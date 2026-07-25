#!/bin/bash
set -euo pipefail

OUT_BASE="$1"
SHARP_DIR="$2"
f="$3"

BASE=$(basename "$f")
FILENAME="${BASE%.*}"
OUT_NAME="${FILENAME}.webp"

# A. Desktop-HQ (2560px max width, quality q=80)
cwebp -quiet -q 80 -m 6 "$f" -o "${OUT_BASE}/desktop-hq/${OUT_NAME}"

# B. Desktop (Scale down to 1920px width, quality q=75)
ffmpeg -loglevel error -i "$f" -vf "scale=1920:-2" -y "${SHARP_DIR}/temp_desktop_${FILENAME}.png"
cwebp -quiet -q 75 -m 6 "${SHARP_DIR}/temp_desktop_${FILENAME}.png" -o "${OUT_BASE}/desktop/${OUT_NAME}"
rm -f "${SHARP_DIR}/temp_desktop_${FILENAME}.png"

# C. Mobile (9:16 Portrait Crop scaled to 540x960, quality q=70)
ffmpeg -loglevel error -i "$f" -vf "crop=ih*9/16:ih,scale=540:960" -y "${SHARP_DIR}/temp_mobile_${FILENAME}.png"
cwebp -quiet -q 70 -m 6 "${SHARP_DIR}/temp_mobile_${FILENAME}.png" -o "${OUT_BASE}/mobile/${OUT_NAME}"
rm -f "${SHARP_DIR}/temp_mobile_${FILENAME}.png"
