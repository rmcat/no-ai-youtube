# ![Extension Icon](src/icons/icon-24.png) No AI YouTube

This browser extension is designed for YouTube viewers frustrated with the Algorithm recommending misleading videos. It identifies YouTube videos labeled as **altered or synthetic content**, halts playback, and alerts the user.

**Important note: This extension was primarily developed for my own use, so active maintenance and fixes are not guaranteed. It might break with YouTube updates. Feel free to report issues and submit fixes if you're able.**

## Developer Setup

To build and package the extension from the source code, you will need Node.js and npm installed.

### Install Dependencies

Navigate to the project directory in your terminal and run:

```bash
npm install
```

### Package Extension

This project uses Rollup to bundle the extension files. To package the extension for installation, run:

```bash
npx rollup -c
```

### Updating Icons

To regenerate and optimize icons:

```bash
INKSCAPE_EXE="<path_to_exe>"
SIZES=(16 24 32 48 64 128 512)

for SIZE in "${SIZES[@]}"; do
  inputFile="src/icons/icon.svg"
  outputFile="src/icons/icon-${SIZE}.png"
  "${INKSCAPE_EXE}" --export-type="png" --export-filename="${outputFile}" --export-area-page --export-width=${SIZE} "${inputFile}"
done

OXIPNG="<path_to_exe>"
"${OXIPNG}" --opt max --strip safe src/icons/*.png
```
