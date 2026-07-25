#!/bin/bash
# Bake CSS filter: brightness(1.16) contrast(0.84) saturate(0.88) into WebP frames
# Pipeline: ffmpeg (decode + color filter) → PNG → cwebp (re-encode to WebP)
#
# CSS brightness(1.16) = multiply each channel by 1.16
# CSS contrast(0.84)   = 0.84 * (val - 128) + 128 in 8-bit
# Combined LUT:  clip( 0.9744 * val + 20.48, 0, 255 )
# CSS saturate(0.88)   = 88% saturation via ffmpeg eq filter

set -e

FRAMES_ROOT="/Users/apple/Documents/Projects/RealNY/public/frames"
SECTIONS=("hero" "amenities" "residences")
TIERS=("desktop-hq" "desktop" "mobile")
TOTAL_PROCESSED=0
TOTAL_FAILED=0

FILTER="lutrgb=r='clip(0.9744*val+20.48,0,255)':g='clip(0.9744*val+20.48,0,255)':b='clip(0.9744*val+20.48,0,255)',eq=saturation=0.88"

process_webp() {
  local input="$1"
  local tmp_png="/tmp/bake_frame_tmp.png"
  local tmp_webp="${input}.tmp.webp"
  
  local quality=90
  if [[ "$input" == *"desktop-hq"* ]]; then
    quality=92
  elif [[ "$input" == *"mobile"* ]] || [[ "$input" == *"mobile-poster"* ]]; then
    quality=85
  fi

  if ffmpeg -y -loglevel error -i "$input" -vf "$FILTER" -f image2 -pix_fmt rgb24 "$tmp_png" 2>/dev/null && \
     cwebp -q "$quality" -m 6 -quiet "$tmp_png" -o "$tmp_webp" 2>/dev/null; then
    mv "$tmp_webp" "$input"
    rm -f "$tmp_png"
    TOTAL_PROCESSED=$((TOTAL_PROCESSED + 1))
    return 0
  else
    rm -f "$tmp_png" "$tmp_webp"
    TOTAL_FAILED=$((TOTAL_FAILED + 1))
    echo "  FAILED: $input"
    return 1
  fi
}

process_avif() {
  local input="$1"
  local tmp_png="/tmp/bake_frame_tmp_avif.png"
  local tmp_avif="${input}.tmp.avif"

  if ffmpeg -y -loglevel error -i "$input" -vf "$FILTER" -f image2 -pix_fmt rgb24 "$tmp_png" 2>/dev/null && \
     ffmpeg -y -loglevel error -i "$tmp_png" -c:v libaom-av1 -still-picture 1 -crf 28 -cpu-used 6 "$tmp_avif" 2>/dev/null; then
    mv "$tmp_avif" "$input"
    rm -f "$tmp_png"
    TOTAL_PROCESSED=$((TOTAL_PROCESSED + 1))
    return 0
  else
    rm -f "$tmp_png" "$tmp_avif"
    TOTAL_FAILED=$((TOTAL_FAILED + 1))
    echo "  FAILED (avif): $input"
    return 1
  fi
}

echo "============================================="
echo " Baking CSS filter into frame sequences"
echo " Filter: brightness(1.16) contrast(0.84) saturate(0.88)"
echo "============================================="
echo ""

for section in "${SECTIONS[@]}"; do
  echo "── Section: $section ──"
  
  for tier in "${TIERS[@]}"; do
    dir="$FRAMES_ROOT/$section/$tier"
    if [ ! -d "$dir" ]; then
      echo "  Skipping $tier (not found)"
      continue
    fi
    
    count=$(ls "$dir"/*.webp 2>/dev/null | wc -l | tr -d ' ')
    echo "  Processing $tier: $count frames..."
    
    processed=0
    for frame in "$dir"/*.webp; do
      process_webp "$frame"
      processed=$((processed + 1))
      if [ $((processed % 30)) -eq 0 ]; then
        echo "    ... $processed / $count done"
      fi
    done
    echo "    ✓ $tier complete ($processed frames)"
  done
  
  echo "  Processing posters..."
  for poster in "$FRAMES_ROOT/$section"/poster.webp "$FRAMES_ROOT/$section"/mobile-poster.webp; do
    if [ -f "$poster" ]; then
      process_webp "$poster"
      echo "    ✓ $(basename "$poster")"
    fi
  done
  for poster in "$FRAMES_ROOT/$section"/poster.avif "$FRAMES_ROOT/$section"/mobile-poster.avif; do
    if [ -f "$poster" ]; then
      process_avif "$poster"
      echo "    ✓ $(basename "$poster")"
    fi
  done
  
  echo ""
done

echo "============================================="
echo " Complete!"
echo " Processed: $TOTAL_PROCESSED files"
echo " Failed:    $TOTAL_FAILED files"
echo "============================================="
