# 🚀 Deployment Checklist - Smart Campus KLH

## Your Environment Variables (Ready to Copy-Paste)

### Backend Environment Variables (for Render)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://shashi:shashi@cluster0.fdzgbec.mongodb.net/smart-campus-klh?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=smart-campus-klh-super-secret-jwt-key-2025-production-render
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=dtj3vvyiz
CLOUDINARY_API_KEY=434478552931465
CLOUDINARY_API_SECRET=eIaxJUtL8bDOIH3wH0sH1-bNUBU
GEMINI_API_KEY=AIzaSyDjWpBWCuJq2IgKCLW8fsCs1DBZTiqHwmQ
FRONTEND_URL=https://smart-campus-klh-frontend.onrender.com
```

### Frontend Environment Variables (for Render)
```
VITE_API_URL=https://YOUR-BACKEND-URL/api
VITE_SOCKET_URL=https://YOUR-BACKEND-URL
```
**⚠️ Replace YOUR-BACKEND-URL with actual URL from Step 2!**

---

## Step-by-Step Progress

### ✅ Step 0: Prerequisites
- [x] Code pushed to GitHub (commit: 9e16d7b)
- [x] MongoDB Atlas configured
- [x] Cloudinary configured
- [x] Gemini API configured

### [ ] Step 1: Create Render Account
- [ ] Visit https://dashboard.render.com/register
- [ ] Sign in with GitHub
- [ ] Authorize repository access

### [ ] Step 2: Deploy Backend (3 minutes)
1. [ ] Click "New +" → "Web Service"
2. [ ] Select repository: `KLH-SMART-CAMPUS`
3. [ ] Configure:
   - Name: `smart-campus-klh-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. [ ] Click "Advanced" → Add environment variables (copy from above)
5. [ ] Click "Create Web Service"
6. [ ] Wait for deployment (~2-3 minutes)
7. [ ] **Copy backend URL**: `_______________________`
8. [ ] Test: Visit `https://your-backend-url/api/health`

### [ ] Step 3: Deploy Frontend (3 minutes)
1. [ ] Click "New +" → "Static Site"
2. [ ] Select repository: `KLH-SMART-CAMPUS`
3. [ ] Configure:
   - Name: `smart-campus-klh-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. [ ] Click "Advanced" → Add environment variables:
   - `VITE_API_URL=https://YOUR-BACKEND-URL/api`
   - `VITE_SOCKET_URL=https://YOUR-BACKEND-URL`
5. [ ] Click "Create Static Site"
6. [ ] Wait for deployment (~2-3 minutes)
7. [ ] **Copy frontend URL**: `_______________________`

### [ ] Step 4: Update Backend CORS (1 minute)
1. [ ] Go to backend service → "Environment"
2. [ ] Update `FRONTEND_URL` with your actual frontend URL
3. [ ] Click "Save Changes"
4. [ ] Wait for auto-redeploy (~1 minute)

### [ ] Step 5: Create Admin Account
**Option A: Render Shell**
1. [ ] Go to backend service → "Shell" tab
2. [ ] Run admin creation script (provided below)

**Option B: PowerShell**
```powershell
$body = @{
    studentId = "ADMIN001"
    name = "Admin User"
    email = "admin@klh.edu.in"
    password = "Admin@123"
    role = "admin"
    department = "Administration"
    phone = "1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://YOUR-BACKEND-URL/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### [ ] Step 6: Test Deployment
1. [ ] Visit frontend URL
2. [ ] Login with: admin@klh.edu.in / Admin@123
3. [ ] Create a test event
4. [ ] Check notifications
5. [ ] Try AI chatbot
6. [ ] Upload an image

---

## 📝 Notes Section

**Backend URL:**
```
https://_________________________________
```

**Frontend URL:**
```
https://_________________________________
```

**Admin Credentials:**
- Email: admin@klh.edu.in
- Password: Admin@123

**Test Student:**
- Email: 2310080030@klh.edu.in
- Password: ________________

---

## 🆘 Quick Troubleshooting

### Backend not starting?
Check Render logs: Backend service → "Logs" tab

### Frontend can't connect?
Verify `VITE_API_URL` and `VITE_SOCKET_URL` are correct

### Database connection failed?
MongoDB Atlas → Network Access → Add `0.0.0.0/0`

### CORS errors?
Make sure `FRONTEND_URL` in backend matches your frontend URL exactly

---

## Admin Creation Script (for Render Shell)

```javascript
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const admin = await User.create({
      studentId: 'ADMIN001',
      name: 'Admin User',
      email: 'admin@klh.edu.in',
      password: 'Admin@123',
      role: 'admin',
      department: 'Administration',
      phone: '1234567890'
    });
    console.log('✅ Admin created:', admin.email);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
"
```

---

## 🎉 Deployment Complete!

Once all steps are checked, your Smart Campus KLH app is LIVE! 🚀

**Time Estimate:** 15-20 minutes total
**Cost:** $0 (Free tier)
