// Enhanced Modern Portfolio JavaScript

// Theme Management
const THEME_STORAGE_KEY = 'portfolio-theme';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isScrollTicking = false;

function applyTheme(theme) {
    const body = document.body;
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const normalizedTheme = theme === 'dark' ? 'dark' : 'light';

    body.setAttribute('data-theme', normalizedTheme);
    document.documentElement.setAttribute('data-theme', normalizedTheme);

    if (themeIcon) {
        themeIcon.className = normalizedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    if (themeToggleBtn) {
        themeToggleBtn.setAttribute(
            'aria-label',
            normalizedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

function initTheme() {
    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    } catch (error) {
        savedTheme = 'dark';
    }

    if (savedTheme !== 'dark' && savedTheme !== 'light') {
        savedTheme = 'dark';
    }

    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(nextTheme);

    try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
        // Ignore storage errors and keep the applied theme in-memory.
    }
}

// Mobile Navigation
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const isActive = mobileNav.classList.contains('active');

    mobileNav.classList.toggle('active');
    menuBtn.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', String(!isActive));

    // Prevent body scroll when menu is open
    if (!isActive) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        toggleMobileMenu();
    });
});

// Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const scrolled = window.scrollY > 50;

    navbar.classList.toggle('scrolled', scrolled);
}

// Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to Top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function handleScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    const scrolled = window.scrollY > 300;

    scrollBtn.classList.toggle('visible', scrolled);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('stagger-grid')) {
                entry.target.classList.add('animate');
            }
        }
    });
}, observerOptions);

// Form Submission
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject').trim();
    const message = formData.get('message').trim();

    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="spinner"></div><span>Sending...</span>';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Create mailto link
        const mailtoSubject = encodeURIComponent(`Portfolio Contact: ${subject}`);
        const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:umar.rahi.work@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        // Open default email client
        window.location.href = mailtoLink;

        // Show success message
        showNotification('Thank you for your message! Your email client will open with the pre-filled message.', 'success');

        // Reset form
        form.reset();

        // Restore button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }, 2000);
}

// Resume Download
function downloadResume() {
    const resumeUrl = 'https://github.com/Umar-Rahi/About-me/raw/main/Umar_Rahi_Resume.pdf';

    // Show loading state
    const downloadBtn = document.querySelector('.btn-primary');
    const originalHTML = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<div class="spinner"></div><span>Downloading...</span>';
    downloadBtn.style.pointerEvents = 'none';

    // Attempt to download
    fetch(resumeUrl)
        .then(response => {
            if (!response.ok) throw new Error('Download failed');
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Umar_Rahi_Resume.pdf';
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
            showNotification('📄 Resume downloaded successfully!', 'success');
        })
        .catch(() => {
            // Fallback to direct link
            const a = document.createElement('a');
            a.href = resumeUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.click();

            showNotification('📄 Resume download started! If it opens in browser, right-click and "Save As".', 'info');
        })
        .finally(() => {
            // Restore button
            setTimeout(() => {
                downloadBtn.innerHTML = originalHTML;
                downloadBtn.style.pointerEvents = 'auto';
            }, 2000);
        });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: var(--font-body);
        font-weight: 500;
        max-width: min(400px, calc(100vw - 40px));
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Typing Effect for Hero Title
function initTypingEffect() {
    const roles = ['Full-Stack Development', 'Backend APIs', 'Frontend UI'];
    const typingText = document.querySelector('.hero-typing-text');
    if (!typingText) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const fullRole = roles[roleIndex];
        const currentRole = isDeleting
            ? fullRole.substring(0, charIndex - 1)
            : fullRole.substring(0, charIndex + 1);

        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
        typingText.innerHTML = `${currentRole}<span class="cursor">|</span>`;

        let typeSpeed = isDeleting ? 50 : 90;

        if (!isDeleting && charIndex === fullRole.length) {
            typeSpeed = 1400;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 350;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1200);
}

// Parallax Effect for Hero
function handleParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || prefersReducedMotion) return;

    const scrolled = window.pageYOffset;
    const maxOffset = 60;
    const rate = Math.min(scrolled * 0.18, maxOffset);

    if (scrolled < window.innerHeight * 1.2) {
        hero.style.backgroundPosition = `center ${Math.round(-rate)}px`;
    } else {
        hero.style.backgroundPosition = 'center 0px';
    }
}

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    let startTime = null;
    const suffix = '+';

    element.closest('.stat-item').classList.add('animating');

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOutCubic * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target + suffix;
            element.closest('.stat-item').classList.remove('animating');
        }
    }

    requestAnimationFrame(step);
}

// Initialize Stats Animation
function initStatsAnimation() {
    const statsSection = document.getElementById('statsSection');
    const statNumbers = statsSection.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;

                statNumbers.forEach((statNumber, index) => {
                    const target = parseInt(statNumber.getAttribute('data-target'));

                    setTimeout(() => {
                        animateCounter(statNumber, target, 1000);
                    }, index * 50);
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(statsSection);
}

// Tag Interaction System
const tagSummaries = {
    // Programming Languages
    'Python': {
        icon: 'fab fa-python',
        text: 'My primary language for backend development and ML projects. I use it with Flask for web apps and scikit-learn for machine learning models.'
    },
    'JavaScript': {
        icon: 'fab fa-js-square',
        text: 'I use JavaScript for front-end interactivity, DOM manipulation, and API integrations. Currently learning React and Node.js.'
    },
    'Java': {
        icon: 'fab fa-java',
        text: 'Learned OOP fundamentals through Java. Used it for data structures, algorithms coursework, and basic Android projects.'
    },
    'C': {
        icon: 'fas fa-code',
        text: 'My first programming language—helped me understand memory management, pointers, and how computers work at a low level.'
    },

    // Web Development
    'HTML5': {
        icon: 'fab fa-html5',
        text: 'I write semantic HTML for accessibility and SEO. Used in all my web projects including this portfolio.'
    },
    'CSS3': {
        icon: 'fab fa-css3-alt',
        text: 'Proficient in responsive layouts with Flexbox/Grid, CSS variables, animations, and media queries for mobile-first design.'
    },
    'Flask': {
        icon: 'fas fa-flask',
        text: 'My go-to Python web framework. Built the AQI Predictor backend with Flask—handling routes, templates, and API endpoints.'
    },
    'REST APIs': {
        icon: 'fas fa-plug',
        text: 'I design and consume RESTful APIs. Experience with JSON data exchange, HTTP methods, and integrating third-party APIs.'
    },

    // Databases & Backend
    'MySQL': {
        icon: 'fas fa-database',
        text: 'Used MySQL in multiple projects for structured data storage. Comfortable with JOINs, indexes, and query optimization basics.'
    },
    'SQL': {
        icon: 'fas fa-table',
        text: 'Strong SQL fundamentals—SELECT, INSERT, UPDATE, DELETE, JOINs, GROUP BY. Used across MySQL and SQLite databases.'
    },
    'SQLite': {
        icon: 'fas fa-database',
        text: 'Lightweight database I use for local development and small Flask apps. Easy to set up and great for prototyping.'
    },

    // Tools & Platforms
    'Git': {
        icon: 'fab fa-git-alt',
        text: 'I use Git daily for version control—branching, merging, resolving conflicts, and maintaining clean commit history.'
    },
    'GitHub': {
        icon: 'fab fa-github',
        text: 'All my projects are on GitHub. I use it for code hosting, collaboration, and showcasing my work to recruiters.'
    },
    'VS Code': {
        icon: 'fas fa-laptop-code',
        text: 'My primary code editor. I use extensions for Python, JavaScript, Git integration, and productivity.'
    },
    'Linux': {
        icon: 'fab fa-linux',
        text: 'Comfortable with Linux command line for development, file management, and running servers. Used Ubuntu for projects.'
    },

    // AI & LLM Tools
    'OpenAI API': {
        icon: 'fas fa-robot',
        text: 'Integrated OpenAI API in projects for chatbot functionality. Familiar with prompt design and API rate handling.'
    },
    'Prompt Engineering': {
        icon: 'fas fa-magic',
        text: 'I craft effective prompts to get useful outputs from LLMs—for code generation, content creation, and problem-solving.'
    },
    'scikit-learn': {
        icon: 'fas fa-brain',
        text: 'Used scikit-learn for my AQI Predictor project—trained Random Forest models, handled data preprocessing, and evaluated accuracy.'
    },

    // Currently Learning
    'React': {
        icon: 'fab fa-react',
        text: 'Currently learning React to build dynamic SPAs. Studying components, hooks, state management, and the React ecosystem.'
    },
    'Node.js': {
        icon: 'fab fa-node-js',
        text: 'Learning Node.js to become a full-stack JavaScript developer. Exploring Express.js for backend APIs.'
    },
    'Docker': {
        icon: 'fab fa-docker',
        text: 'Starting to learn Docker for containerization—understanding images, containers, and deployment workflows.'
    },

    // Project Technologies (for project section tags)
    'Machine Learning': {
        icon: 'fas fa-brain',
        text: 'Applied ML in my AQI Predictor using Random Forest. Understand supervised learning, training/test splits, and model evaluation.'
    },
    'Chart.js': {
        icon: 'fas fa-chart-bar',
        text: 'Used Chart.js to visualize AQI predictions with interactive line and bar charts in the browser.'
    },
    'Random Forest': {
        icon: 'fas fa-tree',
        text: 'Ensemble ML algorithm I used for AQI prediction. Chose it for its accuracy and resistance to overfitting.'
    }
};

let currentSummaryContainer = null;

function createTagSummary(tagName, container) {
    const summary = tagSummaries[tagName];
    if (!summary) return null;

    const summaryElement = document.createElement('div');
    summaryElement.className = 'tag-summary';
    summaryElement.innerHTML = `
        <div class="tag-summary-content">
            <div class="tag-summary-header">
                <div class="tag-summary-title">
                    <div class="tag-summary-icon">
                        <i class="${summary.icon}"></i>
                    </div>
                    ${tagName}
                </div>
                <button class="tag-summary-close" onclick="closeTagSummary()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="tag-summary-text">
                ${summary.text}
            </div>
        </div>
    `;

    return summaryElement;
}

function showTagSummary(tagName, tagElement) {
    // If there's an existing summary, close it first and wait
    if (currentSummaryContainer) {
        closeTagSummary();
        // Wait for the close animation to complete before showing new summary
        setTimeout(() => {
            createAndShowSummary(tagName, tagElement);
        }, 450); // Slightly longer than close animation
    } else {
        createAndShowSummary(tagName, tagElement);
    }
}

function createAndShowSummary(tagName, tagElement) {
    // Find the container (skill-tags or project-tech)
    const container = tagElement.closest('.skill-tags, .project-tech');
    if (!container) return;

    // Create and insert summary
    const summaryElement = createTagSummary(tagName, container);
    if (!summaryElement) return;

    // Insert after the container
    container.parentNode.insertBefore(summaryElement, container.nextSibling);
    currentSummaryContainer = summaryElement;

    // Add active class to clicked tag
    document.querySelectorAll('.skill-tag.active, .tech-tag.active').forEach(tag => {
        tag.classList.remove('active');
    });
    tagElement.classList.add('active');

    // Show with animation
    setTimeout(() => {
        summaryElement.classList.add('show');
    }, 10);

    // Smooth scroll to summary
    setTimeout(() => {
        summaryElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 200);
}

function closeTagSummary() {
    if (currentSummaryContainer) {
        currentSummaryContainer.classList.remove('show');

        // Remove active classes
        document.querySelectorAll('.skill-tag.active, .tech-tag.active').forEach(tag => {
            tag.classList.remove('active');
        });

        setTimeout(() => {
            if (currentSummaryContainer && currentSummaryContainer.parentNode) {
                currentSummaryContainer.parentNode.removeChild(currentSummaryContainer);
            }
            currentSummaryContainer = null;
        }, 400);
    }
}

function initTagInteractions() {
    // Add click listeners to all skill tags and tech tags
    document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const tagName = tag.textContent.trim();

            // If clicking the same tag that's already active, close it
            if (tag.classList.contains('active')) {
                closeTagSummary();
            } else {
                showTagSummary(tagName, tag);
            }
        });

        // Add keyboard support
        tag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tag.click();
            }
        });

        // Make tags focusable
        tag.setAttribute('tabindex', '0');
        tag.setAttribute('role', 'button');
        tag.setAttribute('aria-label', `Learn more about ${tag.textContent.trim()}`);
    });
}

// Initialize Everything
function init() {
    initTheme();

    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    // Set up event listeners
    window.addEventListener('scroll', () => {
        if (isScrollTicking) return;

        isScrollTicking = true;
        requestAnimationFrame(() => {
            handleNavbarScroll();
            updateActiveNavLink();
            handleScrollToTop();
            handleParallax();
            isScrollTicking = false;
        });
    }, { passive: true });

    // Initialize fade-in animations
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Initialize stats animation
    initStatsAnimation();

    // Add loading animation to page
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Initialize typing effect
    initTypingEffect();

    // Initialize tag interactions
    initTagInteractions();

    // Add cursor animation styles
    const style = document.createElement('style');
    style.textContent = `
        .cursor {
            animation: blink 1s infinite;
            color: var(--primary);
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    console.log('🚀 Modern Portfolio Website Loaded Successfully!');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle resize events
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        const mobileNav = document.getElementById('mobileNav');
        const menuBtn = document.querySelector('.mobile-menu-btn');

        mobileNav.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }

        // Close any open tag summaries
        const activeSummary = document.querySelector('.tag-summary.show');
        if (activeSummary) {
            closeTagSummary();
        }
    }
});

// Close summary when clicking outside
document.addEventListener('click', (e) => {
    if (currentSummaryContainer &&
        !e.target.closest('.tag-summary') &&
        !e.target.closest('.skill-tag') &&
        !e.target.closest('.tech-tag')) {
        closeTagSummary();
    }
});
