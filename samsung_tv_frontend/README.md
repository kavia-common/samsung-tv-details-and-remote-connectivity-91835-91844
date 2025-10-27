# Samsung TV Frontend (Ocean Professional)

A Samsung TV-like React UI designed for Tizen emulator and local preview. It includes a TV details panel, remote connectivity controls, keyboard/remote navigation with focus management, and a modern Ocean Professional theme.

## Run

- npm start
- Open http://localhost:3000
- This app uses HashRouter for TV/embedded compatibility and works in Tizen Web Simulator/Emulator.

## TV Remote Navigation

- ArrowUp/Down/Left/Right: navigate between focusable cards and groups (Top Menu, Banner, Rails, Subscriptions).
- Enter/OK: activates the focused element (clicks or submits).
- Back/Escape: from Home opens an Exit overlay; from other routes, returns to Home.

Focus management is handled centrally by src/utils/focusManager.ts and global key handlers via src/hooks/useTVRemote.ts.

## TV Details and Remote Controls

On the Home screen:
- Status badges show connection state (Connected/Connecting/Disconnected/Error).
- Actions: Connect/Disconnect, Refresh, Settings, and Remote (opens on-screen remote).
- Remote overlay: Up/Down/Left/Right/OK and Back/Home buttons that send keys via RemoteService.

## Remote Connectivity

- RemoteService (src/services/RemoteService.ts) is a stub that simulates connect(), disconnect(), and sendKey(key) and emits status/message events.
- RemoteProvider (src/store/RemoteContext.tsx) exposes status, lastMessage, and actions to components.

To integrate a real backend, replace the internals of RemoteService with a WebSocket/fetch implementation that maps sendKey to the remote endpoint. Keep the same public API.

## Theme

The Ocean Professional theme features a subtle blue-to-gray gradient background, rounded cards, and soft shadows (see src/styles/theme.css).

## Emulator/Keyboard Tips

- In the Tizen Emulator or Web Simulator, ensure arrow keys and Enter/Back map to the same codes as standard browsers.
- If Back is not available on your keyboard, Esc triggers the same action.
- Safe area margins and 1920x1080 layout are considered; the UI avoids scrolling except for horizontal rails.

## Scripts

- npm start — development server
- npm test — tests
- npm run build — production build
