#!/bin/bash
set -euo pipefail

SHARP_DIR="$1"
f="$2"

BASE=$(basename "$f")
ffmpeg -loglevel error -i "$f" -vf "unsharp=5:5:0.6:5:5:0.0,noise=alls=4:allf=t" -y "${SHARP_DIR}/${BASE}"
