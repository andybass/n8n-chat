// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--header-color: var(--n8n-chat-header-color, #333333);
            --chat--header-background-color: var(--n8n-chat-header-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
            background-color: var(--chat--header-background-color);
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            height: 32px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--header-color);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .message-content {
            width: 100%;
        }

        .n8n-chat-widget .message-content br {
            display: block;
            margin: 5px 0;
            content: "";
        }

        .n8n-chat-widget .list-item {
            margin: 5px 0;
            display: flex;
            align-items: flex-start;
        }

        .n8n-chat-widget .list-item.numbered {
            padding-left: 5px;
        }

        .n8n-chat-widget .list-item.bulleted {
            padding-left: 5px;
        }

        .n8n-chat-widget .list-number, 
        .n8n-chat-widget .list-bullet {
            margin-right: 5px;
            font-weight: 500;
            min-width: 20px;
            display: inline-block;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            margin-top: 20px;
        }

        .n8n-chat-widget .agent-avatar {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid var(--chat--color-background);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            background-color: var(--chat--color-background);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .agent-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        /* Typing indicator styles */
        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80px;
            align-self: flex-start;
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .typing-indicator span {
            height: 8px;
            width: 8px;
            float: left;
            margin: 0 1px;
            background-color: var(--chat--color-primary);
            display: block;
            border-radius: 50%;
            opacity: 0.4;
        }

        .n8n-chat-widget .typing-indicator span:nth-of-type(1) {
            animation: typing 1s infinite;
        }

        .n8n-chat-widget .typing-indicator span:nth-of-type(2) {
            animation: typing 1s infinite 0.2s;
        }

        .n8n-chat-widget .typing-indicator span:nth-of-type(3) {
            animation: typing 1s infinite 0.4s;
        }

        @keyframes typing {
            0% {
                transform: translateY(0px);
                opacity: 0.4;
            }
            50% {
                transform: translateY(-5px);
                opacity: 0.8;
            }
            100% {
                transform: translateY(0px);
                opacity: 0.4;
            }
        }

        .n8n-chat-widget .message-content strong {
            font-weight: 600;
        }

        .n8n-chat-widget .message-content em {
            font-style: italic;
        }

        .n8n-chat-widget .message-content code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            background-color: rgba(133, 79, 255, 0.1);
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 13px;
            color: var(--chat--color-primary);
        }

        .n8n-chat-widget .message-content pre {
            margin: 8px 0;
            width: 100%;
            overflow-x: auto;
        }

        .n8n-chat-widget .message-content pre code {
            display: block;
            background-color: rgba(133, 79, 255, 0.05);
            padding: 10px;
            border-radius: 6px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            white-space: pre-wrap;
            width: 100%;
        }

        .n8n-chat-widget .email-collection {
            display: none;
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            gap: 12px;
        }

        .n8n-chat-widget .email-collection.visible {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .email-collection p {
            margin: 0;
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.8;
        }

        .n8n-chat-widget .email-collection .email-input-group {
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .email-collection input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .email-collection input:focus {
            outline: none;
            border-color: var(--chat--color-primary);
            box-shadow: 0 0 0 2px rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .email-collection button {
            padding: 8px 16px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .email-collection button:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .email-collection button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .n8n-chat-widget .email-collection .error-message {
            color: #dc2626;
            font-size: 12px;
            margin-top: 4px;
            display: none;
        }

        .n8n-chat-widget .email-collection .error-message.visible {
            display: block;
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        transcript: {
            webhookUrl: '', // New configuration for transcript webhook
            includeMetadata: true // Whether to include metadata in the transcript
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            agentAvatar: '',
            poweredBy: {
                text: 'Powered by NetNerd Ventures',
                link: 'https://www.netnerdventures.com'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            headerBackgroundColor: '#333333',
            headerColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            transcript: { ...defaultConfig.transcript, ...window.ChatWidgetConfig.transcript },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
    widgetContainer.style.setProperty('--n8n-chat-header-background-color', config.style.headerBackgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-header-color', config.style.headerColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span class="brand-name">${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span class="brand-name">${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="email-collection">
                <p>Would you like to receive a follow-up response via email?</p>
                <div class="email-input-group">
                    <input type="email" placeholder="Enter your email address" />
                    <button type="button">Submit</button>
                </div>
                <div class="error-message">Please enter a valid email address</div>
            </div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    const emailCollection = chatContainer.querySelector('.email-collection');
    const emailInput = emailCollection.querySelector('input');
    const emailSubmitButton = emailCollection.querySelector('button');
    const emailErrorMessage = emailCollection.querySelector('.error-message');
    let userEmail = '';

    function generateUUID() {
        return crypto.randomUUID();
    }

    // Function to format message text with proper styling
    function formatMessageText(text) {
        if (!text) return '';
        
        // Replace line breaks with <br> tags
        let formattedText = text.replace(/\n/g, '<br>');
        
        // Format numbered lists (e.g., "1. Item" or "1) Item")
        formattedText = formattedText.replace(/(\d+[\.\)])\s+(.*?)(?=<br>|$)/g, '<div class="list-item numbered"><span class="list-number">$1</span> $2</div><br/>');
        
        // Format bullet points/unnumbered lists (e.g., "• Item" or "- Item" or "* Item")
        formattedText = formattedText.replace(/([•\-\*])\s+(.*?)(?=<br>|$)/g, '<div class="list-item bulleted"><span class="list-bullet">•</span> $2</div><br/>');
        
        // Format bold text (e.g., **bold** or __bold__)
        formattedText = formattedText.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong><br/>');
        
        // Format italic text (e.g., *italic* or _italic_)
        formattedText = formattedText.replace(/(\*|_)(.*?)\1/g, '<em>$2</em><br/>');
        
        // Format inline code (e.g., `code`)
        formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code><br/>');
        
        // Format code blocks (e.g., ```code block```)
        formattedText = formattedText.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre><br/>');
        
        return formattedText;
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        try {
            if (config.branding.name === '') {
                chatContainer.querySelector('.brand-name').style.display = 'none';
            }
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');
            
            // Show typing indicator
            showTypingIndicator();

            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            
            // Hide typing indicator
            hideTypingIndicator();

            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            
            // Add agent avatar if provided in config
            if (config.branding.agentAvatar) {
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'agent-avatar';
                const avatarImg = document.createElement('img');
                avatarImg.src = config.branding.agentAvatar;
                avatarImg.alt = 'Agent';
                avatarDiv.appendChild(avatarImg);
                botMessageDiv.appendChild(avatarDiv);
            }
            
            // Create a separate element for the message text with formatting
            const messageText = document.createElement('div');
            messageText.className = 'message-content';
            const responseText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            messageText.innerHTML = formatMessageText(responseText);
            botMessageDiv.appendChild(messageText);
            
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            // Hide typing indicator on error
            hideTypingIndicator();
            console.error('Error:', error);
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        
        // Show typing indicator
        showTypingIndicator();
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            // Hide typing indicator
            hideTypingIndicator();
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            
            // Add agent avatar if provided in config
            if (config.branding.agentAvatar) {
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'agent-avatar';
                const avatarImg = document.createElement('img');
                avatarImg.src = config.branding.agentAvatar;
                avatarImg.alt = 'Agent';
                avatarDiv.appendChild(avatarImg);
                botMessageDiv.appendChild(avatarDiv);
            }
            
            // Create a separate element for the message text with formatting
            const messageText = document.createElement('div');
            messageText.className = 'message-content';
            const responseText = Array.isArray(data) ? data[0].output : data.output;
            messageText.innerHTML = formatMessageText(responseText);
            botMessageDiv.appendChild(messageText);
            
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Check if the response indicates a need for follow-up
            if (responseText.toLowerCase().includes("i'll get back to you") || 
                responseText.toLowerCase().includes("i'll follow up") ||
                responseText.toLowerCase().includes("i'll email you")) {
                showEmailCollection();
            }
        } catch (error) {
            // Hide typing indicator on error
            hideTypingIndicator();
            console.error('Error:', error);
        }
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        typingIndicator.id = 'typing-indicator';
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Function to capture chat transcript
    function captureTranscript() {
        const messages = [];
        const messageElements = messagesContainer.querySelectorAll('.chat-message');
        
        messageElements.forEach(element => {
            const isUser = element.classList.contains('user');
            const messageContent = element.querySelector('.message-content') || element;
            const messageText = messageContent.textContent.trim();
            
            messages.push({
                role: isUser ? 'user' : 'assistant',
                content: messageText,
                timestamp: new Date().toISOString()
            });
        });

        return {
            sessionId: currentSessionId,
            messages: messages,
            metadata: {
                startTime: messages[0]?.timestamp,
                endTime: new Date().toISOString(),
                messageCount: messages.length,
                userAgent: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                userEmail: userEmail || null
            }
        };
    }

    // Function to send transcript to webhook
    async function sendTranscript(transcript) {
        if (!config.transcript.webhookUrl) return;

        try {
            await fetch(config.transcript.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transcript)
            });
        } catch (error) {
            console.error('Error sending transcript:', error);
        }
    }

    // Update close button handlers to send transcript
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const transcript = captureTranscript();
            await sendTranscript(transcript);
            chatContainer.classList.remove('open');
        });
    });

    // Also capture transcript when the page is unloaded
    window.addEventListener('beforeunload', async () => {
        if (chatContainer.classList.contains('open')) {
            const transcript = captureTranscript();
            // Use sendBeacon for more reliable sending during page unload
            if (config.transcript.webhookUrl) {
                navigator.sendBeacon(
                    config.transcript.webhookUrl,
                    JSON.stringify(transcript)
                );
            }
        }
    });

    // Function to validate email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Function to handle email submission
    function handleEmailSubmit() {
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            emailErrorMessage.classList.add('visible');
            return;
        }

        emailErrorMessage.classList.remove('visible');
        userEmail = email;
        emailCollection.classList.remove('visible');
        emailInput.value = '';
        emailSubmitButton.disabled = true;
    }

    // Add email submission handler
    emailSubmitButton.addEventListener('click', handleEmailSubmit);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleEmailSubmit();
        }
    });

    // Function to show email collection
    function showEmailCollection() {
        emailCollection.classList.add('visible');
        emailInput.focus();
    }
})();
