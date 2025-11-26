# Manual Deployment Trigger

If Vercel doesn't automatically deploy after pushing to GitHub, follow these steps:

## Option 1: Trigger from Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: **evoxers-form-and-dashboard**
3. Go to the **Deployments** tab
4. Click the **"..."** (three dots) menu on the latest deployment
5. Select **"Redeploy"**
6. Or click **"Redeploy"** button at the top

## Option 2: Check Git Integration

1. Go to Vercel Dashboard → Your Project → **Settings** → **Git**
2. Verify your repository is connected
3. Check that **"Production Branch"** is set to `main`
4. Ensure **"Auto-deploy"** is enabled

## Option 3: Use Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/aman-sajid/Desktop/evoxers-form-and-dashboard
vercel --prod
```

## Option 4: Force a New Commit

If auto-deployment is enabled but not triggering, make a small change:

```bash
# Make a small change to trigger deployment
echo "" >> README.md
git add README.md
git commit -m "Trigger deployment"
git push origin main
```

## Troubleshooting

### Deployment Not Triggering

1. **Check Vercel Webhook:**
   - Go to GitHub → Your Repository → **Settings** → **Webhooks**
   - Verify Vercel webhook exists and is active
   - Check recent deliveries for errors

2. **Verify Git Connection:**
   - Vercel Dashboard → Project → Settings → Git
   - Ensure repository is properly connected
   - Try disconnecting and reconnecting if needed

3. **Check Branch Settings:**
   - Ensure `main` branch is set as production branch
   - Verify auto-deploy is enabled for production

4. **Manual Redeploy:**
   - Always works as a fallback
   - Go to Deployments → Click "Redeploy"

## Current Status

Your latest commit: `9aa9150` - "Fix SPA rewrite: exclude API routes from index.html rewrite"

This commit should trigger an automatic deployment if:
- ✅ Git integration is properly configured
- ✅ Auto-deploy is enabled
- ✅ Webhook is active

If it doesn't trigger automatically, use **Option 1** (Redeploy from Dashboard) - it's the quickest solution.

