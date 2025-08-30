// Product Page Functionality
class ProductPage {
  constructor() {
    this.currentImageIndex = 0;
    this.currentQuantity = 1;
    this.maxQuantity = 10;
    this.init();
  }

  init() {
    this.bindImageGallery();
    this.bindQuantityControls();
    this.bindColorOptions();
    this.bindTabs();
    this.bindActionButtons();
    this.bindWishlist();
    this.setupImageZoom();
  }

  // Image gallery functionality
  bindImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');

    if (!thumbnails.length || !mainImage) return;

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        this.switchImage(index, thumbnails, mainImage);
      });
    });

    // Keyboard navigation for gallery
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousImage(thumbnails, mainImage);
      } else if (e.key === 'ArrowRight') {
        this.nextImage(thumbnails, mainImage);
      }
    });
  }

  switchImage(index, thumbnails, mainImage) {
    // Remove active class from all thumbnails
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to clicked thumbnail
    thumbnails[index].classList.add('active');
    
    // Get new image data
    const newImageSrc = thumbnails[index].dataset.image;
    const newImageAlt = thumbnails[index].dataset.alt;
    
    // Fade out current image
    mainImage.style.opacity = '0.5';
    
    // Change image after short delay
    setTimeout(() => {
      mainImage.src = newImageSrc;
      mainImage.alt = `Lente Clásico - ${newImageAlt}`;
      mainImage.style.opacity = '1';
    }, 150);
    
    this.currentImageIndex = index;
  }

  previousImage(thumbnails, mainImage) {
    const prevIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : thumbnails.length - 1;
    this.switchImage(prevIndex, thumbnails, mainImage);
  }

  nextImage(thumbnails, mainImage) {
    const nextIndex = this.currentImageIndex < thumbnails.length - 1 ? this.currentImageIndex + 1 : 0;
    this.switchImage(nextIndex, thumbnails, mainImage);
  }

  // Quantity controls
  bindQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('.qty-btn.minus');
    const increaseBtn = document.querySelector('.qty-btn.plus');

    if (!quantityInput || !decreaseBtn || !increaseBtn) return;

    decreaseBtn.addEventListener('click', () => {
      this.updateQuantity(-1, quantityInput);
    });

    increaseBtn.addEventListener('click', () => {
      this.updateQuantity(1, quantityInput);
    });

    quantityInput.addEventListener('change', (e) => {
      this.validateQuantity(e.target);
    });

    quantityInput.addEventListener('input', (e) => {
      this.validateQuantity(e.target);
    });
  }

  updateQuantity(change, input) {
    const newQuantity = Math.max(1, Math.min(this.maxQuantity, this.currentQuantity + change));
    this.currentQuantity = newQuantity;
    input.value = newQuantity;
    this.updateAddToCartButton();
  }

  validateQuantity(input) {
    let value = parseInt(input.value) || 1;
    value = Math.max(1, Math.min(this.maxQuantity, value));
    this.currentQuantity = value;
    input.value = value;
    this.updateAddToCartButton();
  }

  updateAddToCartButton() {
    const addToCartBtn = document.querySelector('.btn-add-cart');
    if (addToCartBtn) {
      const baseText = 'Agregar al Carrito';
      addToCartBtn.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        ${this.currentQuantity > 1 ? `${baseText} (${this.currentQuantity})` : baseText}
      `;
    }
  }

  // Color options
  bindColorOptions() {
    const colorOptions = document.querySelectorAll('input[name="color"]');
    
    colorOptions.forEach(option => {
      option.addEventListener('change', (e) => {
        this.updateColorSelection(e.target.value);
      });
    });
  }

  updateColorSelection(color) {
    // Update product images based on color selection
    // This would typically involve changing the image sources
    console.log(`Selected color: ${color}`);
    
    // Show color change feedback
    this.showColorChangeNotification(color);
  }

  showColorChangeNotification(color) {
    const notification = document.createElement('div');
    notification.className = 'color-notification';
    notification.textContent = `Color seleccionado: ${color}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #3498db;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  // Tab functionality
  bindTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        this.switchTab(targetTab, tabButtons, tabPanels);
      });
    });
  }

  switchTab(targetTab, tabButtons, tabPanels) {
    // Remove active class from all buttons and panels
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));

    // Add active class to clicked button and corresponding panel
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  }

  // Action buttons
  bindActionButtons() {
    const addToCartBtn = document.querySelector('.btn-add-cart');
    const buyNowBtn = document.querySelector('.btn-buy-now');

    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        this.addToCart();
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        this.buyNow();
      });
    }
  }

  addToCart() {
    const product = this.getProductData();
    
    if (window.cart) {
      // Add multiple quantities if needed
      for (let i = 0; i < this.currentQuantity; i++) {
        window.cart.addToCart(this.createProductCard(product));
      }
    }
    
    this.showAddToCartAnimation();
  }

  buyNow() {
    // Add to cart first
    this.addToCart();
    
    // Small delay to show add to cart animation
    setTimeout(() => {
      // Redirect to checkout
      window.location.href = 'checkout.html';
    }, 500);
  }

  getProductData() {
    const title = document.querySelector('.product-title')?.textContent || 'Producto';
    const price = document.querySelector('.current-price')?.textContent || '$0';
    const image = document.querySelector('#main-product-image')?.src || '';
    const color = document.querySelector('input[name="color"]:checked')?.value || 'negro';
    const size = document.querySelector('#size-select')?.value || 'm';

    return {
      title,
      price,
      image,
      color,
      size,
      quantity: this.currentQuantity
    };
  }

  createProductCard(product) {
    // Create a temporary product card element for cart system
    const tempCard = document.createElement('div');
    tempCard.className = 'producto';
    tempCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="card-content">
        <h3>${product.title}</h3>
        <p>${product.price}</p>
      </div>
    `;
    return tempCard;
  }

  showAddToCartAnimation() {
    const addToCartBtn = document.querySelector('.btn-add-cart');
    if (!addToCartBtn) return;

    // Create flying animation effect
    const productImage = document.querySelector('#main-product-image');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (productImage && cartIcon) {
      const flyingImage = productImage.cloneNode();
      flyingImage.style.cssText = `
        position: fixed;
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `;
      
      const startRect = productImage.getBoundingClientRect();
      const endRect = cartIcon.getBoundingClientRect();
      
      flyingImage.style.left = startRect.left + 'px';
      flyingImage.style.top = startRect.top + 'px';
      
      document.body.appendChild(flyingImage);
      
      setTimeout(() => {
        flyingImage.style.left = endRect.left + 'px';
        flyingImage.style.top = endRect.top + 'px';
        flyingImage.style.transform = 'scale(0.1)';
        flyingImage.style.opacity = '0';
      }, 100);
      
      setTimeout(() => {
        flyingImage.remove();
        // Add cart bounce animation
        if (window.UIEnhancements) {
          window.UIEnhancements.addBounceAnimation(cartIcon);
        }
      }, 900);
    }

    // Button feedback
    addToCartBtn.classList.add('success-state');
    const originalText = addToCartBtn.innerHTML;
    addToCartBtn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
    
    setTimeout(() => {
      addToCartBtn.classList.remove('success-state');
      addToCartBtn.innerHTML = originalText;
    }, 2000);
  }

  // Wishlist functionality
  bindWishlist() {
    const wishlistBtn = document.querySelector('.btn-wishlist');
    
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        this.toggleWishlist();
      });
    }
  }

  toggleWishlist() {
    const wishlistBtn = document.querySelector('.btn-wishlist');
    const icon = wishlistBtn.querySelector('i');
    
    if (icon.classList.contains('far')) {
      // Add to wishlist
      icon.classList.remove('far');
      icon.classList.add('fas');
      wishlistBtn.classList.add('active');
      
      if (window.cart) {
        window.cart.showToast('Agregado a favoritos', 'success');
      }
    } else {
      // Remove from wishlist
      icon.classList.remove('fas');
      icon.classList.add('far');
      wishlistBtn.classList.remove('active');
      
      if (window.cart) {
        window.cart.showToast('Removido de favoritos', 'info');
      }
    }
  }

  // Image zoom functionality
  setupImageZoom() {
    const mainImage = document.querySelector('#main-product-image');
    const zoomBtn = document.querySelector('.image-zoom-btn');
    
    if (zoomBtn && mainImage) {
      zoomBtn.addEventListener('click', () => {
        this.openImageZoom(mainImage);
      });
      
      // Also allow click on main image to zoom
      mainImage.addEventListener('click', () => {
        this.openImageZoom(mainImage);
      });
    }
  }

  openImageZoom(image) {
    const modal = document.createElement('div');
    modal.className = 'image-zoom-modal';
    modal.innerHTML = `
      <div class="zoom-content">
        <button class="zoom-close">&times;</button>
        <img src="${image.src}" alt="${image.alt}" class="zoomed-image">
        <div class="zoom-controls">
          <button class="zoom-btn zoom-in" title="Acercar">
            <i class="fas fa-plus"></i>
          </button>
          <button class="zoom-btn zoom-out" title="Alejar">
            <i class="fas fa-minus"></i>
          </button>
          <button class="zoom-btn zoom-reset" title="Tamaño original">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Bind zoom controls
    this.bindZoomControls(modal);
    
    // Close on click outside or escape key
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeImageZoom(modal);
      }
    });
    
    modal.querySelector('.zoom-close').addEventListener('click', () => {
      this.closeImageZoom(modal);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeImageZoom(modal);
      }
    });
    
    // Add entrance animation
    setTimeout(() => modal.classList.add('active'), 10);
  }

  bindZoomControls(modal) {
    const image = modal.querySelector('.zoomed-image');
    const zoomInBtn = modal.querySelector('.zoom-in');
    const zoomOutBtn = modal.querySelector('.zoom-out');
    const zoomResetBtn = modal.querySelector('.zoom-reset');
    
    let currentZoom = 1;
    
    zoomInBtn.addEventListener('click', () => {
      currentZoom = Math.min(currentZoom * 1.2, 3);
      image.style.transform = `scale(${currentZoom})`;
    });
    
    zoomOutBtn.addEventListener('click', () => {
      currentZoom = Math.max(currentZoom / 1.2, 0.5);
      image.style.transform = `scale(${currentZoom})`;
    });
    
    zoomResetBtn.addEventListener('click', () => {
      currentZoom = 1;
      image.style.transform = `scale(${currentZoom})`;
    });
  }

  closeImageZoom(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Review functionality
class ProductReviews {
  constructor() {
    this.init();
  }

  init() {
    this.bindHelpfulButtons();
    this.bindLoadMoreReviews();
  }

  bindHelpfulButtons() {
    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    
    helpfulButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.markHelpful(button);
      });
    });
  }

  markHelpful(button) {
    if (button.classList.contains('voted')) return;
    
    button.classList.add('voted');
    const countText = button.textContent;
    const currentCount = parseInt(countText.match(/\d+/)[0]);
    const newCount = currentCount + 1;
    
    button.innerHTML = `<i class="fas fa-thumbs-up"></i> Útil (${newCount})`;
    button.style.color = '#3498db';
    
    if (window.cart) {
      window.cart.showToast('Gracias por tu voto', 'success');
    }
  }

  bindLoadMoreReviews() {
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreReviews();
      });
    }
  }

  loadMoreReviews() {
    // Simulate loading more reviews
    const reviewsList = document.querySelector('.reviews-list');
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    
    // Show loading state
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
      // Add mock reviews
      const newReviews = this.generateMockReviews(2);
      reviewsList.insertAdjacentHTML('beforeend', newReviews);
      
      // Reset button
      loadMoreBtn.innerHTML = 'Ver más reseñas';
      loadMoreBtn.disabled = false;
      
      // Add animation to new reviews
      const newReviewCards = reviewsList.querySelectorAll('.review-card:nth-last-child(-n+2)');
      newReviewCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 200);
      });
      
    }, 1500);
  }

  generateMockReviews(count) {
    const mockReviews = [
      {
        name: 'Ana Martín',
        avatar: 'A',
        rating: 5,
        date: '5 Dic 2024',
        text: 'Perfectos para uso diario. La calidad es excelente y el precio muy competitivo.',
        helpful: 6
      },
      {
        name: 'Luis Torres',
        avatar: 'L',
        rating: 4,
        date: '1 Dic 2024',
        text: 'Buenos lentes, aunque esperaba que fueran un poco más ligeros. En general satisfecho con la compra.',
        helpful: 3
      }
    ];
    
    return mockReviews.slice(0, count).map(review => `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">${review.avatar}</div>
            <div>
              <h4>${review.name}</h4>
              <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
            </div>
          </div>
          <span class="review-date">${review.date}</span>
        </div>
        <p class="review-text">${review.text}</p>
        <div class="review-helpful">
          <button class="helpful-btn">
            <i class="fas fa-thumbs-up"></i> Útil (${review.helpful})
          </button>
        </div>
      </div>
    `).join('');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.product-details')) {
    window.productPage = new ProductPage();
    window.productReviews = new ProductReviews();
  }
});

// Export for external use
window.ProductPage = ProductPage;
window.ProductReviews = ProductReviews;