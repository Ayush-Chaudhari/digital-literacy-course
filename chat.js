// Import configuration
import config from './config.js';

// Chat functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('send-button');
    const voiceInputButton = document.getElementById('voice-input');
    const voiceOutputButton = document.getElementById('voice-output');
    const clearChatButton = document.getElementById('clear-chat');
    const themeToggle = document.getElementById('theme-toggle');
    const chatContainer = document.querySelector('.chat-container');
    const typingIndicator = document.getElementById('typingIndicator');

    // Gemini API configuration
    const GEMINI_API_KEY = config.GEMINI_API_KEY;
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // Speech recognition setup
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    // Speech synthesis setup
    const synth = window.speechSynthesis;
    let isVoiceOutputEnabled = false;

    // Theme state
    let isDarkTheme = false;

    // Initialize chat
    function initChat() {
        // Add welcome message
        addMessage('bot', 'Hello! I\'m your AI assistant. How can I help you today?');
        
        // Load chat history from localStorage
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.forEach(msg => {
            addMessage(msg.role, msg.content, false);
        });
    }

    // Function to add a message to the chat
    function addMessage(role, content, saveToHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Save to history
        if (saveToHistory) {
            const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
            chatHistory.push({ role, content });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }

        // Speak message if voice output is enabled
        if (role === 'bot' && isVoiceOutputEnabled) {
            speakMessage(content);
        }
    }

    // Show/hide typing indicator
    function toggleTypingIndicator(show) {
        typingIndicator.style.display = show ? 'flex' : 'none';
    }

    // Generate response using Gemini API
    async function generateResponse(userMessage) {
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: userMessage
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error generating response:', error);
            return 'I apologize, but I\'m having trouble generating a response right now. Please try again later.';
        }
    }

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        
        if (message) {
            // Add user message
            addMessage('user', message);
            messageInput.value = '';

            // Show typing indicator
            toggleTypingIndicator(true);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Generate and add bot response
            const response = await generateResponse(message);
            toggleTypingIndicator(false);
            addMessage('bot', response);
        }
    });

    // Handle keyboard navigation
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Voice input functionality
    voiceInputButton.addEventListener('click', () => {
        if (voiceInputButton.classList.contains('active')) {
            recognition.stop();
            voiceInputButton.classList.remove('active');
        } else {
            recognition.start();
            voiceInputButton.classList.add('active');
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        messageInput.value = transcript;
        voiceInputButton.classList.remove('active');
        sendButton.click();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceInputButton.classList.remove('active');
    };

    // Voice output functionality
    voiceOutputButton.addEventListener('click', () => {
        isVoiceOutputEnabled = !isVoiceOutputEnabled;
        voiceOutputButton.classList.toggle('active');
    });

    function speakMessage(message) {
        if (isVoiceOutputEnabled) {
            const utterance = new SpeechSynthesisUtterance(message);
            synth.speak(utterance);
        }
    }

    // Clear chat functionality
    clearChatButton.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        localStorage.removeItem('chatHistory');
        addMessage('bot', 'Chat history cleared. How can I help you?');
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        themeToggle.classList.toggle('active');
        chatContainer.classList.toggle('dark-theme');
    });

    // Initialize chat
    initChat();
}); 