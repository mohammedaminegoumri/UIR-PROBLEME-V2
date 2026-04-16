# Deployment Guide - UIR PROBLEMES

This guide explains how to deploy the UIR PROBLEMES platform to various hosting services.

## Quick Deploy Options

### 1. Netlify (Recommended)

Netlify is perfect for this static site and offers free hosting with custom domains.

**Steps:**
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your Git repository (GitHub, GitLab, or Bitbucket)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click "Deploy site"
5. Your site will be live at `your-site-name.netlify.app`

**Custom Domain:**
- Go to Domain settings in Netlify
- Add your custom domain (e.g., `uirproblemes.com`)
- Follow DNS configuration instructions

### 2. Vercel

Vercel offers excellent performance and easy deployment.

**Steps:**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your Git repository
3. Vercel auto-detects Vite configuration
4. Click "Deploy"
5. Site live at `your-project.vercel.app`

### 3. GitHub Pages

Free hosting directly from your GitHub repository.

**Steps:**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run deploy`
4. Enable GitHub Pages in repository settings
5. Site live at `username.github.io/repository-name`

### 4. Cloudflare Pages

Fast, global CDN with free SSL.

**Steps:**
1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect Git repository
3. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
4. Deploy
5. Site live with Cloudflare's CDN

### 5. Manual Hosting

For any web server (Apache, Nginx, etc.):

**Steps:**
1. Run `npm run build`
2. Upload contents of `dist` folder to your web server
3. Configure server to serve `index.html` for all routes
4. Ensure HTTPS is enabled

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name uirproblemes.com;

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache Configuration Example (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Post-Deployment Checklist

### Essential Checks
- [ ] All pages load correctly
- [ ] Navigation works between pages
- [ ] Forms submit successfully
- [ ] Local storage is working
- [ ] Images load properly
- [ ] Mobile responsive design works
- [ ] GDPR consent banner appears on first visit
- [ ] Privacy policy is accessible

### Performance Optimization
- [ ] Enable Gzip/Brotli compression
- [ ] Configure browser caching
- [ ] Implement HTTPS
- [ ] Test page load speed
- [ ] Check mobile performance

### SEO & Social
- [ ] Set proper meta tags (done in index.html)
- [ ] Add Open Graph tags for social sharing
- [ ] Submit sitemap to search engines
- [ ] Set up Google Search Console (optional)

## Custom Domain Setup

### Recommended: Custom Domain
Instead of `your-site.netlify.app`, use `uirproblemes.com`

**Steps:**
1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Point domain to hosting provider:
   - **Netlify**: Add A record to `75.2.60.5` and AAAA to `2600:c02:b400:1::c01`
   - **Vercel**: Add CNAME to `cname.vercel-dns.com`
   - **Cloudflare Pages**: Follow Cloudflare's DNS instructions
3. Configure SSL certificate (usually automatic)
4. Wait for DNS propagation (up to 48 hours)

## Environment Considerations

### No Environment Variables Needed
This is a fully client-side application with no backend, so no API keys or environment variables are required.

### Browser Compatibility
The built application works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Considerations
- Site is fully responsive
- Works on iOS and Android
- PWA-ready (can be enhanced with service worker)

## Monitoring & Analytics (Optional)

While the platform doesn't use analytics by default (for privacy), you can optionally add:

### Privacy-Friendly Analytics
If you decide to add analytics later, use privacy-focused options:
- **Plausible**: Privacy-focused, GDPR compliant
- **Fathom**: Simple, privacy-first analytics
- **Simple Analytics**: No cookies, GDPR compliant

**Important**: If adding analytics, update the Privacy Policy accordingly and get user consent.

## Backup & Recovery

### Data Backup
Since all data is stored locally on users' devices:
- No server backup needed
- Users should export important data regularly
- Consider adding an export feature in future versions

### Site Backup
- Keep source code in Git repository
- Tag releases for version control
- Keep build artifacts for rollback capability

## Maintenance

### Regular Updates
1. Monitor dependencies: `npm outdated`
2. Update packages: `npm update`
3. Test after updates
4. Rebuild and redeploy

### Security Updates
1. Watch for security advisories
2. Update dependencies with vulnerabilities
3. Test thoroughly before deploying
4. Keep deployment platform updated

## Troubleshooting

### Common Issues

**Problem: Blank page after deployment**
- Check browser console for errors
- Ensure build completed successfully
- Verify routing configuration on hosting platform

**Problem: 404 on page refresh**
- Configure hosting to redirect all routes to index.html
- See hosting-specific configuration above

**Problem: CSS not loading**
- Check network tab for 404 errors
- Verify dist folder structure
- Ensure base URL is set correctly

**Problem: Local storage not working**
- Check browser privacy settings
- Ensure HTTPS is enabled
- Verify user hasn't disabled local storage

## Support

For deployment assistance or questions:
- Check hosting provider documentation
- Contact through Instagram: @UIR_PROBLEMES

---

**Recommended Hosting**: Netlify or Vercel for easiest deployment with excellent performance.

**Domain Suggestion**: Register `uirproblemes.com` or `uirproblemes.ma` for a professional presence.
