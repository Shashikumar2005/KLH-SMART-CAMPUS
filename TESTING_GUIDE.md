# 🧪 Testing Guide - All Roles & Features

## 🎯 Quick Test Credentials

### **Admin Account** (Just Created!)
```
Email:    admin@klh.edu.in
Password: Admin@123
Role:     Admin
```
**Access**: Full system control

---

### **Student Account** (Create New)
```
Email:    2310080030@klh.edu.in
Password: password123
Role:     Student (Auto-detected from email)
```
**Access**: View events, report lost items, submit feedback

---

### **Faculty Account** (Create New)
```
Email:    faculty@klh.edu.in
Password: password123
Role:     Faculty (Auto-detected from email)
```
**Access**: Create events, manage lost items, view feedback, create announcements

---

## ✅ Feature Testing Checklist

### **1. Admin Dashboard Testing**

| Feature | Test | Expected Result |
|---------|------|-----------------|
| Login as Admin | Use admin@klh.edu.in / Admin@123 | ✅ Admin Dashboard loads |
| View Statistics | Check 5 stat cards | ✅ Shows: Users, Events, Lost&Found, Feedback, Announcements |
| Users Tab | Click Users tab | ✅ Table shows all registered users |
| Edit User Role | Click edit on any user | ✅ Dialog opens, can change role |
| Deactivate User | Click block icon | ✅ Confirmation dialog, user deactivated |
| Events Tab | Click Events tab | ✅ Shows all events with details |
| Lost & Found Tab | Click tab | ✅ Shows all lost/found items |
| Feedback Tab | Click tab | ✅ Shows all feedback submissions |
| Create Event | Click "Create Event" button | ✅ Navigates to event creation page |
| New Announcement | Click button | ✅ Navigates to announcements page |
| Refresh All | Click Refresh button | ✅ Reloads all data |

---

### **2. Event Management Testing**

| Role | Action | Expected Result |
|------|--------|-----------------|
| **Admin** | Create Event | ✅ Event created, visible to all |
| **Admin** | Edit ANY event | ✅ Can edit events created by faculty |
| **Admin** | Delete ANY event | ✅ Can delete any event |
| **Faculty** | Create Event | ✅ Event created |
| **Faculty** | Edit own event | ✅ Can edit |
| **Faculty** | Edit admin event | ❌ Permission denied |
| **Student** | View Events | ✅ Can view all events |
| **Student** | Register for Event | ✅ Registration successful |
| **Student** | Create Event | ❌ No create button visible |

---

### **3. Lost & Found Testing**

| Role | Action | Expected Result |
|------|--------|-----------------|
| **Admin** | View all items | ✅ Sees all lost/found items |
| **Admin** | Edit any item | ✅ Can edit any item |
| **Admin** | Mark as claimed | ✅ Can claim any item |
| **Admin** | Delete item | ✅ Can delete any item |
| **Faculty** | Report item | ✅ Item created |
| **Faculty** | Edit own item | ✅ Can edit |
| **Student** | Report lost item | ✅ Item created |
| **Student** | Claim found item | ✅ Can claim items |

---

### **4. Feedback Testing**

| Role | Action | Expected Result |
|------|--------|-----------------|
| **Admin** | View all feedback | ✅ Sees all feedback (including anonymous) |
| **Admin** | Respond to feedback | ✅ Can respond |
| **Admin** | Update status | ✅ Can change: Pending → In-Progress → Resolved |
| **Admin** | Delete feedback | ✅ Can delete spam |
| **Faculty** | View feedback | ✅ Can view all feedback |
| **Faculty** | Respond | ✅ Can respond |
| **Student** | Submit feedback | ✅ Feedback created |
| **Student** | Anonymous feedback | ✅ Name hidden |

---

### **5. Announcement Testing**

| Role | Action | Expected Result |
|------|--------|-----------------|
| **Admin** | Create announcement | ✅ Announcement created |
| **Admin** | Pin announcement | ✅ 📌 Shows pinned at top |
| **Admin** | Unpin announcement | ✅ Pin removed |
| **Admin** | Edit ANY announcement | ✅ Can edit all |
| **Admin** | Delete ANY announcement | ✅ Can delete all |
| **Faculty** | Create announcement | ✅ Created |
| **Faculty** | Pin announcement | ❌ Pin button not visible |
| **Faculty** | Edit own | ✅ Can edit |
| **Student** | View announcements | ✅ Can view all |
| **Student** | Create announcement | ❌ No access |

---

### **6. User Management Testing (Admin Only)**

| Test | Steps | Expected Result |
|------|-------|-----------------|
| View all users | Dashboard → Users tab | ✅ Table with all users |
| Promote to Faculty | Edit student → Select Faculty | ✅ Role changed, user gets faculty permissions |
| Promote to Admin | Edit faculty → Select Admin | ✅ Role changed, user gets admin access |
| Demote to Student | Edit admin → Select Student | ✅ Role changed, loses admin access |
| Deactivate user | Click block icon → Confirm | ✅ User cannot login |
| Filter by role | Check role chips | ✅ Color coded: Red=Admin, Blue=Faculty, Gray=Student |

---

### **7. Real-time Features Testing**

| Test | Steps | Expected Result |
|------|-------|-----------------|
| New Event Notification | Admin creates event | ✅ All users get notification |
| Lost Item Alert | Student reports lost item | ✅ Real-time notification |
| Announcement Broadcast | Admin creates announcement | ✅ Instant notification to all |
| Socket Connection | Login as any user | ✅ Socket ID in console |
| Auto-refresh | Admin creates event in one tab | ✅ Updates in other user's tab |

---

### **8. Email-Based Role Detection Testing**

| Email Pattern | Role Detected | Student ID Auto-fill |
|---------------|---------------|---------------------|
| 2310080030@klh.edu.in | ✅ Student | ✅ 2310080030 |
| 2024001@klh.edu.in | ✅ Student | ✅ 2024001 |
| john.doe@klh.edu.in | ✅ Faculty | ❌ N/A |
| faculty123@klh.edu.in | ✅ Faculty | ❌ N/A |
| admin@klh.edu.in | ℹ️ Manual | ❌ N/A |
| student@gmail.com | ❌ Error | ❌ Must use @klh.edu.in |

---

### **9. Dashboard Access Testing**

| Role | Dashboard Type | Features Visible |
|------|---------------|------------------|
| **Admin** | AdminDashboard.jsx | ✅ Full stats, 4 tabs (Users/Events/Lost/Feedback), Management tools |
| **Faculty** | FacultyDashboard.jsx | ✅ Stats, Recent events, Create buttons, Announcements |
| **Student** | StudentDashboard.jsx | ✅ Stats, Upcoming events, Recent announcements, Quick actions |

---

## 🧪 Step-by-Step Testing Workflow

### **Test 1: Admin Full Control**

```
1. Open http://localhost:5173
2. Click "Login"
3. Enter: admin@klh.edu.in / Admin@123
4. ✅ Admin Dashboard should load
5. Check 5 statistics cards display numbers
6. Click "Users" tab
   → ✅ Should see all registered users
7. Click "Edit" on any user
   → ✅ Dialog opens
8. Change role to "Faculty"
   → ✅ Role updated successfully
9. Click "Events" tab
   → ✅ Shows all events
10. Click "Create Event" button
    → ✅ Navigates to event creation
11. Click "New Announcement"
    → ✅ Opens announcements page
12. Create an announcement
    → ✅ Click pin icon (📌)
    → ✅ Announcement pinned to top
```

---

### **Test 2: Student Registration & Access**

```
1. Logout from admin
2. Click "Register"
3. Enter:
   - Email: 2310080030@klh.edu.in
   - Password: password123
   - Name: Test Student
   - Department: CSE
4. ✅ Role auto-detected as "Student"
5. ✅ Student ID auto-filled as "2310080030"
6. Click "Register"
7. ✅ Student Dashboard loads
8. Check sidebar menu:
   → ✅ Dashboard
   → ✅ Events
   → ✅ Lost & Found
   → ✅ Feedback
   → ❌ Announcements (not visible)
9. Navigate to Events
   → ✅ Can view events
   → ❌ No "Create" button
10. Navigate to Lost & Found
    → ✅ Can report items
    → ✅ Can claim items
```

---

### **Test 3: Faculty Permissions**

```
1. Logout
2. Register new account:
   - Email: faculty@klh.edu.in
   - Password: password123
   - Name: Test Faculty
3. ✅ Role auto-detected as "Faculty"
4. Login
5. ✅ Faculty Dashboard loads
6. Check permissions:
   → ✅ Create Event button visible
   → ✅ Create Announcement button visible
   → ✅ Can edit own events
   → ❌ Cannot edit admin events
   → ✅ Can respond to feedback
   → ❌ Cannot pin announcements
```

---

### **Test 4: Role Promotion**

```
1. Login as Admin
2. Dashboard → Users tab
3. Find the student (2310080030@klh.edu.in)
4. Click "Edit" icon
5. Select "Faculty" from dropdown
6. Click "Update Role"
7. ✅ Success message appears
8. Logout
9. Login as student (now faculty)
10. ✅ Faculty Dashboard now loads
11. ✅ Create Event button now visible
12. ✅ Create Announcement button visible
```

---

### **Test 5: Deactivation**

```
1. Login as Admin
2. Dashboard → Users tab
3. Find any user
4. Click "Block" icon (🚫)
5. Confirm deactivation
6. ✅ User status changes to "Inactive"
7. Logout
8. Try to login as deactivated user
9. ❌ Error: "Account deactivated. Contact admin."
```

---

## 📊 Expected Data Flow

### **Creating Event (Admin)**
```
Admin Creates Event
    ↓
Backend saves to MongoDB
    ↓
Socket.IO broadcasts "newEvent"
    ↓
All connected users receive notification
    ↓
Frontend updates event list in real-time
    ↓
Users see new event without refresh
```

### **Promoting User (Admin)**
```
Admin clicks Edit Role
    ↓
API: PUT /api/auth/users/:id/role
    ↓
Backend updates user.role in database
    ↓
Response confirms update
    ↓
Admin sees updated role in table
    ↓
User must logout/login to see changes
```

---

## 🔍 Debugging Checklist

### **If admin dashboard doesn't load:**
- [ ] Check user.role in MongoDB is exactly "admin" (lowercase)
- [ ] Verify JWT token is valid
- [ ] Check browser console for errors
- [ ] Clear localStorage and re-login

### **If role change doesn't work:**
- [ ] Confirm admin token in Authorization header
- [ ] Check backend logs for permission errors
- [ ] Verify user ID is correct
- [ ] Try logout/login after role change

### **If pin button not visible:**
- [ ] Confirm logged in as admin (not faculty)
- [ ] Check user.role === 'admin'
- [ ] Verify component conditional rendering

---

## 📝 Test Results Template

```
✅ Admin Dashboard: Passed
✅ User Management: Passed
✅ Event Creation: Passed
✅ Role Detection: Passed
✅ Permissions: Passed
✅ Real-time Updates: Passed
✅ Announcements: Passed
✅ Lost & Found: Passed
✅ Feedback: Passed
✅ Deactivation: Passed

All tests passed! ✅
```

---

## 🎉 Quick Start Testing

**Fastest way to test everything:**

```bash
# 1. Servers should be running
# Frontend: http://localhost:5173
# Backend: http://localhost:5000

# 2. Login as Admin
Email: admin@klh.edu.in
Password: Admin@123

# 3. Create test users (or register via UI)
# 4. Test admin features from dashboard
# 5. Switch to other roles to test permissions
```

---

**🚀 Your complete admin system with all features is ready to test!**
