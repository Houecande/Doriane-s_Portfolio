const burger = document.getElementById('burgerBtn');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-links a');
const body = document.body;

function toggleNav() {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  body.classList.toggle('nav-active');
}

burger.addEventListener('click', () => {
  toggleNav();
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    if (body.classList.contains('nav-active')) {
      toggleNav();
    }
  });
});

// Close nav when clicking outside of it
document.addEventListener('click', (e) => {
  if (body.classList.contains('nav-active') && !e.target.closest('header')) {
    toggleNav();
  }
});

const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

const barRows = document.querySelectorAll('.bar-row');
const io2 = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.bar-fill');
      const val = e.target.getAttribute('data-value');
      requestAnimationFrame(() => { fill.style.width = val + '%'; });
      io2.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
barRows.forEach(row => io2.observe(row));

const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => { backTop.classList.toggle('show', window.scrollY > 500); });
backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  success.classList.add('show');
  form.reset();
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();