# Deploying eonyx

The web build is a folder of static files in `dist/`. Any static host can serve it, as long as unknown paths fall back to `index.html` and `sw.js` is served over HTTPS.

Always build before you deploy:

```bash
npm run build:web
```

## Vercel (current host)

Live: https://eonyx.vercel.app

```bash
npx vercel deploy dist --prod
```

The first time, the CLI asks you to log in and link the project. After that, each deploy updates the live site.

- `scripts/pwa-postbuild.mjs` copies `vercel.json` into `dist/`, so the routing rules are deployed with the build.
- `vercel.json` sends every path to `index.html`, which is what makes links like `/product/p1` work. It uses the `/:path*` pattern. The older `/(.*)` pattern returned 404 for deep links.
- `sw.js` is served with `Cache-Control: no-cache`, so browsers pick up new versions.

Turn on two-factor authentication for your Vercel account at https://vercel.com/account/settings/authentication.

## Netlify

Drag the `dist/` folder onto https://app.netlify.com/drop, or run:

```bash
npx netlify-cli deploy --dir dist --prod
```

The `_redirects` file in `public/` is copied into `dist/` and handles the routing.

## Other static hosts

Upload the contents of `dist/`. Two things to check:

- The app uses root paths such as `/_expo/...`, so it has to be served from the domain root, not a sub-folder like `username.github.io/repo`.
- Unknown paths must return `index.html`. GitHub Pages can't do this, so use Netlify or Vercel for deep links.

## After each deploy

1. Open the live link and check the home page loads.
2. In DevTools, check **Application → Manifest** for errors.
3. Check that **Application → Service Workers** shows `sw.js` as active.
4. Open a deep link, such as `/product/p1`, directly.
5. On a phone, install the app and open it from the home screen.

## Native builds

The iPhone and Android apps are built separately, with EAS (`npx eas-cli build`). That needs an Expo account, and an Apple Developer account for iOS. It doesn't affect the web deploy.
