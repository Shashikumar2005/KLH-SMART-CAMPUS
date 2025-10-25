# Smart Campus KLH - Management System

A comprehensive campus management platform with role-based authentication, real-time updates, and AI-powered chatbot assistance.

## 🚀 Features

### Core Features
- **Intelligent Role-Based Authentication**: 
  - 🎓 **Smart Email Detection**: Automatic role assignment based on KLH email patterns
    - Students: Emails starting with numbers (e.g., `2310080030@klh.edu.in`)
    - Faculty: Emails starting with letters (e.g., `john.doe@klh.edu.in`)
    - Auto-fill Student ID from email for seamless registration
  - 🔐 Secure JWT authentication with role-based access controls
  - 👥 Three user roles: Student, Faculty, and Admin
- **Real-Time Updates**: Instant notifications for events, lost items, and announcements using Socket.IO
- **Event Management**: Create, view, and manage campus events
- **Lost & Found**: Report and search for lost items across campus
- **Feedback System**: Submit and manage feedback from students
- **Announcements**: Campus-wide announcement system with priority levels

### Bonus Feature
- **AI Chatbot**: Domain-specific chatbot powered by Google Gemini API for campus-related queries, FAQs, and navigation assistance

### 🆕 Smart Features
- **Email-Based Role Detection**: See `EMAIL_ROLE_SYSTEM.md` for complete documentation
- **Auto-fill Student ID**: System extracts Student ID from email automatically
- **Real-time Role Detection UI**: Visual feedback during registration

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Material-UI (MUI)
- Redux Toolkit
- React Router v6
- Socket.IO Client
- Axios
- React Hook Form + Zod
- React Hot Toast
- Date-fns

### Backend
- Node.js + Express.js
- Socket.IO Server
- JWT Authentication
- Bcrypt.js
- Express Validator
- Multer
- Nodemailer

### Database & Storage
- MongoDB Atlas + Mongoose
- Cloudinary (File Storage)

### AI Integration
- Google Gemini API
- @google/generative-ai SDK

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-campus-klh
```

2. Install dependencies for all packages:
```bash
npm run install-all
```

3. Configure environment variables:

**Backend (.env)**
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Run the application:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5000`

## 🔐 User Roles & Permissions

### Admin
- Full system access
- User management
- Event creation and management
- Announcement management
- View all feedback and lost items
- System configuration

### Faculty
- Create and manage events
- Post announcements
- View lost & found items
- View feedback
- Access faculty dashboard

### Student
- View events and announcements
- Report lost items
- Search lost & found
- Submit feedback
- Access student dashboard
- Use AI chatbot

## 📁 Project Structure

```
smart-campus-klh/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── lostItemController.js
│   │   ├── feedbackController.js
│   │   ├── announcementController.js
│   │   └── chatbotController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── LostItem.js
│   │   ├── Feedback.js
│   │   └── Announcement.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── lostItems.js
│   │   ├── feedback.js
│   │   ├── announcements.js
│   │   └── chatbot.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── validators.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   ├── lostfound/
│   │   │   ├── chatbot/
│   │   │   └── notifications/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── LostFound.jsx
│   │   │   └── Profile.jsx
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── eventSlice.js
│   │   │   │   ├── lostItemSlice.js
│   │   │   │   └── notificationSlice.js
│   │   │   └── store.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set build command: `cd frontend && npm install && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables

### Backend (Render/Railway)
1. Connect your repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables

## 🤖 Chatbot Usage

The AI chatbot can help with:
- Campus event information
- Lost & found queries
- How to submit feedback
- Navigation assistance
- FAQs about campus services

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Faculty/Admin)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Lost & Found
- `GET /api/lost-items` - Get all lost items
- `POST /api/lost-items` - Report lost item
- `PUT /api/lost-items/:id` - Update item status

### Feedback
- `GET /api/feedback` - Get all feedback (Faculty/Admin)
- `POST /api/feedback` - Submit feedback

### Chatbot
- `POST /api/chatbot/query` - Send message to AI chatbot

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

Smart Campus KLH Team

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Material-UI for the component library
- Socket.IO for real-time functionality
