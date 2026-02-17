# Deployment Guide

Grand Prix Playoffs is deployed on Cloudflare Pages with automatic deployments from GitHub.

## Architecture

```
GitHub (main branch)
    ↓ push
Cloudflare Pages (build + deploy)
    ↓
grandprixplayoffs.com
```

## Current Setup

- **Hosting**: Cloudflare Pages
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Production URL**: https://grand-prix-playoffs.pages.dev
- **Custom domain**: grandprixplayoffs.com (if configured)

## Automatic Deployments

- **Production**: Every push to `main` triggers a production deployment
- **Preview**: Every pull request gets a unique preview URL

## Custom Domain Setup

1. In Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter `grandprixplayoffs.com`
4. Follow DNS configuration instructions
5. SSL certificate is automatically provisioned

## Web Analytics

1. Go to Cloudflare Dashboard → **Web Analytics**
2. Click **Add a site**
3. Enter `grandprixplayoffs.com`
4. Analytics are automatically enabled for Pages projects with custom domains

## Build Settings

If you need to modify build settings:

1. Go to Cloudflare Pages → your project → **Settings** → **Builds & deployments**
2. Update build command or output directory as needed

Current settings:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`
- **Node.js version**: 20 (auto-detected)

## Environment Variables

Production environment variables can be set in:
Cloudflare Pages → Settings → Environment variables

Current variables (all optional - defaults provided):

- `VITE_JOLPICA_API_URL` - F1 data API (default: `https://api.jolpi.ca/ergast/f1`)

## Data Updates

Season data is automatically updated weekly via GitHub Actions:

- Runs every Monday at 6:00 AM UTC
- Can be manually triggered from GitHub Actions tab
- Updates `data/2026.json` with latest race results
- Cloudflare Pages auto-deploys when data changes are pushed

## Troubleshooting

### Build Failures

1. Check Cloudflare Pages deployment logs
2. Common issues:
   - TypeScript errors: Run `npm run build` locally
   - Missing dependencies: Check `package.json`

### 404 on Routes

The `_redirects` file in `/public` handles SPA routing. Verify it exists in build output.

### Rollback

1. Go to Cloudflare Pages → Deployments
2. Find previous working deployment
3. Click menu → **Rollback to this deployment**
