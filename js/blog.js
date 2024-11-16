// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const searchInput = document.querySelector('.search-bar input');
    const blogCards = document.querySelectorAll('.blog-card');
    const categoryButtons = document.querySelectorAll('.category-btn');
    let searchTimeout;

    // Article Preview System
    function createArticlePreview(article) {
        const preview = document.createElement('div');
        preview.className = 'article-preview';
        preview.innerHTML = `
            <div class="preview-content">
                <div class="preview-header">
                    <button class="close-preview">&times;</button>
                </div>
                <img src="${article.querySelector('img').src}" alt="${article.querySelector('img').alt}">
                <h3>${article.querySelector('h4') ? article.querySelector('h4').textContent : article.querySelector('h3').textContent}</h3>
                <span class="preview-category">${article.querySelector('.post-category').textContent}</span>
                <div class="preview-meta">
                    ${article.querySelector('.post-meta').innerHTML}
                </div>
                <div class="preview-text">
                    <p>${article.querySelector('p').textContent}</p>
                    <p class="preview-excerpt">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                <div class="preview-actions">
                    <button class="read-full">Read Full Article</button>
                    <div class="share-buttons">
                        <button class="share-btn" data-platform="facebook">Share on Facebook</button>
                        <button class="share-btn" data-platform="twitter">Share on Twitter</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(preview);
        setTimeout(() => preview.classList.add('show'), 10);

        // Close preview handlers
        const closeBtn = preview.querySelector('.close-preview');
        closeBtn.addEventListener('click', () => closePreview(preview));
        preview.addEventListener('click', (e) => {
            if (e.target === preview) closePreview(preview);
        });

        // Share buttons
        preview.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                const title = encodeURIComponent(preview.querySelector('h3').textContent);
                const url = encodeURIComponent(window.location.href);
                
                const shareUrls = {
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`
                };

                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            });
        });

        return preview;
    }

    function closePreview(preview) {
        preview.classList.remove('show');
        setTimeout(() => preview.remove(), 300);
    }

    // Search functionality with highlighting
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase().trim();
            let hasResults = false;

            blogCards.forEach(card => {
                const title = card.querySelector('h4');
                const description = card.querySelector('p');
                const category = card.querySelector('.post-category');
                
                const matches = 
                    title.textContent.toLowerCase().includes(searchTerm) ||
                    description.textContent.toLowerCase().includes(searchTerm) ||
                    category.textContent.toLowerCase().includes(searchTerm);

                if (matches) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                    highlightText(title, searchTerm);
                    highlightText(description, searchTerm);
                    hasResults = true;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });

            updateNoResults(hasResults, searchTerm);
        }, 300);
    });

    function highlightText(element, searchTerm) {
        if (!searchTerm) {
            element.innerHTML = element.textContent;
            return;
        }
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        element.innerHTML = element.textContent.replace(regex, '<mark>$1</mark>');
    }

    function updateNoResults(hasResults, searchTerm) {
        let noResults = document.querySelector('.no-results');
        if (!hasResults && searchTerm) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                document.querySelector('.blog-grid').appendChild(noResults);
            }
            noResults.textContent = `No results found for "${searchTerm}"`;
        } else if (noResults) {
            noResults.remove();
        }
    }

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = 'scale(1)';
            });
            this.classList.add('active');
            this.style.transform = 'scale(1.05)';

            const category = this.textContent.toLowerCase();
            let visibleCount = 0;

            blogCards.forEach((card, index) => {
                const cardCategory = card.querySelector('.post-category').textContent.toLowerCase();
                const shouldShow = category === 'all' || cardCategory === category;

                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                    visibleCount++;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });

            updateNoResults(visibleCount > 0, category !== 'all' ? category : '');
            currentPage = 1;
            showPage(1);
        });
    });

    // Pagination
    const itemsPerPage = 6;
    let currentPage = 1;
    const totalPages = Math.ceil(blogCards.length / itemsPerPage);

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        let visibleCount = 0;

        blogCards.forEach((card, index) => {
            const shouldShow = index >= start && index < end;
            if (shouldShow && card.style.display !== 'none') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, (index - start) * 50);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });

        updatePaginationButtons();
        return visibleCount;
    }

    function updatePaginationButtons() {
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';

        // Previous button
        if (currentPage > 1) {
            addPaginationButton('Previous', currentPage - 1);
        }

        // First page
        addPaginationButton(1, 1);

        // Ellipsis and middle pages
        if (currentPage > 3) {
            pagination.appendChild(createEllipsis());
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            addPaginationButton(i, i);
        }

        if (currentPage < totalPages - 2) {
            pagination.appendChild(createEllipsis());
        }

        // Last page
        if (totalPages > 1) {
            addPaginationButton(totalPages, totalPages);
        }

        // Next button
        if (currentPage < totalPages) {
            addPaginationButton('Next', currentPage + 1);
        }
    }

    function addPaginationButton(text, pageNum) {
        const button = document.createElement('button');
        button.className = `page-btn${pageNum === currentPage ? ' active' : ''}`;
        button.textContent = text;
        button.addEventListener('click', () => {
            if (pageNum !== currentPage) {
                currentPage = pageNum;
                showPage(currentPage);
            }
        });
        document.querySelector('.pagination').appendChild(button);
    }

    function createEllipsis() {
        const span = document.createElement('span');
        span.className = 'ellipsis';
        span.textContent = '...';
        return span;
    }

    // Initialize blog cards
    blogCards.forEach((card, index) => {
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        // Add click handler for preview
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('share-btn')) {
                createArticlePreview(this);
            }
        });

        // Initial animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Initialize first page
    showPage(1);
});