// Section Navigation
const mainContainer = document.getElementById('mainContainer');
const navDisplay = document.getElementById('navDisplay');
const sections = document.querySelectorAll('.section');

let currentSection = 0;
const totalSections = sections.length;

const sectionNames = ['HOME', 'STORE', 'ABOUT', 'CONTACT', 'BLOG'];

// Swipe detection - improved for mobile
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let currentTranslatePercent = 0;
let velocity = 0;
let lastMoveTime = 0;
let lastMoveX = 0;

// Update navigation display
function updateNavIndicator(sectionIndex) {
    if (navDisplay) {
        navDisplay.textContent = sectionNames[sectionIndex] || 'HOME';
    }
}

// Navigate to section
function goToSection(index) {
    if (index < 0 || index >= totalSections) return;
    
    currentSection = index;
    const translateX = -index * 20; // 20% per section (5 sections total)
    mainContainer.style.transform = `translateX(${translateX}%)`;
    currentTranslatePercent = translateX;
    
    updateNavIndicator(currentSection);
}

// Touch event handlers
function getEventX(e) {
    if (!e) return 0;
    if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
    if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
    return e.clientX || 0;
}

function onTouchStart(e) {
    touchStartX = getEventX(e);
    lastMoveX = touchStartX;
    lastMoveTime = Date.now();
    isDragging = true;
    velocity = 0;
    mainContainer.style.transition = 'none';
}

function onTouchMove(e) {
    if (!isDragging) return;
    
    e.preventDefault(); // Prevent scrolling while swiping
    
    const currentX = getEventX(e);
    const currentTime = Date.now();
    const diff = currentX - touchStartX;
    const sectionWidth = window.innerWidth;
    const diffPercent = (diff / sectionWidth) * 100;
    
    // Calculate velocity for momentum
    const timeDiff = currentTime - lastMoveTime;
    if (timeDiff > 0) {
        const moveDiff = currentX - lastMoveX;
        velocity = moveDiff / timeDiff;
        lastMoveX = currentX;
        lastMoveTime = currentTime;
    }
    
    // Calculate new translate position
    let newTranslate = currentTranslatePercent + diffPercent;
    
    // Apply smooth resistance at boundaries
    if (newTranslate > 0) {
        newTranslate = newTranslate * 0.3; // Stronger resistance at start
    } else if (newTranslate < -(totalSections - 1) * 20) {
        const maxTranslate = -(totalSections - 1) * 20;
        newTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.3; // Stronger resistance at end
    }
    
    mainContainer.style.transform = `translateX(${newTranslate}%)`;
}

function onTouchEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    mainContainer.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    touchEndX = getEventX(e);
    const diff = touchEndX - touchStartX;
    const sectionWidth = window.innerWidth;
    const diffPercent = Math.abs(diff / sectionWidth);
    const threshold = 0.1; // Lower threshold - 10% of screen width for easier swiping
    
    // Use velocity for momentum-based swiping
    const velocityThreshold = 0.2; // Lower velocity threshold
    let targetSection = currentSection;
    
    // Determine target section based on swipe distance and velocity
    if (Math.abs(velocity) > velocityThreshold || diffPercent > threshold) {
        if (diff > 0) {
            // Swipe right - go to previous section
            targetSection = Math.max(0, currentSection - 1);
        } else {
            // Swipe left - go to next section
            targetSection = Math.min(totalSections - 1, currentSection + 1);
        }
    }
    
    // Always snap to a section
    goToSection(targetSection);
}

// Add touch event listeners with proper options
mainContainer.addEventListener('touchstart', onTouchStart, { passive: false });
mainContainer.addEventListener('touchmove', onTouchMove, { passive: false });
mainContainer.addEventListener('touchend', onTouchEnd, { passive: false });

// Initialize nav indicator
updateNavIndicator(0);

// Chest Animation Code
const chestWrapper = document.querySelector('.chest-wrapper');
const chestContainer = document.getElementById('chestContainer');
const chestImage = document.getElementById('chestImage');
const merchItemsContainer = document.getElementById('merchItemsContainer');
const closeBtn = document.getElementById('closeBtn');

let isAnimating = false;
let currentFrame = 1;
let animationInterval = null;
const totalFrames = 160;

// Helper function to format frame number with leading zeros
function formatFrameNumber(num) {
    return String(num).padStart(3, '0');
}

// Preload chest1 (1).png and all animation frames
const chestImages = [];
const firstFrame = new Image();
firstFrame.src = 'chest1 (1).png';
chestImages.push(firstFrame);

for (let i = 2; i <= totalFrames; i++) {
    const img = new Image();
    img.src = `ezgif-frame-${formatFrameNumber(i)}.png`;
    chestImages.push(img);
}

function animateChestOpen() {
    if (isAnimating) return;
    isAnimating = true;
    currentFrame = 1;
    
    animationInterval = setInterval(() => {
        if (currentFrame === 1) {
            chestImage.src = 'chest1 (1).png';
        } else {
            chestImage.src = `ezgif-frame-${formatFrameNumber(currentFrame)}.png`;
        }
        currentFrame++;
        
        if (currentFrame > totalFrames) {
            clearInterval(animationInterval);
            isAnimating = false;
            chestContainer.classList.add('open');
            // Show items immediately when animation completes
            merchItemsContainer.classList.add('show');
            chestWrapper.classList.add('items-visible');
        }
    }, 30); // 30ms per frame = ~4.8s total animation
}

function animateChestClose() {
    if (isAnimating) return;
    isAnimating = true;
    currentFrame = totalFrames;
    
    animationInterval = setInterval(() => {
        if (currentFrame === 1) {
            chestImage.src = 'chest1 (1).png';
            clearInterval(animationInterval);
            isAnimating = false;
            chestContainer.classList.remove('open');
        } else {
            chestImage.src = `ezgif-frame-${formatFrameNumber(currentFrame)}.png`;
        }
        currentFrame--;
    }, 30); // 30ms per frame = ~4.8s total animation
}

// Open chest
chestContainer.addEventListener('click', () => {
    if (!chestContainer.classList.contains('open') && !isAnimating) {
        animateChestOpen();
    }
});

// Close chest
closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (chestContainer.classList.contains('open') && !isAnimating) {
        // Remove blur immediately when closing
        chestWrapper.classList.remove('items-visible');
        merchItemsContainer.classList.remove('show');
        setTimeout(() => {
            animateChestClose();
        }, 100);
    }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chestContainer.classList.contains('open') && !isAnimating) {
        closeBtn.click();
    }
});
