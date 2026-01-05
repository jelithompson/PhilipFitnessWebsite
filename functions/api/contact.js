/* ==========================================
   CLOUDFLARE WORKER - CONTACT FORM HANDLER
   Handles contact form submissions with validation
   Future: Will integrate with Resend/Mailgun for emails
   ========================================== */

/**
 * Main request handler for Cloudflare Pages Functions
 * Endpoint: /functions/contact
 * Method: POST
 */
export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        // Parse form data
        const formData = await request.formData();
        
        // Extract fields
        const name = formData.get('name')?.trim() || '';
        const email = formData.get('email')?.trim() || '';
        const phone = formData.get('phone')?.trim() || '';
        const subject = formData.get('subject')?.trim() || '';
        const message = formData.get('message')?.trim() || '';
        
        // HONEYPOT FIELD - if filled, it's likely a bot
        const honeypot = formData.get('website')?.trim() || '';
        
        // Check honeypot - reject if filled
        if (honeypot) {
            console.log('Honeypot triggered - likely spam');
            return createJsonResponse({
                success: false,
                message: 'Invalid submission detected.'
            }, 400);
        }
        
        // Validate required fields
        const validationErrors = [];
        
        if (!name || name.length < 2) {
            validationErrors.push('Name must be at least 2 characters long');
        }
        
        if (!email || !isValidEmail(email)) {
            validationErrors.push('Please provide a valid email address');
        }
        
        if (!message || message.length < 10) {
            validationErrors.push('Message must be at least 10 characters long');
        }
        
        // Return validation errors if any
        if (validationErrors.length > 0) {
            return createJsonResponse({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            }, 400);
        }
        
        // Sanitize inputs (basic XSS prevention)
        const sanitizedData = {
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            phone: sanitizeInput(phone),
            subject: sanitizeInput(subject),
            message: sanitizeInput(message),
            submittedAt: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || 'Unknown'
        };
        
        // ============================================
        // FUTURE: EMAIL INTEGRATION POINT
        // ============================================
        // Option 1: Resend API
        // const emailResult = await sendEmailViaResend(sanitizedData, env.RESEND_API_KEY);
        
        // Option 2: Mailgun API
        // const emailResult = await sendEmailViaMailgun(sanitizedData, env.MAILGUN_API_KEY);
        
        // Option 3: SendGrid API
        // const emailResult = await sendEmailViaSendGrid(sanitizedData, env.SENDGRID_API_KEY);
        
        // Option 4: Forward to Django backend
        // const result = await forwardToDjangoBackend(sanitizedData, env.DJANGO_API_URL, env.API_KEY);
        
        // For now: Log to console and simulate success
        console.log('Contact form submission received:', {
            name: sanitizedData.name,
            email: sanitizedData.email,
            subject: sanitizedData.subject,
            timestamp: sanitizedData.submittedAt
        });
        
        // Simulate processing delay (remove in production)
        await simulateDelay(500);
        
        // Return success response
        return createJsonResponse({
            success: true,
            message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
            data: {
                name: sanitizedData.name,
                email: sanitizedData.email,
                timestamp: sanitizedData.submittedAt
            }
        }, 200);
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        return createJsonResponse({
            success: false,
            message: 'An error occurred while processing your request. Please try again later.',
            error: error.message
        }, 500);
    }
}

/**
 * Handle GET requests - return method not allowed
 */
export async function onRequestGet() {
    return createJsonResponse({
        success: false,
        message: 'Method not allowed. Please use POST.'
    }, 405);
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders()
    });
}

/* ==========================================
   HELPER FUNCTIONS
   ========================================== */

/**
 * Create a JSON response with CORS headers
 */
function createJsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status: status,
        headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders()
        }
    });
}

/**
 * Get CORS headers
 * SECURITY: In production, replace '*' with your actual domain
 */
function getCorsHeaders() {
    // FUTURE: Update this to your actual domain
    // const allowedOrigin = 'https://yourdomain.com';
    
    return {
        'Access-Control-Allow-Origin': '*', // CHANGE IN PRODUCTION
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Basic input sanitization
 * Removes potentially harmful characters
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .substring(0, 5000); // Limit length
}

/**
 * Simulate async delay (for demo purposes)
 */
function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ==========================================
   FUTURE EMAIL INTEGRATION FUNCTIONS
   Uncomment and configure when ready
   ========================================== */

/**
 * Send email via Resend API
 * Docs: https://resend.com/docs/send-with-nodejs
 */
/*
async function sendEmailViaResend(data, apiKey) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Philip Fitness <noreply@yourdomain.com>',
            to: ['info@philipfitness.com'],
            reply_to: data.email,
            subject: `New Contact Form: ${data.subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Submitted at: ${data.submittedAt}</small></p>
            `
        })
    });
    
    if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`);
    }
    
    return await response.json();
}
*/

/**
 * Send email via Mailgun API
 * Docs: https://documentation.mailgun.com/en/latest/api-sending.html
 */
/*
async function sendEmailViaMailgun(data, apiKey) {
    const domain = 'yourdomain.com'; // Your Mailgun domain
    const formData = new FormData();
    
    formData.append('from', 'Philip Fitness <noreply@yourdomain.com>');
    formData.append('to', 'info@philipfitness.com');
    formData.append('subject', `New Contact Form: ${data.subject}`);
    formData.append('text', `
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone || 'Not provided'}
        Subject: ${data.subject}
        
        Message:
        ${data.message}
        
        Submitted at: ${data.submittedAt}
    `);
    formData.append('h:Reply-To', data.email);
    
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`api:${apiKey}`)
        },
        body: formData
    });
    
    if (!response.ok) {
        throw new Error(`Mailgun API error: ${response.statusText}`);
    }
    
    return await response.json();
}
*/

/**
 * Forward to Django backend API
 */
/*
async function forwardToDjangoBackend(data, apiUrl, apiKey) {
    const response = await fetch(`${apiUrl}/api/contact/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Django API error: ${response.statusText}`);
    }
    
    return await response.json();
}
*/
