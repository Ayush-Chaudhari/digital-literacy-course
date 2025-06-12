document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing toolbar
    const existingToolbar = document.querySelector('.accessibility-toolbar');
    if (existingToolbar) {
        existingToolbar.remove();
    }

    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'accessibility-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Accessibility Options');
    toolbar.innerHTML = `
        <div class="toolbar-section">
            <label for="fontSize">Font Size:</label>
            <select id="fontSize" aria-label="Select font size">
                <option value="small">Small</option>
                <option value="medium" selected>Medium</option>
                <option value="large">Large</option>
            </select>
        </div>
        <div class="toolbar-section">
            <label for="language">Language:</label>
            <select id="language" aria-label="Select language">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
            </select>
        </div>
        <button class="voice-toggle" id="voiceToggle" aria-label="Toggle voice support">
            <i class="fas fa-microphone"></i>
            Voice Support
        </button>
    `;

    // Insert toolbar at the beginning of the body
    document.body.insertBefore(toolbar, document.body.firstChild);

    // Add Google Translate element
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    document.body.appendChild(translateDiv);

    // Initialize Google Translate
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    }

    // Load Google Translate API
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);

    // Font size handling
    const fontSizeSelect = document.getElementById('fontSize');
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    document.body.className = savedFontSize;
    fontSizeSelect.value = savedFontSize;

    fontSizeSelect.addEventListener('change', function() {
        const size = this.value;
        document.body.className = size;
        localStorage.setItem('fontSize', size);
    });

    // Language handling
    const languageSelect = document.getElementById('language');
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;

    languageSelect.addEventListener('change', function() {
        const lang = this.value;
        localStorage.setItem('language', lang);
        
        // Use Google Translate API
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = lang;
            select.dispatchEvent(new Event('change'));
        }
    });

    // Voice support
    const voiceToggle = document.getElementById('voiceToggle');
    let recognition = null;
    let synthesis = window.speechSynthesis;

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
    }

    voiceToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        const isActive = this.classList.contains('active');

        if (isActive) {
            if (recognition) {
                recognition.start();
            }
        } else {
            if (recognition) {
                recognition.stop();
            }
            synthesis.cancel();
        }
    });

    if (recognition) {
        recognition.onresult = function(event) {
            const text = event.results[0][0].transcript;
            const activeElement = document.activeElement;
            
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                activeElement.value = text;
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            voiceToggle.classList.remove('active');
        };
    }

    // Add voice input support to input fields
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (voiceToggle.classList.contains('active') && recognition) {
                recognition.start();
            }
        });
    });

    // Handle user preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
    }

    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.documentElement.classList.add('high-contrast');
    }
}); 