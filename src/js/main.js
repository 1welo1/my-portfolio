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
   * Hero Scroll Pinning Transition
   * Transitions between Frame 1 (Mohammed Waleed) and Frame 2 (Value Proposition)
   * while the hero section remains pinned in place.
   */
  function initHeroScrollPinning() {
    var pinWrapper = document.getElementById('hero-pinned-wrapper');
    var frame1 = document.getElementById('hero-frame-1');
    var frame2 = document.getElementById('hero-frame-2');
    var frame3 = document.getElementById('hero-frame-3');
    if (!pinWrapper || !frame1 || !frame2) return;

    var ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var rect = pinWrapper.getBoundingClientRect();
          var scrolled = -rect.top;

          // Stage 1: Frame 1 (Mohammed Waleed / AI Automation Engineer)
          if (scrolled < 300) {
            frame1.classList.remove('is-hidden');
            frame2.classList.remove('is-active', 'is-hidden');
            if (frame3) frame3.classList.remove('is-active');
          } 
          // Stage 2: Frame 2 (AI Sales Agents That Close Deals in Your DMs)
          else if (scrolled >= 300 && scrolled < 600) {
            frame1.classList.add('is-hidden');
            frame2.classList.remove('is-hidden');
            frame2.classList.add('is-active');
            if (frame3) frame3.classList.remove('is-active');
          } 
          // Stage 3: Frame 3 (Deep Dive Philosophy / Retail Sales Engine)
          else {
            frame1.classList.add('is-hidden');
            frame2.classList.remove('is-active');
            frame2.classList.add('is-hidden');
            if (frame3) frame3.classList.add('is-active');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
/**
   * About Section Scroll Pinning Transition
   * Transitions between Frame 1 (University) and Frame 2 (Faculty/AI)
   * while the about section remains pinned in place.
   */
  function initAboutScrollPinning() {
    var pinWrapper = document.getElementById('about-pinned-wrapper');
    var frame1 = document.getElementById('about-frame-1');
    var frame2 = document.getElementById('about-frame-2');
    if (!pinWrapper || !frame1 || !frame2) return;

    var ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var rect = pinWrapper.getBoundingClientRect();
          var scrolled = -rect.top;

          // Transition when scrolled down past 280px (medium comfortable pace)
          if (scrolled >= 280) {
            frame1.classList.add('is-hidden');
            frame2.classList.add('is-active');
          } else {
            frame1.classList.remove('is-hidden');
            frame2.classList.remove('is-active');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /**
   * Bootstrapping on DOM Ready
   */
  /**
   * 7. Hero Showcase Video Autoplay & Smart Sound Management
   */
  
  /* ==========================================================================
     BILINGUAL (EN / AR) TRANSLATION ENGINE & LANGUAGE SWITCHER
     ========================================================================== */

  var translations = {
    en: {
      nav_demo: "Demo",
      nav_projects: "Projects",
      nav_capabilities: "Capabilities",
      nav_about: "About",
      nav_pricing: "Pricing",
      nav_faq: "FAQ",
      cta_chat_whatsapp: "Chat on WhatsApp",

      hero_name: "Mohammed Waleed",
      hero_title: "AI Automation Engineer",
      hero_f2_title: "Every DM You Answer Late is a Sale Your Competitor Gets.",
      hero_f2_sub: "I engineer autonomous conversational AI sales agents for WhatsApp & Instagram that answer in under 20 seconds, handle objections, and close deals around the clock.",
      hero_f3_lead: "I partner with ambitious brands and retail businesses to transform social messaging inboxes into 24/7 revenue engines.",
      hero_f3_body: "Instead of static chatbot templates that frustrate buyers, I engineer custom conversational AI systems directly connected to your live product catalog, pricing, and CRM. Every system is built to protect your brand reputation, deliver instant answers in under 20 seconds, and hand off high-ticket leads seamlessly to your sales reps.",
      hero_btn_audit: "Book an Automation Audit",
      hero_btn_work: "Explore Featured Work",
      hero_stat1_label: "Average Lead Reply",
      hero_stat2_label: "Automated Conversion",

      video_eyebrow: "SYSTEM SHOWCASE",
      video_title: "See The AI Sales Agent in Action",
      video_desc: "80 seconds showing live qualification, branch inventory lookup, objection handling, and checkout guidance.",

      project_section_eyebrow: "FLAGSHIP CASE STUDY",
      project_section_title: "Live WhatsApp & Meta Sales Engine in Production",
      project_section_desc: "See the actual conversational sales agent running live: verifying physical branch inventory, recommending audio gear by budget, and closing inquiries in seconds.",
      project_badge_cat: "E-Commerce & Retail Automation",
      project_badge_status: "Live Production System",
      project_adawliah_title: "aDawliah Meta & WhatsApp Conversational Sales Engine",
      project_adawliah_desc: "Architected an omnichannel AI sales assistant for aDawliah (Saudi Arabia's premier musical instrument & audio gear chain) to eliminate customer wait times. The video on the left captures the agent engaging customers live in real time: verifying branch inventory, recommending audio equipment matching the buyer's budget, and routing high-intent shoppers directly to branch visits and checkout.",
      highlight1_label: "< 20s Instant 24/7 Response",
      highlight1_sub: "Slashed peak wait times from 2+ hours to under 20 seconds on WhatsApp & Instagram—capturing midnight and weekend buyers immediately.",
      highlight2_label: "12,000+ Monthly Inquiries Automated",
      highlight2_sub: "Processed repetitive product queries, price checks, and branch directions automatically with zero additional support hires.",
      highlight3_label: "500+ SKUs & Live Branch Inventory",
      highlight3_sub: "Real-time catalog synchronization verifies physical branch stock availability across Saudi Arabia and prevents overselling.",
      highlight4_label: "+35% Lead Qualification & Hot Handover",
      highlight4_sub: "Filters out tire-kickers and escalates high-ticket audio gear buyers directly to sales reps with complete conversation summaries.",

      offers_eyebrow: "CORE CAPABILITIES",
      offers_title: "Full-Stack AI Agent Infrastructure",
      offers_desc: "End-to-end engineering from conversational prompt calibration to production database synchronization.",
      card1_title: "Autonomous Sales Agents (Instagram & Meta DMs)",
      card1_desc: "Never let a customer go cold. The AI qualifies incoming buyer intent, answers questions instantly, recommends matching products, overcomes hesitations, and guides shoppers straight to checkout.",
      card2_title: "WhatsApp Sales & Retention Engine",
      card2_desc: "Turn your WhatsApp number into an automated 24/7 storefront. Sends interactive product catalogs, delivers real-time order tracking, recovers abandoned inquiries, and shares instant payment links.",
      card3_title: "Strict Price & Catalog Protection",
      card3_desc: "Rock-solid brand safety: the AI never guesses or invents numbers. It strictly retrieves verified prices, stock availability, and specifications directly from your official inventory documentation.",
      card4_title: "Real-Time CRM & Live Inventory Synchronization",
      card4_desc: "Zero manual copy-pasting for your staff. Every lead phone number, conversation summary, and order request is automatically synchronized with your CRM, Google Sheets, or ERP in real time.",
      card5_title: "Smart Handover to Human Sales Reps",
      card5_desc: "When a high-ticket customer is ready to close or requests custom assistance, the AI instantly notifies your human sales reps with a complete 3-bullet summary of the buyer's needs and chat history.",

      about_f1_text: 'I am currently pursuing my undergraduate studies at <span class="about-highlight">Al Ryada University for Science and Technology</span>, where I am building a strong academic foundation in modern technology and scientific thinking.',
      about_f2_text: "At the Faculty of Computers and Artificial Intelligence, I focus on building AI-powered automation systems that turn complex workflows into intelligent, efficient solutions.",

      pricing_eyebrow: "TRANSPARENT ENGAGEMENTS",
      pricing_title: "Engineered for High-ROI Business Outcomes",
      pricing_desc: "Deterministic delivery sprints with clear technical deliverables, zero monthly bot software markups, and full IP ownership.",

      plan1_name: "Sprint Automation",
      plan1_pitch: "Ideal for businesses needing a dedicated 24/7 lead qualifier on a single channel.",
      plan1_price: "Starting from $450",
      plan1_f1: "Single DM channel (Instagram or WhatsApp)",
      plan1_f2: "Pre-trained FAQ & Lead Qualification flow",
      plan1_f3: "Google Sheets / Email lead capture sync",
      plan1_f4: "Human agent handover trigger",
      plan1_f5: "7–10 days deployment sprint",
      plan1_cta: "Inquire on WhatsApp",

      plan2_badge: "RECOMMENDED • BEST VALUE",
      plan2_name: "Growth Sales Funnel",
      plan2_pitch: "Complete automated sales infrastructure for brands scaling ad-driven conversation volume.",
      plan2_price: "Starting from $950",
      plan2_f1: "Dual-channel setup (Meta DMs + WhatsApp Cloud)",
      plan2_f2: "Dynamic Product Catalog RAG integration",
      plan2_f3: "Live CRM sync (HubSpot, Shopify, or Custom DB)",
      plan2_f4: "Advanced objection handling & checkout links",
      plan2_f5: "Real-time rep escalation dashboard",
      plan2_f6: "14-day delivery sprint + 30-day monitoring",
      plan2_cta: "Book via WhatsApp",

      plan3_name: "Custom Architecture",
      plan3_pitch: "For enterprise systems requiring deep internal database coordination and custom microservices.",
      plan3_price: "Custom Quote",
      plan3_f1: "Multi-system enterprise integration",
      plan3_f2: "Proprietary vector store & private RAG",
      plan3_f3: "Custom FastAPI microservice hosting & SLA",
      plan3_f4: "Full automated testing & CI/CD pipeline",
      plan3_f5: "Dedicated support & ongoing performance tuning",
      plan3_cta: "Discuss on WhatsApp",

      faq_eyebrow: "COMMON INQUIRIES",
      faq_title: "Clear Answers on Architecture & Delivery",
      faq_desc: "Direct explanations addressing system precision, platform integrations, and operational safety.",
      faq_q1: "How do you prevent the AI agent from hallucinating or quoting wrong prices?",
      faq_a1: "I implement strict Retrieval-Augmented Generation (RAG) pipelines with deterministic query boundaries. The AI agent is constrained to retrieve verified information solely from your live inventory database and canonical documentation. If a parameter or price falls outside the retrieved dataset, the agent follows strict fallback protocols rather than guessing.",
      faq_q2: "Can the agent integrate directly with our existing Shopify, WooCommerce, or custom CRM?",
      faq_a2: "Yes. All agents are built on standard RESTful webhooks and FastAPI microservices. We connect directly into Shopify Admin APIs, WooCommerce REST, HubSpot, Zoho, or your internal PostgreSQL database to look up real-time orders, SKU stock counts, and customer histories.",
      faq_q3: "What happens when a customer asks a question outside the bot's training data?",
      faq_a3: "The system triggers a graceful Human-in-the-Loop handover. It politely notifies the customer that a human specialist is taking over, pauses automated triggers for that specific thread, and alerts your customer support team via Slack, WhatsApp, or email with a synthesized transcript summary.",
      faq_q4: "How long does a typical implementation take from kickoff to go-live?",
      faq_a4: "A standard Sprint Automation takes 7 to 10 business days. Comprehensive Growth Funnels requiring dual Meta + WhatsApp setups, catalog ingestion, and CRM bidirectional webhooks typically ship within 14 business days, accompanied by end-to-end sandbox testing before live traffic is directed.",
      faq_q5: "Will our team be able to monitor conversations and take over when needed?",
      faq_a5: "Absolutely. All conversations reside directly within your native Meta Business Suite Inbox or WhatsApp Business app. Your team retains 100% visibility at all times, and typing a manual reply immediately mutes automated responses on that thread.",

      footer_tagline: "Architecting production-grade conversational AI systems and automated conversion funnels. Built with precision, speed, and architectural integrity.",
      footer_contact_title: "Let's Discuss Your Automation Needs",
      footer_copy_btn: "Copy",
      footer_copyright: "© 2026 Mohammed Waleed (WELO). All rights reserved.",
      footer_bottom_sub: "AI Automation Engineer • Production Conversational Systems",
      toast_email_copied: "Email copied to clipboard!"
    },
    ar: {
      nav_demo: "العرض التجريبي",
      nav_projects: "المشاريع",
      nav_capabilities: "القدرات التقنية",
      nav_about: "نبذة عني",
      nav_pricing: "الباقات",
      nav_faq: "الأسئلة الشائعة",
      cta_chat_whatsapp: "تواصل عبر واتساب",

      hero_name: "محمد وليد",
      hero_title: "مهندس أتمتة الذكاء الاصطناعي",
      hero_f2_title: "كل رسالة تتأخر في الرد عليها هي صفقة يكسبها منافسك.",
      hero_f2_sub: "أقوم ببناء وكلاء ذكاء اصطناعي محادثة مستقلين لواتساب وإنستغرام يردون في أقل من 20 ثانية، ويتعاملون مع الاعتراضات، ويغلقون الصفقات على مدار الساعة.",
      hero_f3_lead: "أتعاون مع العلامات التجارية ومتاجر التجزئة الطموحة لتحويل صناديق رسائل التواصل الاجتماعي إلى محركات مبيعات تعمل 24/7.",
      hero_f3_body: "بدلاً من قوالب روبوتات الدردشة التقليدية التي تحبط المشترين، أصمم أنظمة ذكاء اصطناعي محادثة مخصصة متصلة مباشرة بكتالوج منتجاتك، وأسعارك الحية، ونظام إدارة علاقات العملاء (CRM). كل نظام مصمم لحماية سمعة علامتك التجارية، وتقديم إجابات فورية في أقل من 20 ثانية، وتسليم العملاء المهتمين بسلاسة إلى فريق مبيعاتك.",
      hero_btn_audit: "احجز تدقيق أتمتة مجاني",
      hero_btn_work: "استكشف الأعمال المميزة",
      hero_stat1_label: "متوسط وقت الرد على العميل",
      hero_stat2_label: "تحويل مبيعات مؤتمت",

      video_eyebrow: "عرض النظام المباشر",
      video_title: "شاهد وكيل الذكاء الاصطناعي أثناء العمل",
      video_desc: "80 ثانية توضح التأهيل الفوري للعملاء، فحص مخزون الفروع، التعامل مع استفسارات المشترين، والتوجيه لإتمام الطلب.",

      project_section_eyebrow: "دراسة حالة رئيسية",
      project_section_title: "محرك مبيعات حي لواتساب وإنستغرام في بيئة التشغيل الفعلي",
      project_section_desc: "شاهد وكيل المبيعات المحادث الفعلي قيد التشغيل: يفحص توفر المخزون في الفروع الفعلية، يقترح المعدات الصوتية حسب ميزانية المشتري، ويغلق الاستفسارات في ثوانٍ.",
      project_badge_cat: "أتمتة التجارة الإلكترونية والتجزئة",
      project_badge_status: "نظام يعمل فعلياً في الإنتاج",
      project_adawliah_title: "محرك مبيعات الدولية للذكاء الاصطناعي عبر ميتا وواتساب",
      project_adawliah_desc: "تصميم وبناء مساعد مبيعات ذكاء اصطناعي متعدد القنوات لشركة الدولية (الوجهة الرائدة للآلات الموسيقية والمعدات الصوتية في السعودية) لإلغاء أوقات انتظار العملاء تماماً. يوضح الفيديو على اليسار الوكيل وهو يتفاعل مع العملاء مباشرة في الوقت الفعلي: يتحقق من مخزون الفروع، يوصي بالمعدات الصوتية المطابقة لميزانية العميل، ويوجه المشترين الجادين مباشرة لزيارة الفرع وإتمام الشراء.",
      highlight1_label: "< 20s رد فوري 24/7",
      highlight1_sub: "تقليص فترات الانتظار القصوى من ساعتين أو أكثر إلى أقل من 20 ثانية على واتساب وإنستغرام—لكسب مشتري منتصف الليل وعطلات نهاية الأسبوع فوراً.",
      highlight2_label: "+12,000 استفسار شهري مؤتمت",
      highlight2_sub: "معالجة استفسارات المنتجات المتكررة، فحص الأسعار، وتوجيهات الفروع تلقائياً بالكامل دون الحاجة لتوظيف فريق دعم إضافي.",
      highlight3_label: "+500 منتج ومخزون حي للفروع",
      highlight3_sub: "مزامنة لحظية للكتالوج للتحقق من توفر المنتجات في الفروع الفعلية في كافة أنحاء السعودية ومنع البيع الزائد.",
      highlight4_label: "+35% تأهيل للعملاء وتسليم فوري للمبيعات",
      highlight4_sub: "تصفية الفضوليين وتصعيد المشترين الجادين للأجهزة الصوتية عالية القيمة مباشرة لممثلي المبيعات مع ملخص كامل للمحادثة.",

      offers_eyebrow: "القدرات التقنية الأساسية",
      offers_title: "بنية تحتية متكاملة لوكلاء الذكاء الاصطناعي",
      offers_desc: "هندسة شاملة تبدأ من ضبط التوجيهات المحادثة وحتى المزامنة اللحظية مع قواعد البيانات الفعلية.",
      card1_title: "وكلاء مبيعات مستقلون (رسائل إنستغرام وميتا)",
      card1_desc: "لا تترك عميلاً يبرد أبداً. يقوم الذكاء الاصطناعي بتأهيل نية الشراء، الإجابة على الأسئلة فوراً، اقتراح المنتجات المناسبة، تذليل المخاوف، وتوجيه المشترين مباشرة إلى الدفع.",
      card2_title: "محرك مبيعات وتنشيط العملاء عبر واتساب",
      card2_desc: "حوّل رقم واتساب الخاص بك إلى متجر يعمل على مدار الساعة. إرسال كتالوجات تفاعلية، تتبع فوري للطلبات، استعادة الاستفسارات المتروكة، ومشاركة روابط دفع مباشرة.",
      card3_title: "حماية دقيقة للأسعار والكتالوج",
      card3_desc: "أمان راسخ لسمعة العلامة التجارية: لا يقوم الذكاء الاصطناعي بالتخمين أو اختلاق الأرقام نهائياً. يسترجع بدقة الأسعار المعتمدة، وتوفر المخزون، والمواصفات مباشرة من ملفات وبيانات منتجاتك الرسمية.",
      card4_title: "مزامنة فورية مع نظام إدارة العملاء (CRM) والمخزون",
      card4_desc: "وداعاً للنسخ واللصق اليدوي لموظفيك. تتم مزامنة رقم هاتف كل عميل مهتم، وملخص المحادثة، وطلب الشراء تلقائياً مع نظام CRM أو جداول بيانات جوجل أو نظام ERP لحظياً.",
      card5_title: "تسليم ذكي لممثلي المبيعات البشريين",
      card5_desc: "عندما يكون العميل جاهزاً لإتمام صفقة ذات قيمة عالية أو يطلب مساعدة مخصصة، يقوم الذكاء الاصطناعي بإشعار مسؤولي المبيعات فوراً بملخص من 3 نقاط لاحتياجات المشتري وتاريخ المحادثة.",

      about_f1_text: 'أتابع حالياً دراستي الجامعية في <span class="about-highlight">جامعة الريادة للعلوم والتكنولوجيا</span>، حيث أبني أساساً أكاديمياً متيناً في التكنولوجيا الحديثة والتفكير العلمي.',
      about_f2_text: "في كلية الحاسبات والذكاء الاصطناعي، أركز على بناء أنظمة أتمتة مدعومة بالذكاء الاصطناعي تحول مسارات العمل المعقدة إلى حلول ذكية وعالية الكفاءة.",

      pricing_eyebrow: "تعاقدات شفافة ومحددة",
      pricing_title: "مصممة لتحقيق أعلى عائد على الاستثمار",
      pricing_desc: "دورات تسليم محددة بدقة مع مخرجات تقنية واضحة، بدون هوامش شهرية على برمجيات البوت، وملكية فكرية كاملة للنظام.",

      plan1_name: "أتمتة سريعة (Sprint)",
      plan1_pitch: "مثالية للأنشطة التجارية التي تحتاج إلى مؤهل عملاء مخصص يعمل 24/7 على قناة واحدة.",
      plan1_price: "تبدأ من 450$",
      plan1_f1: "قناة مراسلة واحدة (إنستغرام أو واتساب)",
      plan1_f2: "مسار مؤهل مسبقاً للأسئلة الشائعة وتأهيل العملاء",
      plan1_f3: "ربط ومزامنة العملاء مع Google Sheets أو البريد",
      plan1_f4: "محفز تسليم المحادثة لموظف بشري",
      plan1_f5: "تسليم وتشغيل خلال 7 إلى 10 أيام",
      plan1_cta: "استفسر عبر واتساب",

      plan2_badge: "موصى به • القيمة الأفضل",
      plan2_name: "مسار مبيعات النمو (Growth Funnel)",
      plan2_pitch: "بنية تحتية متكاملة لمبيعات المراسلة للعلامات التجارية التي تتوسع في حملات الإعلانات وحجم المحادثات.",
      plan2_price: "تبدأ من 950$",
      plan2_f1: "إعداد لقناتين (رسائل ميتا + WhatsApp Cloud API)",
      plan2_f2: "دمج RAG تفاعلي لكتالوج المنتجات الديناميكي",
      plan2_f3: "مزامنة حية مع CRM (Shopify أو HubSpot أو قاعدة بيانات مخصصة)",
      plan2_f4: "تعامل متقدم مع الاعتراضات وتوليد روابط الدفع",
      plan2_f5: "لوحة تحكم وتنبيهات فورية للمبيعات لتصعيد العملاء",
      plan2_f6: "دورة تسليم خلال 14 يوماً + 30 يوماً متابعة وتحسين",
      plan2_cta: "احجز عبر واتساب",

      plan3_name: "بنية معمارية مخصصة (Custom)",
      plan3_pitch: "للأنظمة والشركات التي تتطلب ربطاً داخلياً عميقاً بقواعد البيانات وبناء خدمات مصغرة خاصة.",
      plan3_price: "عرض سعر مخصص",
      plan3_f1: "تكامل متعدد الأنظمة لبيئات الشركات والمؤسسات",
      plan3_f2: "مستودع بيانات شعاعي خاص ونظام RAG مخصص",
      plan3_f3: "استضافة خدمات FastAPI مصغرة مع اتفاقية مستوى الخدمة (SLA)",
      plan3_f4: "اختبارات برمجية مؤتمتة بالكامل ومسار CI/CD",
      plan3_f5: "دعم فني مخصص ومتابعة مستمرة لتحسين الأداء",
      plan3_cta: "ناقش مشروعك عبر واتساب",

      faq_eyebrow: "استفسارات شائعة",
      faq_title: "إجابات واضحة حول البنية المعمارية والتسليم",
      faq_desc: "توضيحات مباشرة تجيب عن دقة النظام، التكاملات، وسلامة التشغيل.",
      faq_q1: "كيف تمنع وكيل الذكاء الاصطناعي من اختلاق معلومات أو تسعير خاطئ؟",
      faq_a1: "أطبق مسارات بحث معزز بالتوليد (RAG) صارمة مع حدود استعلام حتمية. الوكيل مقيد حصراً باسترجاع البيانات المعتمدة من قاعدة بيانات مخزونك الحية ووثائقك الرسمية. إذا كان أي استفسار أو سعر خارج نطاق البيانات المسترجعة، يتبع النظام بروتوكول تحويل آمن بدلاً من التخمين.",
      faq_q2: "هل يمكن للوكيل التكامل مباشرة مع متجرنا على Shopify أو WooCommerce أو نظام إدارة العملاء الخاص بنا؟",
      faq_a2: "نعم. يتم بناء جميع الوكلاء استناداً إلى RESTful Webhooks وخدمات FastAPI المصغرة. نتصل مباشرة بواجهات برمجية لـ Shopify Admin أو WooCommerce REST أو HubSpot أو Zoho أو قاعدة بيانات PostgreSQL الداخلية لديك لفحص الطلبات وأرصدة المخزون وتاريخ العملاء لحظياً.",
      faq_q3: "ماذا يحدث عندما يطرح العميل سؤالاً غير موجود في بيانات تدريب الوكيل؟",
      faq_a3: "يقوم النظام بتفعيل تسليم سلس للتدخل البشري (Human-in-the-Loop). يخبر العميل بأدب بأن أحد المتخصصين سينضم للمحادثة، ويوقف الردود التلقائية لتلك المحادثة تحديداً، وينبه فريق الدعم لديك عبر Slack أو واتساب أو البريد الإلكتروني مع ملخص للمحادثة.",
      faq_q4: "كم يستغرق التنفيذ الفعلي من لحظة البدء وحتى الإطلاق؟",
      faq_a4: "تستغرق الأتمتة السريعة (Sprint Automation) من 7 إلى 10 أيام عمل. أما مسارات النمو المتكاملة (Growth Funnels) التي تتطلب إعداداً مزدوجاً لـ Meta + WhatsApp ومزامنة الكتالوج مع CRM فغالباً ما تُسلم خلال 14 يوم عمل، مصحوبة باختبارات شاملة قبل توجيه حركة العملاء الفعلية.",
      faq_q5: "هل سيتمكن فريقنا من متابعة المحادثات والتدخل متى لزم الأمر؟",
      faq_a5: "بكل تأكيد. جميع المحادثات تجري مباشرة داخل صندوق بريد Meta Business Suite أو تطبيق WhatsApp Business الخاص بكم. يحتفظ فريقكم برؤية كاملة 100% طوال الوقت، ومجرد كتابة أي رد يدوي من جانبكم يتم كتم الردود التلقائية لتلك المحادثة فوراً.",

      footer_tagline: "هندسة أنظمة ذكاء اصطناعي محادثة ومسارات تحويل مبيعات مؤتمتة للمؤسسات. مبنية بدقة وسرعة وسلامة معمارية.",
      footer_contact_title: "دعنا نناقش احتياجات الأتمتة لعملك",
      footer_copy_btn: "نسخ",
      footer_copyright: "© 2026 Mohammed Waleed (WELO). جميع الحقوق محفوظة.",
      footer_bottom_sub: "مهندس أتمتة الذكاء الاصطناعي • أنظمة محادثة بيئة الإنتاج",
      toast_email_copied: "تم نسخ البريد الإلكتروني إلى الحافظة!"
    }
  };

    /* WhatsApp dynamic link generator with bilingual appointment booking */
  var waNumber = '201043156209';
  var waMessages = {
    en: {
      general: "Hello Mohammed, I'd like to book an appointment to discuss an AI sales agent for my business.",
      audit: "Hello Mohammed, I'd like to book an appointment for a free Automation Audit.",
      plan1: "Hello Mohammed, I'd like to book an appointment for the Sprint Automation plan ($450).",
      plan2: "Hello Mohammed, I'd like to book an appointment for the Growth Sales Funnel plan ($950).",
      plan3: "Hello Mohammed, I'd like to book a meeting to discuss a Custom Architecture system.",
      contact: "Hello Mohammed, I'd like to book an appointment."
    },
    ar: {
      general: "مرحباً محمد، أود حجز موعد لمناقشة تطوير وكيل ذكاء اصطناعي لعملي.",
      audit: "مرحباً محمد، أود حجز موعد لتدقيق أتمتة مجاني لعملي.",
      plan1: "مرحباً محمد، أود حجز موعد لمناقشة باقة الأتمتة السريعة ($450).",
      plan2: "مرحباً محمد، أود حجز موعد لمناقشة باقة مسار مبيعات النمو ($950).",
      plan3: "مرحباً محمد، أود حجز موعد لمناقشة متطلبات بنية معمارية مخصصة.",
      contact: "مرحباً محمد، أود التواصل وحجز موعد لمشروع جديد."
    }
  };

  function updateWhatsAppLinks(lang) {
    var activeLang = (lang === 'ar') ? 'ar' : 'en';
    var links = document.querySelectorAll('a[data-wa-type]');
    links.forEach(function (link) {
      var type = link.getAttribute('data-wa-type') || 'general';
      var textMsg = (waMessages[activeLang] && waMessages[activeLang][type])
        ? waMessages[activeLang][type]
        : waMessages[activeLang].general;
      link.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(textMsg);
    });
  }

  var currentLang = 'en';

  function applyLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' ? 'rtl' : 'ltr');

    // Document title
    document.title = (lang === 'ar') 
      ? 'محمد وليد | مهندس أتمتة الذكاء الاصطناعي'
      : 'Mohammed Waleed | AI Automation Engineer';

    // Translate all tagged DOM elements
    var elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = translations[lang][key];
      if (val !== undefined) {
        if (val.indexOf('<') !== -1) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update Language Toggle Button Labels
    var toggleCodeText = (lang === 'ar') ? 'English' : 'العربية';
    var headerCode = document.querySelector('#lang-toggle-btn .lang-code');
    if (headerCode) headerCode.textContent = toggleCodeText;

    var mobileCode = document.querySelector('#mobile-lang-toggle-btn .lang-code');
    if (mobileCode) mobileCode.textContent = toggleCodeText;

    // Update all WhatsApp action URLs with prefilled booking message for active language
    updateWhatsAppLinks(lang);

    // Trigger video showcase audio button label update if video module loaded
    if (window.__refreshShowcaseAudioBtn) {
      window.__refreshShowcaseAudioBtn();
    }

    // Persist
    try {
      localStorage.setItem('portfolio_lang', lang);
    } catch (e) {}
  }

  function initLanguageSwitcher() {
    var headerBtn = document.getElementById('lang-toggle-btn');
    var mobileBtn = document.getElementById('mobile-lang-toggle-btn');

    function toggle() {
      var nextLang = (currentLang === 'en') ? 'ar' : 'en';
      applyLanguage(nextLang);
    }

    if (headerBtn) headerBtn.addEventListener('click', toggle);
    if (mobileBtn) mobileBtn.addEventListener('click', toggle);

    // Initial check from localStorage
    var savedLang = 'en';
    try {
      savedLang = localStorage.getItem('portfolio_lang') || 'en';
    } catch (e) {}

    if (savedLang === 'ar') {
      applyLanguage('ar');
    } else {
      updateWhatsAppLinks('en');
    }
  }

  function initShowcaseVideo() {
    window.__refreshShowcaseAudioBtn = function() {
      if (typeof updateButtonUI === 'function') updateButtonUI(isUnmuted);
    };
    var video = document.getElementById('hero-showcase-video');
    var btn = document.getElementById('showcase-audio-btn');
    var videoBox = document.querySelector('.hero-showcase-video-box');
    if (!video) return;

    var userHasInteracted = false;
    var isUnmuted = false;
    var fadeTimer = null;

    function updateButtonUI(unmuted) {
      if (!btn) return;
      if (fadeTimer) {
        clearTimeout(fadeTimer);
        fadeTimer = null;
      }
      var isAr = (document.documentElement.lang === 'ar');
      if (unmuted) {
        var onLabel = isAr ? 'الصوت يعمل' : 'Sound On';
        btn.innerHTML = '<span class="audio-btn-icon" aria-hidden="true">🔊</span><span class="audio-btn-text">' + onLabel + '</span>';
        btn.classList.add('is-unmuted');
        btn.classList.remove('is-faded');
        btn.setAttribute('aria-label', isAr ? 'كتم الصوت' : 'Mute Video');
        fadeTimer = setTimeout(function () {
          if (isUnmuted && btn) {
            btn.classList.add('is-faded');
          }
        }, 3000);
      } else {
        var tapLabel = isAr ? 'اضغط لتشغيل الصوت' : 'Tap for Sound';
        btn.innerHTML = '<span class="audio-btn-icon" aria-hidden="true">🔇</span><span class="audio-btn-text">' + tapLabel + '</span>';
        btn.classList.remove('is-unmuted', 'is-faded');
        btn.setAttribute('aria-label', isAr ? 'تشغيل الصوت' : 'Unmute Video');
      }
    }

    function applyUnmute() {
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1.0;
      video.removeAttribute('muted');
      isUnmuted = true;
      updateButtonUI(true);
      if (video.paused) {
        video.play().catch(function () {});
      }
    }

    function applyMute() {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      isUnmuted = false;
      updateButtonUI(false);
    }

    function toggleAudio() {
      if (video.muted || !isUnmuted) {
        applyUnmute();
      } else {
        applyMute();
      }
    }

    // 1. Direct click/tap on Sound Button
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        userHasInteracted = true;
        toggleAudio();
      });
    }

    // 2. Click anywhere on Video Box
    if (videoBox) {
      videoBox.addEventListener('click', function (e) {
        if (e.target.closest('#showcase-audio-btn')) return;
        userHasInteracted = true;
        toggleAudio();
      });
    }

    // 3. User interaction listener anywhere on the page
    // As soon as the user touches, clicks, or interacts with the page,
    // if the video is currently in the viewport, automatically unmute!
    function onFirstUserGesture() {
      userHasInteracted = true;
      var rect = video.getBoundingClientRect();
      var inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && !isUnmuted) {
        applyUnmute();
      }
      window.removeEventListener('click', onFirstUserGesture);
      window.removeEventListener('touchstart', onFirstUserGesture);
    }
    window.addEventListener('click', onFirstUserGesture, { passive: true });
    window.addEventListener('touchstart', onFirstUserGesture, { passive: true });

    // 4. Initial Autoplay: start muted for strict browser policy compliance
    video.volume = 1.0;
    video.muted = true;
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // If autoplay was deferred until interaction
        var resumeOnGesture = function () {
          video.play().catch(function () {});
          window.removeEventListener('touchstart', resumeOnGesture);
          window.removeEventListener('click', resumeOnGesture);
          window.removeEventListener('scroll', resumeOnGesture);
        };
        window.addEventListener('touchstart', resumeOnGesture, { once: true, passive: true });
        window.addEventListener('click', resumeOnGesture, { once: true, passive: true });
        window.addEventListener('scroll', resumeOnGesture, { once: true, passive: true });
      });
    }

    // 5. IntersectionObserver: Pause when out of view, resume when back in view
    // CRITICAL: NEVER touch video.muted here so we preserve user unmuted state!
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (video.paused) {
              video.play().catch(function () {});
            }
            if (userHasInteracted && !isUnmuted) {
              applyUnmute();
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      }, { threshold: 0.15 });

      observer.observe(video);
    }

    // 6. Handle tab visibility changes
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        var rect = video.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (video.paused) video.play().catch(function () {});
        }
      } else {
        if (!video.paused) video.pause();
      }
    });
  }

  function init() {
    initLanguageSwitcher();
    initScrollReveal();
    initHeroScrollPinning();
    initAboutScrollPinning();
    initActiveNavSpy();
    initMobileNav();
    initAccordion();
    initClipboard();
    initVideoControls();
    initShowcaseVideo();
    console.log('Mohammed Waleed Portfolio initialized successfully (CORS-free standalone mode).');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
