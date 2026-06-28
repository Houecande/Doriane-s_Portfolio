const burger = document.getElementById('burgerBtn');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '64px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'var(--cream)';
  navLinks.style.padding = '18px 32px';
  navLinks.style.borderBottom = '1px solid var(--line)';
  navLinks.style.gap = '16px';
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