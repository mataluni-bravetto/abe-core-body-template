# Clerk SDK Bundling Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build Clerk SDK bundle:**
   ```bash
   npm run build:clerk
   ```

3. **Verify bundle was created:**
   - Check that `src/vendor/clerk.js` exists
   - File should be ~200-500 KB

## How It Works

- Clerk SDK is bundled using esbuild into a single file
- Bundle is stored in `src/vendor/clerk.js`
- Auth code loads the bundle instead of CDN
- No CSP exceptions needed - everything is local

## Before Going Live

1. Run `npm run build:clerk` to create the bundle
2. Commit `src/vendor/clerk.js` to your repository
3. Test authentication flow in extension
4. Verify no CSP errors in console

## Troubleshooting

If bundle fails:
- Ensure `@clerk/clerk-js` is installed: `npm install`
- Check Node.js version: `node --version` (needs >=16.0.0)
- Try: `npm install esbuild --save-dev`

If Clerk doesn't load:
- Check browser console for errors
- Verify `src/vendor/clerk.js` exists
- Check manifest.json includes the file in web_accessible_resources

