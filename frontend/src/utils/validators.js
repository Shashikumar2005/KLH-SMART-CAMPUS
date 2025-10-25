import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email address')
    .refine((email) => {
      // Admin can use any email
      if (email.includes('admin')) return true;
      // Students and Faculty must use @klh.edu.in
      return email.endsWith('@klh.edu.in');
    }, {
      message: 'Students and Faculty must use @klh.edu.in email address',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'faculty', 'admin']).optional(),
  studentId: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  // Auto-detect role from email pattern
  if (data.email.endsWith('@klh.edu.in')) {
    const emailPrefix = data.email.split('@')[0];
    // If email starts with numbers, it's a student
    if (/^\d/.test(emailPrefix) && !data.studentId) {
      return false; // Student ID required for student emails
    }
  }
  return true;
}, {
  message: 'Student ID is required for student accounts',
  path: ['studentId'],
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Event creation schema
export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['academic', 'cultural', 'sports', 'workshop', 'seminar', 'other']),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().min(3, 'Venue is required'),
  department: z.string().optional(),
  registrationRequired: z.boolean().optional(),
  maxParticipants: z.number().positive().optional(),
});

// Lost item schema
export const lostItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['electronics', 'documents', 'accessories', 'books', 'clothing', 'other']),
  type: z.enum(['lost', 'found']),
  location: z.string().min(3, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  reporterContact: z.string().optional(),
});

// Feedback schema
export const feedbackSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['infrastructure', 'teaching', 'facilities', 'administration', 'other']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  isAnonymous: z.boolean().optional(),
});

// Announcement schema
export const announcementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.enum(['general', 'academic', 'urgent', 'event', 'holiday']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  targetAudience: z.array(z.enum(['all', 'student', 'faculty', 'admin'])).optional(),
  expiryDate: z.string().optional(),
  isPinned: z.boolean().optional(),
});

// Profile update schema
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  department: z.string().optional(),
  avatar: z.string().optional(),
});

export default {
  registerSchema,
  loginSchema,
  eventSchema,
  lostItemSchema,
  feedbackSchema,
  announcementSchema,
  profileSchema,
};
