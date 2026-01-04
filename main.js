/* ==========================================
   PHILIP FITNESS WEBSITE - MAIN JAVASCRIPT
   Interactive Features for Static Site
   Future Django/AJAX Integration Ready
   ========================================== */

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initPaymentSimulation();
    initContactForm();
    initScrollEffects();
    setActiveNavLink();
});

// ==========================================
// NAVIGATION
// Mobile menu toggle and active states
// ==========================================
function initNavigation() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            
            // Animate hamburger icon
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navbarMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            });
        });
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// PAYMENT SIMULATION
// Placeholder for PayPal integration
// Django: Will replace with actual payment backend
// ==========================================
function initPaymentSimulation() {
    const paymentButtons = document.querySelectorAll('.payment-btn');
    const modal = document.getElementById('paymentModal');
    const closeModal = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    paymentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const planName = this.getAttribute('data-plan');
            const planPrice = this.getAttribute('data-price');
            
            // Simulate payment processing
            simulatePayment(planName, planPrice);
        });
    });
    
    // Close modal functionality
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

// Simulate payment processing
// Django: This will be replaced with actual Stripe/PayPal integration
function simulatePayment(planName, planPrice) {
    const modal = document.getElementById('paymentModal');
    const modalBody = modal.querySelector('.modal-body');
    
    // Show processing state
    modalBody.innerHTML = `
        <div class="text-center">
            <div class="spinner"></div>
            <p class="mt-md">Processing your payment...</p>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Simulate API call delay
    setTimeout(function() {
        // Show success message
        modalBody.innerHTML = `
            <div class="text-center">
                <div class="success-icon">✓</div>
                <h3>Payment Successful!</h3>
                <p>You have successfully subscribed to the <strong>${planName}</strong> plan.</p>
                <p>Amount charged: <strong>$${planPrice}</strong></p>
                <p class="mt-md">A confirmation email has been sent to your inbox.</p>
                <button class="btn btn-primary mt-md" onclick="closePaymentModal()">Get Started</button>
            </div>
        `;
        
        // Django: Here you would:
        // 1. Create a subscription record in the database
        // 2. Send confirmation email
        // 3. Redirect to dashboard or onboarding
        // 4. Update user's subscription status
        
        console.log('Payment simulated:', { planName, planPrice });
    }, 2000);
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
    
    // Django: Redirect to dashboard or next step
    // window.location.href = '/dashboard/';
}

// ==========================================
// CONTACT FORM
// Django: Will submit to backend API
// ==========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone')?.value || '',
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!validateContactForm(formData)) {
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        // Simulate form submission
        // Django: Replace with actual AJAX call to backend
        setTimeout(function() {
            // Show success message
            showFormSuccess('Thank you for your message! We\'ll get back to you within 24 hours.');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            
            // Django: Here you would:
            // fetch('/api/contact/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRFToken': getCookie('csrftoken')
            //     },
            //     body: JSON.stringify(formData)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     showFormSuccess(data.message);
            //     contactForm.reset();
            // })
            // .catch(error => {
            //     showFormError('An error occurred. Please try again.');
            // });
            
            console.log('Form submitted:', formData);
        }, 1500);
    });
}

// Validate contact form
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    if (errors.length > 0) {
        showFormError(errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form success message
function showFormSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.style.cssText = `
        background-color: #00C9A7;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        animation: fadeInUp 0.3s ease;
    `;
    alertDiv.innerHTML = message;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    // Remove after 5 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Show form error message
function showFormError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error';
    alertDiv.style.cssText = `
        background-color: #FF6B35;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        animation: fadeInUp 0.3s ease;
    `;
    alertDiv.innerHTML = message;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    // Remove after 5 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// ==========================================
// SCROLL EFFECTS
// Fade in elements on scroll
// ==========================================
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all feature cards, pricing cards, etc.
    const animatedElements = document.querySelectorAll(
        '.feature-card, .pricing-card, .testimonial-card'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ==========================================
// SMOOTH SCROLLING
// For anchor links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// UTILITY FUNCTIONS
// Django: Helper functions for CSRF tokens, etc.
// ==========================================

// Get CSRF token from cookies (for Django)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ==========================================
// CONSOLE LOG
// ==========================================
console.log('Philip Fitness Website initialized');
console.log('Django integration ready for:');
console.log('- Payment processing');
console.log('- Contact form submission');
console.log('- User authentication');
console.log('- Dynamic content loading');
