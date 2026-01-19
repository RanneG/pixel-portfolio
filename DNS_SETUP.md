# DNS Configuration Guide - Fixing www Subdomain Issues

## Problem

When people try to access `www.yourdomain.com`, some can't see the site, even though `yourdomain.com` works fine. This is a DNS configuration issue.

## Root Causes

1. **Missing CNAME record** for `www` subdomain
2. **DNS not configured in Vercel** for the www domain
3. **No redirect** configured from www to non-www (or vice versa)
4. **DNS propagation delays** (can take up to 48 hours)

## Solution Steps

### Step 1: Configure DNS Records in Your Domain Provider

You need to add a **CNAME record** for the `www` subdomain pointing to Vercel.

#### For Vercel, you need TWO DNS records:

**At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):**

1. **Root domain (yourdomain.com):**
   - Type: `A` record
   - Name: `@` or leave blank
   - Value: `76.76.21.21` (Vercel's IP - this may change, check Vercel docs)
   - OR use: `CNAME` → `cname.vercel-dns.com` (some providers support this)

2. **www subdomain:**
   - Type: `CNAME` record
   - Name: `www`
   - Value: `cname.vercel-dns.com`

#### Example DNS Configuration:

```
Type    Name    Value
----    ----    -----
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### Step 2: Add Both Domains in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Add both domains:
   - `yourdomain.com`
   - `www.yourdomain.com`
4. Vercel will verify both domains

### Step 3: Configure Redirect (Already Done)

The `vercel.json` file has been updated to automatically redirect `www.yourdomain.com` → `yourdomain.com`. This ensures:
- SEO benefits (single canonical URL)
- No duplicate content issues
- Better user experience

### Step 4: Wait for DNS Propagation

After making DNS changes:
- **Wait 5 minutes to 48 hours** for global propagation
- Clear your browser cache
- Clear DNS cache on your computer:
  - **Windows:** `ipconfig /flushdns`
  - **Mac/Linux:** `sudo dscacheutil -flushcache` or `sudo systemd-resolve --flush-caches`

## Verify DNS Configuration

### Check DNS Records

Use these online tools to verify your DNS records:

1. **WhatsMyDNS.net**: https://www.whatsmydns.net
   - Enter `www.yourdomain.com`
   - Check if CNAME resolves correctly

2. **DNS Checker**: https://dnschecker.org
   - Verify DNS propagation globally

3. **Dig Command** (Terminal):
   ```bash
   dig www.yourdomain.com CNAME
   # Should return: cname.vercel-dns.com
   ```

### Test the Redirect

After DNS propagates:
- Visit `www.yourdomain.com`
- Should automatically redirect to `yourdomain.com`
- Check browser console for 301 redirect status

## Common Issues & Solutions

### Issue 1: "DNS_PROBE_FINISHED_NXDOMAIN"

**Problem:** DNS record doesn't exist or hasn't propagated yet.

**Solution:**
- Verify CNAME record exists in your DNS provider
- Wait for DNS propagation (can take up to 48 hours)
- Clear DNS cache

### Issue 2: Both www and non-www Work, But They're Different

**Problem:** Both domains are serving different content or no redirect is configured.

**Solution:**
- The redirect rule in `vercel.json` should fix this
- Redeploy after adding the redirect
- Ensure both domains are added in Vercel dashboard

### Issue 3: SSL Certificate Issues

**Problem:** HTTPS doesn't work for www subdomain.

**Solution:**
- Vercel automatically provisions SSL certificates
- Ensure both domains are added in Vercel
- Wait a few minutes for SSL certificate generation

### Issue 4: Some People Can See It, Others Can't

**Problem:** DNS propagation is still in progress.

**Solution:**
- This is normal after DNS changes
- Different DNS servers update at different times
- Can take 5 minutes to 48 hours depending on TTL
- Check DNS propagation status globally using DNS checkers

## Alternative: Use Cloudflare

If you're using Cloudflare (recommended):

1. **Add A record:**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   - Proxy status: Proxied (orange cloud)

2. **Add CNAME record:**
   - Type: `CNAME`
   - Name: `www`
   - Target: `yourdomain.com` or `cname.vercel-dns.com`
   - Proxy status: Proxied (orange cloud)

3. **Add Page Rule (optional):**
   - If `www.yourdomain.com/*`
   - Then redirect to `https://yourdomain.com/$1`
   - Status code: 301

## Testing Checklist

- [ ] CNAME record added for `www` subdomain
- [ ] Both domains added in Vercel dashboard
- [ ] DNS records verified using DNS checker tools
- [ ] Redirect rule added to `vercel.json`
- [ ] Redeployed to Vercel
- [ ] Tested `www.yourdomain.com` redirects to `yourdomain.com`
- [ ] SSL certificates working for both domains
- [ ] Tested from different locations/networks

## Support

If issues persist:
1. Check Vercel documentation: https://vercel.com/docs/concepts/projects/domains
2. Verify DNS records with your domain provider
3. Check Vercel deployment logs for domain verification errors
4. Contact Vercel support if domains won't verify

