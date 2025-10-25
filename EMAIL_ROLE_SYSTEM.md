# 📧 Email-Based Role Detection System

## Overview

The Smart Campus KLH application uses an **intelligent email-based role detection system** to automatically assign user roles based on their KLH email addresses.

---

## 🎯 How It Works

### Email Pattern Rules

All students and faculty **MUST** use `@klh.edu.in` email addresses.

| Role | Email Pattern | Example | Auto-Detection |
|------|---------------|---------|----------------|
| **Student** | Starts with **numbers** | `2310080030@klh.edu.in` | ✅ Yes |
| **Faculty** | Starts with **letters** | `john123@klh.edu.in` | ✅ Yes |
| **Admin** | Any email domain | `admin@campus.com` | ❌ Manual |

---

## 📝 Registration Process

### For Students

1. **Email Format**: Must start with numbers
   ```
   ✅ Correct: 2310080030@klh.edu.in
   ✅ Correct: 2024001@klh.edu.in
   ❌ Wrong: student123@klh.edu.in (starts with letters)
   ❌ Wrong: 2310080030@gmail.com (wrong domain)
   ```

2. **Role Detection**: 
   - System automatically detects "Student" role
   - Role field becomes read-only with "Auto-detected" badge

3. **Student ID**:
   - If email is purely numeric (e.g., `2310080030@klh.edu.in`)
   - System auto-fills Student ID as `2310080030`
   - You can override if needed

4. **Required Fields**:
   - Name
   - Email (must be @klh.edu.in and start with numbers)
   - Password
   - Student ID (auto-filled or manual)
   - Department
   - Phone (optional)

### For Faculty

1. **Email Format**: Must start with letters
   ```
   ✅ Correct: john.doe@klh.edu.in
   ✅ Correct: faculty123@klh.edu.in
   ✅ Correct: drsmith@klh.edu.in
   ❌ Wrong: 123john@klh.edu.in (starts with numbers)
   ❌ Wrong: john@gmail.com (wrong domain)
   ```

2. **Role Detection**:
   - System automatically detects "Faculty" role
   - Role field becomes read-only with "Auto-detected" badge

3. **Required Fields**:
   - Name
   - Email (must be @klh.edu.in and start with letters)
   - Password
   - Department
   - Phone (optional)
   - No Student ID required

### For Admin

1. **Email Format**: Any valid email
   ```
   ✅ Correct: admin@klh.edu.in
   ✅ Correct: admin@campus.com
   ✅ Correct: superadmin@klh.ac.in
   ```

2. **Role Assignment**:
   - Admins cannot self-register through the public form
   - Must be created by existing admin or through database
   - No automatic role detection

---

## 🔧 Technical Implementation

### Backend Validation (`authController.js`)

```javascript
// Email domain validation
const emailPattern = /^[^\s@]+@klh\.edu\.in$/;
if (!emailPattern.test(email) && role !== 'admin') {
  return res.status(400).json({
    message: 'Students and Faculty must use @klh.edu.in email addresses',
  });
}

// Auto-detect role from email pattern
let userRole = role;
if (role !== 'admin' && email.endsWith('@klh.edu.in')) {
  const emailPrefix = email.split('@')[0];
  
  // Check if starts with numbers → Student
  if (/^\d/.test(emailPrefix)) {
    userRole = 'student';
    // Auto-extract student ID if email is all numbers
    if (/^\d+$/.test(emailPrefix)) {
      studentId = emailPrefix;
    }
  } 
  // Check if starts with letters → Faculty
  else if (/^[a-zA-Z]/.test(emailPrefix)) {
    userRole = 'faculty';
  }
}
```

### Frontend Validation (`validators.js`)

```javascript
email: z.string()
  .email('Invalid email address')
  .refine((email) => {
    // Admin can use any email
    if (email.includes('admin')) return true;
    // Students and Faculty must use @klh.edu.in
    return email.endsWith('@klh.edu.in');
  }, {
    message: 'Students and Faculty must use @klh.edu.in email address',
  })
```

### Real-time Detection (`Register.jsx`)

```javascript
// Auto-detect role based on email pattern
useEffect(() => {
  if (emailValue && emailValue.endsWith('@klh.edu.in')) {
    const emailPrefix = emailValue.split('@')[0];
    
    if (/^\d/.test(emailPrefix)) {
      // Email starts with number - Student
      setDetectedRole('student');
      setValue('role', 'student');
      
      // Auto-fill student ID if email is all numbers
      if (/^\d+$/.test(emailPrefix)) {
        setValue('studentId', emailPrefix);
      }
    } else if (/^[a-zA-Z]/.test(emailPrefix)) {
      // Email starts with letter - Faculty
      setDetectedRole('faculty');
      setValue('role', 'faculty');
    }
  }
}, [emailValue, setValue]);
```

---

## 🎨 User Experience Features

### 1. **Real-time Role Detection**
- As user types email, role is automatically detected
- Role dropdown becomes disabled once detected
- Green "Auto-detected" badge appears

### 2. **Smart Student ID Auto-fill**
- For emails like `2310080030@klh.edu.in`
- Student ID field automatically fills with `2310080030`
- User can override if needed

### 3. **Helpful Guidance**
- Info alert shows email format examples
- Success alert confirms detected role
- Placeholder text guides correct format
- Helper text explains auto-fill behavior

### 4. **Validation Messages**
```
❌ "Students and Faculty must use @klh.edu.in email address"
❌ "Student ID is required for student accounts"
✅ "Role automatically detected as STUDENT from your email"
✅ "Will be auto-filled if email is your student ID"
```

---

## 📊 Example Scenarios

### Scenario 1: Student Registration

**Input:**
```
Email: 2310080030@klh.edu.in
```

**System Actions:**
1. ✅ Validates @klh.edu.in domain
2. ✅ Detects number prefix → Role = Student
3. ✅ Auto-fills Student ID = 2310080030
4. ✅ Shows "Auto-detected" badge
5. ✅ Disables role dropdown

**Result:** User registers as Student with Student ID `2310080030`

---

### Scenario 2: Faculty Registration

**Input:**
```
Email: john.smith@klh.edu.in
```

**System Actions:**
1. ✅ Validates @klh.edu.in domain
2. ✅ Detects letter prefix → Role = Faculty
3. ✅ Shows "Auto-detected" badge
4. ✅ Disables role dropdown
5. ✅ Hides Student ID field (not required)

**Result:** User registers as Faculty without Student ID

---

### Scenario 3: Mixed Email (Edge Case)

**Input:**
```
Email: 2024john@klh.edu.in
```

**System Actions:**
1. ✅ Validates @klh.edu.in domain
2. ✅ Detects number prefix → Role = Student
3. ⚠️ Cannot auto-fill Student ID (not purely numeric)
4. ✅ Shows "Auto-detected" badge
5. ℹ️ User must manually enter Student ID

**Result:** User registers as Student (must provide Student ID manually)

---

## 🔒 Security Benefits

1. **Domain Verification**: Ensures only KLH email addresses are used
2. **Automatic Role Assignment**: Prevents role manipulation
3. **Consistent Pattern**: Easy to audit and maintain
4. **Clear Separation**: Students and Faculty have distinct email patterns

---

## 🚀 Migration Guide

### For Existing Users

If you already have users with different email patterns:

1. **Update Email Addresses**:
   ```javascript
   // For students - change to number-based emails
   student@klh.edu.in → 2310080030@klh.edu.in
   
   // For faculty - ensure letter-based emails
   faculty1@klh.edu.in → john.doe@klh.edu.in
   ```

2. **Database Update Script**:
   ```javascript
   // Update existing users' emails
   db.users.updateMany(
     { role: 'student', email: { $not: /^\d/ } },
     { $set: { email: '<student_id>@klh.edu.in' } }
   );
   ```

---

## ❓ FAQ

**Q: Can I use my personal email?**  
A: No, students and faculty must use @klh.edu.in institutional emails.

**Q: My student ID is different from my email prefix. What should I do?**  
A: If auto-fill is incorrect, you can manually change the Student ID field.

**Q: Can I change my role after registration?**  
A: No, roles are permanent. Contact admin for role changes.

**Q: What if my faculty email starts with a number?**  
A: Faculty emails should start with letters. Contact IT department to update your email.

**Q: How do admins register?**  
A: Admins cannot self-register. They must be created by existing admins or through direct database access.

**Q: Can I have multiple accounts?**  
A: No, each email can only be used once. Each user should have one account.

---

## 🎓 Examples by Department

### Computer Science & Engineering
```
Students:
- 2310080030@klh.edu.in (CSE Student, 2023 batch)
- 2410080001@klh.edu.in (CSE Student, 2024 batch)

Faculty:
- drjohn@klh.edu.in (Professor)
- ramesh.kumar@klh.edu.in (Assistant Professor)
```

### Electronics & Communication
```
Students:
- 2310070025@klh.edu.in (ECE Student)
- 2410070050@klh.edu.in (ECE Student)

Faculty:
- priya.sharma@klh.edu.in (Faculty)
- ece.hod@klh.edu.in (HOD)
```

---

## 📝 Summary

✅ **Students**: Email starts with numbers → Role auto-detected as Student  
✅ **Faculty**: Email starts with letters → Role auto-detected as Faculty  
✅ **Admin**: Any email → Manual role assignment  
✅ **Domain**: All must use @klh.edu.in (except admin)  
✅ **Student ID**: Auto-filled if email is purely numeric  

This system ensures **secure, consistent, and user-friendly** role management! 🎉
