# 🚀 jebkharch AI Expense Tracker - Deployment Guide

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Freemium BYOK Model](#freemium-byok-model)
- [Deploying to Vercel (Recommended)](#deploying-to-vercel-recommended)
- [Alternative: Firebase Hosting](#alternative-firebase-hosting)
- [Commercial Scaling](#commercial-scaling)
- [Free Tier Optimization](#free-tier-optimization)
- [Troubleshooting](#troubleshooting)
- [FAQs](#faqs)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download Link |
|------------|---------|---------------|
| **Node.js** | v18.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.x or higher | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **Gemini API Key** (Optional) | - | [ai.google.dev](https://ai.google.dev/) |

### Getting Your Gemini API Key (Optional)

> [!NOTE]
> **The API key is now OPTIONAL!** The app works perfectly without it. Users who want AI features can add their own free API key directly in the app.

If you want to enable AI features:

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click **"Get API Key"**
4. Create a new API key or use an existing one
5. **Add it in the app Settings** after deploying

> [!TIP]
> **Freemium Model:** With the new architecture, users add their own API keys. This means zero API costs for you, even with thousands of users!

---

## 💻 Local Development Setup

### Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd /path/to/your/projects

# Clone the repository (if using Git)
git clone <your-repo-url>

# Or if you already have the files, navigate to the project
cd jebkharch---ai-expense-tracker
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **@google/genai** - Gemini AI integration (used client-side)
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Step 3: Run the Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

You should see:
```
VITE v6.2.0  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

### Step 4: Test the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Create a user account (stored locally)
3. Test expense tracking features
4. **(Optional)** Add your Gemini API key in Settings to unlock AI features

---

## 💰 Freemium BYOK Model

### What is BYOK?

**BYOK (Bring Your Own Key)** means users provide their own Gemini API keys instead of using a shared key.

### Why This Matters for Commercial Use

**Problem with Traditional Approach:**
- ❌ One API key for all users
- ❌ You pay for everyone's API usage
- ❌ Expensive with 1,000+ users
- ❌ Rate limiting issues

**Solution with BYOK:**
- ✅ Each user uses their own free API key
- ✅ Zero API costs for you
- ✅ Each user gets 1,500 requests/day free
- ✅ Scales infinitely without cost
- ✅ Privacy-first (keys stored in user's browser)

### How It Works

1. **Core Features (Always Free)**
   - ✅ Expense tracking
   - ✅ Budget management
   - ✅ Visual charts & analytics
   - ✅ Category organization
   - ✅ Goal tracking
   - ✅ Recurring transactions

2. **AI Features (Optional - BYOK)**
   - ✨ Natural language input ("Lunch 450")
   - 📸 Receipt scanning & auto-fill
   - 💬 AI financial advisor chat
   - 📈 Smart spending insights
   
   **To unlock**: Users add their free Gemini API key in Settings

3. **User Experience**
   - App shows "Unlock AI Features" prompt in Settings
   - One-click link to get free API key
   - Simple paste & save interface
   - Keys stored locally (never sent to your server)

---

## 🌐 Deploying to Vercel (Recommended)

Vercel is the **recommended platform** for deploying this app. No environment variables needed!

### Why Vercel?

✅ **No configuration needed** - Just deploy!  
✅ **No environment variables required** - Users provide their own keys  
✅ **Free SSL certificates**  
✅ **Global CDN** for fast loading  
✅ **Generous free tier** (100GB bandwidth/month)  

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click **"Sign Up"**
   - Choose **"Continue with GitHub"** (recommended)

2. **Import Your Project**
   - Click **"Add New Project"**
   - Select **"Import Git Repository"**
   - Choose your repository
   - Or click **"Import Third-Party Git Repository"** and paste your repo URL

3. **Configure Project Settings**
   
   Vercel will auto-detect Vite configuration. Verify these settings:
   
   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |

4. **Deploy** (No Environment Variables Needed!)
   - Click **"Deploy"**
   - Wait 1-2 minutes for build to complete
   - Your app will be live at `https://your-app-name.vercel.app`
   - 🎉 **Done!** Users add their own API keys in-app

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd jebkharch---ai-expense-tracker

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# After successful deployment, deploy to production
vercel --prod
```

During deployment, you'll be prompted to:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N** (first time)
- What's your project's name? **jebkharch-ai-expense-tracker** (or your preferred name)
- In which directory is your code located? **./**
- Want to override settings? **N**

### Setting Environment Variables via CLI

```bash
# Add environment variable
vercel env add GEMINI_API_KEY

# You'll be prompted to:
# 1. Enter the value
# 2. Select environments (use spacebar to select multiple)
```

### Automatic Deployments

Once connected to Git:
- **Production**: Every push to `main` branch triggers a production deployment
- **Preview**: Every pull request gets a unique preview URL

### Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed
5. Vercel handles SSL automatically

---

## 🔥 Alternative: Firebase Hosting

While Vercel is recommended, you can also use Firebase Hosting (free tier available).

### Firebase Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

   Select:
   - **What do you want to use as your public directory?** `dist`
   - **Configure as a single-page app?** `Yes`
   - **Set up automatic builds and deploys with GitHub?** `Yes` (optional)

4. **Build Your App**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy
   ```

---

## 📈 Commercial Scaling

### Ready for Market Launch

With the BYOK model, jebkharch is **ready to handle thousands of users** without any backend infrastructure or API costs:

**Scalability Metrics:**
- ✅ **1 user** = $0 API cost to you
- ✅ **1,000 users** = $0 API cost to you  
- ✅ **100,000 users** = $0 API cost to you
- ✨ **Infinite scaling** at zero marginal API cost!

**Why This Works:**
1. Each user brings their own API key
2. Each user stays within Gemini's free tier (1,500 requests/day)
3. No rate limiting conflicts
4. No backend proxy needed

### Future Monetization Options

If you want to monetize later, consider:

**Option 1: Premium Tier with Included API**
- Charge $2-5/month for unlimited AI features
- Build backend proxy to handle API calls
- Rate limit free users, unlimited for premium
- See [Backend Proxy Setup](#backend-proxy-setup-advanced) below

**Option 2: Keep 100% Free + Donations**
- Add donation/tip feature
- Sponsor tier with cosmetic benefits
- Keep BYOK model for sustainability

**Option 3: Freemium Hybrid**
- Basic AI: BYOK (free)
- Advanced AI: Premium subscription with included quota
- Best of both worlds

### Backend Proxy Setup (Advanced)

**Only if you want to add a paid tier with included API access.**

1. **Using Vercel Serverless Functions**
   ```javascript
   // api/gemini.js
   export default async function handler(req, res) {
     // Check user's subscription status
     // Rate limit based on tier
     // Proxy to Gemini API with your key
     // Return result
   }
   ```

2. **Using Firebase Cloud Functions**
   ```javascript
   exports.geminiProxy = functions.https.onCall(async (data, context) => {
     // Authenticate user
     // Check subscription
     // Call Gemini API
     // Return result
   });
   ```

**Implementation Steps:**
- Add user authentication (Firebase Auth)
- Add subscription management (Stripe)
- Build API proxy endpoint
- Update frontend to use proxy for premium users
- Keep BYOK for free tier

---

## 💰 Free Tier Optimization

### Vercel Free Tier Limits

| Resource | Limit |
|----------|-------|
| **Deployments** | Unlimited |
| **Bandwidth** | 100 GB/month |
| **Build Execution** | 6000 minutes/month |
| **Serverless Functions** | 100 GB-hours/month |
| **Projects** | Unlimited |

### Gemini API Free Tier

| Feature | Limit |
|---------|-------|
| **Requests** | 60 requests/minute |
| **Free Quota** | Generous daily quota |

### Tips to Stay Within Free Tier

#### 1. **Optimize Bundle Size**

```bash
# Analyze bundle
npm run build -- --mode analyze
```

- Remove unused dependencies
- Use code splitting
- Implement lazy loading for routes

#### 2. **Implement API Rate Limiting**

Add rate limiting to AI requests in your code:

```typescript
// Example: Debounce AI requests
const debouncedAICall = debounce(async (input) => {
  // Your AI call
}, 1000); // Wait 1 second between calls
```

#### 3. **Cache AI Responses**

Store frequently requested AI responses in browser localStorage to avoid redundant API calls.

#### 4. **Optimize Images**

- Use WebP format
- Compress images
- Implement lazy loading

#### 5. **Monitor Usage**

- **Vercel**: Check dashboard for bandwidth usage
- **Gemini**: Monitor API quota in [Google Cloud Console](https://console.cloud.google.com/)

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. **"API Key not found" Error**

**Problem**: Environment variable not loaded

**Solution**:
```bash
# Verify .env.local exists
ls -la

# Check file contents (be careful not to expose key)
# Make sure GEMINI_API_KEY=your_key is present

# Restart dev server
npm run dev
```

#### 2. **Build Fails on Vercel**

**Problem**: Missing environment variables or build errors

**Solutions**:
- Verify `GEMINI_API_KEY` is set in Vercel dashboard
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Try building locally: `npm run build`

#### 3. **API Quota Exceeded**

**Problem**: Too many Gemini API requests

**Solutions**:
- Implement request caching
- Add rate limiting
- Reduce AI feature usage
- Consider upgrading API quota (still free up to high limits)

#### 4. **TypeScript Errors**

**Problem**: Type checking fails during build

**Solution**:
```bash
# Run type check locally
npx tsc --noEmit

# Fix any type errors before deploying
```

#### 5. **Vite Build Memory Error**

**Problem**: Out of memory during build

**Solution**:
```bash
# Increase Node memory (in package.json)
{
  "scripts": {
    "build": "NODE_OPTIONS=--max_old_space_size=4096 vite build"
  }
}
```

---

## ❓ FAQs

### Can I use both Firebase and Vercel?

No, you should choose one hosting platform. **Vercel is recommended** for this Vite/React app.

### How do I update my deployed app?

**Vercel**: Just push to your Git repository - automatic deployment!
**Firebase**: Run `npm run build` then `firebase deploy`

### Is my data secure?

Yes! With BYOK, API keys are stored locally in each user's browser and never sent to your server. User transaction data is also stored locally in the browser.

### Can I use a custom domain?

**Vercel**: Yes, free SSL included
**Firebase**: Yes, free SSL included

### What happens if I exceed free tier limits?

**Vercel**: You'll receive warnings. Upgrade to Pro ($20/month) if needed.
**Gemini API**: API requests will be rate-limited. Consider implementing caching.

### How do I roll back a deployment?

**Vercel**: Go to deployments tab → select previous deployment → promote to production
**Firebase**: `firebase hosting:clone source:version target:version`

### Can I see deployment logs?

**Vercel**: Yes, real-time logs in dashboard under "Deployments" tab
**Firebase**: Yes, via `firebase hosting:logs`

---

## 📞 Support & Resources

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs/hosting)
- [Gemini API Documentation](https://ai.google.dev/docs)

### Community
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Firebase Community](https://firebase.google.com/community)

---

## 🎉 You're All Set!

Your jebkharch AI Expense Tracker is now ready to deploy! Choose your preferred platform and follow the steps above.

**Recommended Quick Start:**
1. Test locally: `npm run dev`
2. Deploy to Vercel via GitHub integration (no environment variables needed!)
3. Share your live app URL!
4. Users add their own API keys for AI features

> [!TIP]
> Star ⭐ your repository and share your deployed app with friends!

---

**Happy Deploying! 🚀**
