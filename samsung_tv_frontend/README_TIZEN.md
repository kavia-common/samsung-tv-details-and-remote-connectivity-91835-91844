# MyTV React Tizen TV App - Packaging Guide

This project is a React single-page app designed for Samsung Tizen TVs. It includes a splash screen, home with content rails, and basic remote key navigation.

## Build and Prepare

1. Install dependencies:
   npm install

2. Run locally (for preview on port 3000):
   npm start

3. Create production build (used for packaging):
   npm run build

The `public/config.xml` is copied into `build/` so Tizen Studio can recognize the app.

## Import into Tizen Studio and Package .wgt

1. Open Tizen Studio (4.x+).
2. File -> Import -> Tizen -> Tizen Web Project -> Next.
3. Choose "Import from root directory" and select the `build/` directory.
4. Ensure the `config.xml` is present at the project root inside Tizen Studio.
5. Right-click the imported project -> Build Signed Package (or Build Package).
   - If signing is required, configure a TV profile in Tizen Certificate Manager.
6. Tizen Studio generates a `.wgt` package in the project `bin/` folder.

## Notes

- Entry point is `index.html`.
- App ID in `config.xml`: `org.example.mytv`.
- Privileges: `http://tizen.org/privilege/internet` (minimal).
- Profile: `tv-samsung`.

Alternatively, you can run:

- Prepare build for Tizen: `npm run tizen:prepare`
- See packaging note: `npm run tizen:package:note`
