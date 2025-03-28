import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "src/scripts/background.js",
    output: [
      {
        file: "dist/firefox/scripts/background.bundle.js",
        format: "iife",
        sourcemap: true,
      },
      {
        file: "dist/chrome/scripts/background.bundle.js",
        format: "iife",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      copy({
        targets: [
          { src: "src/manifest.firefox.json", dest: "dist/firefox", rename: "manifest.json" },
          { src: "src/manifest.chrome.json", dest: "dist/chrome", rename: "manifest.json" },
        ],
      }),
    ],
  },
  {
    input: "src/scripts/content.js",
    output: [
      {
        file: "dist/firefox/scripts/content.bundle.js",
        format: "iife",
        sourcemap: true,
      },
      {
        file: "dist/chrome/scripts/content.bundle.js",
        format: "iife",
        sourcemap: true,
      },
    ],
    plugins: [resolve()],
  },
];
