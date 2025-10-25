const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
exports.getAllClubs = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = { isApproved: true };

    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }

    const clubs = await Club.find(query)
      .populate('president', 'name email department')
      .populate('vicePresident', 'name email department')
      .populate('secretary', 'name email department')
      .populate('treasurer', 'name email department')
      .populate('faculty', 'name email department')
      .populate('members.user', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
exports.getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('president', 'name email department avatar')
      .populate('vicePresident', 'name email department avatar')
      .populate('secretary', 'name email department avatar')
      .populate('treasurer', 'name email department avatar')
      .populate('faculty', 'name email department avatar')
      .populate('members.user', 'name email department avatar')
      .populate('membershipRequests.user', 'name email department')
      .populate('events');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new club
// @route   POST /api/clubs
// @access  Private (Students)
exports.createClub = async (req, res) => {
  try {
    const { name, description, category, logo, coverImage, socialLinks, meetingSchedule } = req.body;

    // Check if club name already exists
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: 'Club with this name already exists',
      });
    }

    // Auto-approve if created by admin or faculty (staff), otherwise require approval
    const isApproved = req.user.role === 'admin' || req.user.role === 'faculty';

    const club = await Club.create({
      name,
      description,
      category,
      logo,
      coverImage,
      president: req.user.id,
      socialLinks,
      meetingSchedule,
      isApproved,
      members: [{
        user: req.user.id,
        role: 'core-team',
      }],
    });

    await club.populate('president', 'name email department');

    // Emit socket event only if auto-approved
    const io = req.app.get('io');
    if (io && isApproved) {
      io.emit('newClub', club);
    } else if (io && !isApproved) {
      // Notify admins about pending approval
      io.emitToRole('admin', 'clubPendingApproval', club);
    }

    const message = isApproved 
      ? 'Club created successfully!' 
      : 'Club created successfully! Waiting for admin approval.';

    res.status(201).json({
      success: true,
      message,
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private (Club Leaders)
exports.updateClub = async (req, res) => {
  try {
    let club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is club president or admin
    if (club.president.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this club',
      });
    }

    club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('president vicePresident secretary treasurer faculty');

    res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Request to join club
// @route   POST /api/clubs/:id/join
// @access  Private (Students)
exports.requestJoinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if already a member
    const isMember = club.members.some(m => m.user.toString() === req.user.id);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this club',
      });
    }

    // Check if already requested
    const hasRequested = club.membershipRequests.some(r => r.user.toString() === req.user.id);
    if (hasRequested) {
      return res.status(400).json({
        success: false,
        message: 'Membership request already pending',
      });
    }

    club.membershipRequests.push({
      user: req.user.id,
      message: req.body.message || '',
    });

    await club.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('clubJoinRequest', { club: club._id, user: req.user.id });
    }

    res.status(200).json({
      success: true,
      message: 'Membership request sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve/Reject membership request
// @route   PUT /api/clubs/:id/membership/:requestId
// @access  Private (Club Leaders)
exports.handleMembershipRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'

    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is club president or admin
    if (club.president.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const requestIndex = club.membershipRequests.findIndex(
      r => r._id.toString() === req.params.requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Membership request not found',
      });
    }

    const request = club.membershipRequests[requestIndex];

    if (action === 'approve') {
      club.members.push({
        user: request.user,
        role: 'member',
      });
    }

    club.membershipRequests.splice(requestIndex, 1);
    await club.save();

    res.status(200).json({
      success: true,
      message: `Membership request ${action}d successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove member from club
// @route   DELETE /api/clubs/:id/members/:memberId
// @access  Private (Club Leaders)
exports.removeMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is club president or admin
    if (club.president.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    club.members = club.members.filter(
      m => m.user.toString() !== req.params.memberId
    );

    await club.save();

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add achievement
// @route   POST /api/clubs/:id/achievements
// @access  Private (Club Leaders)
exports.addAchievement = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check authorization
    if (club.president.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    club.achievements.push(req.body);
    await club.save();

    res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add resource
// @route   POST /api/clubs/:id/resources
// @access  Private (Club Members)
exports.addResource = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is member
    const isMember = club.members.some(m => m.user.toString() === req.user.id);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only club members can add resources',
      });
    }

    club.resources.push({
      ...req.body,
      uploadedBy: req.user.id,
    });

    await club.save();

    res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve club (Admin only)
// @route   PUT /api/clubs/:id/approve
// @access  Private (Admin)
exports.approveClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('president', 'name email department');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Emit socket event to all users
    const io = req.app.get('io');
    if (io) {
      io.emit('clubApproved', club);
    }

    res.status(200).json({
      success: true,
      message: 'Club approved successfully',
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pending clubs (Admin only)
// @route   GET /api/clubs/pending
// @access  Private (Admin)
exports.getPendingClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isApproved: false })
      .populate('president', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject club (Admin only)
// @route   PUT /api/clubs/:id/reject
// @access  Private (Admin)
exports.rejectClub = async (req, res) => {
  try {
    const { reason } = req.body;

    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Notify the club president about rejection
    const io = req.app.get('io');
    if (io) {
      io.emitToUser(club.president.toString(), 'clubRejected', {
        club: club.name,
        reason: reason || 'No reason provided',
      });
    }

    // Delete the rejected club
    await club.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Club rejected and removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private (Admin)
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    await club.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Club deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
