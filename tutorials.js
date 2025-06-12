document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('tutorialVideo');
    const closeModal = document.querySelector('.close-modal');
    const watchButtons = document.querySelectorAll('.watch-button');

    // Function to open modal with video
    function openVideoModal(videoId) {
        videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Function to close modal
    function closeVideoModal() {
        modal.style.display = 'none';
        videoFrame.src = ''; // Stop video playback
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }

    // Event listeners for watch buttons
    watchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                openVideoModal(videoId);
            }
        });
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', closeVideoModal);

    // Close modal when clicking outside the video
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeVideoModal();
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeVideoModal();
        }
    });

    // Handle keyboard navigation for watch buttons
    watchButtons.forEach(button => {
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const videoId = this.getAttribute('data-video-id');
                if (videoId) {
                    openVideoModal(videoId);
                }
            }
        });
    });

    // Category Filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const tutorials = document.querySelectorAll('.tutorial-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            const selectedCategory = button.dataset.category;

            // Filter tutorials
            tutorials.forEach(tutorial => {
                if (selectedCategory === 'all' || tutorial.dataset.category === selectedCategory) {
                    tutorial.style.display = 'block';
                    // Trigger AOS refresh for smooth animation
                    tutorial.classList.remove('aos-animate');
                    setTimeout(() => {
                        tutorial.classList.add('aos-animate');
                    }, 100);
                } else {
                    tutorial.style.display = 'none';
                }
            });
        });
    });

    // Keyboard Navigation for Category Buttons
    categoryButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Tutorial Start Buttons
    const startButtons = document.querySelectorAll('.start-tutorial-btn');
    startButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tutorialTitle = button.closest('.tutorial-card').querySelector('h2').textContent;
            // Here you would typically navigate to the tutorial page
            // For now, we'll just show an alert
            alert(`Starting tutorial: ${tutorialTitle}`);
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

    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
}); 