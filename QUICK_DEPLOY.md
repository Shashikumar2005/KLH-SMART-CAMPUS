# 🚀 Quick Deployment - 5 Minutes to Production

The fastest way to deploy Smart Campus KLH to production.

## Prerequisites (2 minutes)

1. **Create accounts** (all free):
   - [Render](https://render.com) - For hosting
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) - For database
   - [Cloudinary](https://cloudinary.com/users/register/free) - For images (optional)
   - [Google AI Studio](https://makersuite.google.com/app/apikey) - For chatbot (optional)

2. **Push code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

---

## Step-by-Step Deployment (3 minutes)

### 1️⃣ Deploy Backend on Render (90 seconds)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select your repository
4. Configure:
   ```
   Name: smart-campus-backend
   Environment: Node
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

5. Click **"Advanced"** and add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-random-32-character-string>
   JWT_EXPIRE=7d
   ```

   **Quick tip:** Generate JWT secret:
   ```bash
   # In terminal/PowerShell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Click **"Create Web Service"**
7. **Wait for deployment** (2-3 minutes)
8. **Copy your backend URL**: `https://smart-campus-backend-xxxx.onrender.com`

### 2️⃣ Deploy Frontend on Render (90 seconds)

1. Click **"New +"** → **"Static Site"**
2. Select same GitHub repository
3. Configure:
   ```
   Name: smart-campus-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. Add environment variables:
   ```
   VITE_API_URL=https://smart-campus-backend-xxxx.onrender.com/api
   VITE_SOCKET_URL=https://smart-campus-backend-xxxx.onrender.com
   ```
   *(Replace with your actual backend URL from step 1)*

5. Click **"Create Static Site"**
6. **Wait for deployment** (2-3 minutes)
7. **Copy your frontend URL**: `https://smart-campus-frontend-xxxx.onrender.com`

### 3️⃣ Update Backend FRONTEND_URL (30 seconds)

1. Go back to your backend service in Render
2. Click **"Environment"** in left sidebar
3. Add/Update:
   ```
   FRONTEND_URL=https://smart-campus-frontend-xxxx.onrender.com
   ```
   *(Use your actual frontend URL from step 2)*

4. Click **"Save Changes"** (it will auto-redeploy)

---

## 🎉 You're Live!

Your app is now deployed at:
- **Frontend**: `https://smart-campus-frontend-xxxx.onrender.com`
- **Backend**: `https://smart-campus-backend-xxxx.onrender.com`
- **API Health**: `https://smart-campus-backend-xxxx.onrender.com/api/health`

---

## First Login

### Create Admin Account

**Option 1: Using API**
```bash
curl -X POST https://smart-campus-backend-xxxx.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@klh.edu.in",
    "password": "Admin@123",
    "role": "admin",
    "department": "Administration",
    "phone": "1234567890"
  }'
```

**Option 2: Via Render Shell**
1. Go to backend service → Shell tab
2. Run: `npm run create-admin`
3. Follow prompts

### Test Your Deployment

1. **Visit your frontend URL**
2. **Register as student**: `2310080030@klh.edu.in` / `password123`
3. **Login and explore**
4. **Create an event** (tests real-time notifications)
5. **Try the chatbot** (bottom-right corner)

---

## Optional Enhancements (5 minutes)

### Add Image Upload (Cloudinary)

1. Get credentials from [Cloudinary Dashboard](https://cloudinary.com/console)
2. In Render backend → Environment:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### Add AI Chatbot (Google Gemini)

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. In Render backend → Environment:
   ```
   GEMINI_API_KEY=your-gemini-api-key
   ```

### Add Email Notifications (Gmail)

1. Enable 2FA on your Gmail account
2. Generate app password: [Google Account Security](https://myaccount.google.com/security)
3. In Render backend → Environment:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

---

## Troubleshooting

### ❌ "Cannot connect to database"
- Check MongoDB Atlas network access: Allow `0.0.0.0/0`
- Verify connection string in `MONGODB_URI`
- Ensure database user has read/write permissions

### ❌ "API calls failing"
- Check `VITE_API_URL` ends with `/api`
- Verify `FRONTEND_URL` matches frontend deployment URL
- Check backend logs in Render dashboard

### ❌ "WebSocket not working"
- Verify `VITE_SOCKET_URL` is set (without `/api`)
- Check backend logs for socket connection errors
- Render free tier supports WebSocket ✓

### ⏳ "First request is slow"
- Render free tier: Services sleep after 15 min inactivity
- First request wakes service (~30 seconds)
- Consider upgrading to paid plan for always-on

---

## What's Next?

### Monitoring
- Check logs: Render Dashboard → your service → Logs tab
- Set up [UptimeRobot](https://uptimerobot.com) for monitoring
- Add [Sentry](https://sentry.io) for error tracking

### Custom Domain
1. Render → your service → Settings → Custom Domain
2. Add your domain (e.g., `campus.klh.edu.in`)
3. Update DNS records as shown
4. SSL certificate is automatic ✓

### Scaling
- Free tier limits: 750 hours/month, 512MB RAM
- For production: Upgrade to Starter ($7/month) or higher
- Auto-scaling available on paid plans

---

## Quick Commands

```bash
# Check deployment status
curl https://smart-campus-backend-xxxx.onrender.com/api/health

# View logs (from Render dashboard or CLI)
render logs --service smart-campus-backend

# Trigger redeploy
git commit --allow-empty -m "Trigger deployment"
git push origin main

# Run database migration
# Go to Render → Shell tab
node scripts/fixStudentIdIndex.js
```

---

## Support

**Issues?**
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed docs
- Review Render logs for errors
- Open GitHub issue with error details

**Need help?**
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Project README: [README.md](./README.md)

---

**🎊 Congratulations! Your Smart Campus is live!** 🎊

**Total time:** ~5 minutes ⏱️  
**Cost:** $0 (Free tier) 💰  
**Status:** Production-ready ✅
