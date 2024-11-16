// Gallery Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Gallery filtering system
    const filters = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Add click event to filter buttons
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all buttons
            filters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const selectedCategory = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                // Show all items if 'all' is selected, otherwise check category
                if (selectedCategory === 'all' || item.classList.contains(selectedCategory)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox functionality
    const body = document.body;
    
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="" alt="">
            <div class="lightbox-caption">
                <h3></h3>
                <p></p>
            </div>
        </div>
    `;
    body.appendChild(lightbox);

    // Add click event to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.item-overlay h3').textContent;
            const desc = this.querySelector('.item-overlay p').textContent;

            // Update lightbox content
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.querySelector('.lightbox-caption h3').textContent = title;
            lightbox.querySelector('.lightbox-caption p').textContent = desc;

            // Show lightbox
            lightbox.style.display = 'flex';
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);
        });
    });

    // Close lightbox when clicking close button or outside
    lightbox.addEventListener('click', function(e) {
        if (e.target.classList.contains('lightbox') || 
            e.target.classList.contains('close-lightbox')) {
            closeLightbox();
        }
    });

    // Close lightbox with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }

    // Add error handling for images
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('error', function() {
            console.log(`Failed to load image: ${this.src}`);
            this.src = 'https://placehold.co/400x400?text=Image+Not+Found';
        });
    });
});