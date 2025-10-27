# Local Images for Banner and Rails (Placeholders)

Place your local images under `public/assets` so they can be referenced via `/assets/...`.

Required placeholders used by the UI:
- /assets/banner.jpg
- /assets/trending1.jpg ... /assets/trending6.jpg
- /assets/continue1.jpg ... /assets/continue5.jpg
- /assets/action1.jpg ... /assets/action5.jpg
- /assets/drama1.jpg ... /assets/drama5.jpg
- /assets/horror1.jpg ... /assets/horror5.jpg
- /assets/subscriptions/basic.png
- /assets/subscriptions/standard.png
- /assets/subscriptions/premium.png

Notes:
- If an image is missing, the UI hides the broken <img> gracefully and shows a clean card background.
- The app uses HashRouter and is designed for Samsung Tizen emulator compatibility.
- All cards are focusable with a visible focus ring for TV remote navigation.
