const Announcement = require('../models/Announcement');
const cloudinary = require('../config/cloudinary');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAllAnnouncements = async (req, res) => {
  try {
    const { category, priority, targetAudience } = req.query;
    
    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Filter by target audience
    if (targetAudience) {
      query.targetAudience = { $in: [targetAudience, 'all'] };
    } else if (req.user) {
      // Show announcements for user's role
      query.targetAudience = { $in: [req.user.role, 'all'] };
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name email role')
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email role');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Faculty/Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      targetAudience,
      expiryDate,
      isPinned,
    } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      category,
      priority,
      targetAudience,
      expiryDate,
      isPinned: req.user.role === 'admin' ? isPinned : false,
      createdBy: req.user.id,
      creatorName: req.user.name,
    });

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    io.emit('newAnnouncement', announcement);

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Faculty/Admin or Owner)
exports.updateAnnouncement = async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Check ownership or admin
    if (
      announcement.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement',
      });
    }

    // Only admin can pin announcements
    if (req.body.isPinned && req.user.role !== 'admin') {
      delete req.body.isPinned;
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Emit socket event for update
    const io = req.app.get('io');
    io.emit('announcementUpdated', announcement);

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Faculty/Admin or Owner)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Check ownership or admin
    if (
      announcement.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement',
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle pin announcement
// @route   PUT /api/announcements/:id/pin
// @access  Private (Admin only)
exports.togglePinAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    announcement.isPinned = !announcement.isPinned;
    await announcement.save();

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
