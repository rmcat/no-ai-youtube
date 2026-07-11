#!/bin/bash

INKSCAPE="${1:-inkscape}"
OXIPNG="${2:-oxipng}"

SIZES=(16 24 32 48 64 128 512)

for SIZE in "${SIZES[@]}"; do
  "$INKSCAPE" --export-type="png" --export-filename="icons/icon-${SIZE}.png" --export-area-page --export-width="$SIZE" icons/icon.svg
done

"$OXIPNG" --opt max --strip safe icons/*.png
