// Advanced Filtering and Search System
class CatalogFilter {
  constructor() {
    this.products = this.getProductData();
    this.filteredProducts = [...this.products];
    this.currentFilters = {
      category: 'all',
      priceRange: 'all',
      search: '',
      sortBy: 'name'
    };
    this.init();
  }

  init() {
    this.createSearchBar();
    this.enhanceFilters();
    this.createSortingOptions();
    this.createViewToggle();
    this.bindEvents();
    this.renderProducts();
  }

  // Get product data from the DOM and create a structured dataset
  getProductData() {
    const productCards = document.querySelectorAll('.producto');
    const products = [];

    productCards.forEach((card, index) => {
      const name = card.querySelector('h3')?.textContent || `Producto ${index + 1}`;
      const priceText = card.querySelector('p')?.textContent || '$0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      const image = card.querySelector('img')?.src || '';
      const category = this.categorizeProduct(name);
      
      products.push({
        id: index + 1,
        name,
        price,
        image,
        category,
        description: `Descripción detallada de ${name}`,
        rating: Math.floor(Math.random() * 5) + 1,
        inStock: true,
        featured: Math.random() > 0.7
      });
    });

    return products;
  }

  categorizeProduct(name) {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('deportivo') || nameLower.includes('sport')) return 'deportivo';
    if (nameLower.includes('sol') || nameLower.includes('sun')) return 'sol';
    if (nameLower.includes('graduado') || nameLower.includes('prescription')) return 'graduado';
    return 'moda';
  }

  createSearchBar() {
    const catalogSection = document.querySelector('.catalogo');
    if (!catalogSection) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input type="text" id="product-search" placeholder="Buscar lentes..." class="search-input">
        <button type="button" id="clear-search" class="clear-search" style="display: none;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="search-suggestions" id="search-suggestions"></div>
    `;

    const title = catalogSection.querySelector('h2');
    title.parentNode.insertBefore(searchContainer, title.nextSibling);
  }

  enhanceFilters() {
    const filterContainer = document.querySelector('.filtros');
    if (!filterContainer) return;

    filterContainer.innerHTML = `
      <div class="filter-group">
        <label for="category-filter">Categoría:</label>
        <select id="category-filter" class="filter-select">
          <option value="all">Todas las categorías</option>
          <option value="moda">Moda</option>
          <option value="deportivo">Deportivos</option>
          <option value="sol">De Sol</option>
          <option value="graduado">Graduados</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="price-filter">Precio:</label>
        <select id="price-filter" class="filter-select">
          <option value="all">Todos los precios</option>
          <option value="0-50">$0 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-200">$100 - $200</option>
          <option value="200+">$200+</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sort-filter">Ordenar por:</label>
        <select id="sort-filter" class="filter-select">
          <option value="name">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="price">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="rating">Mejor Valorados</option>
          <option value="featured">Destacados</option>
        </select>
      </div>

      <button type="button" id="clear-filters" class="btn btn-secondary clear-filters">
        <i class="fas fa-filter"></i> Limpiar Filtros
      </button>
    `;
  }

  createSortingOptions() {
    const catalogSection = document.querySelector('.catalogo');
    const productContainer = document.querySelector('.productos');
    
    if (!catalogSection || !productContainer) return;

    const toolbarContainer = document.createElement('div');
    toolbarContainer.className = 'catalog-toolbar';
    toolbarContainer.innerHTML = `
      <div class="toolbar-left">
        <span class="results-count" id="results-count">
          Mostrando ${this.products.length} productos
        </span>
      </div>
      <div class="toolbar-right">
        <div class="view-toggle">
          <button type="button" class="view-btn active" data-view="grid" title="Vista de Grilla">
            <i class="fas fa-th"></i>
          </button>
          <button type="button" class="view-btn" data-view="list" title="Vista de Lista">
            <i class="fas fa-list"></i>
          </button>
        </div>
      </div>
    `;

    productContainer.parentNode.insertBefore(toolbarContainer, productContainer);
  }

  createViewToggle() {
    // Already created in createSortingOptions
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById('product-search');
    const clearSearch = document.getElementById('clear-search');
    const searchSuggestions = document.getElementById('search-suggestions');

    if (searchInput) {
      searchInput.addEventListener('input', this.debounce((e) => {
        this.currentFilters.search = e.target.value;
        this.handleSearch(e.target.value);
        clearSearch.style.display = e.target.value ? 'block' : 'none';
      }, 300));

      searchInput.addEventListener('focus', () => {
        if (this.currentFilters.search) {
          this.showSuggestions();
        }
      });
    }

    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        this.currentFilters.search = '';
        clearSearch.style.display = 'none';
        this.hideSuggestions();
        this.applyFilters();
      });
    }

    // Filter events
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    const clearFilters = document.getElementById('clear-filters');

    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.currentFilters.category = e.target.value;
        this.applyFilters();
      });
    }

    if (priceFilter) {
      priceFilter.addEventListener('change', (e) => {
        this.currentFilters.priceRange = e.target.value;
        this.applyFilters();
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    if (clearFilters) {
      clearFilters.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }

    // View toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('.view-btn')) {
        const viewBtn = e.target.closest('.view-btn');
        const view = viewBtn.dataset.view;
        this.toggleView(view);
      }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.hideSuggestions();
      }
    });
  }

  handleSearch(query) {
    if (query.length > 2) {
      this.showSuggestions();
    } else {
      this.hideSuggestions();
    }
    this.applyFilters();
  }

  showSuggestions() {
    const suggestions = document.getElementById('search-suggestions');
    const query = this.currentFilters.search.toLowerCase();
    
    if (!suggestions || !query) return;

    const matchingProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matchingProducts.length > 0) {
      suggestions.innerHTML = matchingProducts.map(product => `
        <div class="suggestion-item" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" class="suggestion-image">
          <div class="suggestion-details">
            <span class="suggestion-name">${product.name}</span>
            <span class="suggestion-price">$${product.price.toFixed(2)}</span>
          </div>
        </div>
      `).join('');
      
      suggestions.style.display = 'block';
      
      // Add click events to suggestions
      suggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const productId = e.currentTarget.dataset.productId;
          this.selectProduct(productId);
          this.hideSuggestions();
        });
      });
    } else {
      suggestions.innerHTML = '<div class="no-suggestions">No se encontraron productos</div>';
      suggestions.style.display = 'block';
    }
  }

  hideSuggestions() {
    const suggestions = document.getElementById('search-suggestions');
    if (suggestions) {
      suggestions.style.display = 'none';
    }
  }

  selectProduct(productId) {
    const product = this.products.find(p => p.id == productId);
    if (product) {
      document.getElementById('product-search').value = product.name;
      this.currentFilters.search = product.name;
      this.applyFilters();
    }
  }

  applyFilters() {
    let filtered = [...this.products];

    // Apply search filter
    if (this.currentFilters.search) {
      const query = this.currentFilters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.currentFilters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category === this.currentFilters.category
      );
    }

    // Apply price filter
    if (this.currentFilters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (this.currentFilters.priceRange) {
          case '0-50': return price <= 50;
          case '50-100': return price > 50 && price <= 100;
          case '100-200': return price > 100 && price <= 200;
          case '200+': return price > 200;
          default: return true;
        }
      });
    }

    // Apply sorting
    this.sortProducts(filtered);

    this.filteredProducts = filtered;
    this.renderProducts();
    this.updateResultsCount();
  }

  sortProducts(products) {
    switch (this.currentFilters.sortBy) {
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
        products.sort((a, b) => b.featured - a.featured);
        break;
    }
  }

  renderProducts() {
    const productContainer = document.querySelector('.productos');
    if (!productContainer) return;

    if (this.filteredProducts.length === 0) {
      productContainer.innerHTML = `
        <div class="no-products">
          <i class="fas fa-search fa-3x"></i>
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar tus filtros de búsqueda</p>
          <button type="button" class="btn btn-primary" onclick="window.catalogFilter.clearAllFilters()">
            Limpiar Filtros
          </button>
        </div>
      `;
      return;
    }

    productContainer.innerHTML = this.filteredProducts.map(product => `
      <div class="producto" data-product-id="${product.id}">
        <div class="producto-img-container">
          <img src="${product.image}" alt="${product.name}" />
          ${product.featured ? '<span class="product-badge featured">Destacado</span>' : ''}
          ${!product.inStock ? '<span class="product-badge out-of-stock">Agotado</span>' : ''}
        </div>
        <div class="card-content">
          <h3>${product.name}</h3>
          <div class="product-rating">
            ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
            <span class="rating-text">(${product.rating}/5)</span>
          </div>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="btn-comprar ${!product.inStock ? 'disabled' : ''}" 
                  ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Agregar al Carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    `).join('');

    // Add staggered animation
    const productCards = productContainer.querySelectorAll('.producto');
    productCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-fade-in');
    });
  }

  toggleView(view) {
    const productContainer = document.querySelector('.productos');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    if (view === 'list') {
      productContainer.classList.add('list-view');
    } else {
      productContainer.classList.remove('list-view');
    }
  }

  updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      const count = this.filteredProducts.length;
      const total = this.products.length;
      resultsCount.textContent = `Mostrando ${count} de ${total} productos`;
    }
  }

  clearAllFilters() {
    this.currentFilters = {
      category: 'all',
      priceRange: 'all',
      search: '',
      sortBy: 'name'
    };

    // Reset form elements
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    const clearSearch = document.getElementById('clear-search');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'name';
    if (clearSearch) clearSearch.style.display = 'none';

    this.hideSuggestions();
    this.applyFilters();
  }

  // Utility function for debouncing search
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Export for use in other files
window.CatalogFilter = CatalogFilter;