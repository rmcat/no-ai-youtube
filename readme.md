# No AI YouTube

This browser extension identifies YouTube videos labeled as **altered or synthetic content**, halts playback, warns the user, and automatically navigates to the previous page unless explicitly canceled.

## Features

- **Automatic Detection:** Identifies YouTube videos marked as "altered" or "synthetic content".
- **Playback Prevention:** Immediately pauses video and audio playback.
- **User Warning:** Presents a clear on-screen warning.
- **Automatic Redirection:** Navigates back to the previous page after a brief countdown.
- **User Cancellation:** Allows users to cancel the redirection.

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
