# Mobile App Setup

The app is now an installable Progressive Web App.

## What is included

- Web app manifest for Android and desktop install prompts.
- iOS home-screen metadata.
- App icon.
- Service worker for app-shell caching and offline navigation fallback.
- Mobile-safe viewport and safe-area padding.
- Install button where the browser supports `beforeinstallprompt`.

## How to install on a phone

### Android Chrome

1. Open the production app URL in Chrome.
2. Tap the browser install prompt or the in-app `Install app` button.
3. Confirm install.

### iPhone Safari

1. Open the production app URL in Safari.
2. Tap Share.
3. Tap Add to Home Screen.

## Native app packaging

For Play Store or App Store distribution, wrap this app with Capacitor after the web build is stable:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init Cricket11 com.playbookarena.cricket11 --web-dir=client/dist
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

Android builds require Android Studio. iOS builds require Xcode on macOS and an Apple Developer account.
