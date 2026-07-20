# Netlify Deployment

This site is prepared as a static multi-page website for Netlify.

## Included

- `index.html`
- `products/index.html`
- `about/index.html`
- `projects/index.html`
- `contact/index.html`
- `thanks/index.html`
- `404.html`
- `styles.css`
- `script.js`
- `netlify.toml`
- `robots.txt`

## Netlify Setup

1. Sign in to Netlify.
2. Create a new project by importing this folder from a Git provider, or use Netlify's manual deploy upload.
3. Confirm the publish directory is `.`.
4. Deploy the site.
5. After deployment, test these pages:
   - `/`
   - `/products/`
   - `/about/`
   - `/projects/`
   - `/contact/`
   - `/thanks/`
6. Open the Netlify Forms section and confirm the `contact` form is detected after the first deploy.

## Notes

- The contact form uses Netlify's static form pattern with `data-netlify="true"`.
- The form success page is `../thanks/`.
- If you connect a custom domain later, add a sitemap with that final domain.
