# 🔐 Smart Campus KLH - Test Credentials

**For Testing and Development Purposes Only**

---

## 📋 Email Format Rules

### Students
- **Format:** `10-digit-number@klh.edu.in`
- **Example:** `2310080001@klh.edu.in`
- **Pattern:** Exactly 10 numeric digits followed by @klh.edu.in
- **Student ID:** Automatically extracted from email

### Faculty/Staff
- **Format:** `nameXXXX@klh.edu.in` (name followed by 4 digits)
- **Example:** `rajesh1234@klh.edu.in`
- **Pattern:** Alphabetic characters + exactly 4 numeric digits + @klh.edu.in

### Admin
- **Format:** Any valid email format
- **Example:** `admin@klh.edu.in`

---

## 👨‍💼 Admin Account

| Field | Value |
|-------|-------|
| **Email** | `admin@klh.edu.in` |
| **Password** | `Admin@123` |
| **Role** | Admin |
| **Student ID** | `ADMIN001` |
| **Department** | Administration |
| **Phone** | 9876543200 |

**Capabilities:** Full system access, user management, event approval, notifications

---

## 👨‍🏫 Faculty/Staff Test Accounts (10 Accounts)

All faculty accounts use password: **`Staff@123`**

| # | Name | Email | Department | Phone |
|---|------|-------|------------|-------|
| 1 | Rajesh Kumar | `rajesh1234@klh.edu.in` | Computer Science | 9876543210 |
| 2 | Priya Sharma | `priya5678@klh.edu.in` | Electronics | 9876543211 |
| 3 | Anil Reddy | `anil9012@klh.edu.in` | Mechanical | 9876543212 |
| 4 | Suresh Babu | `suresh3456@klh.edu.in` | Civil | 9876543213 |
| 5 | Kavita Singh | `kavita7890@klh.edu.in` | Computer Science | 9876543214 |
| 6 | Ramesh Patel | `ramesh2468@klh.edu.in` | Information Technology | 9876543215 |
| 7 | Deepa Menon | `deepa1357@klh.edu.in` | Electronics | 9876543216 |
| 8 | Vijay Krishna | `vijay8024@klh.edu.in` | Computer Science | 9876543217 |
| 9 | Lakshmi Devi | `lakshmi4680@klh.edu.in` | Mathematics | 9876543218 |
| 10 | Sandeep Gupta | `sandeep1593@klh.edu.in` | Physics | 9876543219 |

**Capabilities:** Create events, manage clubs, post announcements, view student data

---

## 👨‍🎓 Student Test Accounts (5 Accounts)

All student accounts use password: **`Student@123`**

| # | Name | Email | Student ID | Department | Phone |
|---|------|-------|------------|------------|-------|
| 1 | Rahul Verma | `2310080001@klh.edu.in` | 2310080001 | Computer Science | 9876543220 |
| 2 | Sneha Reddy | `2310080002@klh.edu.in` | 2310080002 | Computer Science | 9876543221 |
| 3 | Arjun Malhotra | `2310080003@klh.edu.in` | 2310080003 | Electronics | 9876543222 |
| 4 | Pooja Desai | `2310080004@klh.edu.in` | 2310080004 | Information Technology | 9876543223 |
| 5 | Karthik Nair | `2310080005@klh.edu.in` | 2310080005 | Mechanical | 9876543224 |

**Capabilities:** Join clubs, register for events, report lost/found items, AI chatbot

---

## 🔧 How to Seed Test Data

### Method 1: Run Seeding Script (Recommended)

```bash
# Navigate to backend directory
cd backend

# Run the seeding script
node scripts/seedTestData.js
```

**Output:** Will create all test accounts listed above if they don't already exist.

### Method 2: Manual API Registration

Use the registration endpoint with the data provided above.

**Example (PowerShell):**
```powershell
$body = @{
    name = "Rajesh Kumar"
    email = "rajesh1234@klh.edu.in"
    password = "Staff@123"
    role = "faculty"
    department = "Computer Science"
    phone = "9876543210"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://klh-smart-campus.onrender.com/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

---

## 🧪 Testing Scenarios

### Scenario 1: Student Registration & Login
1. Register with email: `2310080030@klh.edu.in`
2. System auto-detects role as "student"
3. System auto-fills Student ID: `2310080030`
4. Login and explore student dashboard

### Scenario 2: Faculty Login
1. Login with: `rajesh1234@klh.edu.in` / `Staff@123`
2. Create a new event
3. Check admin dashboard for approval
4. Verify notifications sent to students

### Scenario 3: Admin Management
1. Login as admin
2. View all users (students + faculty)
3. Approve/reject events
4. Manage user roles

### Scenario 4: Real-time Features
1. Login with 2 different accounts (different browsers)
2. Create event as faculty
3. See real-time notification on student account
4. Test WebSocket connectivity

### Scenario 5: AI Chatbot
1. Login as any student
2. Click chatbot icon (bottom-right)
3. Ask: "What events are happening this week?"
4. Test AI responses

---

## 📊 Testing Checklist

- [ ] Admin can login and access all features
- [ ] Faculty can create events and manage clubs
- [ ] Students can register with 10-digit email format
- [ ] Email validation works (rejects invalid formats)
- [ ] Real-time notifications appear
- [ ] AI chatbot responds to queries
- [ ] Image uploads work (Cloudinary)
- [ ] Lost & Found item posting works
- [ ] Club join/leave functionality works
- [ ] Event registration works
- [ ] Profile updates save correctly

---

## 🔒 Security Notes

### For Production Deployment:

1. **Change ALL passwords** - Current passwords are for testing only
2. **Generate strong JWT_SECRET** - Use 32+ character random string
3. **Enable rate limiting** - Prevent brute force attacks
4. **Use HTTPS only** - Ensure SSL certificates are valid
5. **Implement email verification** - Add verification flow
6. **Add CAPTCHA** - Prevent automated registrations
7. **Set up proper CORS** - Restrict to your domain only
8. **Monitor logs** - Set up error tracking (Sentry)
9. **Regular backups** - MongoDB Atlas automatic backups
10. **2FA for admin** - Add two-factor authentication

---

## 📝 Validation Rules

### Email Validation
```javascript
// Student Email Pattern
/^\d{10}@klh\.edu\.in$/

// Faculty Email Pattern  
/^[a-zA-Z]+\d{4}@klh\.edu\.in$/

// Admin - any valid email
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### Password Requirements
- Minimum 6 characters (update to 8+ for production)
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Must contain at least one special character

### Student ID Rules
- Automatically extracted from email for students
- Must be unique across the system
- Cannot be changed after registration

---

## 🚀 Quick Start Commands

```bash
# Seed all test data
cd backend && node scripts/seedTestData.js

# Test backend health
curl https://klh-smart-campus.onrender.com/api/health

# Login as admin (PowerShell)
$loginBody = @{
    email = "admin@klh.edu.in"
    password = "Admin@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://klh-smart-campus.onrender.com/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"

# Test authenticated endpoint
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "https://klh-smart-campus.onrender.com/api/auth/me" -Method GET -Headers $headers
```

---

## 📞 Support

For issues with test accounts or authentication:
1. Check backend logs in Render dashboard
2. Verify MongoDB connection
3. Ensure environment variables are set correctly
4. Test API endpoints directly using Postman/curl

---

**Last Updated:** October 25, 2025  
**Version:** 1.0  
**Status:** Ready for Testing ✅
