# Domain Setup Guide for rannegerodias.com

## Current Status

✅ Domain `rannegerodias.com` is added to your Vercel account
⚠️ Domain needs DNS configuration

## DNS Configuration Options

### Option 1: Use A Record (Recommended - Keep Current Nameservers)

If you want to keep your current nameservers (WordPress), add this A record:

**A Record:**
- **Name/Host:** `@` or `rannegerodias.com`
- **Type:** A
- **Value:** `76.76.21.21`
- **TTL:** 3600 (or default)

**For www subdomain:**
- **Name/Host:** `www`
- **Type:** CNAME
- **Value:** `cname.vercel-dns.com`
- **TTL:** 3600 (or default)

### Option 2: Change Nameservers (Full Vercel Control)

Change your domain's nameservers to Vercel's:

1. Go to your domain registrar (where you bought rannegerodias.com)
2. Find DNS/Nameserver settings
3. Replace current nameservers with Vercel's (you'll get these from Vercel dashboard)

## Steps to Complete Setup

1. **Configure DNS** (choose Option 1 or 2 above)

2. **Verify Domain in Vercel:**
   ```bash
   vercel domains verify rannegerodias.com
   ```

3. **Assign Domain to Project:**
   The domain should automatically be assigned, but you can verify in:
   - Vercel Dashboard → Project Settings → Domains
   - Or use: `vercel domains ls`

4. **Wait for DNS Propagation:**
   - DNS changes can take 24-48 hours to propagate
   - Check status: `vercel domains inspect rannegerodias.com`

## Auth Code

You provided auth code: `Peeu-674-463-736`

This code may be needed for:
- Domain transfer (if transferring from another registrar)
- Domain verification
- DNS provider authentication

If Vercel prompts for verification, use this code.

## Verification

After DNS is configured, Vercel will automatically verify the domain. You'll receive an email when verification is complete.

## Current DNS Status

- **Current Nameservers:** WordPress (ns1.wordpress.com, ns2.wordpress.com, ns3.wordpress.com)
- **Recommended:** Add A record `76.76.21.21` to point to Vercel
- **Or:** Change nameservers to Vercel's nameservers

## Testing

Once DNS is configured:
1. Visit https://rannegerodias.com
2. Check SSL certificate (should auto-generate)
3. Test all features on the custom domain

## Troubleshooting

If domain doesn't work after 24 hours:
- Check DNS propagation: https://www.whatsmydns.net/#A/rannegerodias.com
- Verify A record is correct
- Check Vercel dashboard for domain status
- Contact Vercel support if needed

---

**Next Step:** Configure DNS records at your domain registrar using the A record above.

