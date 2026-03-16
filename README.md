# ReFloorCo Rep Tools

Mobile-first sales tools for ReFloorCo field reps.

## Pages

| URL | Purpose |
|-----|---------|
| `/` | Home — links to all tools |
| `/quote` | Quote calculator — build + show + send |
| `/productized-flow` | Productized services 7-step training |
| `/db-flow` | Design & Build 9-step training |
| `/field-guide` | Scripts, rules, email templates |
| `/pricing` | Pricing reference — all rates |

## Deploy to Vercel (30 minutes)

1. Go to vercel.com — create a free account
2. Click "Add New Project"
3. Drag and drop this entire `refloorco-tools` folder
4. Vercel auto-detects the config and deploys
5. You get a URL like `refloorco-tools.vercel.app`

## Connect a custom domain (optional)

1. In Vercel dashboard → your project → Settings → Domains
2. Add `tools.refloorco.com` (or whatever subdomain you want)
3. Add a CNAME record in your DNS pointing to `cname.vercel-dns.com`
4. Done — reps use `tools.refloorco.com`

## Updating pricing

All pricing lives in `/public/quote.html` in the `SVCS` array at the top of the script,
and in `/public/pricing.html` as static HTML. Edit those files and redeploy.

## Internal use only

These tools are for ReFloorCo sales reps. Do not share the URL publicly.
