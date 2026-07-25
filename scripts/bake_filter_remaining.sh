#!/bin/bash
# Bake CSS filter into remaining frames (amenities + residences) and fix AVIF posters
# Uses libsvtav1 instead of libaom-av1 for AVIF encoding

set -e

FRAMES_ROOT="/Users/apple/Documents/Projects/RealNY/public/frames"
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

  # Use libsvtav1 instead of libaom-av1
  if ffmpeg -y -loglevel error -i "$input" -vf "$FILTER" -f image2 -pix_fmt rgb24 "$tmp_png" 2>/dev/null && \
     ffmpeg -y -loglevel error -i "$tmp_png" -c:v libsvtav1 -crf 30 -svtav1-params "tune=0" -frames:v 1 "$tmp_avif" 2>/dev/null; then
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
echo " Baking filter: amenities + residences + AVIF posters"
echo "============================================="

# Process remaining sections: amenities and residences
for section in amenities residences; do
  echo ""
  echo "── Section: $section ──"
  
  for tier in desktop-hq desktop mobile; do
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
done

# Fix the hero AVIF posters that failed
echo ""
echo "── Fixing hero AVIF posters ──"
for poster in "$FRAMES_ROOT/hero"/poster.avif "$FRAMES_ROOT/hero"/mobile-poster.avif; do
  if [ -f "$poster" ]; then
    process_avif "$poster"
    echo "  ✓ $(basename "$poster")"
  fi
done

echo ""
echo "============================================="
echo " Complete!"
echo " Processed: $TOTAL_PROCESSED files"
echo " Failed:    $TOTAL_FAILED files"
echo "============================================="
