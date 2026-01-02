/* =========================================
   MAIN JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. UI INTERACTIONS (Menu, Scroll, etc.)
    // =========================================

    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');

    // Create Overlay
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    // Create Dedicated Mobile Drawer (Clone)
    const mobileDrawer = document.createElement('div');
    mobileDrawer.className = 'mobile-drawer';

    if (navMenu) {
        mobileDrawer.innerHTML = navMenu.innerHTML;
        document.body.appendChild(mobileDrawer);
    }

    function toggleMenu() {
        const isActive = mobileDrawer.classList.contains('active');

        if (!isActive) {
            mobileDrawer.classList.add('active');
            mobileToggle.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        } else {
            mobileDrawer.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';

            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    overlay.addEventListener('click', toggleMenu);

    mobileDrawer.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('.btn')) {
            toggleMenu();
        }
    });

    // Sticky Header Logic (Transparent to Solid)
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Initialize on load

    // Scroll Animation (Fade In Up)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.destination-card, .process-card, .testimonial-card, .section-title, .about-content');

    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(el);
    });


    // =========================================
    // 2. FORM HANDLING & VALIDATION
    // =========================================

    // Configuration
    const FORMSUBMIT_URL = "https://formsubmit.co/ajax/info@mensatglobal.com";
    const WA_PHONE = "918529350150";

    /**
     * Generic function to handle form submission via AJAX
     */
    const handleFormSubmit = async (formElement, statusElementId, btnElement) => {
        const statusDiv = document.getElementById(statusElementId);
        const spinner = btnElement.querySelector('.loading-spinner');

        // 1. Reset Status
        statusDiv.style.display = 'none';
        statusDiv.className = 'form-status';

        // 2. Show Loading
        if (spinner) spinner.style.display = 'inline-block';
        btnElement.disabled = true;

        // 3. Collect Data
        const formData = new FormData(formElement);
        if (!formData.has('_subject')) {
            formData.append('_subject', 'New Visa Enquiry - Mens At Global Website');
        }

        try {
            const response = await fetch(FORMSUBMIT_URL, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success === "true" || response.ok) {
                // Success
                statusDiv.innerText = "Thank you! Your enquiry has been sent successfully. We will contact you shortly.";
                statusDiv.classList.add('success');
                statusDiv.style.display = 'block';
                formElement.reset();
            } else {
                throw new Error("Form submission failed");
            }

        } catch (error) {
            console.error(error);
            statusDiv.innerText = "Something went wrong. Please try again or contact us via WhatsApp.";
            statusDiv.classList.add('error');
            statusDiv.style.display = 'block';
        } finally {
            if (spinner) spinner.style.display = 'none';
            btnElement.disabled = false;
        }
    };

    /**
     * Validate Inputs Live
     */
    const validateInput = (input) => {
        const errorMsg = input.nextElementSibling;
        let isValid = true;

        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
        }

        if (input.type === 'email' && input.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value)) isValid = false;
        }

        if (input.type === 'tel' && input.value) {
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(input.value.replace(/\D/g, ''))) isValid = false;
        }

        if (!isValid && input.value !== "") {
            input.classList.add('input-error');
            if (errorMsg && errorMsg.classList.contains('error-msg')) errorMsg.style.display = 'block';
        } else {
            input.classList.remove('input-error');
            if (errorMsg && errorMsg.classList.contains('error-msg')) errorMsg.style.display = 'none';
        }

        return isValid;
    };

    // Attach to Main Contact Form
    const contactForm = document.getElementById('consultation-form');
    if (contactForm) {
        const submitBtn = document.getElementById('submit-btn');

        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
                const err = input.nextElementSibling;
                if (err && err.classList.contains('error-msg')) err.style.display = 'none';
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formValid = true;
            contactForm.querySelectorAll('[required]').forEach(input => {
                if (!validateInput(input)) formValid = false;
            });

            if (formValid) {
                handleFormSubmit(contactForm, 'form-status', submitBtn);
            }
        });
    }

    // Attach to Home Quick Enquiry Form
    const homeForm = document.getElementById('home-enquiry-form');
    if (homeForm) {
        const submitBtn = homeForm.querySelector('button[type="submit"]');
        homeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = homeForm.querySelectorAll('[required]');
            let valid = true;
            inputs.forEach(i => {
                if (!i.value.trim()) {
                    i.classList.add('input-error');
                    valid = false;
                } else {
                    i.classList.remove('input-error');
                }
            });

            if (valid) {
                handleFormSubmit(homeForm, 'home-form-status', submitBtn);
            }
        });
    }


    // =========================================
    // 3. WHATSAPP INTEGRATION
    // =========================================

    const sendToWhatsApp = (name, type, phone, message) => {
        let text = `Hello Mens At Global,`;
        if (name) text += `%0aMy name is ${encodeURIComponent(name)}.`;
        if (type) text += `%0aI am interested in ${encodeURIComponent(type)}.`;
        if (phone) text += `%0aMy phone is ${encodeURIComponent(phone)}.`;
        if (message) text += `%0a%0aMessage: ${encodeURIComponent(message)}`;

        const url = `https://wa.me/${WA_PHONE}?text=${text}`;
        window.open(url, '_blank');
    };

    const waBtn = document.getElementById('whatsapp-btn');
    if (waBtn && contactForm) {
        waBtn.addEventListener('click', () => {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const type = document.getElementById('visa-type').value;
            const msg = document.getElementById('message').value;

            sendToWhatsApp(name, type, phone, msg);
        });
    }

    const homeWaBtn = document.querySelector('.home-whatsapp-btn');
    if (homeWaBtn && homeForm) {
        homeWaBtn.addEventListener('click', () => {
            const name = document.getElementById('home-name').value;
            const phone = document.getElementById('home-phone').value;
            const type = document.getElementById('home-visa-type').value;

            sendToWhatsApp(name, type, phone, "");
        });
    }
});
