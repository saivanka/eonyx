# Onyx as a Progressive Web App

Onyx ships as a PWA: a web build that can be installed to a phone or desktop, opens full screen, and keeps working when the network drops.

## What a user sees

| Platform | Install steps | Result |
| --- | --- | --- |
| iPhone (Safari) | Share → **Add to Home Screen** | Home-screen icon, full-screen app, no browser bar |
| Android (Chrome) | ⋮ → **Install app** | App drawer entry and icon, full-screen app |
| Desktop (Chrome / Edge) | Install icon in the address bar | Standalone window |

Install requires HTTPS, or `localhost` during development.

## What is in the build

| File | Purpose |
| --- | --- |
| `public/manifest.webmanifest` | Name, short name, colours, `display: standalone`, icons (192, 512 and a maskable 512) |
| `public/icon-*.png`, `apple-touch-icon.png`, `favicon.png` | App icons generated from the ONYX wordmark |
| `public/sw.js` | Service worker: caching and offline support |
| `scripts/pwa-postbuild.mjs` | Adds the manifest link, iOS home-screen tags and service worker registration to `dist/index.html` |
| `app.json` → `web` | Expo's web settings (`output: single`, theme colour, background colour) |

Expo's exporter does not write PWA tags, so `pwa-postbuild.mjs` adds them after each `expo export`.

## Caching strategy (`public/sw.js`)

| Request | Strategy | Why |
| --- | --- | --- |
| Page navigations (`/`, `/product/p1`, …) | Network first, fall back to the cached `index.html` | Fresh content when online, the app still opens offline |
| `/_expo/*` JavaScript bundles | Cache first | File names include a content hash, so they never change |
| Icons, fonts and other static files | Stale while revalidate | Fast, and updated in the background |
| Product photos (cross-origin images) | Stale while revalidate | Photos appear again offline after first view |

The worker's cache names start with `CACHE_VERSION` (currently `onyx-v1`). Old caches are deleted on activate.

### Updating the installed app

1. Change the code, then run `npm run build:web` and redeploy.
2. Users get the new version the next time they open the app. The worker updates in the background.
3. If you change the shell (`index.html` structure or precached files), bump `CACHE_VERSION` in `public/sw.js`.

## Testing locally

```bash
npm run build:web
npm run serve:web       # http://localhost:5057
```

Chrome DevTools → **Application** tab:

- **Manifest:** name, icons and install criteria should show no errors.
- **Service Workers:** `sw.js` should be "activated and running".
- **Offline:** tick "Offline" and reload. The app should still open.

Note: the in-app browser preview in some tools cannot register service workers. Test in Chrome or Safari.

## Changing PWA details

- **Name, colours, display mode:** `public/manifest.webmanifest` (and `web` in `app.json` for Expo's own metadata).
- **Icon artwork:** regenerate the PNGs in `public/` and `assets/icon.png`. Keep the maskable icon's important content within the centre 80%.
- **Extra head tags:** edit `PWA_HEAD` in `scripts/pwa-postbuild.mjs`.
