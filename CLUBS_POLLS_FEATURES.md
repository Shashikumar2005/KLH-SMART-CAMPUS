# Smart Campus - Clubs & Polls Features

## Overview
This document describes the newly implemented Clubs and Polls features for the Smart Campus system.

---

## 🎯 Student Clubs & Organizations

### Features

#### 1. **Club Management**
- Create and manage student clubs
- Categories: Technical, Cultural, Sports, Social, Academic, Arts, Other
- Club profile with logo, cover image, and description
- Leadership structure (President, Vice President, Secretary, Treasurer, Faculty Advisor)
- Meeting schedule information
- Social media links integration

#### 2. **Membership System**
- Request to join clubs
- Approval/rejection workflow for club leaders
- Member roles: Member, Coordinator, Core Team
- Member directory with join dates

#### 3. **Club Dashboard**
Features accessible to club members and leaders:
- **About Tab**: Club information, meeting schedule, leadership team
- **Members Tab**: Full member list with roles and join dates
- **Achievements Tab**: Club accomplishments and milestones
- **Resources Tab**: Shared documents, links, and materials

#### 4. **Resource Sharing**
- Upload and share resources within clubs
- Types: Documents, Videos, Links, Other
- Track who uploaded each resource
- Easy access for all club members

#### 5. **Achievements Tracking**
- Document club achievements
- Add title, description, date, and images
- Build club portfolio over time

### API Endpoints

#### Public Endpoints
```
GET /api/clubs                    - Get all approved clubs
GET /api/clubs/:id                - Get single club details
```

#### Protected Endpoints (Students)
```
POST /api/clubs                   - Create new club
POST /api/clubs/:id/join          - Request to join club
POST /api/clubs/:id/resources     - Add resource (members only)
```

#### Protected Endpoints (Club Leaders)
```
PUT /api/clubs/:id                - Update club details
PUT /api/clubs/:id/membership/:requestId - Approve/reject membership
DELETE /api/clubs/:id/members/:memberId  - Remove member
POST /api/clubs/:id/achievements  - Add achievement
```

#### Admin Only Endpoints
```
PUT /api/clubs/:id/approve        - Approve new club
DELETE /api/clubs/:id             - Delete club
```

### Usage Examples

#### Creating a Club
```javascript
const clubData = {
  name: "Tech Innovators Club",
  description: "A club for technology enthusiasts",
  category: "technical",
  logo: "https://example.com/logo.png",
  coverImage: "https://example.com/cover.png",
  socialLinks: {
    website: "https://techinnovators.club",
    instagram: "@techinnovators"
  },
  meetingSchedule: {
    day: "Wednesday",
    time: "4:00 PM",
    location: "Room 301, Building A"
  }
};

dispatch(createClub(clubData));
```

#### Requesting Membership
```javascript
dispatch(requestJoinClub({ 
  id: clubId, 
  message: "I'm interested in web development" 
}));
```

---

## 📊 Campus Polls System

### Features

#### 1. **Poll Creation**
- Create single or multiple choice polls
- Set end dates for automatic poll closure
- Categories: Campus, Club, Event, Facility, General
- Visibility options: Public, Students Only, Club Members Only
- Optional anonymous voting

#### 2. **Poll Types**
- **Single Choice**: Users can select one option
- **Multiple Choice**: Users can select multiple options

#### 3. **Real-time Results**
- Live vote counts and percentages
- Visual progress bars for each option
- Total vote count display
- Automatic poll closure on end date

#### 4. **Poll Management**
- Filter by category and status (Active/Closed)
- Edit poll before votes are cast
- Manual poll closure by creator
- Delete polls (creator/admin only)

#### 5. **Club Integration**
- Create polls specific to clubs
- Club members-only polls
- Display club name on polls

### API Endpoints

#### Public Endpoints
```
GET /api/polls                    - Get all polls
GET /api/polls/:id                - Get single poll
```

#### Protected Endpoints
```
POST /api/polls                   - Create new poll
POST /api/polls/:id/vote          - Vote on poll
PUT /api/polls/:id                - Update poll (creator only)
PUT /api/polls/:id/close          - Close poll manually
DELETE /api/polls/:id             - Delete poll (creator/admin)
```

### Usage Examples

#### Creating a Poll
```javascript
const pollData = {
  question: "Which event should we organize next?",
  description: "Help us decide our next campus event",
  options: ["Tech Fest", "Cultural Night", "Sports Tournament"],
  category: "event",
  type: "single",
  endDate: "2025-11-01T23:59:59",
  visibility: "public",
  allowAnonymous: false
};

dispatch(createPoll(pollData));
```

#### Voting on a Poll
```javascript
// Single choice poll
dispatch(votePoll({ 
  id: pollId, 
  optionIds: [optionId] 
}));

// Multiple choice poll
dispatch(votePoll({ 
  id: pollId, 
  optionIds: [optionId1, optionId2] 
}));
```

---

## 🔐 Permissions & Access Control

### Club Permissions

| Action | Student | Club Member | Club President | Admin |
|--------|---------|-------------|----------------|-------|
| View clubs | ✅ | ✅ | ✅ | ✅ |
| Create club | ✅ | ✅ | ✅ | ✅ |
| Join club | ✅ | ✅ | ✅ | ✅ |
| Update club | ❌ | ❌ | ✅ | ✅ |
| Manage members | ❌ | ❌ | ✅ | ✅ |
| Add resources | ❌ | ✅ | ✅ | ✅ |
| Approve club | ❌ | ❌ | ❌ | ✅ |
| Delete club | ❌ | ❌ | ❌ | ✅ |

### Poll Permissions

| Action | Any User | Creator | Admin |
|--------|----------|---------|-------|
| View polls | ✅ | ✅ | ✅ |
| Create poll | ✅ | ✅ | ✅ |
| Vote on poll | ✅ | ✅ | ✅ |
| Update poll | ❌ | ✅* | ✅ |
| Close poll | ❌ | ✅ | ✅ |
| Delete poll | ❌ | ✅ | ✅ |

*Only before votes are cast

---

## 📱 Frontend Components

### Clubs Component (`/clubs`)
- Grid view of all approved clubs
- Category filtering
- Club creation dialog
- Detailed club view with tabs
- Membership request functionality

### Polls Component (`/polls`)
- Grid view of all polls
- Filter by category and status
- Poll creation dialog
- Voting dialog with single/multiple choice
- Real-time results display

### Dashboard Integration
- Student Dashboard shows:
  - Total number of active clubs
  - Number of active polls
  - Quick access buttons

---

## 🗄️ Database Models

### Club Schema
```javascript
{
  name: String (required, unique),
  description: String (required),
  category: Enum,
  logo: String,
  coverImage: String,
  president: ObjectId (User, required),
  vicePresident: ObjectId (User),
  secretary: ObjectId (User),
  treasurer: ObjectId (User),
  faculty: ObjectId (User),
  members: [{
    user: ObjectId (User),
    role: Enum (member, coordinator, core-team),
    joinedAt: Date
  }],
  membershipRequests: [{
    user: ObjectId (User),
    message: String,
    requestedAt: Date
  }],
  events: [ObjectId (Event)],
  achievements: [{
    title: String,
    description: String,
    date: Date,
    image: String
  }],
  resources: [{
    title: String,
    description: String,
    link: String,
    type: Enum,
    uploadedBy: ObjectId (User),
    uploadedAt: Date
  }],
  socialLinks: {
    website: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    facebook: String
  },
  meetingSchedule: {
    day: String,
    time: String,
    location: String
  },
  status: Enum (active, inactive, suspended),
  isApproved: Boolean
}
```

### Poll Schema
```javascript
{
  question: String (required),
  description: String,
  options: [{
    text: String (required),
    votes: [ObjectId (User)]
  }],
  createdBy: ObjectId (User, required),
  club: ObjectId (Club),
  category: Enum,
  type: Enum (single, multiple),
  endDate: Date (required),
  isActive: Boolean,
  allowAnonymous: Boolean,
  visibility: Enum
}
```

---

## 🚀 Getting Started

### Backend Setup
1. Routes are automatically registered in `server.js`
2. Models are in `backend/models/`
3. Controllers are in `backend/controllers/`

### Frontend Setup
1. Redux slices are in `frontend/src/redux/slices/`
2. API services are in `frontend/src/services/api.js`
3. Components are in `frontend/src/pages/`
4. Routes are configured in `App.jsx`

### Testing
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to `/clubs` or `/polls` to test features

---

## 🎨 UI/UX Features

### Clubs
- Card-based grid layout
- Avatar/logo display
- Member count and event count badges
- Category chips
- Tabbed detail view
- Responsive design

### Polls
- Progress bars for vote visualization
- Color-coded status chips
- Vote count and percentage display
- Filter and sort options
- Modal dialogs for voting
- Disabled voting for closed/voted polls

---

## 🔄 Real-time Updates

### Socket.IO Events (Ready for Implementation)
```javascript
// Club events
socket.emit('newClub', clubData);
socket.emit('clubJoinRequest', { club, user });

// Poll events
socket.emit('newPoll', pollData);
socket.emit('pollVoted', { poll, votes });
socket.emit('pollClosed', pollId);
```

---

## 📈 Future Enhancements

### Clubs
- [ ] Club events calendar integration
- [ ] Discussion forums for clubs
- [ ] Member attendance tracking
- [ ] Club budget management
- [ ] Photo galleries

### Polls
- [ ] Poll templates
- [ ] Scheduled poll publishing
- [ ] Export poll results
- [ ] Poll analytics dashboard
- [ ] Recurring polls

---

## 🐛 Troubleshooting

### Common Issues

1. **Club not appearing**: Check if admin has approved the club
2. **Cannot vote**: Check if poll is active and you haven't voted already
3. **Permission denied**: Verify user role and club membership status

### Error Messages
- "Club with this name already exists" - Choose a unique club name
- "Poll must have at least 2 options" - Add minimum 2 options
- "You have already voted on this poll" - Each user can vote once

---

## 📝 Notes

- All clubs require admin approval before appearing publicly
- Polls automatically close on end date
- Club presidents have full management rights
- Poll creators can edit before votes are cast
- Resources are visible to club members only

---

For more information or support, please contact the development team.
