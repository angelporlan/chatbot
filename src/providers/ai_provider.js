const Groq = require('groq-sdk');
const config = require('../config');

class AIProvider {
    constructor() {
        this.groq = new Groq({
            apiKey: config.groq.apiKey,
        });
    }

    async generateResponse(messages) {
        try {
            const completion = await this.groq.chat.completions.create({
                messages: messages,
                model: 'openai/gpt-oss-20b',
                temperature: 0.7,
                max_tokens: 1024,
            });

            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Error in AIProvider:', error);
            throw new Error('Failed to generate AI response');
        }
    }
}

module.exports = new AIProvider();
