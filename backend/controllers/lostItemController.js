const LostItem = require('../models/LostItem');
const cloudinary = require('../config/cloudinary');

// @desc    Get all lost items
// @route   GET /api/lost-items
// @access  Public
exports.getAllLostItems = async (req, res) => {
  try {
    const { type, category, status, search } = req.query;
    
    let query = { isActive: true };

    // Filter by type (lost/found)
    if (type) {
      query.type = type;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }

    const items = await LostItem.find(query)
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single lost item
// @route   GET /api/lost-items/:id
// @access  Public
exports.getLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('claimedBy', 'name email phone');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Report lost/found item
// @route   POST /api/lost-items
// @access  Private
exports.createLostItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      location,
      date,
      reporterContact,
    } = req.body;

    let imageUrl = '';

    // Get Cloudinary URL if file was uploaded
    if (req.file) {
      imageUrl = req.file.path; // Cloudinary URL from multer-storage-cloudinary
    }

    const item = await LostItem.create({
      title,
      description,
      category,
      type,
      location,
      date,
      image: imageUrl,
      reportedBy: req.user.id,
      reporterName: req.user.name,
      reporterContact: reporterContact || req.user.phone,
    });

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    io.emit('newLostItem', item);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update lost item
// @route   PUT /api/lost-items/:id
// @access  Private (Owner/Admin)
exports.updateLostItem = async (req, res) => {
  try {
    let item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check ownership or admin
    if (
      item.reportedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    // Get Cloudinary URL if file was uploaded
    if (req.file) {
      req.body.image = req.file.path; // Cloudinary URL from multer-storage-cloudinary
    }

    item = await LostItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Emit socket event for update
    const io = req.app.get('io');
    io.emit('lostItemUpdated', item);

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete lost item
// @route   DELETE /api/lost-items/:id
// @access  Private (Owner/Admin)
exports.deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check ownership or admin
    if (
      item.reportedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Claim lost item (request claim - pending admin approval)
// @route   POST /api/lost-items/:id/claim
// @access  Private
exports.claimLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.status === 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Item has already been claimed and resolved',
      });
    }

    if (item.status === 'pending-approval') {
      return res.status(400).json({
        success: false,
        message: 'Item already has a pending claim request',
      });
    }

    item.status = 'pending-approval';
    item.claimedBy = req.user.id;
    item.claimDate = Date.now();
    await item.save();

    // Populate claimedBy for response
    await item.populate('claimedBy', 'name email phone');

    // Emit socket event
    const io = req.app.get('io');
    io.emit('lostItemClaimRequested', item);

    res.status(200).json({
      success: true,
      message: 'Claim request submitted. Waiting for admin approval.',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve claim request (Admin only)
// @route   POST /api/lost-items/:id/approve
// @access  Private (Admin only)
exports.approveClaim = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can approve claims',
      });
    }

    const item = await LostItem.findById(req.params.id)
      .populate('claimedBy', 'name email phone')
      .populate('reportedBy', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.status !== 'pending-approval') {
      return res.status(400).json({
        success: false,
        message: 'No pending claim request for this item',
      });
    }

    item.status = 'resolved';
    item.approvedBy = req.user.id;
    item.resolvedDate = Date.now();
    await item.save();

    // Emit socket event
    const io = req.app.get('io');
    io.emit('lostItemClaimApproved', item);

    res.status(200).json({
      success: true,
      message: 'Claim approved successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject claim request (Admin only)
// @route   POST /api/lost-items/:id/reject
// @access  Private (Admin only)
exports.rejectClaim = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can reject claims',
      });
    }

    const { reason } = req.body;
    const item = await LostItem.findById(req.params.id)
      .populate('claimedBy', 'name email phone');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.status !== 'pending-approval') {
      return res.status(400).json({
        success: false,
        message: 'No pending claim request for this item',
      });
    }

    item.status = 'active';
    item.claimedBy = null;
    item.claimDate = null;
    item.rejectionReason = reason || 'Claim rejected by administrator';
    await item.save();

    // Emit socket event
    const io = req.app.get('io');
    io.emit('lostItemClaimRejected', item);

    res.status(200).json({
      success: true,
      message: 'Claim rejected successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
