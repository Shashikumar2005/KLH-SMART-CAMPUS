# 🚀 How to Run Smart Campus KLH - Complete Guide

## ✅ Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js v18+ installed
- ✅ npm v9+ installed
- ✅ Internet connection (for MongoDB Atlas)

## 📋 Step-by-Step Running Instructions

### **Step 1: Install Dependencies** ✅ COMPLETED

All packages are already installed! If you need to reinstall:
```powershell
npm run install-all
```

---

### **Step 2: Set Up MongoDB Database** ⚠️ REQUIRED

You need a MongoDB database. Choose one option:

#### **Option A: MongoDB Atlas (Recommended - FREE & Easy)**

1. **Sign up for free**: https://www.mongodb.com/cloud/atlas/register
   - Click "Start Free"
   - Sign up with Google/Email

2. **Create a Free Cluster**:
   - Choose "M0 FREE" tier
   - Select your nearest region
   - Cluster Name: `Cluster0` (default is fine)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**:
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `admin`
   - Password: Create a strong password (SAVE THIS!)
   - User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist Your IP**:
   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Click "Database" (left sidebar)
   - Click "Connect" button
   - Choose "Connect your application"
   - Copy the connection string (looks like this):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Update backend/.env file**:
   - Open: `backend\.env`
   - Find the line: `MONGODB_URI=mongodb+srv://...`
   - Replace with YOUR connection string
   - Replace `<password>` with your actual database password
   - Add database name before the `?`:
   ```
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/smart-campus-klh?retryWrites=true&w=majority
   ```

#### **Option B: Local MongoDB (If you have it installed)**

If you have MongoDB installed locally:
```powershell
# Start MongoDB service
net start MongoDB

# Update backend/.env
MONGODB_URI=mongodb://localhost:27017/smart-campus-klh
```

---

### **Step 3: Configure Optional Features** (Can skip for now)

These features are optional - the app works without them:

#### **A. Google Gemini API (For AI Chatbot)**

1. Get free API key: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Update `backend/.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

#### **B. Cloudinary (For Image Uploads)**

1. Sign up: https://cloudinary.com/users/register/free
2. From Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Update `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

#### **C. Gmail SMTP (For Email Notifications)**

1. Enable 2FA on your Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `backend/.env`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_digit_app_password
   ```

---

### **Step 4: Start the Application** 🚀

Open TWO terminal windows:

#### **Terminal 1 - Start Backend Server**

```powershell
cd c:\Users\Dell\Desktop\smart-campus-klh
npm run server
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000 in development mode
⚡ Socket.IO server is running
```

#### **Terminal 2 - Start Frontend**

```powershell
cd c:\Users\Dell\Desktop\smart-campus-klh
npm run client
```

You should see:
```
VITE v5.0.8  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**OR Run Both Together:**

```powershell
cd c:\Users\Dell\Desktop\smart-campus-klh
npm run dev
```

---

### **Step 5: Access the Application** 🌐

1. **Open Browser**: http://localhost:5173

2. **Register a New User**:
   - Click "Register" or "Sign Up"
   - Fill in details:
     - Name: Test Student
     - Email: student@klh.edu
     - Password: password123
     - Role: Student
     - Student ID: 2024001
     - Department: Computer Science
   - Click "Register"

3. **Login**:
   - Email: student@klh.edu
   - Password: password123
   - Click "Login"

4. **Explore Features**:
   - ✅ Dashboard with stats
   - ✅ Events management
   - ✅ Lost & Found
   - ✅ Feedback system
   - ✅ Announcements
   - ✅ AI Chatbot (if Gemini API configured)
   - ✅ Real-time notifications

---

## 🎯 Quick Test Script

Want to test everything at once? Run this:

```powershell
# Install dependencies
npm run install-all

# Start both servers
npm run dev
```

Then open: http://localhost:5173

---

## 🐛 Troubleshooting

### **Problem: "MongoDB Connection Error"**

**Solution**: Update your `MONGODB_URI` in `backend/.env` with your actual MongoDB Atlas connection string.

### **Problem: "Port 5000 is already in use"**

**Solution**: 
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### **Problem: "Port 5173 is already in use"**

**Solution**:
```powershell
# Kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### **Problem: "Cannot find module..."**

**Solution**:
```powershell
# Reinstall dependencies
npm run install-all
```

### **Problem: "Chatbot not responding"**

**Solution**: Add your Gemini API key to `backend/.env`. The chatbot feature is optional.

### **Problem: "Images not uploading"**

**Solution**: Configure Cloudinary in `backend/.env`. Image upload is optional.

---

## 📱 Test Different User Roles

Create accounts with different roles to test features:

### **Student Account**
- Email: student@klh.edu
- Role: Student
- Can: View events, report lost items, submit feedback

### **Faculty Account**
- Email: faculty@klh.edu
- Role: Faculty
- Can: Create events, manage lost items, view feedback

### **Admin Account**
- Email: admin@klh.edu
- Role: Admin
- Can: Manage all users, create announcements, full system access

---

## 📊 API Testing

Backend API runs on: http://localhost:5000/api

Test the API:
```powershell
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"password123\",\"role\":\"student\"}"
```

---

## 🎉 Success Checklist

- ✅ Dependencies installed
- ✅ MongoDB connected
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ Can register and login
- ✅ Dashboard loads with data
- ✅ Real-time updates working

---

## 📚 Additional Resources

- **Full Documentation**: See `SETUP.md`
- **API Reference**: See `API_DOCS.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`

---

## 🆘 Need Help?

Common issues and solutions:

1. **MongoDB not connecting**: Double-check your connection string in `backend/.env`
2. **Ports busy**: Change ports in respective `.env` files
3. **Dependencies error**: Run `npm run install-all` again
4. **Build errors**: Delete `node_modules` folders and reinstall

---

**🎓 You're all set! Enjoy using Smart Campus KLH!**
