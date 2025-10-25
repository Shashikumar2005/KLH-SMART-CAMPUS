# 🚀 Smart Campus KLH - Deployment Guide

Complete guide to deploy your Smart Campus application to production.

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deploy to Render (Recommended)](#deploy-to-render)
3. [Deploy to Vercel + Railway](#deploy-to-vercel--railway)
4. [Deploy with Docker](#deploy-with-docker)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ MongoDB Atlas account with database created
- ✅ Cloudinary account for image uploads
- ✅ Google Gemini API key for chatbot
- ✅ Gmail account with app password for emails
- ✅ GitHub repository with latest code pushed
- ✅ All secrets and API keys ready

---

## 🎯 Option 1: Deploy to Render (Recommended)

**Best for**: Full-stack apps with WebSocket support (FREE tier available)

### Step 1: Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy Backend on Render

1. **Sign up at [Render](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure service:**
   ```
   Name: smart-campus-backend
   Environment: Node
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables** (see [Environment Variables](#environment-variables))

6. **Click "Create Web Service"**

7. **Copy your backend URL** (e.g., `https://smart-campus-backend.onrender.com`)

### Step 3: Deploy Frontend on Render

1. **Click "New +" → "Static Site"**
2. **Connect same GitHub repository**
3. **Configure:**
   ```
   Name: smart-campus-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variables:**
   ```
   VITE_API_URL=https://smart-campus-backend.onrender.com/api
   VITE_SOCKET_URL=https://smart-campus-backend.onrender.com
   ```

5. **Click "Create Static Site"**

### Step 4: Update Backend FRONTEND_URL

Go back to your backend service settings and update:
```
FRONTEND_URL=https://smart-campus-frontend.onrender.com
```

Then click "Save Changes" (it will redeploy).

---

## 🎯 Option 2: Deploy to Vercel + Railway

**Best for**: Fastest deployment with great DX

### Deploy Backend on Railway

1. **Sign up at [Railway](https://railway.app)**
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select your repository**
4. **Configure:**
   - Root Directory: `/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

5. **Add Environment Variables** (see below)

6. **Click "Deploy"**

7. **Go to Settings → Generate Domain**

8. **Copy your backend URL**

### Deploy Frontend on Vercel

1. **Sign up at [Vercel](https://vercel.com)**
2. **Click "Add New" → "Project"**
3. **Import your GitHub repository**
4. **Configure:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

5. **Add Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   VITE_SOCKET_URL=https://your-backend-url.railway.app
   ```

6. **Click "Deploy"**

---

## 🎯 Option 3: Deploy with Docker

**Best for**: Self-hosting, VPS, cloud servers

### Step 1: Create Dockerfiles

Already included in your project! See:
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`

### Step 2: Build and Deploy

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Step 3: Deploy to Cloud

**For AWS ECS, Google Cloud Run, or DigitalOcean:**

```bash
# Build and push to Docker Hub
docker build -t yourusername/smart-campus-backend:latest ./backend
docker build -t yourusername/smart-campus-frontend:latest ./frontend

docker push yourusername/smart-campus-backend:latest
docker push yourusername/smart-campus-frontend:latest
```

Then deploy using your cloud provider's container service.

---

## 🔐 Environment Variables

### Backend Environment Variables

**Required:**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-campus-klh
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.com
```

**Optional (but recommended):**
```bash
# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Gemini (for AI chatbot)
GEMINI_API_KEY=your-gemini-api-key

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend Environment Variables

```bash
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

---

## 🎬 Post-Deployment Steps

### 1. Create Admin Account

Once backend is deployed, create an admin:

```bash
# SSH into your backend or use Railway/Render shell
cd backend
npm run create-admin
```

Or use the API directly:
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
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

### 2. Test the Application

1. Visit your frontend URL
2. Register as a test student: `2310080030@klh.edu.in`
3. Login and test features
4. Check real-time notifications
5. Test chatbot
6. Upload an image (test Cloudinary)

### 3. Configure Custom Domain (Optional)

**For Render:**
- Go to Settings → Custom Domain
- Add your domain
- Update DNS records

**For Vercel:**
- Go to Settings → Domains
- Add your domain
- Update DNS records

### 4. Enable HTTPS

Most platforms (Render, Vercel, Railway) provide free SSL certificates automatically.

### 5. Set up Monitoring

**Render:**
- Built-in metrics and logs available in dashboard

**Add external monitoring:**
- [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem: "Cannot connect to MongoDB"**
```bash
# Solution: Check MongoDB Atlas
# 1. Whitelist 0.0.0.0/0 in Network Access
# 2. Verify connection string
# 3. Check database user credentials
```

**Problem: "Socket.IO not working"**
```bash
# Solution: Ensure WebSocket support
# 1. Render/Railway: WebSocket enabled by default
# 2. Check CORS settings in backend
# 3. Verify FRONTEND_URL environment variable
```

**Problem: "Cloudinary upload fails"**
```bash
# Solution: Verify Cloudinary credentials
# 1. Check CLOUDINARY_* environment variables
# 2. Ensure API key is correct
# 3. Check Cloudinary quota/limits
```

### Frontend Issues

**Problem: "API calls failing"**
```bash
# Solution: Check VITE_API_URL
# 1. Must end with /api
# 2. Must use HTTPS in production
# 3. Check backend CORS configuration
```

**Problem: "WebSocket disconnecting"**
```bash
# Solution: Check VITE_SOCKET_URL
# 1. Should be backend base URL (without /api)
# 2. Backend must support WebSocket
# 3. Check firewall rules
```

**Problem: "Environment variables not working"**
```bash
# Solution: Rebuild frontend
# 1. Vite bakes env vars at build time
# 2. After changing env vars, trigger rebuild
# 3. Clear cache if needed
```

### Database Issues

**Problem: "Indexes missing after deployment"**
```bash
# Solution: Run index creation
# In backend shell:
node scripts/fixStudentIdIndex.js
```

**Problem: "No admin user"**
```bash
# Solution: Create admin manually
# In backend shell:
npm run create-admin
```

---

## 📊 Performance Tips

### Backend Optimization

1. **Enable gzip compression:**
   ```javascript
   // Already enabled in server.js
   app.use(compression());
   ```

2. **Add rate limiting:**
   ```javascript
   // Add in production
   const rateLimit = require('express-rate-limit');
   ```

3. **Use MongoDB indexes:**
   ```javascript
   // Already configured in models
   ```

### Frontend Optimization

1. **Enable build optimizations:**
   ```json
   // Already configured in vite.config.js
   build: {
     minify: 'terser',
     sourcemap: false
   }
   ```

2. **Lazy load routes:**
   ```javascript
   // Use React.lazy() for code splitting
   const Events = lazy(() => import('./pages/Events'));
   ```

3. **Optimize images:**
   - Use Cloudinary transformations
   - Enable lazy loading
   - Use WebP format

---

## 🎯 Quick Deploy Commands

### Render (using render.yaml)
```bash
# Commit changes
git add .
git commit -m "Deploy to Render"
git push origin main

# Render will auto-deploy using render.yaml
```

### Manual Deploy (Docker)
```bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Update Deployed App
```bash
# Make changes
git add .
git commit -m "Update: description"
git push origin main

# Platforms will auto-deploy
# Or trigger manual deploy in dashboard
```

---

## 🌐 URLs After Deployment

Save these URLs:

```
Frontend: https://smart-campus-frontend.onrender.com
Backend: https://smart-campus-backend.onrender.com
API: https://smart-campus-backend.onrender.com/api
Health Check: https://smart-campus-backend.onrender.com/api/health
```

---

## 📝 Notes

- **Free tier limitations:**
  - Render: Services sleep after 15 min inactivity (first request takes ~30s)
  - Vercel: 100GB bandwidth/month
  - Railway: $5 credit/month

- **Production checklist:**
  - ✅ All environment variables set
  - ✅ MongoDB Atlas configured
  - ✅ SSL certificates enabled
  - ✅ Admin account created
  - ✅ Custom domain configured (optional)
  - ✅ Monitoring enabled
  - ✅ Backups configured

- **Security:**
  - Never commit `.env` files
  - Use strong JWT secrets (min 32 characters)
  - Enable rate limiting
  - Keep dependencies updated

---

## 🎉 Success!

Your Smart Campus KLH application is now deployed! 🚀

**Test it out:**
1. Visit your frontend URL
2. Register a test account
3. Create an event
4. Test real-time notifications
5. Try the AI chatbot

**Questions?**
Check the troubleshooting section or open an issue on GitHub.

---

**Made with ❤️ for KLH University**
