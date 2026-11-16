# Onyx — Fashion Marketplace

Onyx is a fashion marketplace built with **Expo (SDK 58)**, **Expo Router** and **React Native**. It runs on iPhone and Android through Expo Go, and on any browser as an installable **Progressive Web App (PWA)**.

It follows the screen flow of the *Onyx — Fashion Marketplace App | UI/UX Case Study*: a Discover feed with shoppable looks, a four-step checkout with one all-in total, guest checkout with just an email, cash on delivery preselected, live order tracking, saved items and dark mode.

**Live web app:** https://onyx-marketplace.vercel.app

> The catalogue, orders and checkout are local prototype data. No payment is taken and nothing is sent to a server.

---

## Contents

- [Quick start](#quick-start)
- [Run on your phone (Expo Go)](#run-on-your-phone-expo-go)
- [Use it as a web app (PWA)](#use-it-as-a-web-app-pwa)
- [Deploy the web app](#deploy-the-web-app)
- [Screens](#screens)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Design system](#design-system)
- [Troubleshooting](#troubleshooting)
- [Credits and licence](#credits-and-licence)

Further guides:

- [docs/PWA.md](docs/PWA.md): how the web app is installed, cached and built.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): hosting on Vercel, Netlify or any static host.

---

## Quick start

**Requirements**

- Node.js **22.13 or newer** (`node -v`). Expo SDK 58 will not start on Node 20.
- npm (comes with Node).

**Install and start**

```bash
git clone https://github.com/<your-username>/onyx-marketplace.git
cd onyx-marketplace
npm install
npx expo start
```

Press `w` to open the web version, or scan the QR code with Expo Go.

---

## Run on your phone (Expo Go)

1. Install **Expo Go** from the App Store or Google Play.
2. Run `npx expo start` on the same Wi-Fi network as your phone.
3. Scan the QR code with the iPhone Camera app or with Expo Go on Android.

Expo Go includes every native module this app uses, so no development build is needed.

---

## Use it as a web app (PWA)

The web app can be opened in any browser and installed to the home screen.

- **iPhone:** open the link in Safari, tap **Share → Add to Home Screen**.
- **Android:** open the link in Chrome, tap **⋮ → Install app** (or **Add to Home screen**).
- **Desktop Chrome / Edge:** click the install icon in the address bar.

Once installed it opens full screen, has the Onyx icon, and the app shell works offline. Details are in [docs/PWA.md](docs/PWA.md).

To build and preview it locally:

```bash
npm run build:web   # exports to dist/ and adds PWA tags and the service worker
npm run serve:web   # serves dist/ at http://localhost:5057
```

Service workers only run on `https://` addresses and on `localhost`. To test installation on a phone, use the deployed HTTPS link, not a local Wi-Fi IP address.

---

## Deploy the web app

The fastest route is Vercel:

```bash
npm run build:web
npx vercel deploy dist --prod --name onyx-marketplace
```

The first run asks you to log in and link the project. Other static hosts (Netlify, Cloudflare Pages, GitHub Pages) work too. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for each option and for SPA routing rules.

---

## Screens

| Area | Screen | Route |
| --- | --- | --- |
| Discover | Shoppable looks with tap hotspots, category circles, promise strip, new-in grid | `/` (`app/(tabs)/index.tsx`) |
| Search | Live search, filter chips, trending terms, empty state | `/search` |
| Bag | Quantity steppers, all-in total, free courier pickup note | `/bag` |
| Saved | Hearted pieces | `/saved` |
| Profile | Guest or signed-in identity, orders, appearance (System / Light / Dark), addresses | `/profile` |
| Welcome | Three-slide introduction, skip, sign-in entry | `/welcome` |
| Sign in | Email-only sign-in or "Continue as guest" | `/auth` |
| Category | Sort and grid for one category | `/category/[id]` |
| Product | Image gallery, size picker, delivery promises, add to bag, related items | `/product/[id]` |
| Checkout 1 | Address (email field for guests) | `/checkout/address` |
| Checkout 2 | Delivery: courier pickup from your door or partner point, both free | `/checkout/delivery` |
| Checkout 3 | Payment: cash on delivery (preselected), card, wallet | `/checkout/payment` |
| Checkout 4 | Review, all-in total, place order | `/checkout/review` |
| Success | Confirmation with order number and total | `/checkout/success` |
| Order | Live timeline, courier card, ETA, items and total | `/order/[id]` |

---

## Project structure

```
onyx-marketplace/
├── src/
│   ├── app/                 Expo Router routes. Each file is a screen; _layout.tsx files define navigators.
│   │   ├── _layout.tsx      Root stack, font loading, providers, web phone-width column
│   │   ├── welcome.tsx
│   │   ├── auth.tsx
│   │   ├── (tabs)/          Bottom tabs: index, search, bag, saved, profile
│   │   ├── category/[id].tsx
│   │   ├── product/[id].tsx
│   │   ├── checkout/        address, delivery, payment, review, success
│   │   └── order/[id].tsx
│   ├── components/          Shared UI: ui.tsx (Button, Chip, Header…), ProductCard, checkout/StepFrame
│   ├── data/catalog.ts      Mock products, looks, categories (Unsplash photo URLs)
│   ├── lib/                 format.ts (money, dates), haptics.ts, layout.ts (web column width)
│   ├── store/StoreContext.tsx  Bag, saved, orders, checkout choices, user (reducer + context)
│   └── theme/               tokens.ts (colours, type scale, spacing), ThemeContext.tsx (light/dark)
├── public/                  Copied as-is into the web build
│   ├── manifest.webmanifest PWA manifest
│   ├── sw.js                Service worker (offline app shell and caching)
│   ├── icon-*.png           App icons, including a maskable icon
│   └── _redirects           Netlify SPA rewrite
├── scripts/pwa-postbuild.mjs  Adds PWA tags and the service worker to the exported HTML
├── docs/                    PWA and deployment guides
├── app.json                 Expo config (name, scheme, web/PWA settings, plugins)
├── vercel.json              Vercel SPA rewrite and service worker headers
└── .npmrc                   legacy-peer-deps=true (see Troubleshooting)
```

**How the pieces fit**

- **State:** `StoreProvider` holds the bag, saved items, orders, user and checkout choices. Components read it through `useStore()`.
- **Theme:** `ThemeProvider` resolves System / Light / Dark. Colours come from `palette` in `tokens.ts`, so no screen hard-codes a colour.
- **Responsive width:** on the web, `useAppWidth()` caps layouts to a 480px phone column. On native it returns the device width.
- **Routing:** the first screen is Discover at `/`. Protected or modal screens use `presentation: 'modal'` in the root layout.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` / `npx expo start` | Start the development server (Expo Go, simulators, web). |
| `npm run android` | Start and open on an Android emulator. |
| `npm run ios` | Start and open on an iOS simulator (macOS with Xcode). |
| `npm run web` | Start the web development server. |
| `npm run build:web` | Production web export to `dist/`, plus PWA post-build checks. |
| `npm run serve:web` | Serve `dist/` locally on port 5057 with SPA routing. |
| `npx tsc --noEmit` | Type-check the project. |
| `npx expo-doctor` | Check dependency and config health. |

---

## Design system

All design values live in [src/theme/tokens.ts](src/theme/tokens.ts):

- **Colour:** `palette.light` and `palette.dark` (background, surface, text, muted text, border, accent, highlight bronze, success, danger).
- **Type:** Poppins 400, 500, 600 and 700, with an 18-style scale (`display`, `h1`–`h4`, `body`, `label`, `caption`, `micro`, `overline`, `price`, `button`).
- **Spacing and shape:** `space` (4–40 px), `radius` (10–999 px), `gutter` (20 px).

To re-brand, change those tokens and the app icons in `public/` and `assets/icon.png`.

---

## Troubleshooting

**`npm install` fails with ERESOLVE (peer dependency conflict)**
`.npmrc` sets `legacy-peer-deps=true`. This works around a conflict between `expo-router`'s Radix UI dependencies and `react-dom`. Keep the file, or run `npm install --legacy-peer-deps`.

**Expo says Node is too old**
Install Node 22.13 or newer, for example with `nvm install 22` and `nvm use 22`.

**Expo Go shows a version mismatch**
Update Expo Go from the App Store or Google Play. Expo Go must match the SDK in `package.json`.

**Port 5000 is in use on macOS**
AirPlay Receiver uses port 5000. The scripts use 5057 for that reason.

**The web app doesn't install on my phone**
Install needs HTTPS. Deploy the app and open the HTTPS link. Local Wi-Fi addresses like `http://192.168.x.x` don't qualify.

**Deep links like `/product/p1` show 404 after deploying**
Your host needs an SPA rewrite to `index.html`. `vercel.json` and `public/_redirects` provide it. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

**Changes don't appear in the installed web app**
The service worker caches the app shell. Close the app completely and reopen it. If it still shows old content, bump `CACHE_VERSION` in `public/sw.js` and redeploy.

---

## Credits and licence

- **Design reference:** *Onyx — Fashion Marketplace App | UI/UX Case Study* by Saqib Ali on Behance. The case study's images and copy are owned by its designer and are **not** included. This project re-creates the described flow with original code and styling. Check the designer's terms before reusing their visuals.
- **Photos:** Unsplash, under the [Unsplash licence](https://unsplash.com/license).
- **Fonts:** Poppins (SIL Open Font Licence), via `@expo-google-fonts/poppins`.
- **Icons:** Ionicons, via `@expo/vector-icons`.

The project template licence is in [LICENSE](LICENSE).
