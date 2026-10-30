/**
 * Mohamed Waleed (WELO) Portfolio - Standalone Application Script
 * Optimized for both local file browsing (file://) and HTTP web servers.
 * Zero external runtime dependencies.
 */

(function () {
  'use strict';

  /**
   * 1. Scroll Reveal Animations
   * Smooth intersection observer with instant fallback for items in viewport
   */
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    // Respect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    // Enable CSS transitions
    document.body.classList.add('js-motion-ready');

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var observerOptions = {
      root: null,
      rootMargin: '100px 0px 100px 0px',
      threshold: 0.05
    };

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      // If already in or near viewport on page load, reveal immediately
      if (rect.top < window.innerHeight + 50) {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });
  }

  /**
   * 2. Active Section Spy for Navigation Bar
   */
  function initActiveNavSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    if (!('IntersectionObserver' in window)) return;

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(function (sec) {
      spyObserver.observe(sec);
    });
  }

  /**
   * 3. Mobile Navigation Drawer & Hamburger Toggle
   */
  function initMobileNav() {
    var toggleBtn = document.querySelector('.mobile-toggle');
    var drawer = document.querySelector('.mobile-nav-drawer');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !drawer) return;

    function toggleMenu(isOpen) {
      var isCurrentlyOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      var nextState = typeof isOpen === 'boolean' ? isOpen : !isCurrentlyOpen;

      toggleBtn.setAttribute('aria-expanded', String(nextState));
      toggleBtn.classList.toggle('is-active', nextState);
      drawer.classList.toggle('is-open', nextState);
      document.body.style.overflow = nextState ? 'hidden' : '';
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMenu(false);
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', function (e) {
      if (drawer.classList.contains('is-open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close when pressing Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  /**
   * 4. FAQ Accordion Interaction
   */
  function initAccordion() {
    var faqList = document.querySelector('.faq-list');
    if (!faqList) return;

    faqList.addEventListener('click', function (e) {
      var trigger = e.target.closest('.faq-trigger');
      if (!trigger) return;

      var currentItem = trigger.closest('.faq-item');
      if (!currentItem) return;

      var isCurrentlyOpen = currentItem.classList.contains('is-open');

      // Close all other items
      var allItems = faqList.querySelectorAll('.faq-item');
      allItems.forEach(function (item) {
        if (item !== currentItem) {
          item.classList.remove('is-open');
          var itemTrigger = item.querySelector('.faq-trigger');
          if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      var nextState = !isCurrentlyOpen;
      currentItem.classList.toggle('is-open', nextState);
      trigger.setAttribute('aria-expanded', String(nextState));
    });
  }

  /**
   * 5. Email Clipboard Copy with Toast Feedback
   */
  function initClipboard() {
    var copyButtons = document.querySelectorAll('[data-clipboard-target]');
    var toast = document.getElementById('toast');
    var toastTimeout = null;

    function showToast(message) {
      if (!toast) return;

      if (message) {
        var textNode = toast.querySelector('.toast-text');
        if (textNode) textNode.textContent = message;
      }

      toast.classList.add('is-visible');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(function () {
        toast.classList.remove('is-visible');
      }, 2500);
    }

    copyButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var textToCopy = btn.getAttribute('data-clipboard-target');
        if (!textToCopy) return;

        function fallbackCopy(text) {
          var textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
          } catch (_) {}
          document.body.removeChild(textArea);
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(function () {
            showToast('Email copied to clipboard!');
          }).catch(function () {
            fallbackCopy(textToCopy);
            showToast('Email copied to clipboard!');
          });
        } else {
          fallbackCopy(textToCopy);
          showToast('Email copied to clipboard!');
        }
      });
    });
  }

  /**
   * 6. Live Video Viewport Autoplay & Performance Management
   */
  function initVideoControls() {
    var video = document.getElementById('adawliah-video');
    if (!video) return;

    // Ensure completely muted and playsinline to satisfy browser policies
    video.muted = true;
    video.playsInline = true;

    // Ensure autoplay triggers reliably even if browser has strict initial policy
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {});
    }

    // Pause video when out of viewport to preserve mobile battery and performance
    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            if (!video.paused) {
              video.pause();
            }
          } else {
            if (video.paused) {
              video.play().catch(function () {});
            }
          }
        });
      }, { threshold: 0.15 });

      videoObserver.observe(video);
    }
  }

  /**
   * Bootstrapping on DOM Ready
   */
  function init() {
    initScrollReveal();
    initActiveNavSpy();
    initMobileNav();
    initAccordion();
    initClipboard();
    initVideoControls();
    console.log('Mohamed Waleed Portfolio initialized successfully (CORS-free standalone mode).');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
