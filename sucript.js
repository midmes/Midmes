// Optional scroll animation using Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });
  
    document.querySelectorAll('.col-md-4').forEach(el => {
      el.classList.add('hidden');
      observer.observe(el);
    });
  });
  