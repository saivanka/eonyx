// Runs after `expo export --platform web`.
// Expo's generated index.html has no PWA tags, so this adds the manifest, iOS
// home-screen tags and the service worker registration, then checks the output.
import { readFile, writeFile, access, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const indexPath = join(DIST, 'index.html');

const PWA_HEAD = `
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="eonyx" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="format-detection" content="telephone=no" />`;

const SW_REGISTER = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function (err) {
            console.warn('Service worker registration failed', err);
          });
        });
      }
    </script>`;

let html = await readFile(indexPath, 'utf8');

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', `${PWA_HEAD}\n  </head>`);
}
if (!html.includes("navigator.serviceWorker.register")) {
  html = html.replace('</body>', `${SW_REGISTER}\n</body>`);
}

// Expo's own <link rel="icon"> points at favicon.ico; keep it, the PNG one above is preferred.
await writeFile(indexPath, html);

const required = ['manifest.webmanifest', 'sw.js', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', '_redirects'];
const missing = [];
for (const f of required) {
  try {
    await access(join(DIST, f));
  } catch {
    missing.push(f);
  }
}

if (missing.length) {
  console.error(`PWA post-build: missing files in dist/: ${missing.join(', ')}`);
  process.exit(1);
}
// Ship the Vercel rewrites with the build so deep links work when dist/ is deployed directly.
await copyFile(join(process.cwd(), 'vercel.json'), join(DIST, 'vercel.json'));

console.log('PWA post-build: manifest, service worker and icons are in dist/');
