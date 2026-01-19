# Deployment Guide

Complete guide for deploying the 8-bit portfolio website.

## 🚀 Quick Deploy

### Option 1: Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RanneG/pixel-portfolio)

1. Click the button above
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy!

### Option 2: Manual Deployment Script

```bash
npm run deploy
```

For production:
```bash
npm run deploy:prod
```

## 📋 Pre-Deployment Checklist

### Environment Variables

Set these in your deployment platform:

**Required:**
- `VITE_FORMSPREE_ID` - Formspree form ID for contact form

**Optional:**
- `VITE_ANALYTICS_PROVIDER` - `plausible` or `ga4`
- `VITE_PLAUSIBLE_DOMAIN` - Your domain (if using Plausible)
- `VITE_GA4_ID` - Google Analytics ID (if using GA4)

### Files to Update

Before deploying, update:

- [ ] `public/sitemap.xml` - Replace `yourdomain.com` with your actual domain
- [ ] `public/robots.txt` - Update sitemap URL
- [ ] `index.html` - Update Open Graph URLs and Twitter handle
- [ ] `src/App.tsx` - Update structured data URLs
- [ ] `public/api/health.json` - Update timestamp

### Assets

- [ ] Create `public/og-image.png` (1200×630px) for social sharing
- [ ] Add favicon at `public/favicon.svg`
- [ ] Add PWA icons (`public/icon-192.png`, `public/icon-512.png`)

## 🔧 Deployment Script

The deployment script (`scripts/deploy.js`) performs:

1. **Environment Validation** - Checks required env vars
2. **Tests** - Runs test suite (if configured)
3. **Linting** - Runs linter (if configured)
4. **Build** - Creates production build
5. **Backup** - Creates backup of previous build
6. **Deploy** - Deploys to Vercel

### Usage

```bash
# Development/preview deployment
npm run deploy

# Production deployment
npm run deploy:prod
```

### Cross-Platform Support

The script works on:
- ✅ Windows (PowerShell, CMD)
- ✅ macOS (Terminal)
- ✅ Linux (Bash)

## 🔄 CI/CD with GitHub Actions

### Automated Workflows

The project includes GitHub Actions workflows:

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on every push and PR
   - Tests, lints, and builds
   - Creates preview deployments for PRs

2. **Health Check** (`.github/workflows/health-check.yml`)
   - Monitors site health every 5 minutes
   - Checks API endpoint availability
   - Notifies on failures

### Setup

1. **Add Vercel Secrets:**
   - Go to Repository Settings → Secrets
   - Add `VERCEL_TOKEN`
   - Add `VERCEL_ORG_ID`
   - Add `VERCEL_PROJECT_ID`

2. **Enable GitHub Actions:**
   - Actions are enabled by default
   - Workflows run automatically on push/PR

3. **Monitor Deployments:**
   - Check Actions tab for status
   - Review deployment logs
   - Monitor health checks

## 🌐 Vercel Deployment

### Initial Setup

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Link Project:**
   ```bash
   vercel link
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Configuration

The `vercel.json` file includes:
- Build configuration
- Route rewrites for SPA
- Security headers
- Cache headers

### Environment Variables

Set in Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables for Production, Preview, Development
3. Redeploy after adding variables

## 🏥 Health Check Endpoint

### Endpoint

- **URL:** `/api/health`
- **Method:** GET
- **Response:** JSON with status information

### Response Format

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "8-bit-portfolio",
  "version": "1.0.0",
  "environment": "production",
  "region": "iad1"
}
```

### Monitoring

Use this endpoint for:
- Uptime monitoring (UptimeRobot, Pingdom)
- Health checks in CI/CD
- Status page integration
- Alerting systems

## 📊 Deployment Status

### Check Deployment Status

```bash
# Vercel CLI
vercel ls

# Or check Vercel dashboard
```

### View Logs

```bash
# Vercel CLI
vercel logs

# Or check Vercel dashboard → Deployments → Logs
```

## 🔍 Troubleshooting

### Build Fails

**Issue:** Build fails during deployment

**Solutions:**
- Check Node.js version (18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors
- Ensure environment variables are set

### Environment Variables Not Working

**Issue:** Variables not available in build

**Solutions:**
- Variables must start with `VITE_` for Vite
- Redeploy after adding variables
- Check variable names match exactly
- Verify variables are set for correct environment

### Preview Deployments Not Working

**Issue:** GitHub Actions preview fails

**Solutions:**
- Verify Vercel secrets are set correctly
- Check Vercel project is linked
- Review GitHub Actions logs
- Ensure Vercel CLI is up to date

### Health Check Fails

**Issue:** `/api/health` returns error

**Solutions:**
- Verify API route is deployed
- Check serverless function logs
- Ensure CORS is configured
- Test endpoint manually

## 📧 Formspree Email Configuration

### Setting Up Outlook Email

To receive form submissions in your Outlook email:

1. Go to [Formspree Dashboard](https://formspree.io)
2. Log in and find your form (ID: `xeeegyek`)
3. Go to **Settings** → **Email Notifications**
4. Add your Outlook email address
5. Enable email notifications
6. Verify email if prompted

**Note:** The email displayed on your website (`rannegerodias@gmail.com`) is for display. Form submissions will be sent to the email configured in Formspree.

## 🔐 Security

### Best Practices

- ✅ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ Enable Vercel security headers
- ✅ Keep dependencies updated
- ✅ Use HTTPS only
- ✅ Enable DDoS protection (Vercel)

### Security Headers

Configured in `vercel.json`:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## 📈 Post-Deployment

### Verify Deployment

1. **Check Site:**
   - Visit deployed URL
   - Test all features
   - Check mobile responsiveness

2. **Verify SEO:**
   - Test Open Graph previews
   - Check structured data
   - Submit sitemap to Google

3. **Check Analytics:**
   - Verify tracking is working
   - Test custom events
   - Monitor Web Vitals

4. **Test Forms:**
   - Submit test contact form
   - Verify email delivery
   - Check error handling

### Monitoring

Set up monitoring for:
- Uptime (health check endpoint)
- Performance (Web Vitals)
- Errors (error tracking)
- Analytics (user behavior)

## 🎯 Rollback

### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

Or via CLI:
```bash
vercel rollback [deployment-url]
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Deployment Script](./scripts/deploy.js)
- [CI/CD Workflows](./.github/workflows/)

---

**Happy Deploying! 🚀**

