(function () {
    'use strict';

    const currentScript = document.currentScript || document.querySelector('script[data-api]');
    const config = {
        apiUrl: currentScript?.getAttribute('data-api') || 'http://localhost:3000',
        tenant: currentScript?.getAttribute('data-tenant') || 'default',
        botAvatar: currentScript?.getAttribute('data-bot-avatar') || null
    };

    function injectStyles() {
        const styleId = 'chatbot-widget-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Chatbot Widget Styles */
            :root {
                --chatbot-primary: #6366f1;
                --chatbot-primary-hover: #4f46e5;
                --chatbot-bg: #ffffff;
                --chatbot-text-main: #1f2937;
                --chatbot-text-secondary: #6b7280;
                --chatbot-user-msg-bg: #6366f1;
                --chatbot-user-msg-text: #ffffff;
                --chatbot-bot-msg-bg: #e5e7eb;
                --chatbot-bot-msg-text: #1f2937;
            }

            /* Floating Chat Button */
            .chatbot-toggle-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: var(--chatbot-primary);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 999;
                font-family: system-ui, -apple-system, sans-serif;
            }

            .chatbot-toggle-btn:hover {
                background: var(--chatbot-primary-hover);
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
            }

            .chatbot-toggle-btn.chatbot-hidden {
                display: none;
            }

            /* Chat Widget Container */
            .chatbot-widget {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 380px;
                max-width: calc(100vw - 48px);
                height: 600px;
                max-height: calc(100vh - 100px);
                background: var(--chatbot-bg);
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 1000;
                transform: scale(0);
                transform-origin: bottom right;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                font-family: system-ui, -apple-system, sans-serif;
            }

            .chatbot-widget.chatbot-open {
                transform: scale(1);
                opacity: 1;
            }

            /* Chat Header */
            .chatbot-header {
                background: var(--chatbot-primary);
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                font-size: 1.125rem;
            }

            .chatbot-close-btn {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background 0.2s;
            }

            .chatbot-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            /* Messages Area */
            .chatbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }

            .chatbot-messages::-webkit-scrollbar-thumb {
                background-color: #d1d5db;
                border-radius: 3px;
            }

            .chatbot-message {
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 0.95rem;
                line-height: 1.5;
                animation: chatbotFadeIn 0.3s ease;
            }

            .chatbot-message.chatbot-user {
                align-self: flex-end;
                background: var(--chatbot-user-msg-bg);
                color: var(--chatbot-user-msg-text);
                border-bottom-right-radius: 4px;
            }

            .chatbot-message.chatbot-bot {
                align-self: flex-start;
                background: var(--chatbot-bot-msg-bg);
                color: var(--chatbot-bot-msg-text);
                border-bottom-left-radius: 4px;
            }

            /* Typing Indicator */
            .chatbot-typing-indicator {
                align-self: flex-start;
                background: var(--chatbot-bot-msg-bg);
                padding: 10px 14px;
                border-radius: 12px;
                border-bottom-left-radius: 4px;
                display: flex;
                gap: 4px;
                align-items: center;
                max-width: 80px;
            }

            .chatbot-typing-indicator span {
                width: 8px;
                height: 8px;
                background-color: #6b7280;
                border-radius: 50%;
                display: inline-block;
                animation: chatbotTypingDot 1.4s infinite;
            }

            .chatbot-typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .chatbot-typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }

            /* Input Area */
            .chatbot-input-area {
                padding: 16px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 10px;
                background: #fff;
            }

            .chatbot-input {
                flex: 1;
                padding: 12px;
                border: 1px solid #d1d5db;
                border-radius: 24px;
                outline: none;
                font-size: 0.95rem;
                transition: border-color 0.2s;
                font-family: system-ui, -apple-system, sans-serif;
            }

            .chatbot-input:focus {
                border-color: var(--chatbot-primary);
            }

            .chatbot-send-btn {
                background: var(--chatbot-primary);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 24px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.2s;
                font-family: system-ui, -apple-system, sans-serif;
            }

            .chatbot-send-btn:hover {
                background: var(--chatbot-primary-hover);
            }

            .chatbot-send-btn:disabled {
                background: #9ca3af;
                cursor: not-allowed;
            }

            /* Animations */
            @keyframes chatbotFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes chatbotTypingDot {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.7;
                }
                30% {
                    transform: translateY(-10px);
                    opacity: 1;
                }
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .chatbot-widget {
                    width: calc(100vw - 32px);
                    height: calc(100vh - 100px);
                    bottom: 16px;
                    right: 16px;
                }

                .chatbot-toggle-btn {
                    bottom: 16px;
                    right: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function injectHTML() {
        const widgetId = 'chatbot-widget-container';
        if (document.getElementById(widgetId)) return;

        const container = document.createElement('div');
        container.id = widgetId;
        container.innerHTML = `
            <!-- Floating Chat Button -->
            <button id="chatbot-toggle-btn" class="chatbot-toggle-btn" aria-label="Abrir chat">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>

            <!-- Chat Widget -->
            <div class="chatbot-widget" id="chatbot-widget">
                <div class="chatbot-header">
                    <span>AI Assistant</span>
                    <button id="chatbot-close-btn" class="chatbot-close-btn" aria-label="Cerrar chat">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="chatbot-message chatbot-bot">¡Hola! ¿Cómo puedo ayudarte hoy?</div>
                </div>
                <div class="chatbot-input-area">
                    <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Escribe un mensaje..." autocomplete="off">
                    <button id="chatbot-send-btn" class="chatbot-send-btn">Enviar</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }

    class ChatWidget {
        constructor(config) {
            this.config = config;
            this.messagesContainer = document.getElementById('chatbot-messages');
            this.inputField = document.getElementById('chatbot-input');
            this.sendButton = document.getElementById('chatbot-send-btn');
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

            this.showTypingIndicator();

            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage("Hola, soy un bot", "bot");
                this.setLoading(false);
            }, 2000);

            // TODO: Implement real API call
            // try {
            //     const response = await fetch(`${this.config.apiUrl}/api/chat`, {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({
            //             message: text,
            //             history: this.history,
            //             tenant: this.config.tenant
            //         })
            //     });
            //
            //     const data = await response.json();
            //
            //     if (data.success) {
            //         this.hideTypingIndicator();
            //         this.addMessage(data.response, 'bot');
            //         this.history.push({ role: 'user', content: text });
            //         this.history.push({ role: 'assistant', content: data.response });
            //     } else {
            //         this.hideTypingIndicator();
            //         this.addMessage('Error: ' + data.error, 'bot');
            //     }
            // } catch (error) {
            //     this.hideTypingIndicator();
            //     this.addMessage('Lo siento, algo salió mal.', 'bot');
            //     console.error(error);
            // } finally {
            //     this.setLoading(false);
            // }
        }

        addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chatbot-message', `chatbot-${sender}`);
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

        showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('chatbot-typing-indicator');
            typingDiv.id = 'chatbot-typing-indicator';
            typingDiv.innerHTML = '<span></span><span></span><span></span>';
            this.messagesContainer.appendChild(typingDiv);
            this.scrollToBottom();
        }

        hideTypingIndicator() {
            const typingDiv = document.getElementById('chatbot-typing-indicator');
            if (typingDiv) {
                typingDiv.remove();
            }
        }
    }

    function initWidget() {
        injectStyles();
        injectHTML();

        const chatWidget = new ChatWidget(config);

        const toggleBtn = document.getElementById('chatbot-toggle-btn');
        const closeBtn = document.getElementById('chatbot-close-btn');
        const widget = document.getElementById('chatbot-widget');

        if (toggleBtn && widget) {
            toggleBtn.addEventListener('click', () => {
                widget.classList.add('chatbot-open');
                toggleBtn.classList.add('chatbot-hidden');
            });
        }

        if (closeBtn && widget) {
            closeBtn.addEventListener('click', () => {
                widget.classList.remove('chatbot-open');
                if (toggleBtn) {
                    toggleBtn.classList.remove('chatbot-hidden');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

})();
