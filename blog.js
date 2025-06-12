document.addEventListener('DOMContentLoaded', function() {
    // Category Filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const articles = document.querySelectorAll('.blog-article');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.dataset.category;

            // Filter articles
            articles.forEach(article => {
                if (selectedCategory === 'all' || article.dataset.category === selectedCategory) {
                    article.style.display = 'grid';
                    // Trigger AOS refresh for smooth animation
                    article.classList.remove('aos-animate');
                    setTimeout(() => {
                        article.classList.add('aos-animate');
                    }, 100);
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            // Here you would typically send this to your backend
            // For now, we'll just show a success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for subscribing!';
            successMessage.style.cssText = `
                background: #2ecc71;
                color: white;
                padding: 1rem;
                border-radius: 5px;
                margin-top: 1rem;
                text-align: center;
            `;

            // Remove any existing success message
            const existingMessage = this.querySelector('.success-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Add the success message
            this.appendChild(successMessage);

            // Clear the input
            emailInput.value = '';

            // Remove the success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }

    // Keyboard Navigation for Category Buttons
    categoryButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Accessibility: Focus Management
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    });
}); 