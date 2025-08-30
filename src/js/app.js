// Menú responsive y funcionalidad principal
document.addEventListener('DOMContentLoaded', function() {
  // Initialize shopping cart
  window.cart = new ShoppingCart();
  
  // Toggle del menú móvil
  const menuToggle = document.querySelector('.menu-toggle');
  if(menuToggle) {
    menuToggle.addEventListener('click', function() {
      document.querySelector('.nav-links').classList.toggle('active');
      this.querySelector('i').classList.toggle('fa-bars');
      this.querySelector('i').classList.toggle('fa-times');
    });
  }

  // Cerrar menú al hacer clic en un enlace (móviles)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      const navLinks = document.querySelector('.nav-links');
      if(navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        document.querySelector('.menu-toggle i').classList.replace('fa-times', 'fa-bars');
      }
    });
  });

  // Sistema de valoración por estrellas (para nueva-reseña.html)
  if(document.querySelector('.rating-system')) {
    const stars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('rating-value');
    
    stars.forEach(star => {
      star.addEventListener('click', function() {
        const rating = this.getAttribute('data-rating');
        ratingInput.value = rating;
        
        // Actualizar visualización
        stars.forEach((s, index) => {
          if(index < rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });

      // Efecto hover
      star.addEventListener('mouseover', function() {
        const hoverRating = this.getAttribute('data-rating');
        stars.forEach((s, index) => {
          if(index < hoverRating) {
            s.classList.add('hover');
          } else {
            s.classList.remove('hover');
          }
        });
      });

      star.addEventListener('mouseout', function() {
        stars.forEach(s => s.classList.remove('hover'));
      });
    });
  }
});
