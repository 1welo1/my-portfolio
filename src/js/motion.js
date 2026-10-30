/**
 * Motion & Navigation Interactions Module
 * Inspired by NESH motion mechanics with zero external dependencies
 */

export function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (!revealElements.length) return;

  // If user prefers reduced motion, reveal everything immediately without hiding
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Activate CSS motion styles
  document.body.classList.add('js-motion-ready');

  const observerOptions = {
    root: null,
    rootMargin: '200px 0px 300px 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

export function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!sections.length || !navLinks.length) return;

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -70% 0px'
  });

  sections.forEach(sec => spyObserver.observe(sec));
}

export function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function toggleMenu(isOpen) {
    const currentState = toggleBtn.getAttribute('aria-expanded') === 'true';
    const nextState = typeof isOpen === 'boolean' ? isOpen : !currentState;

    toggleBtn.setAttribute('aria-expanded', String(nextState));
    toggleBtn.classList.toggle('is-active', nextState);
    drawer.classList.toggle('is-open', nextState);
    document.body.style.overflow = nextState ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}
