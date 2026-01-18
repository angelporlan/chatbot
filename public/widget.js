class ChatWidget {
    constructor() {
        this.messagesContainer = document.getElementById('chat-messages');
        this.inputField = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-btn');
        this.history = [];

        this.init();
    }

    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    async sendMessage() {
        const text = this.inputField.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.inputField.value = '';
        this.setLoading(true);

        setTimeout(() => {
            this.addMessage("Hola, soy un bot", "bot");
            this.setLoading(false);
        }, 2000);

        // for testing

        // try {
        //     const response = await fetch('/api/chat', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             message: text,
        //             history: this.history
        //         })
        //     });

        //     const data = await response.json();

        //     if (data.success) {
        //         this.addMessage(data.response, 'bot');
        //         this.history.push({ role: 'user', content: text });
        //         this.history.push({ role: 'assistant', content: data.response });
        //     } else {
        //         this.addMessage('Error: ' + data.error, 'bot');
        //     }
        // } catch (error) {
        //     this.addMessage('Sorry, something went wrong.', 'bot');
        //     console.error(error);
        // } finally {
        //     this.setLoading(false);
        // }
    }

    addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();
    }

    setLoading(isLoading) {
        this.sendButton.disabled = isLoading;
        this.inputField.disabled = isLoading;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});
