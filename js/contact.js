// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form Validation and Handling
    const contactForm = document.querySelector('.contact-form');
    const formInputs = contactForm.querySelectorAll('input, textarea, select');

    // Real-time validation
    formInputs.forEach(input => {
        // Add validation status indicators
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'validation-status';
        input.parentNode.appendChild(statusIndicator);

        input.addEventListener('input', function() {
            validateInput(this);
        });

        input.addEventListener('blur', function() {
            validateInput(this, true);
        });
    });

    function validateInput(input, showMessage = false) {
        const statusIndicator = input.parentNode.querySelector('.validation-status');
        let isValid = true;
        let message = '';

        switch(input.type) {
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailPattern.test(input.value);
                message = 'Please enter a valid email address';
                break;

            case 'tel':
                const phonePattern = /^\+?[\d\s-]{10,}$/;
                isValid = phonePattern.test(input.value);
                message = 'Please enter a valid phone number';
                break;

            case 'text':
                isValid = input.value.length >= 2;
                message = 'Must be at least 2 characters long';
                break;

            case 'textarea':
                isValid = input.value.length >= 10;
                message = 'Message must be at least 10 characters long';
                break;
        }

        // Update status indicator
        statusIndicator.className = `validation-status ${isValid ? 'valid' : 'invalid'}`;
        
        if (showMessage && !isValid) {
            showValidationMessage(input, message);
        }

        return isValid;
    }

    function showValidationMessage(input, message) {
        let messageElement = input.parentNode.querySelector('.validation-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'validation-message';
            input.parentNode.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.style.opacity = '1';

        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => messageElement.remove(), 300);
        }, 3000);
    }

    // Form Submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        formInputs.forEach(input => {
            if (!validateInput(input, true)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Simulate form submission
            const submitButton = this.querySelector('.submit-btn');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Sending...';

            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.');
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }, 1500);
        }
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('p');
        
        // Initially hide answers
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'all 0.3s ease';
        
        // Add click handler
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('p');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.opacity = '0';
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
            } else {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
            }
        });

        // Add arrow indicator
        const arrow = document.createElement('span');
        arrow.className = 'faq-arrow';
        arrow.innerHTML = '›';
        question.appendChild(arrow);
    });

    // Interactive Map
    const mapContainer = document.querySelector('.map-container');
    mapContainer.addEventListener('click', () => {
        // Open larger map view
        const mapModal = document.createElement('div');
        mapModal.className = 'map-modal';
        mapModal.innerHTML = `
            <div class="map-modal-content">
                <img src="/api/placeholder/800/600" alt="Large Map View">
                <button class="close-map">×</button>
                <div class="map-controls">
                    <button class="zoom-in">+</button>
                    <button class="zoom-out">-</button>
                    <button class="directions">Get Directions</button>
                </div>
            </div>
        `;
        document.body.appendChild(mapModal);

        // Add close functionality
        mapModal.querySelector('.close-map').addEventListener('click', () => {
            mapModal.classList.add('fade-out');
            setTimeout(() => mapModal.remove(), 300);
        });
    });

    // Social Media Links Animation
    const socialLinks = document.querySelectorAll('.social-btn');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Business Hours Highlight
    function highlightCurrentBusinessHours() {
        const now = new Date();
        const currentDay = now.getDay();
        const currentHour = now.getHours();

        const hoursList = document.querySelector('.hours-list');
        const hoursItems = hoursList.querySelectorAll('li');

        hoursItems.forEach((item, index) => {
            // Remove any existing highlights
            item.classList.remove('current-hours');
            
            // Highlight current day's hours
            if ((index === currentDay - 1) || (currentDay === 0 && index === 6)) {
                item.classList.add('current-hours');
                
                // Check if currently open
                const hours = item.textContent.match(/(\d+):(\d+)\s*([AP]M)/g);
                if (hours && hours.length === 2) {
                    const [openTime, closeTime] = hours;
                    const isOpen = isCurrentlyOpen(currentHour, openTime, closeTime);
                    
                    const status = document.createElement('span');
                    status.className = `status ${isOpen ? 'open' : 'closed'}`;
                    status.textContent = isOpen ? ' (Open Now)' : ' (Closed)';
                    item.appendChild(status);
                }
            }
        });
    }

    function isCurrentlyOpen(currentHour, openTime, closeTime) {
        // Convert time strings to 24-hour format for comparison
        const openHour = convertTo24Hour(openTime);
        const closeHour = convertTo24Hour(closeTime);
        return currentHour >= openHour && currentHour < closeHour;
    }

    function convertTo24Hour(timeStr) {
        const [time, period] = timeStr.split(/(?=[AP]M)/);
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return hours;
    }

    // Initialize business hours highlight
    highlightCurrentBusinessHours();

    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});