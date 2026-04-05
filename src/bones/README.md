# Boneyard chart skeletons

Pixel positions for [`boneyard-js`](https://github.com/0xGF/boneyard) are stored in `*.bones.json` and registered from `registry.js` (generated — do not hand-edit `registry.js`).

## Regenerate after layout changes

1. Start the app: `npm run dev` (default port **5173**; if Vite picks another port, pass that URL to the CLI instead).
2. From the project root:

   ```bash
   npm run bones:build
   ```

   Or explicitly:

   ```bash
   npx boneyard-js build http://localhost:5173/india_power_tracker/ --wait 3000
   ```

3. Commit updated `registry.js` and `*.bones.json` so CI and production builds do not need a browser.

If the registry is missing or empty, chart `<Skeleton>` components still show the CSS `ChartSkeleton` fallback from [`../components/ChartSkeleton.tsx`](../components/ChartSkeleton.tsx).
