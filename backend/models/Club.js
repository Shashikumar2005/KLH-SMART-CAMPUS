const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide club name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide club description'],
    },
    category: {
      type: String,
      enum: ['technical', 'cultural', 'sports', 'social', 'academic', 'arts', 'other'],
      required: true,
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    president: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vicePresident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    secretary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    treasurer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['member', 'coordinator', 'core-team'],
        default: 'member',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    membershipRequests: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      message: String,
      requestedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
    achievements: [{
      title: String,
      description: String,
      date: Date,
      image: String,
    }],
    socialLinks: {
      website: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      facebook: String,
    },
    meetingSchedule: {
      day: String,
      time: String,
      location: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    resources: [{
      title: String,
      description: String,
      link: String,
      type: {
        type: String,
        enum: ['document', 'video', 'link', 'other'],
      },
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Club', clubSchema);
