// Firebase configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('successMessage');

    // Handle form submission
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            ageGroup: document.getElementById('ageGroup').value,
            rating: document.querySelector('input[name="rating"]:checked')?.value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        try {
            // Save to Firebase
            await database.ref('feedback').push(formData);

            // Show success message
            feedbackForm.style.display = 'none';
            successMessage.style.display = 'flex';

            // Reset form
            feedbackForm.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
                feedbackForm.style.display = 'flex';
            }, 5000);

        } catch (error) {
            console.error('Error saving feedback:', error);
            alert('Sorry, there was an error submitting your feedback. Please try again.');
        }
    });

    // Star rating hover effect
    const starLabels = document.querySelectorAll('.star-rating label');
    starLabels.forEach(label => {
        label.addEventListener('mouseover', function() {
            const rating = this.previousElementSibling.value;
            updateStarColors(rating);
        });
    });

    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
        updateStarColors(selectedRating || 0);
    });

    function updateStarColors(rating) {
        starLabels.forEach(label => {
            const starValue = label.previousElementSibling.value;
            label.style.color = starValue <= rating ? '#ffd700' : '#ddd';
        });
    }

    // Form validation
    const formInputs = feedbackForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('invalid');
        });

        input.addEventListener('input', function() {
            this.classList.remove('invalid');
        });
    });

    // Accessibility: Keyboard navigation for star rating
    const starInputs = document.querySelectorAll('.star-rating input');
    starInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const currentIndex = Array.from(starInputs).indexOf(this);
                const nextIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;
                
                if (nextIndex >= 0 && nextIndex < starInputs.length) {
                    starInputs[nextIndex].focus();
                    starInputs[nextIndex].checked = true;
                    updateStarColors(starInputs[nextIndex].value);
                }
            }
        });
    });
}); 