// Menú responsive
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  if(menuToggle) {
    menuToggle.addEventListener('click', function() {
      document.querySelector('.nav-links').classList.toggle('active');
    });
  }

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      document.querySelector('.nav-links').classList.remove('active');
    });
  });
});
