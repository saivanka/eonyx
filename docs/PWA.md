# eonyx as a web app (PWA)

The web version of eonyx can be installed like an app. Once installed, it opens full screen, has its own icon, and still loads when the connection drops.

Live: https://eonyx.vercel.app

## Installing it

- **iPhone:** open the link in Safari, tap Share, then tap **Add to Home Screen**.
- **Android:** open the link in Chrome, tap the menu (⋮), then tap **Install app**.
- **Desktop Chrome or Edge:** click the install icon in the address bar.

Installing needs HTTPS. The only exception is `localhost` during development.

## What's in the build

| File | What it does |
| --- | --- |
| `public/manifest.webmanifest` | The app name, colours, icons and display mode |
| `public/icon-*.png`, `apple-touch-icon.png`, `favicon.png` | Icons, made from the EONYX wordmark |
| `public/sw.js` | The service worker that handles offline loading |
| `scripts/pwa-postbuild.mjs` | Adds the PWA tags and the service worker to the built HTML |

Expo's exporter doesn't write PWA tags, so the post-build script adds them after every build.

## How offline loading works

| What is requested | How it's served |
| --- | --- |
| A page (for example `/product/p1`) | From the network when online. If offline, the app shell from the cache is used. |
| Built JavaScript (`/_expo/...`) | From the cache first. File names change with each build, so the cache is safe. |
| Icons and fonts | From the cache, refreshed in the background. |
| Product photos | From the cache once they've been seen. |

## Shipping an update

1. Make your change and run `npm run build:web`.
2. Redeploy (see [DEPLOYMENT.md](DEPLOYMENT.md)).
3. People get the new version the next time they open the app.

If you change the app shell, bump `CACHE_VERSION` in `public/sw.js` so old caches are cleared.

## Testing it locally

```bash
npm run build:web
npm run serve:web   # http://localhost:5057
```

In Chrome DevTools, open the **Application** tab:

- **Manifest** should show no errors.
- **Service Workers** should show `sw.js` as active.
- Tick **Offline** and reload. The app should still open.

Some in-app browsers can't register service workers. Test in Chrome or Safari.
