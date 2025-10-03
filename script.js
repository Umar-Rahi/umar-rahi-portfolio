// Enhanced Modern Portfolio JavaScript

// Theme Management
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-toggle i');
    const isDark = body.getAttribute('data-theme') === 'dark';

    if (isDark) {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }

    // Add smooth transition effect
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

// Mobile Navigation
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const isActive = mobileNav.classList.contains('active');

    mobileNav.classList.toggle('active');
    menuBtn.classList.toggle('active');

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
    const titles = ['Software Developer', 'Full-Stack Developer', 'Problem Solver', 'Tech Enthusiast'];
    const subtitle = document.querySelector('.hero-subtitle');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentTitle = '';

    function type() {
        const fullTitle = titles[titleIndex];

        if (isDeleting) {
            currentTitle = fullTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentTitle = fullTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        subtitle.innerHTML = `Aspiring ${currentTitle}<span class="cursor">|</span> crafting digital experiences with code and creativity`;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === fullTitle.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect after initial animation
    setTimeout(type, 3000);
}

// Parallax Effect for Hero
function handleParallax() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
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
        text: 'Python is a versatile programming language widely used in AI, machine learning, web development, and automation. Known for its simple syntax and powerful libraries.'
    },
    'JavaScript': {
        icon: 'fab fa-js-square',
        text: 'JavaScript is a dynamic programming language that enables interactive web pages and is essential for web development, mobile apps, and server-side programming.'
    },
    'Java': {
        icon: 'fab fa-java',
        text: 'Java is a robust, object-oriented programming language used for enterprise applications, Android development, and large-scale systems.'
    },
    'C++': {
        icon: 'fas fa-code',
        text: 'C++ is a powerful programming language used for system programming, game development, and performance-critical applications.'
    },
    'C': {
        icon: 'fas fa-code',
        text: 'C is a foundational programming language known for its efficiency and control over system resources, widely used in system programming.'
    },
    'PHP': {
        icon: 'fab fa-php',
        text: 'PHP is a server-side scripting language designed for web development, powering many websites and content management systems.'
    },
    'C#': {
        icon: 'fas fa-code',
        text: 'C# is a modern, object-oriented programming language developed by Microsoft, used for Windows applications and web development.'
    },

    // Web Technologies
    'HTML5': {
        icon: 'fab fa-html5',
        text: 'HTML5 is the latest version of HTML, providing semantic elements, multimedia support, and modern web standards for building web pages.'
    },
    'CSS3': {
        icon: 'fab fa-css3-alt',
        text: 'CSS3 is the latest version of CSS, offering advanced styling capabilities including animations, gradients, and responsive design features.'
    },
    'MySQL': {
        icon: 'fas fa-database',
        text: 'MySQL is a popular open-source relational database management system used for storing and managing data in web applications.'
    },
    'WordPress': {
        icon: 'fab fa-wordpress',
        text: 'WordPress is a content management system that powers over 40% of websites, offering flexibility and ease of use for web development.'
    },
    'XAMPP': {
        icon: 'fas fa-server',
        text: 'XAMPP is a free, cross-platform web server solution stack package consisting of Apache, MySQL, PHP, and Perl for local development.'
    },

    // Tools & IDEs
    'Android Studio': {
        icon: 'fab fa-android',
        text: 'Android Studio is the official IDE for Android development, providing comprehensive tools for building Android applications.'
    },
    'GitHub': {
        icon: 'fab fa-github',
        text: 'GitHub is a web-based platform for version control and collaboration, allowing developers to host and review code, manage projects, and build software together.'
    },
    'IntelliJ IDEA': {
        icon: 'fas fa-laptop-code',
        text: 'IntelliJ IDEA is a powerful IDE for Java development with intelligent coding assistance, debugging tools, and framework support.'
    },
    'Eclipse': {
        icon: 'fas fa-laptop-code',
        text: 'Eclipse is a popular open-source IDE primarily used for Java development, with extensive plugin support for various programming languages.'
    },
    'Xcode': {
        icon: 'fab fa-apple',
        text: 'Xcode is Apple\'s integrated development environment for creating apps for iOS, macOS, watchOS, and tvOS platforms.'
    },

    // AI Tools & Platforms
    'ChatGPT': {
        icon: 'fas fa-robot',
        text: 'ChatGPT is an AI-powered conversational model that can assist with coding, writing, problem-solving, and various creative tasks.'
    },
    'Claude AI': {
        icon: 'fas fa-brain',
        text: 'Claude AI is an advanced AI assistant created by Anthropic, designed to be helpful, harmless, and honest in various tasks and conversations.'
    },
    'Gemini': {
        icon: 'fas fa-gem',
        text: 'Gemini is Google\'s advanced AI model designed for multimodal understanding, capable of processing text, images, and code.'
    },
    'Prompt Engineering': {
        icon: 'fas fa-magic',
        text: 'Prompt Engineering is the practice of designing effective prompts to get optimal responses from AI models and language models.'
    },
    'LLM APIs': {
        icon: 'fas fa-plug',
        text: 'LLM APIs provide programmatic access to Large Language Models, enabling developers to integrate AI capabilities into applications.'
    },

    // Project Technologies
    'Flask': {
        icon: 'fas fa-flask',
        text: 'Flask is a lightweight Python web framework that provides tools and libraries for building web applications quickly and efficiently.'
    },
    'Machine Learning': {
        icon: 'fas fa-brain',
        text: 'Machine Learning is a field of AI that enables computers to learn from data and make predictions or decisions without explicit programming.'
    },
    'Chart.js': {
        icon: 'fas fa-chart-bar',
        text: 'Chart.js is a JavaScript library that makes it easy to create responsive, interactive data visualizations and charts for web applications.'
    },
    'Random Forest': {
        icon: 'fas fa-tree',
        text: 'Random Forest is a machine learning algorithm that uses multiple decision trees to improve accuracy and prevent overfitting in predictions.'
    },
    'NLP': {
        icon: 'fas fa-language',
        text: 'Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret, and generate human language.'
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
    // Set up event listeners
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
        handleScrollToTop();
        handleParallax();
    });

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