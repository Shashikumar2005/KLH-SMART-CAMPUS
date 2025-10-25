const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Prepare the conversation context
    let prompt = SYSTEM_PROMPT + '\n\n';
    
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
