#!/bin/bash

# ==============================================================================
# Frame Processing and Optimization Pipeline for The Eastline New York
# ==============================================================================
# Automates:
#   1. Telemetry verification and video resolution checks
#   2. Precision frame extraction across video duration
#   3. Bake pass (unsharp mask + dynamic noise dithering) to eliminate banding
#   4. Multi-tier WebP encoding (desktop-hq: 2560px, desktop: 1920px, mobile: 540x960)
# ==============================================================================

set -euo pipefail

# Print usage instructions
usage() {
  echo "Usage: $0 <source_video.mp4> <section_name> <frame_count>"
  echo "Example: $0 input.mp4 hero 180"
  exit 1
}

# Check input arguments
if [ "$#" -lt 3 ]; then
  usage
fi

VIDEO_PATH="$1"
SECTION_NAME="$2"
FRAME_COUNT="$3"

# Verify tools are installed
for cmd in ffmpeg ffprobe cwebp; do
  if ! command -v "$cmd" &> /dev/null; then
    echo "Error: Required tool '$cmd' is not installed. Please install it first."
    exit 1
  fi
done

# Check if video exists
if [ ! -f "$VIDEO_PATH" ]; then
  echo "Error: Source video file '$VIDEO_PATH' not found."
  exit 1
fi

echo "==> Step 1: Performing video telemetry check..."
# Retrieve video width, height, and duration
WIDTH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$VIDEO_PATH")
HEIGHT=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$VIDEO_PATH")
DURATION=$(ffprobe -v error -select_streams v:0 -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_PATH")

echo "Source dimensions: ${WIDTH}x${HEIGHT}"
echo "Duration: ${DURATION}s"

if [ "$WIDTH" -lt 3840 ]; then
  echo "WARNING: Video width ($WIDTH) is below the 4K resolution threshold (3840px)."
  echo "Up-scaling may result in loss of visual fidelity. Recommended to render in 4K."
fi

# Calculate division fps rate
FPS=$(bc -l <<< "$FRAME_COUNT / $DURATION")
echo "Target Frame Count: $FRAME_COUNT"
echo "Calculated FPS extraction rate: $FPS"

# Establish directories
TMP_DIR="tmp_${SECTION_NAME}"
SHARP_DIR="sharp_${SECTION_NAME}"
OUT_BASE="public/frames/${SECTION_NAME}"

mkdir -p "$TMP_DIR"
mkdir -p "$SHARP_DIR"
mkdir -p "${OUT_BASE}/desktop-hq"
mkdir -p "${OUT_BASE}/desktop"
mkdir -p "${OUT_BASE}/mobile"

echo "==> Step 2: Extracting PNG frames from video..."
ffmpeg -i "$VIDEO_PATH" -vf "fps=${FPS},scale=2560:-2" -q:v 1 -y "${TMP_DIR}/%04d.png"

# Verify frame count
EXTRACTED_COUNT=$(find "$TMP_DIR" -maxdepth 1 -name "*.png" | wc -l)
echo "Extracted $EXTRACTED_COUNT frames."

# Adjust if off by 1 frame
if [ "$EXTRACTED_COUNT" -ne "$FRAME_COUNT" ]; then
  echo "Warning: Extracted frames count ($EXTRACTED_COUNT) does not match target count ($FRAME_COUNT)."
fi

echo "==> Step 3: Running sharpening and noise bake pass to eliminate banding in parallel..."
find "${TMP_DIR}" -name "*.png" -print0 | xargs -0 -P 8 -n 1 ./scripts/sharpen_frame.sh "${SHARP_DIR}"

echo "Generating comparison frame midpoint..."
MID_FRAME=$(printf "%04d.png" $((FRAME_COUNT / 2)))
if [ -f "${TMP_DIR}/${MID_FRAME}" ] && [ -f "${SHARP_DIR}/${MID_FRAME}" ]; then
  ffmpeg -loglevel error -i "${TMP_DIR}/${MID_FRAME}" -i "${SHARP_DIR}/${MID_FRAME}" -filter_complex hstack -y "${SECTION_NAME}-halo-check.png"
  echo "Midpoint comparison generated at ${SECTION_NAME}-halo-check.png"
fi

echo "==> Step 4: Compressing and scaling into WebP resolution tiers in parallel..."
find "${SHARP_DIR}" -name "*.png" -print0 | xargs -0 -P 8 -n 1 ./scripts/encode_frame.sh "${OUT_BASE}" "${SHARP_DIR}"

echo "=============================================================================="
# Generate Posters for fallback
POSTER_SRC="${SHARP_DIR}/$(printf "%04d.png" 1)"
if [ -f "$POSTER_SRC" ]; then
  cwebp -quiet -q 85 "$POSTER_SRC" -o "${OUT_BASE}/poster.webp"
  ffmpeg -loglevel error -i "$POSTER_SRC" -vf "crop=ih*9/16:ih,scale=540:960" -y "${SHARP_DIR}/temp_poster_mobile.png"
  cwebp -quiet -q 80 "${SHARP_DIR}/temp_poster_mobile.png" -o "${OUT_BASE}/mobile-poster.webp"
  rm -f "${SHARP_DIR}/temp_poster_mobile.png"
  echo "Generated static poster fallbacks."
fi

echo "SUCCESS: Frame processing for section '$SECTION_NAME' completed successfully."
echo "Tiers are saved in: ${OUT_BASE}/"
echo "=============================================================================="
