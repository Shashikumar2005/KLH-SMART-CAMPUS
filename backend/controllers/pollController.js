const Poll = require('../models/Poll');
const Club = require('../models/Club');

// @desc    Get all polls
// @route   GET /api/polls
// @access  Public
exports.getAllPolls = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    let query = { isApproved: true }; // Only show approved polls

    if (category) {
      query.category = category;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Check if poll has expired
    const currentDate = new Date();
    
    const polls = await Poll.find(query)
      .populate('createdBy', 'name email department')
      .populate('club', 'name logo')
      .populate('options.votes', 'name')
      .sort({ createdAt: -1 });

    // Update isActive status for expired polls
    for (let poll of polls) {
      if (poll.endDate < currentDate && poll.isActive) {
        poll.isActive = false;
        await poll.save();
      }
    }

    res.status(200).json({
      success: true,
      count: polls.length,
      data: polls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single poll
// @route   GET /api/polls/:id
// @access  Public
exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate('createdBy', 'name email department')
      .populate('club', 'name logo')
      .populate('options.votes', 'name email');

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new poll
// @route   POST /api/polls
// @access  Private
exports.createPoll = async (req, res) => {
  try {
    const { question, description, options, category, type, endDate, allowAnonymous, visibility, club } = req.body;

    // Validate options
    if (!options || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Poll must have at least 2 options',
      });
    }

    // If club poll, verify user is club member
    if (club) {
      const clubDoc = await Club.findById(club);
      if (!clubDoc) {
        return res.status(404).json({
          success: false,
          message: 'Club not found',
        });
      }

      const isMember = clubDoc.members.some(m => m.user.toString() === req.user.id);
      if (!isMember && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only club members can create club polls',
        });
      }
    }

    const formattedOptions = options.map(opt => ({
      text: typeof opt === 'string' ? opt : opt.text,
      votes: [],
    }));

    // Auto-approve if created by admin or faculty (staff), otherwise require approval
    const isApproved = req.user.role === 'admin' || req.user.role === 'faculty';

    const poll = await Poll.create({
      question,
      description,
      options: formattedOptions,
      createdBy: req.user.id,
      category,
      type,
      endDate,
      allowAnonymous,
      visibility,
      club,
      isApproved,
    });

    await poll.populate('createdBy', 'name email');

    // Emit socket event only if auto-approved
    const io = req.app.get('io');
    if (io && isApproved) {
      io.emit('newPoll', poll);
    } else if (io && !isApproved) {
      // Notify admins about pending approval
      io.emitToRole('admin', 'pollPendingApproval', poll);
    }

    const message = isApproved 
      ? 'Poll created successfully!' 
      : 'Poll created successfully! Waiting for admin approval.';

    res.status(201).json({
      success: true,
      message,
      data: poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Vote on poll
// @route   POST /api/polls/:id/vote
// @access  Private
exports.votePoll = async (req, res) => {
  try {
    const { optionIds } = req.body; // Array of option IDs for multiple choice

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }

    // Check if poll is active
    if (!poll.isActive || poll.endDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Poll has ended',
      });
    }

    // Check if user already voted
    const hasVoted = poll.options.some(opt => 
      opt.votes.some(vote => vote.toString() === req.user.id)
    );

    if (hasVoted) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this poll',
      });
    }

    // Validate vote count based on poll type
    if (poll.type === 'single' && optionIds.length !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Single choice poll allows only one vote',
      });
    }

    // Add votes
    optionIds.forEach(optionId => {
      const option = poll.options.id(optionId);
      if (option) {
        option.votes.push(req.user.id);
      }
    });

    await poll.save();

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update poll
// @route   PUT /api/polls/:id
// @access  Private (Creator/Admin)
exports.updatePoll = async (req, res) => {
  try {
    let poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }

    // Check authorization
    if (poll.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this poll',
      });
    }

    // Don't allow updating if votes have been cast
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
    if (totalVotes > 0 && (req.body.options || req.body.type)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify options or type after votes have been cast',
      });
    }

    poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Close poll
// @route   PUT /api/polls/:id/close
// @access  Private (Creator/Admin)
exports.closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }

    // Check authorization
    if (poll.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    poll.isActive = false;
    await poll.save();

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete poll
// @route   DELETE /api/polls/:id
// @access  Private (Creator/Admin)
exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }

    // Check authorization
    if (poll.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await poll.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Poll deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pending polls (Admin only)
// @route   GET /api/polls/pending
// @access  Private (Admin)
exports.getPendingPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ isApproved: false })
      .populate('createdBy', 'name email department')
      .populate('club', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: polls.length,
      data: polls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve poll (Admin only)
// @route   PUT /api/polls/:id/approve
// @access  Private (Admin)
exports.approvePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('createdBy', 'name email department');

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }

    // Emit socket event to all users
    const io = req.app.get('io');
    if (io) {
      io.emit('pollApproved', poll);
    }

    res.status(200).json({
      success: true,
      message: 'Poll approved successfully',
      data: poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject poll (Admin only)
// @route   PUT /api/polls/:id/reject
// @access  Private (Admin)
exports.rejectPoll = async (req, res) => {
  try {
    const { reason } = req.body;

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }

    // Notify the creator about rejection
    const io = req.app.get('io');
    if (io) {
      io.emitToUser(poll.createdBy.toString(), 'pollRejected', {
        poll: poll.question,
        reason: reason || 'No reason provided',
      });
    }

    // Delete the rejected poll
    await poll.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Poll rejected and removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
