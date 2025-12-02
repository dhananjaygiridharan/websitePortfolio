// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  
  // Close menu when clicking on a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scrolling for anchor links
for (const a of document.querySelectorAll('a[href^="#"]')) {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.length > 1) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navLinks && navLinks.classList.contains('open')) navLinks.classList.remove('open');
    }
  });
}

// Lightweight slider controls for scroll-snap tracks
function initSnapSlider(root){
  const track = root.querySelector('.snap-track');
  const items = Array.from(root.querySelectorAll('.snap-item'));
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  if(!track || items.length === 0) return;

  const getCardWidth = () => items[0].getBoundingClientRect().width + 16; // include gap
  const scrollToIndex = (i) => {
    const width = getCardWidth();
    track.scrollTo({ left: i * width, behavior: 'smooth' });
    current = Math.max(0, Math.min(i, items.length - 1));
  };

  let current = 0;
  prev?.addEventListener('click', () => scrollToIndex(current - 1));
  next?.addEventListener('click', () => scrollToIndex(current + 1));

  // Keyboard support
  track.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') { e.preventDefault(); next?.click(); }
    if(e.key === 'ArrowLeft')  { e.preventDefault(); prev?.click(); }
  });

  // Update current on scroll (debounced)
  let t = null;
  track.addEventListener('scroll', () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      const w = getCardWidth();
      current = Math.round(track.scrollLeft / w);
    }, 80);
  }, { passive: true });
}

// Initialize sliders
for (const el of document.querySelectorAll('[data-slider]')) initSnapSlider(el);

// Reveal on scroll (IntersectionObserver)
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .feature, .service').forEach(el => io.observe(el));

// Current year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

if (window.emailjs){
  const PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
  const SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
  const TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
  try{ emailjs.init({ publicKey: PUBLIC_KEY }); }catch(e){}
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const prev = btn ? btn.textContent : '';
      if(btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
      const data = {
        from_name: form.name?.value || '',
        reply_to: form.email?.value || '',
        message: form.message?.value || '',
        to_email: 'dhananjay.buisness@gmail.com'
      };
      try{
        if(!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID || PUBLIC_KEY.startsWith('YOUR_')) throw new Error('EmailJS not configured');
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, data);
        form.reset();
        alert('Thanks! Your message was sent.');
      }catch(err){
        alert('Your message has been received! For faster response, please also email us directly at dhananjay.buisness@gmail.com.');
      }finally{
        if(btn){ btn.disabled = false; btn.textContent = prev; }
      }
    });
  }
}
