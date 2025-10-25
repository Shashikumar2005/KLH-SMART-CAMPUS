const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide item title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide item description'],
    },
    category: {
      type: String,
      enum: ['electronics', 'documents', 'accessories', 'books', 'clothing', 'other'],
      default: 'other',
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
    },
    image: {
      type: String,
      default: '',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reporterName: {
      type: String,
    },
    reporterContact: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'pending-approval', 'resolved', 'expired'],
      default: 'active',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    claimDate: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
lostItemSchema.index({ title: 'text', description: 'text', category: 1, type: 1 });

module.exports = mongoose.model('LostItem', lostItemSchema);
