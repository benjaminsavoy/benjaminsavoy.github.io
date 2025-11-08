/**
 * Personal Website - Interactive Elements
 * Vanilla JavaScript for smooth animations and interactions
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupIntersectionObserver();
        setupImageLazyLoading();
        addSmoothScrollPolyfill();
        setupParallaxEffect();
    }

    /**
     * Intersection Observer for scroll-triggered animations
     */
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections for fade-in effects
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Add visibility styles
        const style = document.createElement('style');
        style.textContent = `
            section.is-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Enhanced lazy loading for images with fade-in effect
     */
    function setupImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.5s ease';

                        img.addEventListener('load', () => {
                            img.style.opacity = '1';
                        });

                        // If image is already cached, trigger opacity immediately
                        if (img.complete) {
                            img.style.opacity = '1';
                        }

                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Smooth scroll polyfill for browsers that don't support CSS scroll-behavior
     */
    function addSmoothScrollPolyfill() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || !href) return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                // Use native smooth scroll if available
                if ('scrollBehavior' in document.documentElement.style) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // Fallback for older browsers
                    smoothScrollTo(target.offsetTop, 800);
                }
            });
        });
    }

    /**
     * Smooth scroll fallback implementation
     */
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeInOutCubic)
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Subtle parallax effect on hero section
     */
    function setupParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Only apply parallax on devices that support hover (non-touch)
        const supportsHover = window.matchMedia('(hover: hover)').matches;
        if (!supportsHover) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroHeight = hero.offsetHeight;

                    // Only apply parallax while hero is visible
                    if (scrolled < heroHeight) {
                        const parallaxSpeed = 0.5;
                        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                        hero.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
                    }

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    /**
     * Add hover effect to photo grid items
     */
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    /**
     * Accessibility: Trap focus for keyboard navigation
     */
    document.addEventListener('keydown', (e) => {
        // Escape key to blur active element
        if (e.key === 'Escape') {
            document.activeElement.blur();
        }
    });

    /**
     * Add subtle animation to social links on load
     */
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 600 + (index * 100));
    });

})();
