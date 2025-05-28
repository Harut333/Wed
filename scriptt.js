// Wedding Site Main JavaScript

// --- RSVP FUNCTIONALITY ---

// Guest count function
function changeGuestCount(change) {
    const countDisplay = document.getElementById('guest-count');
    const hiddenInput = document.getElementById('guest-count-input');
    
    if (countDisplay && hiddenInput) {
        let currentCount = parseInt(countDisplay.textContent);
        
        // Update count with constraints (minimum 1, maximum 10)
        currentCount = Math.max(1, Math.min(10, currentCount + change));
        
        // Update display and hidden input
        countDisplay.textContent = currentCount;
        hiddenInput.value = currentCount;
    }
}

// --- POPUP FUNCTIONALITY ---

// Open popup
function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        popup.style.display = 'flex';
        setTimeout(() => {
            popup.classList.add('active');
        }, 10);
    }
}

// Close popup
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }, 400);
    }
}

// Initialize all on document ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize emailjs with your User ID
    emailjs.init("O-hLjhGu-wK1T6KdQ"); // Replace with your actual EmailJS user ID
    
    // Initialize sliders
    initializeSliders();
    
    // Set up popups
    setupPopups();
    
    // Handle RSVP form
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                // Get form values
                const name = document.getElementById('guest-name')?.value || '';
                const email = document.getElementById('guest-email')?.value || '';
                
                // Get selected radio button value
                let attendance = '';
                const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
                for (const radio of attendanceRadios) {
                    if (radio.checked) {
                        attendance = radio.value;
                        break;
                    }
                }
                
                // Get guest count
                const guestCountInput = document.getElementById('guest-count-input');
                const guestCount = guestCountInput ? guestCountInput.value : '1';
                
                // Prepare template parameters for emailjs
                const templateParams = {
                    name: name,
                    email: email,
                    attendance: attendance === 'yes' ? 'Attending' : 'Not Attending',
                    guestCount: guestCount
                };
                
                // Send email using emailjs
                emailjs.send('service_xi3rumr', 'template_zspccq8', templateParams)
                    .then(function(response) {
                        console.log('Email sent successfully:', response);
                        
                        // Show thank you message after successful email
                        showThankYouMessage();
                        
                    }, function(error) {
                        console.error('Failed to send email:', error);
                        alert('There was an error sending your RSVP. Please try again later.');
                    });
                
                // Function to show thank you message
                function showThankYouMessage() {
                    // Hide form elements
                    const formElements = rsvpForm.querySelectorAll('.form-group, .attendance-options, .guest-count-container, .submit-btn');
                    formElements.forEach(el => el.style.display = 'none');
                    
                    // Create thank you message
                    const thankYouMessage = document.createElement('div');
                    thankYouMessage.className = 'thank-you-message';
                    thankYouMessage.innerHTML = `
                        <h3>Thank You!</h3>
                        <p>${attendance === 'yes' 
                            ? 'Your RSVP has been received. We look forward to celebrating with you!' 
                            : 'Thank you for letting us know. We\'ll miss you!'}</p>
                        <button class="submit-btn close-btn">CLOSE</button>
                    `;
                    
                    rsvpForm.appendChild(thankYouMessage);
                    
                    // Add close button functionality
                    const closeBtn = thankYouMessage.querySelector('.close-btn');
                    closeBtn.addEventListener('click', function() {
                        closePopup('rsvp');
                        
                        // Reset form view for next time
                        setTimeout(() => {
                            thankYouMessage.remove();
                            formElements.forEach(el => el.style.display = '');
                            rsvpForm.reset();
                            
                            // Reset guest count
                            const guestCountDisplay = document.getElementById('guest-count');
                            if (guestCountDisplay) guestCountDisplay.textContent = '1';
                            if (guestCountInput) guestCountInput.value = '1';
                        }, 300);
                    });
                }
                
            } catch (error) {
                console.error('Error in RSVP submission:', error);
            }
        });
    }
});

// Set up all popup functionality
function setupPopups() {
    // Add close buttons to popups
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        const popupInner = popup.querySelector('.popup-inner');
        
        // Add close button if it doesn't exist
        if (popupInner && !popupInner.querySelector('.close')) {
            const closeButton = document.createElement('span');
            closeButton.className = 'close';
            closeButton.innerHTML = '&times;';
            closeButton.onclick = function() { 
                closePopup(popup.id);
            };
            popupInner.insertBefore(closeButton, popupInner.firstChild);
        }
        
        // Close when clicking outside content
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup(this.id);
            }
        });
    });
    
    // RSVP button to open popup
    const rsvpButtons = document.querySelectorAll('.rsvp-btn button, [onclick*="openPopup(\'rsvp\')"]');
    rsvpButtons.forEach(button => {
        button.addEventListener('click', function() {
            openPopup('rsvp');
        });
    });
}

// Initialize all sliders
function initializeSliders() {
    try {
        // Desktop banner slider
        const desktopSlider = new Swiper('.desktop-banner', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.desktop-banner .swiper-pagination',
                clickable: true
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1000
        });
        
        // Mobile banner slider
        const mobileSlider = new Swiper('.mobile-banner', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.mobile-banner .swiper-pagination',
                clickable: true
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
        
        // Event slider
        const eventSwiper = new Swiper('.event-swiper', {
            loop: false,
            pagination: {
              el: '.event-swiper .swiper-pagination',
              clickable: true
            }
        });
        
        // Memories slider
        const memoriesSwiper = new Swiper('.memories-swiper', {
            loop: true,
            pagination: {
              el: '.memories-swiper .swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }
        });
    } catch (error) {
        console.error('Error initializing sliders:', error);
    }
}