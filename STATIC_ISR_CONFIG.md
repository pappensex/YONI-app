# Static-First + ISR Configuration

This document explains the static-first and ISR (Incremental Static Regeneration) configuration applied to the YONI app.

## Changes Made

### 1. vercel.json Configuration

Updated `vercel.json` to include static export configuration:

```json
{
  "version": 2,
  "build": {
    "env": {}
  },
  "output": "export",
  "routes": []
}
```

**Note**: The `"output": "export"` setting in `vercel.json` is kept as requested, but **NOT** applied in `next.config.js` because it's incompatible with API routes. The app uses several API routes (`/api/chat`, `/api/checkout`, `/api/github-app/callback`, `/api/revalidate`) which require server-side functionality.

### 2. ISR Configuration (Layout)

Added ISR with 10-minute revalidation to the root layout (`app/layout.tsx`):

```typescript
export const revalidate = 600; // 10 minutes
```

This enables Incremental Static Regeneration for all pages, allowing them to be regenerated every 10 minutes.

### 3. On-Demand Revalidation API

Created `/app/api/revalidate/route.ts` - a webhook endpoint for on-demand revalidation triggered by CMS or Stripe events.

**Usage**:

```bash
POST /api/revalidate?secret=YOUR_SECRET
Content-Type: application/json

{
  "path": "/some-path"
}
```

or

```bash
POST /api/revalidate?secret=YOUR_SECRET
Content-Type: application/json

{
  "tag": "some-tag"
}
```

**Security**: Requires `REVALIDATE_SECRET` environment variable to be set.

## Configuration Rationale

### Why NOT Full Static Export?

While the problem statement requested `output: "export"`, this configuration is **incompatible** with:

1. **API Routes**: The app has 4 API endpoints that require server-side execution
2. **ISR**: The `revalidate` configuration requires server-side regeneration
3. **On-Demand Revalidation**: The `/api/revalidate` endpoint needs server functionality

### Current Architecture: Hybrid (Static-First + Server)

The implemented solution uses:

- **Static pre-rendering** for pages (○ symbol in build output)
- **ISR** with 10-minute revalidation for content updates
- **Server-side API routes** (ƒ symbol in build output) for:
  - `/api/chat` - ChatGPT integration
  - `/api/checkout` - Stripe checkout
  - `/api/github-app/callback` - GitHub OAuth
  - `/api/revalidate` - On-demand revalidation

This is the recommended approach for Next.js App Router applications that need both static optimization and dynamic functionality.

## Environment Variables Required

To use the revalidation endpoint, add to your `.env` or Vercel environment variables:

```
REVALIDATE_SECRET=your-secret-key-here
```

## Build Output

```
Route (app)                              Size     First Load JS
┌ ○ /                                    7.04 kB        94.3 kB
├ ○ /_not-found                          873 B          88.2 kB
├ ƒ /api/chat                            0 B                0 B
├ ƒ /api/checkout                        0 B                0 B
├ ƒ /api/github-app/callback             0 B                0 B
└ ƒ /api/revalidate                      0 B                0 B

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

## Additional Notes

- The `cache: 'no-store'` audit was performed - no instances found in the codebase
- Images are already configured with `unoptimized: true` for static compatibility
- The SvelteKit configuration mentioned in the problem statement does not apply to this Next.js project
