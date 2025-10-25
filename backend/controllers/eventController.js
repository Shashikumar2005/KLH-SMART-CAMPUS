const Event = require('../models/Event');
const cloudinary = require('../config/cloudinary');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    
    let query = { isActive: true };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email department')
      .populate('registeredUsers', 'name email department role')
      .populate('interestedUsers', 'name email department role')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email department')
      .populate('registeredUsers', 'name email department role studentId')
      .populate('interestedUsers', 'name email department role studentId');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Faculty/Admin)
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      department,
      registrationRequired,
      maxParticipants,
    } = req.body;

    let imageUrl = '';

    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'smart-campus/events',
      });
      imageUrl = result.secure_url;
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      organizer: req.user.id,
      organizerName: req.user.name,
      department,
      image: imageUrl,
      registrationRequired,
      maxParticipants,
    });

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    io.emit('newEvent', event);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Faculty/Admin or Owner)
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Handle image upload if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'smart-campus/events',
      });
      req.body.image = result.secure_url;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Emit socket event for update
    const io = req.app.get('io');
    io.emit('eventUpdated', event);

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Faculty/Admin or Owner)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (!event.registrationRequired) {
      return res.status(400).json({
        success: false,
        message: 'This event does not require registration',
      });
    }

    // Check if already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event',
      });
    }

    // Check if event is full
    if (
      event.maxParticipants &&
      event.registeredUsers.length >= event.maxParticipants
    ) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    event.registeredUsers.push(req.user.id);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unregister from event
// @route   POST /api/events/:id/unregister
// @access  Private
exports.unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if registered
    if (!event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Not registered for this event',
      });
    }

    event.registeredUsers = event.registeredUsers.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark interest in event
// @route   POST /api/events/:id/interested
// @access  Private
exports.markInterested = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if already interested
    if (event.interestedUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already marked as interested',
      });
    }

    event.interestedUsers.push(req.user.id);
    await event.save();

    // Populate the event with user details
    await event.populate('interestedUsers', 'name email department role');
    await event.populate('organizer', 'name email department');
    await event.populate('registeredUsers', 'name email department role');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('eventUpdated', event);
    }

    res.status(200).json({
      success: true,
      message: 'Marked as interested',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unmark interest in event
// @route   POST /api/events/:id/uninterested
// @access  Private
exports.unmarkInterested = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if interested
    if (!event.interestedUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Not marked as interested',
      });
    }

    event.interestedUsers = event.interestedUsers.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await event.save();

    // Populate the event with user details
    await event.populate('interestedUsers', 'name email department role');
    await event.populate('organizer', 'name email department');
    await event.populate('registeredUsers', 'name email department role');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('eventUpdated', event);
    }

    res.status(200).json({
      success: true,
      message: 'Removed interest',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
