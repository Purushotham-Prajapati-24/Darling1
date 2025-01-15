document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Add falling hearts animation
    createHearts();

    // Initialize sliders
    initializeSliders();

    // Initialize photo groups
    initializePhotoGroups();

    // Initialize flip cards
    initializeFlipCards();

    const lighter = document.querySelector('.lighter');
    const lighterSwitch = document.querySelector('.lighter-switch');
    const flame = document.querySelector('.flame');
    const envelope = document.querySelector('.envelope');
    const letter = document.querySelector('.letter');
    
    lighterSwitch.addEventListener('click', () => {
        lighter.classList.toggle('on');
        if (lighter.classList.contains('on')) {
            flame.classList.add('active');
            envelope.classList.add('open');
            setTimeout(() => {
                letter.classList.add('visible');
                animateText();
            }, 1000);
        } else {
            flame.classList.remove('active');
            envelope.classList.remove('open');
            letter.classList.remove('visible');
        }
    });
    
    function animateText() {
        const text = document.querySelector('.animated-text');
        text.style.opacity = '1';
        text.style.transform = 'translateY(0)';
    }

    const photoContainers = document.querySelectorAll('.photo-container');
    
    photoContainers.forEach(container => {
        const photoGroup = container.querySelector('.photo-group');
        const prevBtn = container.querySelector('.nav-btn.prev');
        const nextBtn = container.querySelector('.nav-btn.next');
        const images = photoGroup.querySelectorAll('img');
        
        let currentIndex = 0;
        
        // Function to update image visibility
        function showImage(index) {
            const offset = -index * 100;
            photoGroup.style.transform = `translateX(${offset}%)`;
            
            // Update button states
            prevBtn.style.opacity = index === 0 ? '0.5' : '1';
            nextBtn.style.opacity = index === images.length - 1 ? '0.5' : '1';
            
            // Update current index
            currentIndex = index;
        }
        
        // Initialize with first image
        showImage(0);
        
        // Add click handlers
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                showImage(currentIndex - 1);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < images.length - 1) {
                showImage(currentIndex + 1);
            }
        });
        
        // Add touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        photoGroup.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, false);
        
        photoGroup.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50; // minimum distance for swipe
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentIndex < images.length - 1) {
                    // Swiped left -> show next
                    showImage(currentIndex + 1);
                } else if (diff < 0 && currentIndex > 0) {
                    // Swiped right -> show previous
                    showImage(currentIndex - 1);
                }
            }
        }
    });
});

function createHearts() {
    const numberOfHearts = 20;
    const container = document.querySelector('.hero');

    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.fontSize = `${Math.random() * (30 - 15) + 15}px`;
        heart.innerHTML = '❤️';
        container.appendChild(heart);
    }
}

// Add this CSS to your style.css file
const style = document.createElement('style');
style.textContent = `
    .heart {
        position: absolute;
        top: -20px;
        animation: falling 5s linear infinite;
        opacity: 0;
    }

    @keyframes falling {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function initializeSliders() {
    document.querySelectorAll('.memory-card').forEach(card => {
        const slider = card.querySelector('.photo-slider');
        const images = slider.querySelectorAll('img');
        const prevBtn = card.querySelector('.prev');
        const nextBtn = card.querySelector('.next');
        let currentIndex = 0;

        // Set initial position
        updateSlider();

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlider();
        });

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    });
}

function initializePhotoGroups() {
    document.querySelectorAll('.memory-section').forEach(section => {
        const photoGroup = section.querySelector('.photo-group');
        const images = photoGroup.querySelectorAll('img');
        const prevBtn = section.querySelector('.prev');
        const nextBtn = section.querySelector('.next');
        let currentPosition = 0;
        let maxScroll = photoGroup.scrollWidth - photoGroup.clientWidth;

        // Scroll by 300px (image width) + 10px (margin)
        const scrollAmount = 310;

        prevBtn.addEventListener('click', () => {
            currentPosition = Math.max(currentPosition - scrollAmount, 0);
            photoGroup.style.transform = `translateX(-${currentPosition}px)`;
            updateButtonVisibility();
        });

        nextBtn.addEventListener('click', () => {
            currentPosition = Math.min(currentPosition + scrollAmount, maxScroll);
            photoGroup.style.transform = `translateX(-${currentPosition}px)`;
            updateButtonVisibility();
        });

        function updateButtonVisibility() {
            prevBtn.style.opacity = currentPosition === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentPosition >= maxScroll ? '0.5' : '1';
        }

        // Initial button visibility
        updateButtonVisibility();

        // Add smooth mouse drag scrolling
        let isDown = false;
        let startX;
        let scrollLeft;

        photoGroup.addEventListener('mousedown', (e) => {
            isDown = true;
            photoGroup.style.cursor = 'grabbing';
            startX = e.pageX - photoGroup.offsetLeft;
            scrollLeft = currentPosition;
        });

        photoGroup.addEventListener('mouseleave', () => {
            isDown = false;
            photoGroup.style.cursor = 'grab';
        });

        photoGroup.addEventListener('mouseup', () => {
            isDown = false;
            photoGroup.style.cursor = 'grab';
        });

        photoGroup.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - photoGroup.offsetLeft;
            const walk = (x - startX) * 2;
            currentPosition = Math.max(0, Math.min(scrollLeft - walk, maxScroll));
            photoGroup.style.transform = `translateX(-${currentPosition}px)`;
            updateButtonVisibility();
        });
    });
}

// Initialize flip cards
function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            
            // Remove flipped class from other cards
            flipCards.forEach(otherCard => {
                if(otherCard !== card) {
                    otherCard.classList.remove('flipped');
                }
            });
        });
    });
}

function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 150; // Increased number of stars

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        // Randomly assign star sizes
        const starType = Math.random();
        if (starType < 0.3) {
            star.className = 'star star-1';
        } else if (starType < 0.6) {
            star.className = 'star star-2';
        } else {
            star.className = 'star star-3';
        }
        
        // Random position with better distribution
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
    }
}
createStars();


