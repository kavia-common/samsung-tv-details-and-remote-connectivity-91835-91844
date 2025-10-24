# MyTVProject (Tizen Web App)

A self-contained Tizen Web App (no Node, no build) ready to import into Tizen Studio to create a `.wgt` package. This is a static port of the React app UI with vanilla HTML/CSS/JS and Samsung TV remote support.

## Structure

- index.html — Entry point (declared in config.xml)
- css/styles.css — TV-first UI styles
- js/app.js — App logic, remote navigation handling, simple routing, splash
- config.xml — Tizen widget configuration (profile: tv-samsung)
- assets/
  - icons/icon.png — App icon referenced by config.xml
  - banners/banner1.jpg — Home banner image
  - thumbs/*.jpg — Card images for rails

## Remote Navigation

Bound globally for:
- Arrow keys: LEFT/RIGHT/UP/DOWN
- Select: ENTER
- Back: RETURN on TV remote, ESC on keyboard

Focus model:
- Top menu focus (Home, Login, Setting, My Plan)
- Rails focus per row (horizontal)
- ENTER on menu navigates to the view
- ENTER on a card returns focus to the menu (demo behavior)
- Back behavior:
  - If not on Home, returns to Home
  - If on Home, exits the app (on device/emulator)

## Splash

On launch, a splash screen with "MyTV" is shown for ~3 seconds, after which the app navigates to Home automatically.

## Import into Tizen Studio

1. Open Tizen Studio (4.x+).
2. File → Import… → Tizen → Tizen Web Project → Next.
3. Choose "Import from root directory" and select this `MyTVProject` folder.
4. Confirm `config.xml` is at the project root in the Tizen Studio project.
5. Right-click the project → Build Signed Package (or Build Package).
   - If signing is required, configure a TV profile in Tizen Certificate Manager.
6. The `.wgt` file will be in the project `bin/` folder.

## Assets

Before packaging, ensure all referenced images exist:

- assets/icons/icon.png
- assets/banners/banner1.jpg
- assets/thumbs/trending1.jpg
- assets/thumbs/action1.jpg
- assets/thumbs/drama1.jpg
- assets/thumbs/horror1.jpg
- assets/thumbs/action2.jpg
- assets/thumbs/continue1.jpg

You can replace images with your own, keeping the same filenames or adjust paths in `index.html` and `js/app.js`.

## Notes

- This project has no dependency on npm or React at runtime inside Tizen.
- To preview in a desktop browser, open `index.html` directly. Some TV-only APIs will be no-ops.
- The React development app remains in `samsung_tv_frontend` for web preview; this project is standalone for Tizen Studio.

## Troubleshooting

- If remote keys do not respond in the emulator, ensure TV keys are registered and the emulator input focus is on the app.
- If packaging fails, verify `config.xml` and that `assets/icons/icon.png` exists.

