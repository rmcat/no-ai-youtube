#!/bin/bash
# Package extension for Mozilla Add-on store

rm -f no-ai-youtube.zip
rm -rf temp_archive

mkdir -p temp_archive/scripts temp_archive/icons

cp manifest.json temp_archive/
cp scripts/content.js temp_archive/scripts/
cp scripts/overlay.js temp_archive/scripts/
cp icons/*.png temp_archive/icons/

cd temp_archive
zip -r ../no-ai-youtube.zip . > /dev/null
cd ..

# rm -rf temp_archive

echo "Extension successfully packaged into no-ai-youtube.zip"
