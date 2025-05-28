document.addEventListener('DOMContentLoaded', function() {
  // Initialize all sliders
  initializeSliders();
  setupEventListeners();
  
  // Add mobile video support
  const videos = document.querySelectorAll('video');
  
  videos.forEach(video => {
      // Set video properties for mobile
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.muted = true;
      
      // Force play on mobile
      video.addEventListener('loadeddata', function() {
          video.play().catch(e => {
              console.log('Autoplay prevented:', e);
          });
      });
      
      // Try to play when user touches the screen
      document.addEventListener('touchstart', function() {
          if (video.paused) {
              video.play().catch(e => {
                  console.log('Manual play failed:', e);
              });
          }
      }, { once: true });
  });
});

function initializeSliders() {
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
  
  // Mobile banner slider with completely different settings
  const mobileSlider = new Swiper('.mobile-banner', {
    loop: true,
    autoplay: {
      delay: 9500,
      disableOnInteraction: false
    },
    pagination: {
      el: '.mobile-banner .swiper-pagination',
      clickable: true
    },
    // Critical fixes for mobile lag issues
    effect: 'fade', // Change to fade effect instead of slide
    fadeEffect: {
      crossFade: true // Enable cross-fade for smoother transitions
    },
    speed: 300, // Faster transition
    virtualTranslate: false, // Disable virtual translate which can cause issues
    cssMode: false, // Disable CSS mode which can conflict
    allowTouchMove: true, // Ensure touch is enabled
    touchReleaseOnEdges: true, // Better edge handling
    preventInteractionOnTransition: false, // Allow interaction during transitions
    touchMoveStopPropagation: true, // Stop event propagation issues
    observer: true,
    observeParents: true
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
  
  // Force update both sliders to fix transition issues
  setTimeout(() => {
    if (mobileSlider) {
      mobileSlider.update();
      // Manually trigger slide transition to ensure initialization
      mobileSlider.slideNext(0);
      mobileSlider.slidePrev(0);
    }
    if (desktopSlider) {
      desktopSlider.update();
    }
  }, 300);
  
  // Add resize handler for better mobile support
  window.addEventListener('resize', () => {
    if (mobileSlider) mobileSlider.update();
    if (desktopSlider) desktopSlider.update();
  });
}

// Guest count functionality
let guestCount = 1;
function changeGuestCount(delta) {
    guestCount = Math.max(1, guestCount + delta); // Ensure minimum of 1
    document.getElementById('guestCountText').textContent = guestCount;
}

// Popup functionality
function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    popup.style.display = 'flex';
    
    // Wait a small amount of time before adding the active class for animation
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
    
    // Reinitialize sliders inside popups to ensure proper functionality
    if (popupId === 'eventDay' || popupId === 'memories') {
        // Need to update Swiper after the popup is visible
        setTimeout(() => {
            const swipersInPopup = popup.querySelectorAll('.swiper');
            swipersInPopup.forEach(swiperEl => {
                const swiperInstance = swiperEl.swiper;
                if (swiperInstance) {
                    swiperInstance.update();
                }
            });
        }, 300);
    }
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.classList.remove('active');
    
    // Wait for animation to finish before hiding
    setTimeout(() => {
        popup.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }, 400);
}

function setupEventListeners() {
    // Close popup when clicking outside the popup-inner
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                const popupId = this.id;
                closePopup(popupId);
            }
        });
    });
    
    // ESC key to close popups
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activePopup = document.querySelector('.popup.active');
            if (activePopup) {
                const popupId = activePopup.id;
                closePopup(popupId);
            }
        }
    });
}

// Form submission
function submitRSVP(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const guests = guestCount;
    
    // You can replace this with your actual form submission logic
    alert(`Thank you, ${name}! Your RSVP has been received.\nAttendance: ${attendance}\nGuests: ${guests}\nPhone: ${phone}`);
    
    // Close popup after successful submission
    closePopup('rsvp');
}