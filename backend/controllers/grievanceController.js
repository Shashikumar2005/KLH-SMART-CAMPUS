const Grievance = require('../models/Grievance');

// @desc    Get all grievances
// @route   GET /api/grievances
// @access  Private (Admin/Faculty can see all, Students see only their own)
exports.getAllGrievances = async (req, res) => {
  try {
    const { status, category, severity } = req.query;
    
    let query = {};

    // Students can only see their own grievances
    if (req.user.role === 'student') {
      query.submittedBy = req.user.id;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by severity
    if (severity) {
      query.severity = severity;
    }

    const grievances = await Grievance.find(query)
      .populate('submittedBy', 'name email role department')
      .populate('respondedBy', 'name email role')
      .populate('assignedTo', 'name email role department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: grievances.length,
      data: grievances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single grievance
// @route   GET /api/grievances/:id
// @access  Private
exports.getGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('submittedBy', 'name email role department')
      .populate('respondedBy', 'name email role')
      .populate('assignedTo', 'name email role department');

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found',
      });
    }

    // Students can only view their own grievances
    if (req.user.role === 'student' && grievance.submittedBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this grievance',
      });
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit grievance
// @route   POST /api/grievances
// @access  Private (All authenticated users)
exports.createGrievance = async (req, res) => {
  try {
    const { subject, description, category, severity, priority, isAnonymous } = req.body;

    const grievance = await Grievance.create({
      subject,
      description,
      category,
      severity,
      priority,
      submittedBy: req.user.id,
      submitterName: isAnonymous ? 'Anonymous' : req.user.name,
      isAnonymous,
    });

    // Populate submittedBy before emitting
    await grievance.populate('submittedBy', 'name email role department');

    // Emit socket event for real-time notification to admins/faculty
    const io = req.app.get('io');
    if (io) {
      io.emit('newGrievance', grievance);
    }

    res.status(201).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Respond to grievance
// @route   PUT /api/grievances/:id/respond
// @access  Private (Faculty/Admin)
exports.respondToGrievance = async (req, res) => {
  try {
    const { response, actionTaken, status } = req.body;

    // Validate required fields
    if (!response || response.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Response message is required',
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'under-review', 'investigating', 'action-taken', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    let grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found',
      });
    }

    grievance.response = response;
    grievance.actionTaken = actionTaken || grievance.actionTaken;
    grievance.status = status || 'under-review';
    grievance.respondedBy = req.user.id;
    grievance.respondedAt = Date.now();

    if (status === 'resolved' || status === 'closed') {
      grievance.resolvedAt = Date.now();
    }

    await grievance.save();

    // Populate before sending response
    await grievance.populate('submittedBy', 'name email role department');
    await grievance.populate('respondedBy', 'name email role');
    await grievance.populate('assignedTo', 'name email role department');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('grievanceResponded', grievance);
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update grievance status
// @route   PUT /api/grievances/:id/status
// @access  Private (Faculty/Admin)
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status value
    const validStatuses = ['pending', 'under-review', 'investigating', 'action-taken', 'resolved', 'closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'resolved' || status === 'closed' ? { resolvedAt: Date.now() } : {})
      },
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email role department')
     .populate('respondedBy', 'name email role')
     .populate('assignedTo', 'name email role department');

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found',
      });
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('grievanceStatusUpdated', grievance);
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Assign grievance to user
// @route   PUT /api/grievances/:id/assign
// @access  Private (Admin only)
exports.assignGrievance = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId, status: 'under-review' },
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email role department')
     .populate('respondedBy', 'name email role')
     .populate('assignedTo', 'name email role department');

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found',
      });
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('grievanceAssigned', grievance);
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete grievance
// @route   DELETE /api/grievances/:id
// @access  Private (Admin only)
exports.deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found',
      });
    }

    await grievance.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Grievance deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
