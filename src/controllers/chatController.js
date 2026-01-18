const chatService = require('../services/chatservice');

exports.sendMessage = async (req, res, next) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            const error = new Error('Message field is required');
            error.statusCode = 400;
            throw error;
        }

        const response = await chatService.processMessage(message, history);

        res.json({
            success: true,
            response: response,
        });
    } catch (error) {
        next(error);
    }
};
