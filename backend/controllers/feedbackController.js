const Feedback = require('../models/Feedback');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (All roles can view)
exports.getAllFeedback = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Students can see all feedback (for transparency)
    // But can only submit, edit, delete their own
    
    const feedback = await Feedback.find(query)
      .populate('submittedBy', 'name email role department')
      .populate('respondedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private (All roles)
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('submittedBy', 'name email role department')
      .populate('respondedBy', 'name email role');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private (All roles - Student, Faculty, Admin)
exports.createFeedback = async (req, res) => {
  try {
    const { subject, message, category, priority, isAnonymous } = req.body;

    const feedback = await Feedback.create({
      subject,
      message,
      category,
      priority,
      submittedBy: req.user.id,
      submitterName: isAnonymous ? 'Anonymous' : req.user.name,
      isAnonymous,
    });

    // Populate submittedBy before emitting
    await feedback.populate('submittedBy', 'name email role department');

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    io.emit('newFeedback', feedback);

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Respond to feedback
// @route   PUT /api/feedback/:id/respond
// @access  Private (Faculty/Admin)
exports.respondToFeedback = async (req, res) => {
  try {
    const { response, status } = req.body;

    // Validate required fields
    if (!response || response.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Response message is required',
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in-progress', 'reviewed', 'resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    feedback.response = response;
    feedback.status = status || 'reviewed';
    feedback.respondedBy = req.user.id;
    feedback.respondedAt = Date.now();

    await feedback.save();

    // Populate before sending response
    await feedback.populate('submittedBy', 'name email role department');
    await feedback.populate('respondedBy', 'name email role');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('feedbackResponded', feedback);
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update feedback status
// @route   PUT /api/feedback/:id/status
// @access  Private (Faculty/Admin)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status value
    const validStatuses = ['pending', 'in-progress', 'reviewed', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email role department')
     .populate('respondedBy', 'name email role');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('feedbackStatusUpdated', feedback);
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Owner/Admin)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    // Check ownership or admin
    if (
      feedback.submittedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this feedback',
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
