const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Please provide grievance subject'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide grievance description'],
    },
    category: {
      type: String,
      enum: ['harassment', 'discrimination', 'safety', 'facilities', 'academic', 'administrative', 'other'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
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
      enum: ['pending', 'under-review', 'investigating', 'action-taken', 'resolved', 'closed'],
      default: 'pending',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    response: {
      type: String,
    },
    actionTaken: {
      type: String,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    attachments: [{
      type: String,
    }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Grievance', grievanceSchema);
