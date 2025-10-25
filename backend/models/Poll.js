const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please provide poll question'],
      trim: true,
    },
    description: {
      type: String,
    },
    options: [{
      text: {
        type: String,
        required: true,
      },
      votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
    },
    category: {
      type: String,
      enum: ['campus', 'club', 'event', 'facility', 'general'],
      default: 'general',
    },
    type: {
      type: String,
      enum: ['single', 'multiple'],
      default: 'single',
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    allowAnonymous: {
      type: Boolean,
      default: false,
    },
  visibility: {
    type: String,
    enum: ['public', 'students', 'club-members'],
    default: 'public',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
}
);module.exports = mongoose.model('Poll', pollSchema);
