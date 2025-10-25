# 📡 Smart Campus KLH - API Documentation

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 👤 Auth Routes

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "studentId": "KLH123456",
  "department": "Computer Science",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
**GET** `/auth/me`
- **Auth Required**: Yes

### Update Profile
**PUT** `/auth/profile`
- **Auth Required**: Yes

**Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "department": "CS"
}
```

### Get All Users (Admin Only)
**GET** `/auth/users`
- **Auth Required**: Yes (Admin)

### Update User Role (Admin Only)
**PUT** `/auth/users/:id/role`
- **Auth Required**: Yes (Admin)

**Body:**
```json
{
  "role": "faculty"
}
```

---

## 📅 Event Routes

### Get All Events
**GET** `/events`
- **Auth Required**: No

**Query Parameters:**
- `status`: upcoming, ongoing, completed, cancelled
- `category`: academic, cultural, sports, workshop, seminar, other
- `search`: Search term

**Example:**
```
GET /events?status=upcoming&category=academic
```

### Get Single Event
**GET** `/events/:id`
- **Auth Required**: No

### Create Event
**POST** `/events`
- **Auth Required**: Yes (Faculty/Admin)
- **Content-Type**: multipart/form-data

**Body:**
```json
{
  "title": "Tech Workshop 2024",
  "description": "Learn latest technologies",
  "category": "workshop",
  "date": "2024-12-20",
  "time": "10:00 AM",
  "venue": "Auditorium",
  "department": "CSE",
  "registrationRequired": true,
  "maxParticipants": 100,
  "image": "<file>"
}
```

### Update Event
**PUT** `/events/:id`
- **Auth Required**: Yes (Owner or Admin)
- **Content-Type**: multipart/form-data

### Delete Event
**DELETE** `/events/:id`
- **Auth Required**: Yes (Owner or Admin)

### Register for Event
**POST** `/events/:id/register`
- **Auth Required**: Yes

### Unregister from Event
**POST** `/events/:id/unregister`
- **Auth Required**: Yes

---

## 🔍 Lost Items Routes

### Get All Lost Items
**GET** `/lost-items`
- **Auth Required**: No

**Query Parameters:**
- `type`: lost, found
- `category`: electronics, documents, accessories, books, clothing, other
- `status`: active, resolved, expired
- `search`: Search term

**Example:**
```
GET /lost-items?type=lost&category=electronics&status=active
```

### Get Single Lost Item
**GET** `/lost-items/:id`
- **Auth Required**: No

### Report Lost/Found Item
**POST** `/lost-items`
- **Auth Required**: Yes
- **Content-Type**: multipart/form-data

**Body:**
```json
{
  "title": "iPhone 14 Pro",
  "description": "Black iPhone with blue case",
  "category": "electronics",
  "type": "lost",
  "location": "Library 2nd Floor",
  "date": "2024-01-15",
  "reporterContact": "+1234567890",
  "image": "<file>"
}
```

### Update Lost Item
**PUT** `/lost-items/:id`
- **Auth Required**: Yes (Owner or Admin)

### Delete Lost Item
**DELETE** `/lost-items/:id`
- **Auth Required**: Yes (Owner or Admin)

### Claim Lost Item
**POST** `/lost-items/:id/claim`
- **Auth Required**: Yes

---

## 💬 Feedback Routes

### Get All Feedback
**GET** `/feedback`
- **Auth Required**: Yes

**Query Parameters:**
- `status`: pending, reviewed, resolved, rejected
- `category`: infrastructure, teaching, facilities, administration, other
- `priority`: low, medium, high

**Note:** Students can only see their own feedback. Faculty/Admin can see all.

### Get Single Feedback
**GET** `/feedback/:id`
- **Auth Required**: Yes

### Submit Feedback
**POST** `/feedback`
- **Auth Required**: Yes

**Body:**
```json
{
  "title": "Library Improvement",
  "description": "Need more study spaces",
  "category": "infrastructure",
  "priority": "medium",
  "isAnonymous": false
}
```

### Respond to Feedback (Faculty/Admin)
**PUT** `/feedback/:id/respond`
- **Auth Required**: Yes (Faculty/Admin)

**Body:**
```json
{
  "response": "Thank you for your feedback. We'll work on this.",
  "status": "reviewed"
}
```

### Update Feedback Status
**PUT** `/feedback/:id/status`
- **Auth Required**: Yes (Faculty/Admin)

**Body:**
```json
{
  "status": "resolved"
}
```

### Delete Feedback
**DELETE** `/feedback/:id`
- **Auth Required**: Yes (Owner or Admin)

---

## 📢 Announcement Routes

### Get All Announcements
**GET** `/announcements`
- **Auth Required**: No

**Query Parameters:**
- `category`: general, academic, urgent, event, holiday
- `priority`: low, medium, high
- `targetAudience`: all, student, faculty, admin

**Example:**
```
GET /announcements?category=urgent&priority=high
```

### Get Single Announcement
**GET** `/announcements/:id`
- **Auth Required**: No

### Create Announcement
**POST** `/announcements`
- **Auth Required**: Yes (Faculty/Admin)

**Body:**
```json
{
  "title": "Winter Break Notice",
  "content": "Campus will be closed from Dec 20-Jan 5",
  "category": "holiday",
  "priority": "high",
  "targetAudience": ["all"],
  "expiryDate": "2024-01-05",
  "isPinned": false
}
```

### Update Announcement
**PUT** `/announcements/:id`
- **Auth Required**: Yes (Owner or Admin)

### Delete Announcement
**DELETE** `/announcements/:id`
- **Auth Required**: Yes (Owner or Admin)

### Toggle Pin Announcement (Admin Only)
**PUT** `/announcements/:id/pin`
- **Auth Required**: Yes (Admin)

---

## 🤖 Chatbot Routes

### Send Message to Chatbot
**POST** `/chatbot/query`
- **Auth Required**: Yes

**Body:**
```json
{
  "message": "What events are happening this week?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Here are the events happening this week...",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Get Chatbot Suggestions
**GET** `/chatbot/suggestions`
- **Auth Required**: No

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "text": "What events are happening this week?",
      "category": "events"
    }
  ]
}
```

### Get FAQs
**GET** `/chatbot/faqs`
- **Auth Required**: No

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "How do I register for events?",
      "answer": "Navigate to Events section...",
      "category": "events"
    }
  ]
}
```

---

## 🔌 Socket.IO Events

### Connection
Connect with authentication token:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events to Listen

#### notification
Receive general notifications
```javascript
socket.on('notification', (data) => {
  console.log('Notification:', data);
});
```

#### newEvent
New event created
```javascript
socket.on('newEvent', (event) => {
  console.log('New event:', event);
});
```

#### eventUpdated
Event updated
```javascript
socket.on('eventUpdated', (event) => {
  console.log('Event updated:', event);
});
```

#### newLostItem
New lost/found item reported
```javascript
socket.on('newLostItem', (item) => {
  console.log('New lost item:', item);
});
```

#### lostItemUpdated
Lost item updated
```javascript
socket.on('lostItemUpdated', (item) => {
  console.log('Item updated:', item);
});
```

#### lostItemClaimed
Item claimed
```javascript
socket.on('lostItemClaimed', (item) => {
  console.log('Item claimed:', item);
});
```

#### newAnnouncement
New announcement posted
```javascript
socket.on('newAnnouncement', (announcement) => {
  console.log('New announcement:', announcement);
});
```

#### announcementUpdated
Announcement updated
```javascript
socket.on('announcementUpdated', (announcement) => {
  console.log('Announcement updated:', announcement);
});
```

#### newFeedback
New feedback submitted
```javascript
socket.on('newFeedback', (feedback) => {
  console.log('New feedback:', feedback);
});
```

#### feedbackResponded
Feedback received response
```javascript
socket.on('feedbackResponded', (feedback) => {
  console.log('Feedback responded:', feedback);
});
```

### Events to Emit

#### joinEvent
Join specific event room
```javascript
socket.emit('joinEvent', eventId);
```

#### leaveEvent
Leave event room
```javascript
socket.emit('leaveEvent', eventId);
```

#### typing
Indicate typing in chatbot
```javascript
socket.emit('typing', { userId, isTyping: true });
```

#### notificationRead
Mark notification as read
```javascript
socket.emit('notificationRead', notificationId);
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { },
  "count": 0,
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

## 🔒 Role-Based Access

| Route | Student | Faculty | Admin |
|-------|---------|---------|-------|
| View Events | ✅ | ✅ | ✅ |
| Create Events | ❌ | ✅ | ✅ |
| View Lost Items | ✅ | ✅ | ✅ |
| Report Lost Items | ✅ | ✅ | ✅ |
| Submit Feedback | ✅ | ✅ | ✅ |
| View All Feedback | ❌ | ✅ | ✅ |
| Respond to Feedback | ❌ | ✅ | ✅ |
| Create Announcements | ❌ | ✅ | ✅ |
| Pin Announcements | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Use Chatbot | ✅ | ✅ | ✅ |

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Events (with token)
```bash
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Notes

1. All dates should be in ISO 8601 format
2. File uploads use multipart/form-data
3. Maximum file size: 5MB
4. Supported image formats: JPEG, JPG, PNG, GIF
5. Rate limiting may apply in production
6. WebSocket connection required for real-time features

---

## 🐛 Common Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

**Happy API Testing! 🚀**
