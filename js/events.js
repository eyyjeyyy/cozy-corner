// Events Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Event Data (in a real application, this would come from a database)
    const eventData = {
        'featured': {
            title: 'Coffee Tasting Workshop',
            date: '2024-12-15',
            time: '14:00-16:00',
            description: 'Join our expert baristas for an afternoon of coffee tasting and learning about different brewing methods.',
            price: 45,
            category: 'workshops',
            capacity: 20,
            location: 'Main Cafe Area',
            image: 'images/events/event1.webp'
        },
        'events': [
            {
                id: 1,
                title: 'Latte Art Workshop',
                date: '2024-12-20',
                time: '15:00-17:00',
                description: 'Learn the art of creating beautiful latte designs from our expert baristas.',
                price: 35,
                category: 'workshops',
                image: 'images/events/latte-workshop.jpeg'
            },
            {
                id: 2,
                title: 'Jazz Night',
                date: '2024-12-22',
                time: '19:00-22:00',
                description: 'Enjoy an evening of smooth jazz with local artists while sipping your favorite coffee.',
                price: 0,
                category: 'live-music',
                image: 'images/events/jazz-music.jpg'
            },
            {
                id: 3,
                title: 'Pastry Making Class',
                date: '2024-12-27',
                time: '10:00-13:00',
                description: 'Learn to make delicious pastries with our experienced pastry chef.',
                price: 50,
                category: 'workshops',
                image: 'images/events/pastry-class.png'
            }
        ]
    };

    // Initialize Elements
    const categoryButtons = document.querySelectorAll('.category-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    const eventsGrid = document.querySelector('.events-grid');
    const calendar = document.querySelector('.calendar-grid');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');

    let currentDate = new Date();
    let currentView = 'grid';

    // Calendar Navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });

    // View Toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (view !== currentView) {
                currentView = view;
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                eventsGrid.className = `events-grid ${view}-view`;
                initializeAnimations();
            }
        });
    });

    // Category Filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterEvents(category);
        });
    });

    function filterEvents(category) {
        const cards = document.querySelectorAll('.event-card');
        cards.forEach((card, index) => {
            const shouldShow = category === 'all' || card.dataset.category === category;
            card.style.transition = `all 0.3s ease ${index * 0.1}s`;
            
            if (shouldShow) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }

    // Calendar Generation
    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];

        document.querySelector('.calendar-month').textContent = `${monthNames[month]} ${year}`;

        const calendarDays = document.querySelector('.calendar-days');
        calendarDays.innerHTML = '';

        // Add day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'day-name';
            dayEl.textContent = day;
            calendarDays.appendChild(dayEl);
        });

        // Add empty cells before first day
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }

        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (hasEvent(dateString)) {
                dayEl.classList.add('has-event');
                const indicator = document.createElement('div');
                indicator.className = 'event-indicator';
                dayEl.appendChild(indicator);
            }

            dayEl.innerHTML = `${day}${dayEl.innerHTML || ''}`;
            dayEl.addEventListener('click', () => showEventsForDate(dateString));
            calendarDays.appendChild(dayEl);
        }
    }

    function hasEvent(dateString) {
        return eventData.events.some(event => event.date === dateString) || 
               eventData.featured.date === dateString;
    }

    // Event Details Popup
    function showEventDetails(event) {
        const template = document.getElementById('event-details-template');
        const popup = template.content.cloneNode(true).querySelector('.event-popup');
        
        // Populate popup content
        popup.querySelector('.event-image').src = event.image;
        popup.querySelector('.event-tag').textContent = event.category;
        popup.querySelector('h3').textContent = event.title;
        popup.querySelector('.event-date').textContent = formatDate(event.date);
        popup.querySelector('.event-time').textContent = event.time;
        popup.querySelector('.event-price').textContent = event.price === 0 ? 'Free' : `$${event.price}`;
        popup.querySelector('.event-description').textContent = event.description;

        // Add close functionality
        popup.querySelector('.close-btn').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });

        // Add registration handler
        popup.querySelector('.register-btn').addEventListener('click', () => {
            showRegistrationForm(event);
        });

        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 10);
    }

    // Registration Form
    function showRegistrationForm(event) {
        const template = document.getElementById('registration-form-template');
        const popup = template.content.cloneNode(true).querySelector('.registration-popup');

        const form = popup.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegistration(event, form);
        });

        popup.querySelector('.close-btn').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });

        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 10);
    }

    function handleRegistration(event, form) {
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        showNotification('Registration successful! Check your email for confirmation.');
        form.closest('.registration-popup').querySelector('.close-btn').click();
    }

    // Utility Functions
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Event Countdown
    function updateCountdowns() {
        document.querySelectorAll('.event-countdown').forEach(countdown => {
            const dateStr = countdown.dataset.date;
            if (!dateStr) return;

            const eventDate = new Date(dateStr);
            const now = new Date();
            const diff = eventDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                countdown.textContent = `${days}d ${hours}h until event`;
            } else {
                countdown.textContent = 'Event has ended';
            }
        });
    }

    // Initialize
    function initialize() {
        generateCalendar(currentDate);
        updateCountdowns();
        setInterval(updateCountdowns, 60000); // Update countdowns every minute
        initializeAnimations();

        // Add click handlers to event cards
        document.querySelectorAll('.event-card').forEach(card => {
            card.querySelector('.details-btn').addEventListener('click', () => {
                const eventId = parseInt(card.dataset.id);
                const event = eventData.events.find(e => e.id === eventId);
                if (event) showEventDetails(event);
            });
        });

        // Featured event registration
        document.querySelector('.featured-event .register-btn').addEventListener('click', () => {
            showRegistrationForm(eventData.featured);
        });
    }

    function initializeAnimations() {
        const cards = document.querySelectorAll('.event-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Start the application
    initialize();
});