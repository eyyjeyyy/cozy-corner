// Home Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Featured Coffee Items Data
    const featuredItems = [
        {
            image: 'images/featured/cappuccino.webp',
            title: 'Cappuccino',
            price: '$4.99',
            description: 'Rich espresso topped with foamy milk'
        },
        {
            image: 'images/map/latte.webp',
            title: 'Latte',
            price: '$4.49',
            description: 'Smooth espresso with steamed milk'
        },
        {
            image: 'images/featured/mocha.jpg',
            title: 'Mocha',
            price: '$5.99',
            description: 'Coffee with chocolate and whipped cream'
        }
    ];

    // Add error handling for images
    function handleImageError(img) {
        img.onerror = function() {
            this.src = 'https://placehold.co/400x300?text=Coffee';
            console.log(`Failed to load image: ${img.src}`);
        };
        img.onload = function() {
            this.classList.remove('loading');
        };
        img.classList.add('loading');
    }

    // Dynamically load featured items
    const coffeeGrid = document.querySelector('.coffee-grid');
    
    function loadFeaturedItems() {
        coffeeGrid.innerHTML = '';
        featuredItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'coffee-card';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2}s`;
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="loading">
                <h3>${item.title}</h3>
                <p class="description">${item.description}</p>
                <p class="price">${item.price}</p>
                <button class="order-btn">Order Now</button>
            `;
            
            // Add error handling to the image
            const img = card.querySelector('img');
            handleImageError(img);
            
            coffeeGrid.appendChild(card);
        });
    }

    // Initialize featured items
    loadFeaturedItems();

    // Add click handlers for order buttons
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.coffee-card');
            const itemName = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            
            showNotification(`Thank you for ordering ${itemName}! Our staff will prepare it right away.`);
            
            // Add animation to the card
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Menu button functionality
    const menuButton = document.querySelector('.hero-text button');
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            window.location.href = 'menu.html';
        });
    }

    // Read More button functionality
    const readMoreButton = document.querySelector('.about-preview button');
    if (readMoreButton) {
        readMoreButton.addEventListener('click', function() {
            window.location.href = 'about.html';
        });
    }

    // Hero section animation
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroText.style.transition = 'all 0.8s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 300);
    }

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add styles to notification
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--color-brown);
            color: var(--color-light);
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        document.body.appendChild(notification);

        // Animate notification
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        // Remove notification after delay
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add scroll animations
    function handleScroll() {
        const cards = document.querySelectorAll('.coffee-card');
        const aboutPreview = document.querySelector('.about-preview');
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.85) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });

        if (aboutPreview) {
            const aboutTop = aboutPreview.getBoundingClientRect().top;
            if (aboutTop < window.innerHeight * 0.85) {
                aboutPreview.style.opacity = '1';
                aboutPreview.style.transform = 'translateY(0)';
            }
        }
    }

    // Initialize scroll animations
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Add hover effects to cards
    document.querySelectorAll('.coffee-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});