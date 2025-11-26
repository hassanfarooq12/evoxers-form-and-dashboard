# Vercel Deployment Guide

Complete step-by-step guide to deploy the Evoxers Form and Dashboard to Vercel as a single project.

## Prerequisites

- ✅ Supabase PostgreSQL database set up (already done)
- ✅ Database migrations applied (already done)
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com) - free tier available)

## Project Structure After Deployment

- **Frontend (Questionnaire Form):** `https://your-project.vercel.app/`
- **Admin Dashboard:** `https://your-project.vercel.app/dashboard`
- **Backend API:** `https://your-project.vercel.app/api/*`

---

## Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Verify your repository is pushed to GitHub/GitLab/Bitbucket**

---

## Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. **Import your Git repository:**
   - Select your repository (GitHub/GitLab/Bitbucket)
   - Click **Import**

---

## Step 3: Configure Project Settings

Vercel should auto-detect the configuration from `vercel.json`, but verify these settings:

### Build Settings

- **Framework Preset:** Other (or Vite - Vercel will handle it)
- **Root Directory:** `.` (leave as default)
- **Build Command:** `npm run build:all` (should auto-detect)
- **Output Directory:** `dist` (for frontend)
- **Install Command:** `npm install` (default)

**Note:** The `vercel.json` file handles building both frontend and dashboard automatically.

---

## Step 4: Add Environment Variables

This is the **most important step**. Go to **Settings** → **Environment Variables** and add:

### Required Environment Variable

#### 1. DATABASE_URL

**Variable Name:** `DATABASE_URL`

**Value:**
```
postgres://postgres.lasxxeuklurnjsxxvxtw:uRpRrD9dho5y2rQ4@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

**Environments:** 
- ✅ Production
- ✅ Preview  
- ✅ Development

**Why:** This is the connection pooler URL optimized for Vercel serverless functions. It uses port 6543 with pgbouncer for connection pooling.

---

### Optional Environment Variables

#### 2. CORS_ORIGIN (Optional - Leave Empty)

**Variable Name:** `CORS_ORIGIN`

**Value:** (Leave empty or don't add this variable)

**Environments:** Production, Preview, Development

**Why:** For single deployment, everything is on the same domain, so CORS is not needed. The backend automatically allows same-origin requests.

#### 3. NODE_ENV (Optional - Auto-set by Vercel)

**Variable Name:** `NODE_ENV`

**Value:** `production`

**Environments:** Production only

**Why:** Vercel automatically sets this, but you can explicitly set it if needed.

---

## Step 5: Deploy

1. **Click "Deploy"** button
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Monitor the build logs** for any errors

---

## Step 6: Verify Deployment

After deployment completes, test all three applications:

### 1. Test Frontend (Questionnaire Form)

- Visit: `https://your-project.vercel.app/`
- Fill out and submit the form
- Verify submission is successful

### 2. Test Backend API

- Health check: `https://your-project.vercel.app/api/`
  - Should return: `{"status":"ok","message":"Backend is running"}`
- Get submissions: `https://your-project.vercel.app/api/all`
  - Should return array of submissions (or empty array `[]`)

### 3. Test Admin Dashboard

- Visit: `https://your-project.vercel.app/dashboard`
- Log in with:
  - Username: `admin`
  - Password: `admin123`
- Verify you can:
  - View submissions list
  - Click on a submission to see details
  - See the data you submitted from the form

---

## Environment Variables Summary

Copy and paste this into Vercel's Environment Variables section:

```
DATABASE_URL=postgres://postgres.lasxxeuklurnjsxxvxtw:uRpRrD9dho5y2rQ4@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

**That's it!** Only one environment variable is required for single deployment.

---

## Troubleshooting

### Build Fails

**Issue:** Build command fails
- **Solution:** Check that `build:all` script exists in root `package.json`
- Verify both `package.json` files (root and `backend/dashboard/`) have build scripts

**Issue:** Prisma client generation fails
- **Solution:** Ensure `DATABASE_URL` is set correctly
- Check build logs for specific Prisma errors

### Database Connection Issues

**Issue:** API returns database connection errors
- **Solution:** 
  - Verify `DATABASE_URL` is set in Vercel environment variables
  - Ensure you're using the **pooling connection** (port 6543) not the direct connection
  - Check Supabase dashboard to ensure database is active

**Issue:** "Too many connections" error
- **Solution:** You're using the wrong connection string. Make sure it includes:
  - Port `6543` (not 5432)
  - `pgbouncer=true` parameter

### API Not Working

**Issue:** API returns 404
- **Solution:** 
  - Verify `api/index.js` exists in project root
  - Check `vercel.json` has route for `/api/(.*)`
  - Check build logs to ensure API function was created

**Issue:** CORS errors
- **Solution:** For single deployment, CORS should work automatically. If you see errors:
  - Verify `CORS_ORIGIN` is empty or not set
  - Check `backend/src/server.js` CORS configuration

### Dashboard Not Loading

**Issue:** Dashboard shows 404 or blank page
- **Solution:**
  - Verify `backend/dashboard/dist` was created during build
  - Check `vercel.json` routes for `/dashboard/*`
  - Ensure React Router basename is set correctly in `backend/dashboard/src/App.jsx`

**Issue:** Dashboard assets (CSS/JS) not loading
- **Solution:**
  - Check `backend/dashboard/vite.config.js` has `base: '/dashboard/'`
  - Verify build output includes assets in correct paths

### Form Submission Fails

**Issue:** Form submission returns error
- **Solution:**
  - Check browser console for errors
  - Verify API endpoint is `/api/submit` (relative path)
  - Check Vercel function logs for backend errors
  - Verify database connection is working

---

## Post-Deployment Checklist

- [ ] All three applications accessible (frontend, dashboard, API)
- [ ] Form submission works and saves to database
- [ ] Dashboard can view submissions
- [ ] Database connection stable (no errors in logs)
- [ ] All routes working correctly
- [ ] Custom domain configured (optional)

---

## Cost Estimate

- **Vercel Hobby (Free Tier):** $0/month
  - 100GB bandwidth
  - Unlimited serverless function executions
  - Perfect for small to medium projects
- **Supabase Free Tier:** $0/month
  - 500MB database storage
  - 2GB bandwidth
- **Total: $0/month** (free tier sufficient for most use cases)

---

## Updating Your Deployment

After making code changes:

1. **Commit and push to your repository:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Vercel will automatically redeploy** (if connected to Git)
   - Or manually trigger deployment from Vercel dashboard

3. **Environment variables persist** across deployments
   - No need to re-add them unless you change them

---

## Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel automatically provisions SSL certificates

---

## Monitoring and Logs

- **View logs:** Vercel Dashboard → Your Project → **Deployments** → Click on deployment → **Functions** tab
- **Real-time logs:** Vercel Dashboard → Your Project → **Logs** tab
- **Analytics:** Available in Vercel Pro plan (optional)

---

## Support

If you encounter issues:
1. Check Vercel build logs for specific errors
2. Check Supabase dashboard to verify database is active
3. Verify all environment variables are set correctly
4. Test API endpoints directly using the URLs above

---

## Quick Reference

**Your Supabase Connection Strings:**

**For Vercel (Application Runtime - Use This):**
```
postgres://postgres.lasxxeuklurnjsxxvxtw:uRpRrD9dho5y2rQ4@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

**For Local Migrations (Port 5432 - Non-pooling):**
```
postgres://postgres.lasxxeuklurnjsxxvxtw:uRpRrD9dho5y2rQ4@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**Remember:** 
- Use **port 6543** (pooling) for Vercel deployment ✅
- Use **port 5432** (non-pooling) for local migrations only

