const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Please provide feedback subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide feedback message'],
    },
    category: {
      type: String,
      enum: ['facilities', 'academic', 'events', 'safety', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submitterName: {
      type: String,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'reviewed', 'resolved'],
      default: 'pending',
    },
    response: {
      type: String,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
