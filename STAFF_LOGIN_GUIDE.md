# 🔑 Quick Login Credentials for Testing

## 🎯 Already Created in Database

These 10 staff accounts are **ready to use** for login testing:

---

## 👨‍🏫 Staff/Faculty Accounts (10 Users)

**All use password:** `Staff@123`

| # | Name | Email | Department |
|---|------|-------|------------|
| 1 | Rajesh Kumar | `rajesh1234@klh.edu.in` | Computer Science |
| 2 | Priya Sharma | `priya5678@klh.edu.in` | Electronics |
| 3 | Anil Reddy | `anil9012@klh.edu.in` | Mechanical |
| 4 | Suresh Babu | `suresh3456@klh.edu.in` | Civil |
| 5 | Kavita Singh | `kavita7890@klh.edu.in` | Computer Science |
| 6 | Ramesh Patel | `ramesh2468@klh.edu.in` | Information Technology |
| 7 | Deepa Menon | `deepa1357@klh.edu.in` | Electronics |
| 8 | Vijay Krishna | `vijay8024@klh.edu.in` | Computer Science |
| 9 | Lakshmi Devi | `lakshmi4680@klh.edu.in` | Mathematics |
| 10 | Sandeep Gupta | `sandeep1593@klh.edu.in` | Physics |

---

## 👨‍🎓 Student Accounts (5 Users)

**All use password:** `Student@123`

| # | Name | Email | Student ID |
|---|------|-------|------------|
| 1 | Rahul Verma | `2310080001@klh.edu.in` | 2310080001 |
| 2 | Sneha Reddy | `2310080002@klh.edu.in` | 2310080002 |
| 3 | Arjun Malhotra | `2310080003@klh.edu.in` | 2310080003 |
| 4 | Pooja Desai | `2310080004@klh.edu.in` | 2310080004 |
| 5 | Karthik Nair | `2310080005@klh.edu.in` | 2310080005 |

---

## 👨‍💼 Admin Account

| Email | Password |
|-------|----------|
| `admin@klh.edu.in` | `Admin@123` |

---

## ✅ Testing Instructions

### 1. Login Test
1. Go to: http://localhost:5174/login
2. Use any staff email from the list above
3. Password: `Staff@123`
4. Should login successfully as Faculty

### 2. Registration Test (Auto-Detection)
1. Go to: http://localhost:5174/register
2. Enter email: `teacher9999@klh.edu.in` (any name + 4 digits)
3. Notice: **Role dropdown is REMOVED**
4. System automatically detects as "Faculty" and shows badge
5. Enter email: `9876543210@klh.edu.in` (10 digits)
6. System automatically detects as "Student" and shows badge

### 3. Invalid Email Test
1. Try: `123@klh.edu.in` (less than 10 digits)
   - Should show error
2. Try: `teacher123@klh.edu.in` (only 3 digits instead of 4)
   - Should show error

---

## 🎨 What Changed

### Before:
- ❌ User selects role manually from dropdown
- ❌ Can select wrong role for their email
- ❌ Confusing for users

### After:
- ✅ Role auto-detected from email format
- ✅ Shows beautiful badge with detected role
- ✅ Student ID auto-filled for students
- ✅ No manual role selection needed
- ✅ Cleaner, more intuitive UI

---

## 📋 Email Format Rules

### Students:
- **Format:** Exactly 10 digits + @klh.edu.in
- **Example:** `2310080030@klh.edu.in`
- **Auto-assigns:** Student role + Student ID

### Faculty:
- **Format:** Letters + exactly 4 digits + @klh.edu.in
- **Example:** `rajesh1234@klh.edu.in`
- **Auto-assigns:** Faculty role

### Admin:
- **Format:** Any valid email
- **Example:** `admin@klh.edu.in`
- **Manual only:** Cannot register as admin

---

## 🚀 Quick Test Commands

Test login via API:

```powershell
# Test Faculty Login
$body = @{
    email = "rajesh1234@klh.edu.in"
    password = "Staff@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"

# Test Student Login
$body = @{
    email = "2310080001@klh.edu.in"
    password = "Student@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

---

**Status:** ✅ All 10 staff accounts are in database and ready to use!
