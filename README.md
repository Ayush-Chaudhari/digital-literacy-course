# Digital Literacy Hub

A comprehensive platform for learning digital skills, featuring interactive tutorials, AI-powered chat assistance, and accessibility features.

## Features

- Interactive Tutorials
- AI Chat Assistant
- Accessibility Tools
- Multi-language Support
- Voice Input/Output
- Responsive Design

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/digital-literacy-hub.git
cd digital-literacy-hub
```

2. Create a `config.js` file in the root directory and add your API keys:
```javascript
const config = {
    GEMINI_API_KEY: 'your_api_key_here'
};
```

3. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Project Structure

```
digital-literacy-hub/
├── index.html
├── tutorials.html
├── chat.html
├── feedback.html
├── blog.html
├── css/
│   ├── styles.css
│   ├── accessibility.css
│   ├── chat.css
│   └── tutorials.css
├── js/
│   ├── chat.js
│   └── accessibility.js
└── config.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI chat functionality
- Font Awesome for icons
- Google Translate API for language support 