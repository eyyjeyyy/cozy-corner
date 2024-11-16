// Menu Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Menu filtering system with counts
    const menuSections = document.querySelectorAll('.menu-section');
    const menuFilters = document.createElement('div');
    menuFilters.className = 'menu-filters';

    // Count items in each category
    const counts = {
        all: document.querySelectorAll('.menu-item').length,
        'hot-drinks': document.querySelectorAll('.menu-section:nth-child(2) .menu-item').length,
        'cold-drinks': document.querySelectorAll('.menu-section:nth-child(3) .menu-item').length,
        'pastries': document.querySelectorAll('.menu-section:nth-child(4) .menu-item').length
    };

    // Create filter buttons with counts
    menuFilters.innerHTML = `
        <button class="filter-btn active" data-category="all">
            All <span class="count">${counts.all}</span>
        </button>
        <button class="filter-btn" data-category="hot-drinks">
            Hot Drinks <span class="count">${counts['hot-drinks']}</span>
        </button>
        <button class="filter-btn" data-category="cold-drinks">
            Cold Drinks <span class="count">${counts['cold-drinks']}</span>
        </button>
        <button class="filter-btn" data-category="pastries">
            Pastries <span class="count">${counts.pastries}</span>
        </button>
    `;

    // Insert filters before menu sections
    document.querySelector('.menu-container h2').after(menuFilters);

    // Filter click handlers with smooth transitions
    menuFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button with smooth transition
            menuFilters.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.style.transform = 'scale(1)';
            });
            this.classList.add('active');
            this.style.transform = 'scale(1.05)';

            const category = this.dataset.category;
            
            // Animate sections
            menuSections.forEach(section => {
                section.classList.add('fade-out');
                
                setTimeout(() => {
                    if (category === 'all' || section.dataset.category === category) {
                        section.style.display = 'block';
                        section.classList.remove('fade-out');
                        section.classList.add('fade-in');
                    } else {
                        section.style.display = 'none';
                    }
                }, 300);
            });
        });

        // Add hover effect
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.05)';
            }
        });

        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
            }
        });
    });

    // Add data-category attributes to menu sections
    menuSections[0].dataset.category = 'hot-drinks';
    menuSections[1].dataset.category = 'cold-drinks';
    menuSections[2].dataset.category = 'pastries';

    // Add to cart functionality
    let cart = [];
    
    // Add "Add to Cart" button to each menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart-btn';
        addButton.innerHTML = 'Add to Cart';
        addButton.style.cssText = `
            background-color: var(--color-brown);
            color: var(--color-light);
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            margin-top: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(10px);
        `;
        
        item.appendChild(addButton);

        // Show/hide button on hover
        item.addEventListener('mouseenter', () => {
            addButton.style.opacity = '1';
            addButton.style.transform = 'translateY(0)';
        });

        item.addEventListener('mouseleave', () => {
            addButton.style.opacity = '0';
            addButton.style.transform = 'translateY(10px)';
        });

        // Add to cart functionality
        addButton.addEventListener('click', () => {
            const itemName = item.querySelector('h4').textContent;
            const itemPrice = item.querySelector('.price').textContent;
            
            cart.push({ name: itemName, price: itemPrice });
            showNotification(`Added ${itemName} to cart!`);
            updateCartCount();
        });
    });

    function updateCartCount() {
        let cartBadge = document.querySelector('.cart-badge');
        if (!cartBadge) {
            cartBadge = document.createElement('div');
            cartBadge.className = 'cart-badge';
            document.body.appendChild(cartBadge);
        }
        cartBadge.textContent = cart.length;
        cartBadge.style.display = cart.length > 0 ? 'block' : 'none';
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});