// Main JavaScript functionality for Alexander Van den Putte Portfolio

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeInteractiveComponents();
    initializeScrollEffects();
    initializeNavigation();
    initializeContactForm(); // For contact.html
    // REMOVED: generateCV(); 

    // ADDED: Logic for new glass nav "active" class
    initializeGlassNav();
});

// Animation initialization
function initializeAnimations() {
    // Typewriter effect for hero text
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                "Master's Student at KU Leuven",
                'Specializing in Electromechanics',
                'Problem-Solver & Innovator',
                'Seeking roles in Maintenance & Reliability'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|',
        });
    }

    // Text splitting animations
    if (typeof Splitting !== 'undefined') {
        Splitting({ target: '.split-text', by: 'chars' });
        
        anime({
            targets: '.split-text .char',
            translateY: [-100, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1400,
            delay: (el, i) => 100 + 30 * i
        });
    }

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                skillsObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillsObserver.observe(bar));
}

// Interactive components
function initializeInteractiveComponents() {
    // Skills radar chart
    initializeSkillsChart();
    
    // Achievement counters
    initializeCounters();
    
    // Project carousel
    initializeProjectCarousel();
    
    // Interactive timeline
    initializeTimeline();
}

// Skills radar chart
function initializeSkillsChart() {
    const chartElement = document.getElementById('skills-chart');
    if (!chartElement) return;

    const skillsChart = echarts.init(chartElement);
    
    // UPDATED: Re-ordered to match your image (Inv, MS, Py, MAT, FEA, TIA)
    const option = {
        backgroundColor: 'transparent',
        radar: {
            indicator: [
                { name: 'Autodesk Inventor', max: 100 }, // 1. Top
                { name: 'MS365', max: 100 },              // 2. Top-Right
                { name: 'Python', max: 100 },             // 3. Bottom-Right
                { name: 'MATLAB/Simulink', max: 100 },// 4. Bottom
                { name: 'FEA (Abaqus)', max: 100 },    // 5. Bottom-Left
                { name: 'TIA Portal', max: 100 }         // 6. Top-Left
            ],
            shape: 'polygon',
            splitNumber: 5,
            axisName: {
                color: '#F8F9FA',
                fontSize: 12,
                fontFamily: 'Open Sans, sans-serif'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(192, 197, 204, 0.5)'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(42, 59, 79, 0.3)', 'rgba(42, 59, 79, 0.5)']
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(192, 197, 204, 0.5)'
                }
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: '#1D2A3A',
            borderColor: '#4DB6AC',
            textStyle: {
                color: '#F8F9FA'
            }
        },
        series: [{
            name: 'Skills',
            type: 'radar',
            data: [{
                // UPDATED: Values re-ordered to match new indicator order and values
                value: [95, 100, 60, 75, 70, 80], // Inv, MS, Py, MAT, FEA, TIA
                name: 'Technical Skills',
                areaStyle: {
                    color: 'rgba(77, 182, 172, 0.3)'
                },
                lineStyle: {
                    color: '#4DB6AC',
                    width: 2
                },
                itemStyle: {
                    color: '#4DB6AC'
                }
            }],
            animationDuration: 2000
        }]
    };
    
    skillsChart.setOption(option);
    
    // Responsive chart
    window.addEventListener('resize', () => {
        skillsChart.resize();
    });
}

// Animated counters
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// UPDATED: Counter function for speed and natural start
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (isNaN(target)) return;

    // NEW LOGIC: Start high for year values, start low for small values.
    let start = 0;
    let duration = 250; // Default speed
    
    if (target == 5) { 
        start = 0; 
        duration = 1250; // Much faster transition (1 second)
    }

    if (target == 9) { 
        start = 0; 
        duration = 1750; // Much faster transition (1 second)
    }

    if (target > 100) { 
        // This condition targets the '2026' value 
        start = 2003; 
        duration = 2400; // Much faster transition (1 second)
    }

    const stepTime = 16; // approx 60fps
    const steps = duration / stepTime;
    const increment = (target - start) / steps;

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(start);
    }, stepTime);
}

// Project carousel
function initializeProjectCarousel() {
    const carousel = document.querySelector('.project-carousel');
    if (!carousel) return;
    
    new Splide(carousel, {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '2rem',
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        breakpoints: {
            768: {
                perPage: 1
            },
            1024: {
                perPage: 2
            }
        }
    }).mount();
}

// Interactive timeline
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    // Removed click-to-expand functionality as per new design
    // It's now a static, visual timeline
}

// Scroll effects
function initializeScrollEffects() {
    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-bg');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
    
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// Navigation functionality (for old nav on projects/contact)
function initializeNavigation() {
    const nav = document.querySelector('nav'); // Finds <nav> on all pages
    const mobileToggle = document.querySelector('.mobile-toggle'); // Finds hamburger
    const navLinksContainer = document.querySelector('.nav-links'); // Finds link container
    
    // Mobile menu toggle - This will only run if mobileToggle exists on the page
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            // Close mobile menu (if it exists)
            if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ADDED: Logic for new glass nav "active" class
function initializeGlassNav() {
    const navItems = document.querySelectorAll('.nav-item');
    if (!navItems.length) return; // Only runs if the new nav exists

    navItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // We don't preventDefault, so the link still works
        navItems.forEach(navItem => navItem.classList.remove('active'));
        this.classList.add('active');
      });
    });
}


// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Real-time validation check before submit
        let allValid = true;
        form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
            if (!validateField({ target: field })) {
                allValid = false;
            }
        });

        if (!allValid) {
            showNotification('Please correct the errors in the form.', 'error');
            return;
        }
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML; // Store inner HTML to keep icon
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                showNotification(`Error: ${result.message}`, 'error');
            }
        } catch (error) {
            showNotification('An error occurred. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation listeners
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidationError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const errorElement = field.parentNode.querySelector('.form-error');
    
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        field.classList.add('error');
        if(errorElement) errorElement.style.display = 'block';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        field.classList.add('error');
        if(errorElement) errorElement.style.display = 'block';
    } else {
        field.classList.remove('error');
        if(errorElement) errorElement.style.display = 'none';
    }
    
    return isValid;
}

function clearValidationError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.form-error');
    field.classList.remove('error');
    if(errorElement) errorElement.style.display = 'none';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// REMOVED: Old generateCV() function