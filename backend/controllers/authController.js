const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, studentId, department, phone } = req.body;

    // Validate email domain for students and faculty
    const emailPattern = /^[^\s@]+@klh\.edu\.in$/;
    if (!emailPattern.test(email) && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Students and Faculty must use @klh.edu.in email addresses',
      });
    }

    // Get email prefix once
    const emailPrefix = email.split('@')[0];

    // Validate student email format (must be 10 digits followed by @klh.edu.in)
    if (role === 'student' && !/^\d{10}$/.test(emailPrefix)) {
      return res.status(400).json({
        success: false,
        message: 'Student email must be a 10-digit number followed by @klh.edu.in (e.g., 2310080001@klh.edu.in)',
      });
    }

    // Validate faculty email format (name followed by 4 digits)
    if (role === 'faculty' && email.endsWith('@klh.edu.in')) {
      const facultyPattern = /^[a-zA-Z]+\d{4}@klh\.edu\.in$/;
      if (!facultyPattern.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Faculty email must be in format: nameXXXX@klh.edu.in (e.g., rajesh1234@klh.edu.in)',
        });
      }
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Restrict faculty registration - only pre-registered staff can exist
    // Students can register freely, but faculty must be created by admin
    const isFacultyEmail = /^[a-zA-Z]+\d{4}$/.test(emailPrefix) && email.endsWith('@klh.edu.in');
    
    if (isFacultyEmail) {
      return res.status(403).json({
        success: false,
        message: 'Staff/Faculty registration is restricted. Please contact administrator to create your account.',
      });
    }

    // Auto-detect role based on email pattern if not explicitly provided
    let userRole = role || 'student'; // Default to student
    let autoDetectedStudentId = null;

    if (email.endsWith('@klh.edu.in')) {
      // Check if email is 10 digits (student)
      if (/^\d{10}$/.test(emailPrefix)) {
        userRole = 'student';
        // Auto-extract student ID from email if not provided
        if (!studentId) {
          autoDetectedStudentId = emailPrefix;
        }
      } 
      // Check if email starts with letters followed by 4 digits (faculty)
      else if (/^[a-zA-Z]+\d{4}$/.test(emailPrefix)) {
        userRole = 'faculty';
      }
    }

    // Use provided studentId or auto-detected one
    const finalStudentId = studentId || autoDetectedStudentId;

    // Validate student ID for students
    if (userRole === 'student' && !finalStudentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required for student accounts',
      });
    }

    // Check if studentId already exists (for students only)
    if (finalStudentId) {
      const studentExists = await User.findOne({ studentId: finalStudentId });
      if (studentExists) {
        return res.status(400).json({
          success: false,
          message: 'Student ID already exists',
        });
      }
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role: userRole,
      department,
      phone,
    };

    // Only add studentId for students
    if (userRole === 'student' && finalStudentId) {
      userData.studentId = finalStudentId;
    }

    const user = await User.create(userData);

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
      },
      message: `Successfully registered as ${userRole}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, department, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, department, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Deactivate user (Admin only)
// @route   PUT /api/auth/users/:id/deactivate
// @access  Private/Admin
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
