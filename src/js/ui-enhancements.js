// Scroll Animations and UI Enhancements
class UIEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupImageLazyLoading();
    this.setupSmoothScrolling();
    this.setupLoadingStates();
  }

  // Scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add staggered animation for product cards
          if (entry.target.classList.contains('productos')) {
            const products = entry.target.querySelectorAll('.producto');
            products.forEach((product, index) => {
              setTimeout(() => {
                product.style.animationDelay = `${index * 0.1}s`;
                product.classList.add('animate-fade-in');
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.catalogo, .ofertas, .hero');
    animatedElements.forEach(el => {
      el.classList.add('scroll-animate');
      observer.observe(el);
    });

    // Observe product containers
    const productContainers = document.querySelectorAll('.productos');
    productContainers.forEach(container => observer.observe(container));
  }

  // Lazy loading for images
  setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('loading-skeleton');
              img.classList.add('animate-fade-in');
              observer.unobserve(img);
            }
          }
        });
      });

      // Add loading skeleton to images
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.classList.add('loading-skeleton');
        imageObserver.observe(img);
      });
    }
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Loading states for buttons
  setupLoadingStates() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn-comprar, .btn-primary, .btn-secondary')) {
        this.addLoadingState(e.target);
      }
    });
  }

  addLoadingState(button) {
    const originalText = button.textContent;
    button.classList.add('loading');
    button.textContent = 'Cargando...';
    button.disabled = true;

    // Remove loading state after a short delay (simulating network request)
    setTimeout(() => {
      button.classList.remove('loading');
      button.textContent = originalText;
      button.disabled = false;
    }, 1000);
  }

  // Add pulse animation to elements
  static addPulseAnimation(element) {
    element.classList.add('animate-pulse');
    setTimeout(() => {
      element.classList.remove('animate-pulse');
    }, 2000);
  }

  // Add shake animation for error states
  static addShakeAnimation(element) {
    element.classList.add('animate-shake');
    setTimeout(() => {
      element.classList.remove('animate-shake');
    }, 500);
  }

  // Add bounce animation for success states
  static addBounceAnimation(element) {
    element.classList.add('animate-bounce');
    setTimeout(() => {
      element.classList.remove('animate-bounce');
    }, 2000);
  }

  // Parallax effect for hero section
  setupParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  // Dynamic background colors based on time
  setupDynamicBackground() {
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 6 && hour < 12) {
      // Morning - light blue gradient
      body.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
    } else if (hour >= 12 && hour < 18) {
      // Afternoon - warm gradient
      body.style.background = 'linear-gradient(135deg, #fdcb6e, #e17055)';
    } else if (hour >= 18 && hour < 22) {
      // Evening - orange gradient
      body.style.background = 'linear-gradient(135deg, #fd79a8, #e84393)';
    } else {
      // Night - dark gradient
      body.style.background = 'linear-gradient(135deg, #2d3436, #636e72)';
    }
  }

  // Performance monitoring
  measurePerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 100);
      });
    }
  }
}

// Utility functions for animations
class AnimationUtils {
  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        element.style.opacity = progress;
        requestAnimationFrame(animate);
      } else {
        element.style.opacity = '1';
      }
    }
    
    requestAnimationFrame(animate);
  }

  static fadeOut(element, duration = 300) {
    const start = performance.now();
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        element.style.opacity = initialOpacity * (1 - progress);
        requestAnimationFrame(animate);
      } else {
        element.style.opacity = '0';
        element.style.display = 'none';
      }
    }
    
    requestAnimationFrame(animate);
  }

  static slideUp(element, duration = 300) {
    element.style.height = element.offsetHeight + 'px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.height = '0px';
      setTimeout(() => {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
        element.style.transition = '';
      }, duration);
    });
  }

  static slideDown(element, duration = 300) {
    element.style.display = 'block';
    const height = element.offsetHeight;
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.height = height + 'px';
      setTimeout(() => {
        element.style.height = '';
        element.style.overflow = '';
        element.style.transition = '';
      }, duration);
    });
  }
}

// Export for use in other files
window.UIEnhancements = UIEnhancements;
window.AnimationUtils = AnimationUtils;