const { GoogleGenerativeAI } = require('@google/generative-ai');
const Event = require('../models/Event');
const LostItem = require('../models/LostItem');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for campus-specific chatbot
const SYSTEM_PROMPT = `You are a helpful AI assistant for Smart Campus KLH (KL University). Your role is to help students, faculty, and staff with campus-related queries.

You can help with:
- Information about campus events and their timings
- Lost & found items status and how to report items
- How to submit feedback or suggestions
- General campus information and FAQs
- Navigation and location of campus facilities
- Academic schedules and important dates
- Campus services and amenities

Guidelines:
- Be friendly, professional, and concise
- If you don't know something specific about the campus, suggest contacting the administration
- For real-time information (like current events or lost items), advise users to check the respective sections in the portal
- Provide step-by-step guidance when explaining processes
- Always prioritize student and staff safety and well-being

Keep your responses clear, helpful, and relevant to campus life.`;

// Helper function to fetch relevant campus data
const getCampusData = async (message) => {
  const lowerMessage = message.toLowerCase();
  let contextData = '';

  try {
    // Fetch events data if query is about events
    if (lowerMessage.includes('event') || lowerMessage.includes('workshop') || 
        lowerMessage.includes('seminar') || lowerMessage.includes('happening')) {
      const events = await Event.find({ 
        date: { $gte: new Date() } 
      })
      .sort({ date: 1 })
      .limit(10)
      .populate('organizer', 'name department')
      .select('title description date location category maxAttendees registeredUsers');

      if (events.length > 0) {
        contextData += '\n\n=== CURRENT EVENTS IN DATABASE ===\n';
        events.forEach((event, index) => {
          const eventDate = new Date(event.date).toLocaleDateString();
          const spotsLeft = event.maxAttendees - event.registeredUsers.length;
          contextData += `\n${index + 1}. ${event.title}`;
          contextData += `\n   Date: ${eventDate}`;
          contextData += `\n   Location: ${event.location}`;
          contextData += `\n   Category: ${event.category}`;
          contextData += `\n   Description: ${event.description}`;
          contextData += `\n   Available Spots: ${spotsLeft}/${event.maxAttendees}`;
          if (event.organizer) {
            contextData += `\n   Organizer: ${event.organizer.name} (${event.organizer.department})`;
          }
          contextData += '\n';
        });
      }
    }

    // Fetch lost & found data
    if (lowerMessage.includes('lost') || lowerMessage.includes('found') || lowerMessage.includes('item')) {
      const lostItems = await LostItem.find({ 
        status: 'active',
        type: 'lost'
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('reportedBy', 'name')
      .select('title description category location date');

      const foundItems = await LostItem.find({ 
        status: 'active',
        type: 'found'
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('reportedBy', 'name')
      .select('title description category location date');

      if (lostItems.length > 0) {
        contextData += '\n\n=== RECENTLY LOST ITEMS ===\n';
        lostItems.forEach((item, index) => {
          contextData += `\n${index + 1}. ${item.title}`;
          contextData += `\n   Category: ${item.category}`;
          contextData += `\n   Location: ${item.location}`;
          contextData += `\n   Description: ${item.description}`;
          contextData += `\n   Date: ${new Date(item.date).toLocaleDateString()}`;
          contextData += '\n';
        });
      }

      if (foundItems.length > 0) {
        contextData += '\n\n=== RECENTLY FOUND ITEMS ===\n';
        foundItems.forEach((item, index) => {
          contextData += `\n${index + 1}. ${item.title}`;
          contextData += `\n   Category: ${item.category}`;
          contextData += `\n   Location: ${item.location}`;
          contextData += `\n   Description: ${item.description}`;
          contextData += `\n   Date: ${new Date(item.date).toLocaleDateString()}`;
          contextData += '\n';
        });
      }
    }

    // Fetch feedback statistics
    if (lowerMessage.includes('feedback') || lowerMessage.includes('suggestion') || lowerMessage.includes('complaint')) {
      const feedbackStats = await Feedback.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
            }
          }
        }
      ]);

      if (feedbackStats.length > 0) {
        contextData += '\n\n=== FEEDBACK STATISTICS ===\n';
        feedbackStats.forEach(stat => {
          contextData += `\n${stat._id}: ${stat.count} total (${stat.pending} pending, ${stat.resolved} resolved)`;
        });
        contextData += '\n';
      }

      const recentFeedback = await Feedback.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('category message status priority createdAt');

      if (recentFeedback.length > 0) {
        contextData += '\n\n=== RECENT FEEDBACK ===\n';
        recentFeedback.forEach((fb, index) => {
          contextData += `\n${index + 1}. Category: ${fb.category}, Priority: ${fb.priority}, Status: ${fb.status}`;
          contextData += `\n   Message: ${fb.message.substring(0, 100)}${fb.message.length > 100 ? '...' : ''}`;
          contextData += '\n';
        });
      }
    }

    // Fetch user statistics
    if (lowerMessage.includes('student') || lowerMessage.includes('faculty') || lowerMessage.includes('user')) {
      const userStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      if (userStats.length > 0) {
        contextData += '\n\n=== USER STATISTICS ===\n';
        userStats.forEach(stat => {
          contextData += `${stat._id}: ${stat.count} users\n`;
        });
      }
    }

  } catch (error) {
    console.error('Error fetching campus data:', error);
  }

  return contextData;
};

// @desc    Send message to chatbot
// @route   POST /api/chatbot/query
// @access  Private
exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    // Fetch relevant campus data based on the message
    const campusData = await getCampusData(message);

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });

    // Prepare the conversation context
    let prompt = SYSTEM_PROMPT;
    
    // Add real campus data to the context
    if (campusData) {
      prompt += '\n\n=== REAL-TIME CAMPUS DATA ===';
      prompt += '\nUse this actual data from the campus database to answer user questions:';
      prompt += campusData;
      prompt += '\n\nIMPORTANT: When user asks about events, lost items, or feedback, use the REAL data provided above, not generic responses.';
    }
    
    prompt += '\n\n=== CONVERSATION ===\n';
    
    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }
    
    // Add current message
    prompt += `User: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      data: {
        message: text,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate response. Please try again.',
    });
  }
};

// @desc    Get chatbot suggestions/quick responses
// @route   GET /api/chatbot/suggestions
// @access  Public
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      {
        id: 1,
        text: 'What events are happening this week?',
        category: 'events',
      },
      {
        id: 2,
        text: 'How do I report a lost item?',
        category: 'lost-found',
      },
      {
        id: 3,
        text: 'How can I submit feedback?',
        category: 'feedback',
      },
      {
        id: 4,
        text: 'Where is the library located?',
        category: 'navigation',
      },
      {
        id: 5,
        text: 'What are the cafeteria timings?',
        category: 'facilities',
      },
      {
        id: 6,
        text: 'How do I register for an event?',
        category: 'events',
      },
    ];

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get FAQs
// @route   GET /api/chatbot/faqs
// @access  Public
exports.getFAQs = async (req, res) => {
  try {
    const faqs = [
      {
        id: 1,
        question: 'How do I register for campus events?',
        answer:
          'Navigate to the Events section, browse available events, and click the "Register" button on events that require registration.',
        category: 'events',
      },
      {
        id: 2,
        question: 'What should I do if I lose something on campus?',
        answer:
          'Go to the Lost & Found section and create a "Lost Item" report with details about your item. You can also search for found items that match your description.',
        category: 'lost-found',
      },
      {
        id: 3,
        question: 'How can I submit feedback or suggestions?',
        answer:
          'Visit the Feedback section from your dashboard and fill out the feedback form. You can choose to submit anonymously if preferred.',
        category: 'feedback',
      },
      {
        id: 4,
        question: 'Who can create events on the platform?',
        answer:
          'Faculty members and administrators can create and manage campus events. Students can view and register for events.',
        category: 'events',
      },
      {
        id: 5,
        question: 'How do I update my profile information?',
        answer:
          'Click on your profile icon in the top right corner and select "Profile Settings" to update your information.',
        category: 'profile',
      },
    ];

    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
