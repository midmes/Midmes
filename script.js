// Initialize AOS
AOS.init({ duration: 1000, once: true, offset: 100 });

// Custom cursor (works on all pages)
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
if (dot && outline) {
  document.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    outline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
}

// Header scroll effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
  const backBtn = document.getElementById('back-to-top');
  if (window.scrollY > 600) backBtn.classList.add('visible');
  else backBtn.classList.remove('visible');
});

// Mobile menu toggle
const toggleBtn = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
if (toggleBtn && nav) {
  toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    toggleBtn.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
  const navLinks = document.querySelectorAll('#main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

// Hero stat counters
function animateHeroNumbers() {
  const heroNumbers = document.querySelectorAll('.stat-number-hero');
  heroNumbers.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    let current = 0;
    const step = target / 45;
    const updater = setInterval(() => {
      current += step;
      if (current >= target) { el.innerText = target; clearInterval(updater); }
      else el.innerText = Math.floor(current);
    }, 25);
  });
}
// Main counters
function animateMainCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(c => {
    const target = parseInt(c.getAttribute('data-target'));
    let val = 0;
    const inc = target / 40;
    const timer = setInterval(() => {
      val += inc;
      if (val >= target) { c.innerText = target; clearInterval(timer); }
      else c.innerText = Math.floor(val);
    }, 30);
  });
}
// Intersection Observer
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateHeroNumbers();
      animateMainCounters();
      statObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
const statsHeroSec = document.querySelector('.hero-stats');
if (statsHeroSec) statObserver.observe(statsHeroSec);

// Three.js WebGL Background (subtle motion)
const canvas = document.getElementById('webgl-canvas');
if (canvas) {
  const scene = new THREE.Scene();
  scene.background = null;
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1800;
  const posArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    posArray[i*3] = (Math.random() - 0.5) * 28;
    posArray[i*3+1] = (Math.random() - 0.5) * 18;
    posArray[i*3+2] = (Math.random() - 0.5) * 18 - 8;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({ color: 0x2d1bff, size: 0.07, transparent: true, blending: THREE.AdditiveBlending });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.3, 180, 24, 3, 4);
  const knotMat = new THREE.MeshStandardMaterial({ color: 0x00f2ff, emissive: 0x2d1bff, emissiveIntensity: 0.5, metalness: 0.7, roughness: 0.3 });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);
  
  const ringGeo = new THREE.TorusGeometry(2.0, 0.06, 64, 200);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x2d1bff, emissive: 0x2d1bff });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  scene.add(ring);
  
  const ambientLight = new THREE.AmbientLight(0x111122);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x2d1bff, 0.9);
  pointLight.position.set(3,3,4);
  scene.add(pointLight);
  const backLight = new THREE.PointLight(0x00f2ff, 0.6);
  backLight.position.set(-2,1,-5);
  scene.add(backLight);
  
  let time = 0;
  function animate3D() {
    requestAnimationFrame(animate3D);
    time += 0.006;
    knot.rotation.x = time * 0.7;
    knot.rotation.y = time * 0.4;
    ring.rotation.x = time * 0.3;
    ring.rotation.z = time * 0.35;
    particlesMesh.rotation.y = time * 0.08;
    particlesMesh.rotation.x = Math.sin(time * 0.15) * 0.15;
    camera.position.z = 12 + Math.sin(time * 0.15) * 0.15;
    renderer.render(scene, camera);
  }
  animate3D();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// GSAP animations
gsap.registerPlugin(ScrollTrigger);
gsap.from('.service-card-neon', { scrollTrigger: { trigger: '.services-section', start: 'top 80%' }, y: 50, opacity: 0, duration: 0.7, stagger: 0.12 });
gsap.from('.stat-block', { scrollTrigger: { trigger: '.stats-section-2026', start: 'top 75%' }, scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.1 });
gsap.from('.testimonial-card', { scrollTrigger: { trigger: '.testimonial-section', start: 'top 80%' }, y: 40, opacity: 0, duration: 0.7, stagger: 0.15 });