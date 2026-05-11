/* ============================================
   LIQUID GLASSMORPHISM LINK-IN-BIO
   Interactive JavaScript Module
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       DEVICE DETECTION
       ============================================ */
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 768;
    };

    /* ============================================
       3D TILT EFFECT (Desktop Only)
       ============================================ */
    class TiltEffect {
        constructor(element) {
            this.element = element;
            this.width = element.offsetWidth;
            this.height = element.offsetHeight;
            this.settings = {
                maxTilt: 8,        // Maximum tilt angle in degrees
                perspective: 1000, // Perspective value
                scale: 1.02,       // Scale on hover
                speed: 400,        // Transition speed
                easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
            };
            
            this.init();
        }

        init() {
            // Set initial perspective
            this.element.style.transformStyle = 'preserve-3d';
            this.element.style.willChange = 'transform';
            
            // Bind events
            this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
            this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
            this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        }

        onMouseEnter() {
            this.updateDimensions();
            this.element.style.transition = `transform ${this.settings.speed}ms ${this.settings.easing}`;
        }

        onMouseMove(e) {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate tilt values
            const tiltX = ((y / this.height) - 0.5) * -this.settings.maxTilt * 2;
            const tiltY = ((x / this.width) - 0.5) * this.settings.maxTilt * 2;
            
            // Apply transform
            this.element.style.transform = `
                perspective(${this.settings.perspective}px)
                rotateX(${tiltX}deg)
                rotateY(${tiltY}deg)
                scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})
            `;
        }

        onMouseLeave() {
            this.element.style.transform = `
                perspective(${this.settings.perspective}px)
                rotateX(0deg)
                rotateY(0deg)
                scale3d(1, 1, 1)
            `;
        }

        updateDimensions() {
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
        }

        destroy() {
            this.element.removeEventListener('mouseenter', this.onMouseEnter);
            this.element.removeEventListener('mousemove', this.onMouseMove);
            this.element.removeEventListener('mouseleave', this.onMouseLeave);
            this.element.style.transform = '';
        }
    }

    /* ============================================
       RIPPLE EFFECT ON CLICK
       ============================================ */
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    /* ============================================
       SMOOTH SCROLL BEHAVIOR
       ============================================ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /* ============================================
       PARALLAX EFFECT FOR BACKGROUND ORBS
       ============================================ */
    function initParallax() {
        if (isMobile()) return; // Skip on mobile for performance

        const orbs = document.querySelectorAll('.gradient-orb');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            orbs.forEach((orb, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled * speed);
                orb.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    /* ============================================
       LAZY LOAD IMAGES
       ============================================ */
    function initLazyLoad() {
        const images = document.querySelectorAll('img[src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    /* ============================================
       PERFORMANCE MONITORING
       ============================================ */
    function logPerformance() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`🚀 Page loaded in ${pageLoadTime}ms`);
                }, 0);
            });
        }
    }

    /* ============================================
       INITIALIZE ALL FEATURES
       ============================================ */
    function init() {
        console.log('🎨 Initializing Liquid Glassmorphism Profile...');

        // Initialize tilt effect on desktop only
        if (!isMobile()) {
            const tiltElements = document.querySelectorAll('[data-tilt]');
            tiltElements.forEach(element => {
                new TiltEffect(element);
            });
            console.log(`✨ 3D Tilt effect enabled for ${tiltElements.length} elements`);
        } else {
            console.log('📱 Mobile detected - Tilt effect disabled for performance');
        }

        // Add ripple effect to all link buttons
        const linkButtons = document.querySelectorAll('.link-button');
        linkButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                createRipple(e, this);
            });
        });
        console.log(`💧 Ripple effect added to ${linkButtons.length} buttons`);

        // Initialize other features
        initSmoothScroll();
        initParallax();
        initLazyLoad();
        logPerformance();

        // Add loaded class to body for any CSS transitions
        document.body.classList.add('loaded');

        console.log('✅ All features initialized successfully!');
    }

    /* ============================================
       WINDOW RESIZE HANDLER
       ============================================ */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-check if device is mobile after resize
            const tiltElements = document.querySelectorAll('[data-tilt]');
            
            if (isMobile()) {
                // Disable tilt on mobile
                tiltElements.forEach(element => {
                    element.style.transform = '';
                });
            }
        }, 250);
    });

    /* ============================================
       EXECUTE ON DOM READY
       ============================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ============================================
       EASTER EGG - Console Art
       ============================================ */
    console.log(`
    %c╔═══════════════════════════════════════╗
    ║   🌊 LIQUID GLASSMORPHISM PROFILE 🌊  ║
    ║                                       ║
    ║   Built with Pure HTML, CSS & JS     ║
    ║   Design: Premium Link-in-Bio        ║
    ║   Created for: Nguyễn Minh Tấn       ║
    ╚═══════════════════════════════════════╝
    `, 'color: #8b5cf6; font-weight: bold; font-size: 12px; font-family: monospace;');

})();
