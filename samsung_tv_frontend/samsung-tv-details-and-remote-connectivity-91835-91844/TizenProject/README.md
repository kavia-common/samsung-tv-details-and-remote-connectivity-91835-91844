# TizenProject (Samsung TV - Tizen Web App Wrapper)

This folder contains a minimal Tizen Web Application scaffold to host the React app build for Samsung TV emulator in Tizen Studio.

## What this is

- A Tizen Web Application (profile: TV, version: 5.5+) with:
  - `config.xml` configured for TV profile, required privileges, and app metadata
  - `index.html` wrapper that loads your React build from `./wres`
  - `icon.png`, `splash.png` placeholders
  - `scripts/` with helper scripts to copy and package
  - `wres/` folder where your React build goes

## Prerequisites

- Tizen Studio installed (with TV Extensions)
- Samsung TV Emulator set up (Tizen 5.5+)
- Node.js/Yarn or npm to build the React app

## Steps: Build React app and copy into wres

1) Build the React app
- From the repository root:
  ```
  cd samsung-tv-details-and-remote-connectivity-91835-91844/samsung_tv_frontend
  npm install
  npm run build
  ```
  This generates a production build under `samsung_tv_frontend/build/`.

2) Copy the build into TizenProject/wres
- From the repository root, run:
  ```
  cd samsung-tv-details-and-remote-connectivity-91835-91844/TizenProject
  ./scripts/build-tizen.sh
  ```
  The script copies everything from `../samsung_tv_frontend/build/` into `./wres/`.

Alternatively, copy manually:
- Copy the contents of `samsung_tv_frontend/build/` into `TizenProject/wres/` so that `TizenProject/wres/index.html` exists.

3) Verify entry file
- Ensure `TizenProject/wres/index.html` is present. The wrapper `index.html` will attempt to load `wres/index.html` inside an iframe.

## Import and Run in Tizen Studio

1) Open Tizen Studio
2) File -> Import -> Tizen -> Tizen Project -> "Import Existing Tizen Project"
3) Choose the `TizenProject` folder
4) Ensure the profile is set to TV (5.5 or later)
5) Right click the project -> Run As -> Tizen Web Application
6) Select the TV Emulator to launch

## Packaging (.wgt)

If Tizen CLI is available, you can package this project:

- From the repository root:
  ```
  cd samsung-tv-details-and-remote-connectivity-91835-91844/TizenProject
  ./scripts/package.sh
  ```
- This will create a `.wgt` file in a `dist/` folder (and reuse your default certificate profile if configured).

## Troubleshooting

- CSP: This project’s `config.xml` includes a permissive CSP for local usage. If your app fetches remote APIs, ensure allowed domains are present in `connect-src`.
- Local Storage: Tizen WebApp runs inside a WebView environment; local storage and IndexedDB typically work. If you hit quota issues, reduce large cache usage.
- Remote Focus/Keys: For TV remote support, ensure your UI controls are keyboard-focusable. Tizen TV remotes send keyboard events and arrow keys.
- Base Path: Some React apps expect a `<base>` tag or a specific public URL. The CRA build is usually self-contained. If assets fail to load, check references in `wres/index.html`.
- Emulator Profile: Make sure the emulator is a TV profile with Tizen 5.5+.
- White Screen: Open Emulator Web Inspector (if enabled) to see console errors and network requests.

## Project Layout

- `config.xml` — Tizen app manifest (TV profile, privileges, category)
- `index.html` — Wrapper that loads `wres/index.html` (React build entry)
- `wres/` — Place your React production build here
- `scripts/build-tizen.sh` — Copies CRA build to `wres`
- `scripts/package.sh` — Packages into `.wgt` using Tizen CLI (if installed)
- `.tproject` / `.tproject.json` — Markers for Tizen Studio project metadata
- `icon.png` / `splash.png` — Placeholder assets (replace with your own)

## Notes

- App ID and package in `config.xml` are placeholders (`com.example.mytv`, `com.example`). Adjust if needed for store distribution.
- For hosted mode (loading from an external URL), you can modify `index.html` to set `iframe.src` to your hosted page. Update CSP accordingly.
