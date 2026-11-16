# Deploying eonyx

The web build is static files in `dist/`. Any static host works, as long as it serves `index.html` for unknown paths (SPA routing) and serves `sw.js` over HTTPS.

Build first, every time:

```bash
npm run build:web
```

## Vercel (current production host)

Live: https://onyx-marketplace.vercel.app

Deploy the built folder:

```bash
npx vercel deploy dist --prod --name onyx-marketplace
```

- The first run asks you to log in (`npx vercel login`) and links the project.
- `scripts/pwa-postbuild.mjs` copies `vercel.json` into `dist/`, so the rewrites ship with the build.
- `vercel.json` rewrites every path to `/index.html` and sets `Cache-Control: no-cache` on `sw.js`.

Turn on two-factor authentication for the Vercel account at https://vercel.com/account/settings/authentication.

## Netlify

Option A, drag and drop: go to https://app.netlify.com/drop and drop the `dist/` folder.

Option B, CLI:

```bash
npx netlify-cli deploy --dir dist --prod
```

`public/_redirects` is copied into `dist/` and provides the SPA rewrite (`/* /index.html 200`).

## GitHub Pages or any other static host

- Upload the contents of `dist/`.
- The app uses root-relative URLs (`/_expo/...`, `/manifest.webmanifest`), so it must be served from the domain root, not a sub-path such as `username.github.io/repo`.
- Configure a rewrite that sends unknown paths to `index.html`, or deep links will 404. GitHub Pages does not support this natively. Use Netlify or Vercel instead.

## After every deploy

1. Open the live URL in Chrome and check the page loads.
2. DevTools → Application → Manifest: no errors.
3. DevTools → Application → Service Workers: `sw.js` activated.
4. Open a deep link such as `/product/p1` directly.
5. On a phone, install the app and open it from the home screen.

## Native builds (later)

The app can also be built for the App Store and Google Play with EAS (`npx eas-cli build`). That requires an Expo account and, for iOS, an Apple Developer account. It is separate from the web deployment.
