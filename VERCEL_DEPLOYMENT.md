# 🚀 Deploy jebkharch to Vercel with HTTPS

## Overview

This guide walks you through deploying jebkharch AI Expense Tracker to Vercel with automatic HTTPS/SSL. Vercel provides:

- ✅ **Free HTTPS/SSL** - Automatic on all deployments
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Automatic deployments** - Every git push deploys
- ✅ **Preview deployments** - Every PR gets a unique URL
- ✅ **Zero configuration** - Works out of the box with Vite

**Total Time:** ~15 minutes

---

## 📋 Prerequisites

Before you begin, make sure you have:

| Requirement | Status | Get It |
|-------------|--------|--------|
| **GitHub Account** | Required | [github.com/signup](https://github.com/signup) |
| **Vercel Account** | Required | [vercel.com/signup](https://vercel.com/signup) |
| **Firebase Project** | Required | See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) |
| **Git Installed** | Required | [git-scm.com](https://git-scm.com/) |
| **Code Ready** | Required | `npm install` should work |

---

## 🎯 Deployment Steps

### Step 1: Prepare Your Repository

#### 1.1 Initialize Git (if not already done)

```bash
cd jebkharch---ai-expense-tracker
git init
```

#### 1.2 Create `.gitignore`

Make sure these files are in `.gitignore`:

```gitignore
# Dependencies
node_modules

# Environment variables
.env
.env.local
.env.production.local

# Build output
dist
build

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

#### 1.3 Verify `.env.local` is NOT committed

```bash
# Check if .env.local is ignored
git check-ignore .env.local

# Should output: .env.local (if properly ignored)
```

> [!CAUTION]
> **NEVER** commit `.env.local` to Git! It's for local development only.

---

### Step 2: Push to GitHub

#### 2.1 Create a New Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `jebkharch-ai-expense-tracker`
3. Description: `AI-powered expense tracker with Firebase & Gemini`
4. Set to **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

#### 2.2 Link and Push

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Firebase integrated"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/jebkharch-ai-expense-tracker.git

# Push
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

### Step 3: Deploy to Vercel

#### 3.1 Sign Up / Sign In to Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Click **Sign Up** (or **Login**)
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub repositories

#### 3.2 Import Project

1. Click **Add New Project** (or **Import Project**)
2. Select **Import Git Repository**
3. Find `jebkharch-ai-expense-tracker` in the list
4. Click **Import**

#### 3.3 Configure Project

Vercel will auto-detect Vite. Verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

**These should be auto-filled!** If not, set them manually.

---

### Step 4: Add Environment Variables

This is **CRITICAL** - your app won't work without these!

#### 4.1 In Vercel Dashboard

1. Scroll to **Environment Variables** section
2. Add each variable one by one:

**Add these 6 variables:**

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` | Production, Preview, Development |
| `VITE_FIREBASE_AUTH_DOMAIN` | `yourproject.firebaseapp.com` | Production, Preview, Development |
| `VITE_FIREBASE_PROJECT_ID` | `your-project-id` | Production, Preview, Development |
| `VITE_FIREBASE_STORAGE_BUCKET` | `yourproject.appspot.com` | Production, Preview, Development |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Production, Preview, Development |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abc123` | Production, Preview, Development |

**Where to find these values?**
- Firebase Console → Project Settings → Your apps → Web app → Config

#### 4.2 For Each Variable

1. Enter **Name** (e.g., `VITE_FIREBASE_API_KEY`)
2. Enter **Value** (copy from Firebase Console)
3. Select **ALL environments** (Production, Preview, Development)
4. Click **Add**

Repeat for all 6 variables!

---

### Step 5: Deploy!

1. Click **Deploy** button
2. Wait 1-2 minutes for build ⏳
3. See build logs in real-time ✨

**Build process:**
```
Installing dependencies...
Building...
Deploying...
✅ Deployment successful!
```

---

### Step 6: Get Your HTTPS URL

Once deployed, you'll see:

```
🎉 Congratulations!

Your project is live at:
https://jebkharch-ai-expense-tracker.vercel.app
```

**That's your HTTPS URL!** 🔒

- ✅ **SSL/HTTPS automatic** - Vercel provides it free
- ✅ **Global CDN** - Fast worldwide
- ✅ **Always online** - 99.99% uptime

---

### Step 7: Authorize Domain in Firebase

**Important:** Firebase needs to know your Vercel domain!

#### 7.1 Copy Your Vercel URL

```
https://jebkharch-ai-expense-tracker.vercel.app
```

#### 7.2 Add to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** in sidebar
4. Click **Settings** tab
5. Scroll to **Authorized domains**
6. Click **Add domain**
7. Paste your Vercel URL (without https://):
   ```
   jebkharch-ai-expense-tracker.vercel.app
   ```
8. Click **Add**

✅ Now users can sign in on your deployed app!

---

### Step 8: Test Your Deployment

1. **Open your app:**
   ```
   https://jebkharch-ai-expense-tracker.vercel.app
   ```

2. **Test authentication:**
   - Click "Continue with Google"
   - Should open Google sign-in popup
   - Sign in successfully

3. **Test functionality:**
   - Add a transaction
   - Check Firestore console - should appear there
   - Open on another device - data syncs!

4. **Verify HTTPS:**
   - Look for 🔒 padlock in browser address bar
   - Click it - should show "Connection is secure"

---

## 🔄 Automatic Deployments

**Every time you push to GitHub, Vercel automatically deploys!**

```bash
# Make changes
git add .
git commit -m "Added new feature"
git push

# Vercel automatically:
# 1. Detects the push
# 2. Builds your app
# 3. Deploys to production
# 4. Updates your live URL
```

**You'll get:**
- ✅ Email notification when deployed
- ✅ Deployment preview URL
- ✅ Build logs

---

## 🌐 Custom Domain (Optional)

Want your own domain like `jebkharch.com`?

### Add Custom Domain

1. **Buy a domain** (Namecheap, GoDaddy, etc.)

2. **In Vercel Dashboard:**
   - Go to your project
   - Click **Settings**
   - Click **Domains**
   - Click **Add**
   - Enter your domain (e.g., `jebkharch.com`)
   - Click **Add**

3. **Configure DNS:**
   
   Vercel will show you DNS records to add:
   
   **For root domain (jebkharch.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait for DNS propagation** (5 minutes - 24 hours)

5. **Vercel automatically:**
   - ✅ Provisions SSL/HTTPS
   - ✅ Redirects www to non-www (or vice versa)
   - ✅ Updates your deployment

6. **Update Firebase authorized domains:**
   - Add `jebkharch.com` to Firebase authorized domains
   - Add `www.jebkharch.com` too

---

## 📊 Monitor Your Deployment

### Vercel Dashboard

Monitor your app's performance:

1. **Analytics** - Page views, unique visitors
2. **Speed Insights** - Performance metrics
3. **Deployment History** - All past deployments
4. **Real-time Logs** - Live server logs
5. **Usage** - Bandwidth, build minutes

### Free Tier Limits

| Resource | Limit | Your Usage |
|----------|-------|------------|
| **Bandwidth** | 100 GB/month | Monitor in dashboard |
| **Build Minutes** | 6,000 min/month | ~200 builds |
| **Deployments** | Unlimited | Deploy freely! |
| **Team Members** | 1 (just you) | Upgrade for team |

---

## 🔧 Troubleshooting

### Issue: "Build Failed"

**Solution:**
1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

**Fix:**
```bash
# Test build locally
npm run build

# If it fails locally, fix errors first
# Then push to GitHub
```

---

### Issue: "Failed to sign in"

**Solution:**
1. Check Firebase authorized domains
2. Make sure you added your Vercel domain:
   ```
   jebkharch-ai-expense-tracker.vercel.app
   ```
3. Wait 5 minutes after adding domain

---

### Issue: "Environment variables not working"

**Solution:**
1. Verify all 6 Firebase env vars are set in Vercel
2. Check they're set for **all environments**
3. **Redeploy** after adding env vars:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### Issue: "Data not syncing"

**Solution:**
1. Check Firestore security rules are set correctly
2. Check browser console for errors
3. Verify Firebase project is in Blaze (pay-as-you-go) plan if you have many users
   - Spark (free) plan has limits
   - But should work for thousands of users

---

## 🎨 Customize Deployment

### Change App Name

**In Vercel:**
1. Go to project **Settings**
2. Scroll to **General**
3. Change **Project Name**
4. New URL: `https://new-name.vercel.app`

### Environment-Specific Variables

**Different values for production vs preview:**

```bash
# Production only
VITE_ENABLE_ANALYTICS=true

# Preview only (for testing)
VITE_ENABLE_DEBUG=true
```

Add in Vercel → Environment Variables → Select specific environment

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep Firebase credentials in Vercel environment variables
- Use Firestore security rules
- Enable 2FA on Vercel account
- Use strong Firebase authentication

### ❌ DON'T:
- Commit `.env.local` to GitHub
- Share Firebase credentials publicly
- Disable HTTPS (Vercel forces it anyway)
- Use weak passwords

---

## 📱 Share Your App

Once deployed, share your app:

```
🎉 Check out jebkharch!
https://jebkharch-ai-expense-tracker.vercel.app

Track expenses with AI-powered features!
```

**Add to:**
- LinkedIn profile
- Twitter bio
- Portfolio website
- Resume/CV

---

## 🎓 Next Steps

1. ✅ **Monitor analytics** - See who's using your app
2. ✅ **Add features** - Push to GitHub → auto-deploys
3. ✅ **Get feedback** - Share with friends/family
4. ✅ **Scale up** - Firebase handles growth
5. ✅ **Custom domain** - Make it yours

---

## 📞 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Firebase Support
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Status](https://status.firebase.google.com/)

---

## 🎉 You're Live!

Your jebkharch app is now:
- ✅ Deployed on Vercel
- ✅ HTTPS/SSL enabled (automatic)
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Production-ready

**Start sharing and changing lives! 💰✨**

---

## 📋 Quick Reference

### Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All 6 Firebase env vars added
- [ ] Deployed successfully
- [ ] Firebase domain authorized
- [ ] Tested authentication
- [ ] Tested data sync
- [ ] Verified HTTPS (🔒 in browser)
- [ ] Shared with friends 🎉

### Useful Commands

```bash
# Local development
npm run dev

# Test production build
npm run build
npm run preview

# Deploy (automatic via git push)
git add .
git commit -m "Update"
git push

# Check Vercel CLI (optional)
npm i -g vercel
vercel
```

---

**Happy deploying! Your app is now live with HTTPS! 🚀🔒**
