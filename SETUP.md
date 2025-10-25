# Smart Campus KLH - Setup and Deployment Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-campus-klh
```

### 2. Install Dependencies

Install dependencies for all packages:

```bash
npm run install-all
```

Or install manually:

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create `backend/.env` file:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment Variables

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `MONGODB_URI`

### 5. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Get your Cloud Name, API Key, and API Secret from the dashboard
4. Add these to your backend `.env` file

### 6. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `GEMINI_API_KEY` in backend `.env`

### 7. Gmail App Password (for email notifications)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password
4. Use this password in `EMAIL_PASSWORD`

## 🏃 Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📦 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Set root directory to `frontend`
5. Add environment variables:
   - `VITE_API_URL`: Your backend URL
   - `VITE_SOCKET_URL`: Your backend URL
6. Deploy

#### Using Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel
```

### Frontend Deployment (Netlify)

1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/)
3. Import your repository
4. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Add environment variables in Netlify dashboard
6. Deploy

#### Using Netlify CLI

```bash
cd frontend
npm install -g netlify-cli
netlify deploy --prod
```

### Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render](https://render.com/)
3. Create a new Web Service
4. Connect your repository
5. Set build settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add all environment variables
7. Deploy

#### Using Render Configuration File

The `render.yaml` file is already configured. Just:
1. Connect your repository to Render
2. Render will automatically detect the configuration
3. Add required environment variables

### Backend Deployment (Railway)

1. Go to [Railway](https://railway.app/)
2. Create a new project
3. Connect your GitHub repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

## 🔐 Default User Roles

For testing, you can create users with different roles:

**Admin:**
- Email: admin@klh.edu
- Role: admin

**Faculty:**
- Email: faculty@klh.edu
- Role: faculty

**Student:**
- Email: student@klh.edu
- Role: student

## 🧪 Testing

### Backend API Testing

Use tools like Postman or Thunder Client:

1. Import the API endpoints
2. Set up authentication headers
3. Test all CRUD operations

### Frontend Testing

```bash
cd frontend
npm run test
```

## 📱 Features to Test

1. **Authentication**
   - User registration
   - User login
   - Role-based access

2. **Events**
   - Create, view, update, delete events
   - Event registration
   - Real-time event notifications

3. **Lost & Found**
   - Report lost/found items
   - Search items
   - Claim items

4. **Feedback**
   - Submit feedback
   - Faculty/Admin response

5. **Announcements**
   - Create announcements
   - View announcements by role

6. **Chatbot**
   - Ask campus-related questions
   - Get suggestions
   - View FAQs

7. **Real-time Features**
   - Live notifications
   - Socket.IO connections

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check your connection string
- Ensure IP is whitelisted
- Verify database user credentials

### Cloudinary Upload Error
- Verify API credentials
- Check file size limits
- Ensure correct folder paths

### Socket.IO Connection Failed
- Check CORS settings
- Verify frontend and backend URLs
- Ensure authentication token is valid

### Gemini API Error
- Verify API key
- Check API quota
- Ensure correct API endpoint

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Gemini API Documentation](https://ai.google.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC License - See LICENSE file for details

## 👥 Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team

---

**Happy Coding! 🚀**
