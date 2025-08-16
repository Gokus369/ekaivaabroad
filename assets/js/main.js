// Global Variables
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.dot');
let testimonialInterval;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100
    });
  }

  // Initialize all components
  initializeHeader();
  initializeMobileMenu();
  initializeCounters();
  initializeTestimonials();
  initializeContactForm();
  initializeSmoothScrolling();
  initializeWhatsApp();

  // Start counter animations when stats section is visible
  observeStatsSection();
});

// Header Functionality
function initializeHeader() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Active navigation link
  window.addEventListener('scroll', function () {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// Mobile Menu
function initializeMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('nav');

  mobileMenuToggle.addEventListener('click', function () {
    nav.classList.toggle('mobile-open');
    mobileMenuToggle.classList.toggle('active');
  });

  // Close menu when clicking nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      mobileMenuToggle.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (event) {
    if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
      nav.classList.remove('mobile-open');
      mobileMenuToggle.classList.remove('active');
    }
  });
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  }

  // Function to start counters
  window.startCounters = function () {
    counters.forEach(counter => {
      if (!counter.classList.contains('counted')) {
        counter.classList.add('counted');
        animateCounter(counter);
      }
    });
  };
}

// Observe Stats Section
function observeStatsSection() {
  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounters();
      }
    });
  }, {
    threshold: 0.3
  });

  observer.observe(statsSection);
}

// Testimonials Functionality
function initializeTestimonials() {
  if (testimonials.length === 0) return;

  showTestimonial(0);
  startTestimonialInterval();
}

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.classList.remove('active');
    if (testimonialDots[i]) {
      testimonialDots[i].classList.remove('active');
    }
  });

  if (testimonials[index]) {
    testimonials[index].classList.add('active');
    if (testimonialDots[index]) {
      testimonialDots[index].classList.add('active');
    }
  }

  currentTestimonial = index;
}

function nextTestimonial() {
  const next = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(next);
  resetTestimonialInterval();
}

function prevTestimonial() {
  const prev = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(prev);
  resetTestimonialInterval();
}

function currentTestimonialSlide(index) {
  showTestimonial(index);
  resetTestimonialInterval();
}

function startTestimonialInterval() {
  testimonialInterval = setInterval(nextTestimonial, 5000);
}

function resetTestimonialInterval() {
  clearInterval(testimonialInterval);
  startTestimonialInterval();
}

// Global functions for testimonials
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.currentTestimonial = currentTestimonialSlide;

// Contact Form
function initializeContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    const formMessage = document.getElementById('form-message');

    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    // Validate form
    if (!data.name || !data.email || !data.subject || !data.message) {
      showFormMessage('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(data.email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    // Show loading state
    btn.classList.add('loading');
    btn.disabled = true;

    try {
      // Simulate API call (replace with actual email service)
      await simulateEmailSend(data);

      // Success
      showFormMessage('Thank you! Your message has been sent successfully.', 'success');
      form.reset();

    } catch (error) {
      // Error
      showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      // Reset button state
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
}

function showFormMessage(message, type) {
  const formMessage = document.getElementById('form-message');
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';

  // Hide message after 5 seconds
  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function simulateEmailSend(data) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real application, you would send the email here
  console.log('Email data:', data);

  // For demo purposes, we'll just log the data
  // You can integrate with EmailJS, Formspree, or your own backend

  return { success: true };
}

// Smooth Scrolling
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// WhatsApp Functionality
function initializeWhatsApp() {
  const whatsappButton = document.getElementById('whatsapp-button');
  const whatsappChat = document.getElementById('whatsapp-chat');

  // Auto-hide chat when clicking outside
  document.addEventListener('click', function (event) {
    if (!whatsappChat.contains(event.target) && !whatsappButton.contains(event.target)) {
      whatsappChat.classList.remove('active');
    }
  });
}

function toggleWhatsAppChat() {
  const whatsappChat = document.getElementById('whatsapp-chat');
  whatsappChat.classList.toggle('active');
}

function sendWhatsAppMessage(message) {
  const phoneNumber = '+919037951594'; // Replace with actual WhatsApp number
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');

  // Close chat widget
  const whatsappChat = document.getElementById('whatsapp-chat');
  whatsappChat.classList.remove('active');
}

function sendCustomWhatsAppMessage() {
  const messageInput = document.getElementById('whatsapp-message');
  const message = messageInput.value.trim();

  if (message) {
    sendWhatsAppMessage(message);
    messageInput.value = '';
  }
}

// Make WhatsApp functions global
window.toggleWhatsAppChat = toggleWhatsAppChat;
window.sendWhatsAppMessage = sendWhatsAppMessage;
window.sendCustomWhatsAppMessage = sendCustomWhatsAppMessage;

// Newsletter Form
document.addEventListener('DOMContentLoaded', function () {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;

      if (isValidEmail(email)) {
        // Simulate newsletter subscription
        alert('Thank you for subscribing to our newsletter!');
        this.reset();
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }
});

// Scroll to Top Functionality
function addScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollBtn.classList.add('scroll-to-top');
  scrollBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 45px;
        height: 45px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        font-size: 14px;
    `;

  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  });

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize scroll to top when DOM is loaded
document.addEventListener('DOMContentLoaded', addScrollToTop);

// Loading Animation for Images
function initializeImageLoading() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () {
        this.classList.add('loaded');
      });
    }
  });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', initializeImageLoading);

// Parallax Effect for Hero Section
function initializeParallax() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    const heroImg = heroSection.querySelector('.hero-bg img');
    if (heroImg) {
      heroImg.style.transform = `translateY(${rate}px)`;
    }
  });
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', initializeParallax);

// Intersection Observer for Animation Triggers
function initializeAnimationObserver() {
  const animatedElements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });
}

// Error handling for images
function handleImageErrors() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    img.addEventListener('error', function () {
      this.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Image+Not+Found';
      this.alt = 'Image not found';
    });
  });
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', handleImageErrors);

// Preloader
function initializePreloader() {
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <h2>Ekaiva Business Limited</h2>
            </div>
            <div class="preloader-spinner"></div>
        </div>
    `;
  preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: white;
        transition: opacity 0.5s ease;
    `;

  const style = document.createElement('style');
  style.textContent = `
        .preloader-logo h2 {
            font-size: 2rem;
            margin-bottom: 2rem;
            background: linear-gradient(135deg, #f97316, #fbbf24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .preloader-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #f97316;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

  document.head.appendChild(style);
  document.body.appendChild(preloader);

  window.addEventListener('load', function () {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 1000);
  });
}

// Initialize preloader
initializePreloader();

// Console welcome message
console.log(`
%c🚀 Ekaiva Business Limited Website
%cBuilt with HTML, CSS & JavaScript
%c✨ Modern design with smooth animations
`,
  'color: #1e3a8a; font-size: 24px; font-weight: bold;',
  'color: #f97316; font-size: 16px;',
  'color: #10b981; font-size: 14px;'
);