// Shopping Cart System
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.createCartIcon();
    this.createCartModal();
    this.bindEvents();
    this.updateCartCount();
  }

  createCartIcon() {
    // Add cart icon to navbar
    const navbar = document.querySelector('.nav-links');
    if (navbar) {
      const cartLi = document.createElement('li');
      cartLi.innerHTML = `
        <div class="cart-icon" id="cart-icon">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-count" id="cart-count">0</span>
        </div>
      `;
      
      // Insert before login button
      const loginBtn = navbar.querySelector('.btn-login')?.parentElement;
      if (loginBtn) {
        navbar.insertBefore(cartLi, loginBtn);
      } else {
        navbar.appendChild(cartLi);
      }
    }
  }

  createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.id = 'cart-modal';
    modal.innerHTML = `
      <div class="cart-content">
        <div class="cart-header">
          <h3>Carrito de Compras</h3>
          <button class="cart-close" id="cart-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="cart-items" id="cart-items">
          <!-- Cart items will be inserted here -->
        </div>
        <div class="cart-total" id="cart-total">
          <!-- Total will be calculated here -->
        </div>
        <div class="cart-actions">
          <button class="cart-continue" id="cart-continue">Seguir Comprando</button>
          <button class="cart-checkout" id="cart-checkout">Proceder al Pago</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  bindEvents() {
    // Cart icon click
    document.addEventListener('click', (e) => {
      if (e.target.closest('#cart-icon')) {
        this.openCart();
      }
    });

    // Close cart modal
    document.addEventListener('click', (e) => {
      if (e.target.closest('#cart-close') || e.target.closest('#cart-continue')) {
        this.closeCart();
      }
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.id === 'cart-modal') {
        this.closeCart();
      }
    });

    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-comprar')) {
        e.preventDefault();
        const productCard = e.target.closest('.producto') || e.target.closest('.card');
        if (productCard) {
          this.addToCart(productCard);
        }
      }
    });

    // Checkout button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#cart-checkout')) {
        this.proceedToCheckout();
      }
    });

    // Quantity controls and remove buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.quantity-btn')) {
        const btn = e.target.closest('.quantity-btn');
        const productId = btn.dataset.productId;
        const action = btn.dataset.action;
        
        if (action === 'increase') {
          this.updateQuantity(productId, 1);
        } else if (action === 'decrease') {
          this.updateQuantity(productId, -1);
        }
      }

      if (e.target.closest('.cart-item-remove')) {
        const productId = e.target.closest('.cart-item-remove').dataset.productId;
        this.removeFromCart(productId);
      }
    });

    // Quantity input change
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const productId = e.target.dataset.productId;
        const newQuantity = parseInt(e.target.value) || 1;
        this.setQuantity(productId, newQuantity);
      }
    });
  }

  addToCart(productCard) {
    const product = this.extractProductInfo(productCard);
    
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      this.showToast(`Se aumentó la cantidad de ${product.name}`, 'success');
    } else {
      this.items.push({ ...product, quantity: 1 });
      this.showToast(`${product.name} agregado al carrito`, 'success');
    }
    
    this.saveCart();
    this.updateCartCount();
    this.updateCartDisplay();
  }

  extractProductInfo(productCard) {
    const img = productCard.querySelector('img');
    const name = productCard.querySelector('h3')?.textContent || 'Producto';
    const priceText = productCard.querySelector('p')?.textContent || '$0';
    
    // Extract price number from text like "$59.99"
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    
    // Generate ID from name
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id,
      name,
      price,
      image: img?.src || 'src/images/placeholder.jpg'
    };
  }

  updateQuantity(productId, change) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
      }
    }
  }

  setQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
      }
    }
  }

  removeFromCart(productId) {
    const itemIndex = this.items.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      const item = this.items[itemIndex];
      this.items.splice(itemIndex, 1);
      this.showToast(`${item.name} eliminado del carrito`, 'info');
      this.saveCart();
      this.updateCartCount();
      this.updateCartDisplay();
    }
  }

  openCart() {
    this.updateCartDisplay();
    document.getElementById('cart-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    document.getElementById('cart-modal').classList.remove('active');
    document.body.style.overflow = '';
  }

  updateCartCount() {
    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) {
      countElement.textContent = count;
      countElement.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;

    if (this.items.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <p>Tu carrito está vacío</p>
          <p>¡Agrega algunos productos para empezar!</p>
        </div>
      `;
      cartTotal.innerHTML = '';
      return;
    }

    // Render cart items
    cartItems.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn" data-product-id="${item.id}" data-action="decrease">
              <i class="fas fa-minus"></i>
            </button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product-id="${item.id}">
            <button class="quantity-btn" data-product-id="${item.id}" data-action="increase">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        <button class="cart-item-remove" data-product-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');

    // Calculate and render totals
    const subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    cartTotal.innerHTML = `
      <div class="cart-total-row">
        <span>Subtotal:</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="cart-total-row">
        <span>Envío:</span>
        <span>${shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(2)}</span>
      </div>
      <div class="cart-total-row">
        <span>Impuestos:</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="cart-total-row">
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    `;
  }

  proceedToCheckout() {
    if (this.items.length === 0) {
      this.showToast('Tu carrito está vacío', 'warning');
      return;
    }
    
    // Store cart for checkout page
    localStorage.setItem('checkout-cart', JSON.stringify(this.items));
    window.location.href = 'checkout.html';
  }

  saveCart() {
    localStorage.setItem('lumishop-cart', JSON.stringify(this.items));
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('lumishop-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart:', e);
      return [];
    }
  }

  showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas fa-${this.getToastIcon(type)}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  getToastIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'check-circle';
  }

  // Get cart summary for other pages
  getCartSummary() {
    const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    return {
      items: this.items,
      itemCount,
      totalPrice
    };
  }

  // Clear cart (useful for after checkout)
  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartCount();
    this.updateCartDisplay();
    this.showToast('Carrito vaciado', 'info');
  }
}

// Export for use in other files
window.ShoppingCart = ShoppingCart;