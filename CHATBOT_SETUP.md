# Chatbot Setup Guide

## Overview
The Smart Campus chatbot is powered by Google's Gemini AI and provides intelligent assistance for campus-related queries.

## Features
- 🤖 AI-powered responses using Google Gemini 1.5 Flash
- 💬 Contextual conversation history
- 📋 Quick suggestions for common queries
- ❓ FAQs about campus services
- 🎨 Beautiful UI with smooth animations
- 📱 Responsive design for all devices

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated API key

### 2. Configure Backend

1. Open `backend/.env` file
2. Add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Test the Chatbot

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Login to the application
4. Click the chat icon in the bottom-right corner
5. Try asking questions like:
   - "What events are happening this week?"
   - "How do I report a lost item?"
   - "Where is the library?"

## Chatbot Capabilities

The chatbot can help with:

### Campus Events
- Event schedules and timings
- Registration process
- Event locations

### Lost & Found
- How to report lost items
- How to claim found items
- Checking item status

### Feedback & Grievances
- How to submit feedback
- Anonymous submission process
- Status tracking

### Campus Navigation
- Building locations
- Facility information
- Department contacts

### General Information
- Academic schedules
- Campus services
- FAQs

## API Endpoints

### Public Endpoints
- `GET /api/chatbot/suggestions` - Get quick query suggestions
- `GET /api/chatbot/faqs` - Get frequently asked questions

### Protected Endpoints (Requires Authentication)
- `POST /api/chatbot/query` - Send message to chatbot
  ```json
  {
    "message": "What events are happening?",
    "conversationHistory": [
      {
        "role": "user",
        "content": "Previous message"
      },
      {
        "role": "assistant",
        "content": "Previous response"
      }
    ]
  }
  ```

## Customization

### Update System Prompt

Edit `backend/controllers/chatbotController.js`:

```javascript
const SYSTEM_PROMPT = `You are a helpful AI assistant for Smart Campus KLH...
// Customize this to match your campus needs
`;
```

### Add More Suggestions

Edit the `getSuggestions` function in `backend/controllers/chatbotController.js`:

```javascript
const suggestions = [
  {
    id: 1,
    text: 'Your custom suggestion',
    category: 'custom-category',
  },
  // Add more suggestions
];
```

### Customize UI

Edit `frontend/src/components/chatbot/Chatbot.jsx` to modify:
- Colors and themes
- Avatar styles
- Message bubble designs
- Animation effects

## Troubleshooting

### Chatbot Not Responding

1. **Check API Key**: Ensure `GEMINI_API_KEY` is set in `.env`
2. **Check Console**: Look for errors in browser console and server logs
3. **Verify Backend**: Make sure backend is running on port 5000
4. **Test API**: Try hitting `/api/chatbot/suggestions` directly

### API Key Error

```
Error: GEMINI_API_KEY is not defined
```

**Solution**: Add the API key to `backend/.env`:
```env
GEMINI_API_KEY=your_key_here
```

### CORS Issues

If you get CORS errors:
1. Check `FRONTEND_URL` in `.env`
2. Ensure it matches your frontend URL (default: `http://localhost:5173`)

### Slow Responses

- Gemini API may take 2-5 seconds to respond
- This is normal for AI generation
- Loading indicator shows while waiting

## Best Practices

1. **Conversation Context**: The chatbot keeps last 10 messages for context
2. **Clear Messages**: Use the "X" button to clear conversation history
3. **Specific Questions**: Ask specific questions for better responses
4. **Use Suggestions**: Click suggested questions for common queries

## Security Notes

- ⚠️ Never commit `.env` file with real API keys
- ⚠️ Use environment variables in production
- ⚠️ Chatbot endpoint is protected (requires authentication)
- ⚠️ Implement rate limiting in production

## Cost Considerations

Google Gemini API has:
- Free tier with request limits
- Pay-as-you-go pricing beyond free tier
- Monitor usage in Google Cloud Console

For production:
- Set up usage alerts
- Implement request caching
- Add rate limiting per user

## Future Enhancements

Possible improvements:
- [ ] Voice input/output
- [ ] File attachment support
- [ ] Multi-language support
- [ ] Sentiment analysis
- [ ] Analytics dashboard
- [ ] Integration with campus database for real-time data
- [ ] Proactive notifications
- [ ] Chat history persistence

## Support

For issues or questions:
- Check server logs: `backend/logs`
- Check browser console for frontend errors
- Review API responses in Network tab
- Test API endpoints with Postman

## License

This chatbot integration is part of the Smart Campus KLH project.
