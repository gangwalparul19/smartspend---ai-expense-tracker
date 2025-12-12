# 🔥 Firebase Setup Guide

## Purpose
This guide walks you through setting up Firebase for jebkharch AI Expense Tracker.

>**Note:** This implementation is complete! You just need to create your Firebase project and add credentials.

---

## 📋 Step-by-Step Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: **`jebkharch-ai`** (or your preferred name)
4. Click **Continue**
5. **Disable** Google Analytics (not needed for this app) - Click **Continue**
6. Click **Create project**
7. Wait for setup to complete (~30 seconds)
8. Click **Continue** to go to your project dashboard

---

### Step 2: Register Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Enter app nickname: **`jebkharch Web`**
3. **Check** "Also set up Firebase Hosting" (optional, but recommended)
4. Click **Register app**
5. Firebase will show you config code - **KEEP THIS PAGE OPEN** (you'll need it next)

---

### Step 3: Enable Google Authentication

1. In Firebase Console sidebar, click **Build** > **Authentication**
2. Click **Get started**
3. Click **Sign-in method** tab
4. Click **Google** in the providers list
5. Toggle **Enable** switch to ON
6. Select your **Project support email** from dropdown
7. Click **Save**

✅ Google Auth is now enabled!

---

### Step 4: Create Firestore Database

1. In Firebase Console sidebar, click **Build** > **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode** (we'll add security rules next)
4. Click **Next**
5. Choose your **Firestore location** (select closest to your users, e.g., `asia-south1` for India)
6. Click **Enable**
7. Wait for database creation (~1 minute)

---

### Step 5: Add Security Rules

1. In Firestore Database page, click **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

✅ Your database is now secure!

---

### Step 6: Get Your Configuration

1. Go to **Project Settings** (gear icon in sidebar)
2. Scroll down to **"Your apps"** section
3. Under your web app, click **SDK setup and configuration**
4. Select **Config** radio button
5. Copy the firebaseConfig object

It should look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "jebkharch-ai.firebaseapp.com",
  projectId: "smart spend-ai",
  storageBucket: "jebkharch-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

### Step 7: Add Config to Your App

1. Open your project folder
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` and fill in your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=jebkharch-ai.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=jebkharch-ai
   VITE_FIREBASE_STORAGE_BUCKET=jebkharch-ai.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

4. Save the file

---

### Step 8: Install Dependencies & Run

```bash
# Install Firebase SDK
npm install

# Start development server
npm run dev
```

Your app will start at **http://localhost:3000**

---

## 🎉 You're Done!

Your app now has:
- ✅ Real Google Authentication
- ✅ Cloud database (Firestore)
- ✅ Multi-device sync
- ✅ Automatic backup
- ✅ Ready for lakhs of users!

---

## 🚀 Deploy to Production

### Option 1: Deploy to Vercel

1. Push your code to GitHub (but `.env.local` in `.gitignore`)
2. Go to [vercel.com](https://vercel.com/)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Deploy!

### Option 2: Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Build app
npm run build

# Deploy
firebase deploy
```

---

## 📊 Monitor Usage

### Firebase Console

Monitor your app's usage:
1. **Authentication** > **Users** - See all signed-in users
2. **Firestore Database** > **Data** - Browse user data
3. **Usage and billing** - Monitor free tier limits

### Free Tier Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| Auth Users | Unlimited | ✅ No limit! |
| Firestore Reads | 50,000/day | ~50 per active user = 1,000 users/day |
| Firestore Writes | 20,000/day | ~20 per active user = 1,000 users/day |
| Storage | 1 GB | Plenty for millions of transactions |

---

## 🔒 Security Notes

### Firebase Config is Public
- Firebase API keys in `.env.local` are **safe to expose**
- They identify your Firebase project (like a project ID)
- Real security comes from:
  - ✅ Firestore Security Rules (users only access their data)
  - ✅ Firebase Authentication (only signed-in users)

### Gemini API Keys
- Still stored in **user's browser** (localStorage)
-  **Never** stored in Firestore
- BYOK model preserved - each user uses their own key

---

## ❓ Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"

**Solution:** Add your domain to authorized domains:
1. Firebase Console > **Authentication** > **Settings**
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Add: `localhost`, your Vercel domain, or custom domain

### "Missing or insufficient permissions"

**Solution:** Check Firestore Security Rules are set correctly (Step 5 above)

### "Firebase SDK not initialized"

**Solution:** Check `.env.local` file exists and has correct values

---

##  🎓 Learning Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Happy deploying! 🚀**

Your app is now enterprise-ready for lakhs of users with zero cost!
