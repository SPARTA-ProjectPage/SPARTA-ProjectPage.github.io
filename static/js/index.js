window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Initialize custom SPARTA carousel
    initSpartaCarousel();

    bulmaSlider.attach();

    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})

// ── SPARTA Custom Carousel ──
function initSpartaCarousel() {
    var allSlides = document.querySelectorAll('.sparta-slide');
    if (!allSlides.length) return;

    var filteredIndices = [];
    var currentPos = 0;
    var currentFilter = 'all';
    var slideDirection = 'next'; // 'next' or 'prev'
    var autoplayTimer = null;
    var AUTOPLAY_MS = 8000;

    var prevBtn = document.getElementById('sparta-prev');
    var nextBtn = document.getElementById('sparta-next');
    var currentEl = document.getElementById('sparta-current');
    var totalEl = document.getElementById('sparta-total');
    var progressEl = document.getElementById('sparta-progress');
    var complexityEl = document.getElementById('sparta-complexity');
    var filterTabs = document.querySelectorAll('.sparta-filter-tab');

    function buildFilteredList(filter) {
        filteredIndices = [];
        for (var i = 0; i < allSlides.length; i++) {
            if (filter === 'all' || allSlides[i].getAttribute('data-domain') === filter) {
                filteredIndices.push(i);
            }
        }
    }

    function showSlide(pos) {
        if (!filteredIndices.length) return;
        currentPos = pos;
        // Hide all and clear direction class
        for (var i = 0; i < allSlides.length; i++) {
            allSlides[i].classList.remove('active', 'slide-rev');
        }
        var idx = filteredIndices[currentPos];
        var slide = allSlides[idx];
        // Force reflow for re-animation
        void slide.offsetWidth;
        if (slideDirection === 'prev') {
            slide.classList.add('slide-rev');
        }
        slide.classList.add('active');

        // Update counter
        currentEl.textContent = currentPos + 1;
        totalEl.textContent = filteredIndices.length;

        // Update progress
        var pct = ((currentPos + 1) / filteredIndices.length) * 100;
        progressEl.style.width = pct + '%';

        // Update complexity dots (max 4)
        var h = parseInt(slide.getAttribute('data-height')) || 0;
        var b = parseInt(slide.getAttribute('data-breadth')) || 0;
        var complexity = Math.min(h + b, 4);
        var dots = complexityEl.querySelectorAll('.sparta-complexity-dot');
        for (var d = 0; d < dots.length; d++) {
            if (d < complexity) {
                dots[d].classList.add('filled');
            } else {
                dots[d].classList.remove('filled');
            }
        }
    }

    function next() {
        if (!filteredIndices.length) return;
        slideDirection = 'next';
        showSlide((currentPos + 1) % filteredIndices.length);
    }

    function prev() {
        if (!filteredIndices.length) return;
        slideDirection = 'prev';
        showSlide((currentPos - 1 + filteredIndices.length) % filteredIndices.length);
    }

    // Autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
        if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
    }
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Nav buttons
    prevBtn.addEventListener('click', function() { prev(); resetAutoplay(); });
    nextBtn.addEventListener('click', function() { next(); resetAutoplay(); });

    // Filter tabs
    filterTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            filterTabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter');
            slideDirection = 'next';
            buildFilteredList(currentFilter);
            showSlide(0);
            resetAutoplay();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        var carousel = document.querySelector('.sparta-carousel');
        if (!carousel) return;
        var rect = carousel.getBoundingClientRect();
        var inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            next(); resetAutoplay();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prev(); resetAutoplay();
        }
    });

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    var viewport = document.querySelector('.sparta-carousel-viewport');
    if (viewport) {
        viewport.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        viewport.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) { next(); } else { prev(); }
                resetAutoplay();
            }
        }, { passive: true });
    }

    // Pause autoplay on hover
    var carouselEl = document.querySelector('.sparta-carousel');
    if (carouselEl) {
        carouselEl.addEventListener('mouseenter', stopAutoplay);
        carouselEl.addEventListener('mouseleave', startAutoplay);
    }

    // Initial setup
    slideDirection = 'next';
    buildFilteredList('all');
    showSlide(0);
    startAutoplay();
}
