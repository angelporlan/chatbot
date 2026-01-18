const aiProvider = require('../providers/ai_provider');

class ChatService {
    /**
     * Process a user message and get a response from the AI.
     * @param {string} userMessage - The message sent by the user.
     * @param {Array} history - Previous conversation history (optional).
     * @returns {Promise<string>} - The AI response.
     */
    async processMessage(userMessage, history = []) {
        const systemMessage = {
            role: 'system',
            content: 'You are a helpful and friendly AI assistant for a chatbot widget. Keep your responses concise and engaging.',
        };

        const messages = [
            systemMessage,
            ...history,
            { role: 'user', content: userMessage },
        ];

        const response = await aiProvider.generateResponse(messages);

        return response;
    }
}

module.exports = new ChatService();
