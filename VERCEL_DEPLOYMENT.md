# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RanneG/pixel-portfolio)

Click the button above for one-click deployment!

## Manual Deployment

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

Or connect your GitHub repository directly on [Vercel Dashboard](https://vercel.com/new).

## Environment Variables

### Required Environment Variable

Add this in your Vercel project settings (Settings → Environment Variables):

- **Key:** `VITE_FORMSPREE_ID`
- **Value:** `xeeegyek` (or your Formspree form ID)

### How to Add:

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Name:** `VITE_FORMSPREE_ID`
   - **Value:** `xeeegyek`
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**

## Configuration Details

### vercel.json

The `vercel.json` file includes:

- **Build Configuration:** Uses Vite framework (auto-detected)
- **SPA Routing:** All routes redirect to `index.html` for client-side routing
- **Cache Headers:** Static assets cached for 1 year
- **Security Headers:** 
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection
  - Referrer-Policy

### Node Version

- Set to Node.js 18.x via `package.json` engines field
- Vercel will automatically use Node 18

## Post-Deployment

After deployment:

1. **Update README.md** with your Vercel URL
2. **Add screenshots** to `/screenshots` folder
3. **Update PortfolioDataContext.tsx** with your live URL
4. **Test the contact form** to ensure Formspree is working

## Custom Domain (Optional)

1. Go to **Settings** → **Domains** in Vercel
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update README.md with your custom domain

## Troubleshooting

### Build Fails

- Check Node version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Routing Issues

- Ensure `vercel.json` rewrites are configured
- Check that all routes redirect to `index.html`

### Environment Variables Not Working

- Verify variable name is `VITE_FORMSPREE_ID` (must start with `VITE_`)
- Ensure variable is added to all environments (Production, Preview, Development)
- Redeploy after adding variables

---

**Happy Deploying! 🚀**

