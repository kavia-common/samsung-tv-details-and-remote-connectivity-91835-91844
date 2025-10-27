# Local Images for Rails and Banner

Place your local images for the horizontal rails and banner under the public assets folder so they can be served as `/assets/...`.

Recommended structure (under `public/assets`):
- /assets/banner.jpg                           -> Hero image for the banner
- /assets/thumb1.jpg ... /assets/thumb10.jpg   -> Generic thumbnails for sample rails

Optional category folders (if you want themed images):
- /assets/action/...
- /assets/drama/...
- /assets/horror/...
- /assets/trending/...
- /assets/continue/...

In code, images are referenced with absolute paths like:
- "/assets/banner.jpg"
- "/assets/thumb1.jpg"

Note:
- The app uses HashRouter and is designed for Samsung Tizen emulator compatibility.
- All cards are focusable with a visible focus ring for TV remote navigation.
