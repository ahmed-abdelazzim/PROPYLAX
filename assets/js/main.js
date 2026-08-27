/**
 * PROPYLAX GEL — HIGH-CONVERTING MEDICAL LANDING PAGE LOGIC
 * Features:
 * - Persistent 25-minute Countdown Timer (localStorage preserved)
 * - Natural Dynamic Live View Simulation (10 - 20)
 * - Product Visual Switcher (Combo / Box / Tube)
 * - Real-time Package Pricing & Savings Calculator
 * - Egyptian Phone Validation & Carrier Detection (010, 011, 012, 015)
 * - Frictionless Form Submission with Animated Success State
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIGURATION & STATE
     ========================================================================== */
  const CONFIG = {
    // Campaign Countdown
    countdownDurationMinutes: 25,
    storageCountdownKey: 'propylax_deal_end_timestamp_aug2026',

    // Live Viewer Simulation
    liveView: {
      min: 11,
      max: 20,
      initial: 17,
      intervalMinMs: 4000,
      intervalMaxMs: 7500
    },

    // Product Offer Configuration (Single 100GM Tube)
    product: {
      name: 'دهان PROPYLAX GEL (عبوة 100GM)',
      qtyLabel: 'عبوة واحدة (100GM)',
      currentPrice: 420,
      oldPrice: 560,
      savings: 140,
      discountPercent: '25%'
    }
  };

  let state = {
    currentLiveCount: CONFIG.liveView.initial
  };

  /* ==========================================================================
     2. COUNTDOWN TIMER (PERSISTENT & REALISTIC)
     ========================================================================== */
  function initCountdownTimer() {
    const minutesEl = document.getElementById('timerMinutes');
    const secondsEl = document.getElementById('timerSeconds');
    if (!minutesEl || !secondsEl) return;

    let targetEndTime;
    const storedTimestamp = localStorage.getItem(CONFIG.storageCountdownKey);
    const now = Date.now();

    if (storedTimestamp && parseInt(storedTimestamp, 10) > now) {
      targetEndTime = parseInt(storedTimestamp, 10);
    } else {
      // Set new duration (25 minutes from now)
      targetEndTime = now + CONFIG.countdownDurationMinutes * 60 * 1000;
      localStorage.setItem(CONFIG.storageCountdownKey, targetEndTime.toString());
    }

    function updateTimer() {
      const currentTime = Date.now();
      const remainingMs = targetEndTime - currentTime;

      if (remainingMs <= 0) {
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const totalSeconds = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ==========================================================================
     3. LIVE VIEW SIMULATION (10 - 20 NATURAL FLUCTUATION)
     ========================================================================== */
  function initLiveView() {
    const liveCountEl = document.getElementById('liveCount');
    if (!liveCountEl) return;

    let currentVal = state.currentLiveCount;
    liveCountEl.textContent = currentVal;

    function fluctuate() {
      // Natural delta between -2 and +2
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
      let nextVal = currentVal + delta;

      // Keep strictly within [CONFIG.liveView.min, CONFIG.liveView.max]
      if (nextVal < CONFIG.liveView.min) nextVal = CONFIG.liveView.min + 2;
      if (nextVal > CONFIG.liveView.max) nextVal = CONFIG.liveView.max - 2;

      currentVal = nextVal;
      state.currentLiveCount = currentVal;

      // Smooth micro-animation
      liveCountEl.classList.add('num-updated');
      liveCountEl.textContent = currentVal;

      setTimeout(() => {
        liveCountEl.classList.remove('num-updated');
      }, 350);

      // Schedule next fluctuation at random natural interval
      const nextInterval = Math.floor(
        Math.random() * (CONFIG.liveView.intervalMaxMs - CONFIG.liveView.intervalMinMs) + CONFIG.liveView.intervalMinMs
      );
      setTimeout(fluctuate, nextInterval);
    }

    setTimeout(fluctuate, 4000);
  }

  /* ==========================================================================
     4. INTERACTIVE PRODUCT IMAGE SLIDER (ARROWS, DOTS, THUMBS, TOUCH SWIPE)
     ========================================================================== */
  function initProductSlider() {
    const sliderWrapper = document.getElementById('productSliderWrapper');
    const track = document.getElementById('productSliderTrack');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('sliderPrevBtn');
    const nextBtn = document.getElementById('sliderNextBtn');
    const dots = document.querySelectorAll('.slider-dot');
    const thumbs = document.querySelectorAll('.slider-thumb-item');
    const counterNum = document.getElementById('currentSlideNum');

    if (!sliderWrapper || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentIndex = index;

      // Update slides
      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update dots
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Update thumbnails
      thumbs.forEach((thumb, i) => {
        if (i === currentIndex) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });

      // Update counter badge
      if (counterNum) counterNum.textContent = currentIndex + 1;
    }

    // Previous Button (Right arrow in RTL)
    if (prevBtn) {
      const handlePrev = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        goToSlide(currentIndex - 1);
      };
      prevBtn.addEventListener('click', handlePrev);
      prevBtn.addEventListener('touchend', handlePrev);
    }

    // Next Button (Left arrow in RTL)
    if (nextBtn) {
      const handleNext = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        goToSlide(currentIndex + 1);
      };
      nextBtn.addEventListener('click', handleNext);
      nextBtn.addEventListener('touchend', handleNext);
    }

    // Pagination Dots
    dots.forEach((dot) => {
      const handleDot = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const idx = parseInt(dot.dataset.index, 10);
        if (!isNaN(idx)) goToSlide(idx);
      };
      dot.addEventListener('click', handleDot);
      dot.addEventListener('touchend', handleDot);
    });

    // Thumbnails
    thumbs.forEach((thumb) => {
      const handleThumb = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const idx = parseInt(thumb.dataset.index, 10);
        if (!isNaN(idx)) goToSlide(idx);
      };
      thumb.addEventListener('click', handleThumb);
      thumb.addEventListener('touchend', handleThumb);
    });

    // Touch swipe gesture on track
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
      track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        const threshold = 35;

        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            goToSlide(currentIndex - 1);
          } else {
            goToSlide(currentIndex + 1);
          }
        }
      }, { passive: true });
    }
  }
  /* ==========================================================================
     5. ORDER SUMMARY INITIALIZATION
     ========================================================================== */
  function initOrderSummary() {
    const summaryProductText = document.getElementById('summaryProductText');
    const summaryOldPrice = document.getElementById('summaryOldPrice');
    const summarySavings = document.getElementById('summarySavings');
    const summaryFinalPrice = document.getElementById('summaryFinalPrice');

    const p = CONFIG.product;
    if (summaryProductText) summaryProductText.textContent = p.name;
    if (summaryOldPrice) summaryOldPrice.textContent = `${p.oldPrice} جنيه`;
    if (summarySavings) summarySavings.textContent = `${p.savings} جنيه (خصم ${p.discountPercent})`;
    if (summaryFinalPrice) summaryFinalPrice.textContent = p.currentPrice;
  }

  /* ==========================================================================
     6. EGYPTIAN PHONE VALIDATION & LIVE CARRIER / CHECKMARK FEEDBACK
     ========================================================================== */
  function initPhoneValidation() {
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const nameBadge = document.getElementById('nameValidBadge');
    const phoneBadge = document.getElementById('phoneValidBadge');
    const carrierPill = document.getElementById('carrierPill');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');

    // Live validation for Name
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const val = nameInput.value.trim();
        if (val.length >= 3) {
          nameInput.classList.remove('has-error');
          if (nameError) nameError.classList.remove('show');
          if (nameBadge) nameBadge.classList.add('show');
        } else {
          if (nameBadge) nameBadge.classList.remove('show');
        }
      });
    }

    // Live validation for Phone
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^\d]/g, '');

        if (val.length > 11) {
          val = val.substring(0, 11);
        }
        phoneInput.value = val;

        // Detect Egyptian carriers: 010 (Vodafone), 011 (Etisalat), 012 (Orange), 015 (WE)
        if (carrierPill) {
          if (val.startsWith('010')) {
            carrierPill.textContent = 'Vodafone';
            carrierPill.className = 'carrier-pill carrier-vodafone';
            carrierPill.style.display = 'block';
          } else if (val.startsWith('011')) {
            carrierPill.textContent = 'Etisalat';
            carrierPill.className = 'carrier-pill carrier-etisalat';
            carrierPill.style.display = 'block';
          } else if (val.startsWith('012')) {
            carrierPill.textContent = 'Orange';
            carrierPill.className = 'carrier-pill carrier-orange';
            carrierPill.style.display = 'block';
          } else if (val.startsWith('015')) {
            carrierPill.textContent = 'WE';
            carrierPill.className = 'carrier-pill carrier-we';
            carrierPill.style.display = 'block';
          } else {
            carrierPill.style.display = 'none';
          }
        }

        const isValidPhone = val.length === 11 && /^01[0125][0-9]{8}$/.test(val);
        if (isValidPhone) {
          phoneInput.classList.remove('has-error');
          if (phoneError) phoneError.classList.remove('show');
          if (phoneBadge) phoneBadge.classList.add('show');
        } else {
          if (phoneBadge) phoneBadge.classList.remove('show');
        }
      });
    }
  }

  /* ==========================================================================
     7. FORM SUBMISSION & SUCCESS CELEBRATION
     ========================================================================== */
  function initOrderForm() {
    const form = document.getElementById('directOrderForm');
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const groupName = document.getElementById('groupName');
    const groupPhone = document.getElementById('groupPhone');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const submitBtn = document.getElementById('submitOrderBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnText = document.getElementById('btnText');

    const formView = document.getElementById('orderFormView');
    const successView = document.getElementById('orderSuccessView');

    const successCustomerName = document.getElementById('successCustomerName');
    const successCustomerPhone = document.getElementById('successCustomerPhone');
    const successOrderId = document.getElementById('successOrderId');
    const recapProduct = document.getElementById('recapProduct');
    const recapQty = document.getElementById('recapQty');
    const recapTotal = document.getElementById('recapTotal');
    const btnBackToHero = document.getElementById('btnBackToHero');

    if (!form) return;

    function triggerShake(element) {
      if (!element) return;
      element.classList.remove('shake');
      void element.offsetWidth; // Force reflow
      element.classList.add('shake');
      setTimeout(() => element.classList.remove('shake'), 400);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      // Validate Name
      if (nameVal.length < 3) {
        if (nameInput) nameInput.classList.add('has-error');
        if (nameError) nameError.classList.add('show');
        triggerShake(groupName);
        isValid = false;
      } else {
        if (nameInput) nameInput.classList.remove('has-error');
        if (nameError) nameError.classList.remove('show');
      }

      // Validate Phone
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phoneRegex.test(phoneVal)) {
        if (phoneInput) phoneInput.classList.add('has-error');
        if (phoneError) phoneError.classList.add('show');
        triggerShake(groupPhone);
        isValid = false;
      } else {
        if (phoneInput) phoneInput.classList.remove('has-error');
        if (phoneError) phoneError.classList.remove('show');
      }

      if (!isValid) {
        if (nameVal.length < 3 && nameInput) {
          nameInput.focus();
        } else if (phoneInput) {
          phoneInput.focus();
        }
        return;
      }

      // Show Loading State
      submitBtn.disabled = true;
      btnSpinner.style.display = 'inline-block';
      btnText.textContent = 'جاري تسجيل طلبك...';

      setTimeout(() => {
        const randomOrderId = '#PR-' + Math.floor(10000 + Math.random() * 90000);
        const prod = CONFIG.product;

        if (successCustomerName) successCustomerName.textContent = nameVal;
        if (successCustomerPhone) successCustomerPhone.textContent = phoneVal;
        if (successOrderId) successOrderId.textContent = randomOrderId;
        if (recapProduct) recapProduct.textContent = prod.name;
        if (recapQty) recapQty.textContent = prod.qtyLabel;
        if (recapTotal) recapTotal.textContent = `${prod.currentPrice} جنيه مصري`;

        // Switch Views
        formView.style.display = 'none';
        successView.style.display = 'block';

        // Trigger Confetti Celebration
        fireConfettiBurst();

        // Scroll to card top smoothly
        const orderCardGlass = document.getElementById('orderCardGlass');
        if (orderCardGlass) {
          orderCardGlass.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 700);
    });

    if (btnBackToHero) {
      btnBackToHero.addEventListener('click', () => {
        formView.style.display = 'block';
        successView.style.display = 'none';
        submitBtn.disabled = false;
        btnSpinner.style.display = 'none';
        btnText.textContent = 'تأكيد الطلب الآن 📦';
        form.reset();

        const nameBadge = document.getElementById('nameValidBadge');
        const phoneBadge = document.getElementById('phoneValidBadge');
        if (nameBadge) nameBadge.classList.remove('show');
        if (phoneBadge) phoneBadge.classList.remove('show');
        
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }



  /* ==========================================================================
     9. STICKY FLOATING BOTTOM PURCHASE BAR
     ========================================================================== */
  function initStickyPurchaseBar() {
    const stickyBar = document.getElementById('stickyPurchaseBar');
    const heroCta = document.getElementById('heroCtaBtn');
    const orderSection = document.getElementById('order-section');

    if (!stickyBar) return;

    function checkStickyVisibility() {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroThreshold = heroCta ? (heroCta.offsetTop + 100) : 400;
      const orderTop = orderSection ? (orderSection.offsetTop - 300) : 2000;

      // Show after hero CTA and hide when order section is in view
      if (scrollY > heroThreshold && scrollY < orderTop) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', checkStickyVisibility, { passive: true });
    checkStickyVisibility();
  }

  /* ==========================================================================
     10. LIVE RECENT PURCHASE TOAST NOTIFICATIONS
     ========================================================================== */
  function initRecentPurchaseToasts() {
    const toast = document.getElementById('recentPurchaseToast');
    const avatar = document.getElementById('toastAvatar');
    const nameEl = document.getElementById('toastBuyerName');
    const locEl = document.getElementById('toastBuyerLoc');
    const timeEl = document.getElementById('toastTimeAgo');
    const closeBtn = document.getElementById('toastCloseBtn');

    if (!toast) return;

    const purchases = [
      { name: 'أحمد م.', loc: 'من القاهرة', time: 'منذ دقيقتين', avatar: '👨‍⚕️' },
      { name: 'د. وائل ر.', loc: 'من الإسكندرية', time: 'منذ 4 دقائق', avatar: '🩺' },
      { name: 'م. طارق خ.', loc: 'من الجيزة', time: 'منذ دقيقة', avatar: '👨‍💼' },
      { name: 'أ. مروة ش.', loc: 'من المنصورة', time: 'منذ 5 دقائق', avatar: '👩‍💼' },
      { name: 'الحاج محمود س.', loc: 'من طنطا', time: 'منذ 3 دقائق', avatar: '🧔' },
      { name: 'د. سهام ن.', loc: 'من الزقازيق', time: 'منذ 7 دقائق', avatar: '🧕' }
    ];

    let currentIdx = 0;
    let toastTimeout = null;

    function showNextToast() {
      const item = purchases[currentIdx];
      currentIdx = (currentIdx + 1) % purchases.length;

      if (avatar) avatar.textContent = item.avatar;
      if (nameEl) nameEl.textContent = item.name;
      if (locEl) locEl.textContent = item.loc;
      if (timeEl) timeEl.textContent = item.time;

      toast.classList.add('show');

      // Hide after 5 seconds
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        if (toastTimeout) clearTimeout(toastTimeout);
      });
    }

    // Start cycle after 6s, then every 20s
    setTimeout(() => {
      showNextToast();
      setInterval(showNextToast, 20000);
    }, 6000);
  }

  /* ==========================================================================
     11. PURE CANVAS CONFETTI CELEBRATION BURST
     ========================================================================== */
  function fireConfettiBurst() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#006d37', '#6bfe9c', '#ee6c1d', '#f59e0b', '#001b15'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        r: Math.random() * 6 + 3,
        d: Math.random() * 90,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14 - 3,
        alpha: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let remaining = false;
      particles.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle - (i / 3)) * 15;
        p.alpha -= 0.009;

        if (p.alpha > 0) {
          remaining = true;
          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
          ctx.stroke();
        }
      });

      if (remaining) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  /* ==========================================================================
     12. BANNER & CTA SMOOTH SCROLL HANDLER
     ========================================================================== */
  function initSmoothScrollLinks() {
    const scrollLinks = document.querySelectorAll('a[href="#order-section"]');
    const orderSection = document.getElementById('order-section');
    const nameInput = document.getElementById('customerName');

    scrollLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            if (nameInput) nameInput.focus();
          }, 600);
        }
      });
    });
  }

  /* ==========================================================================
     13. AMBIENT BACKGROUND PARTICLES (LIGHTWEIGHT)
     ========================================================================== */
  function initAmbientParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    const particleCount = 14;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'ambient-particle';
      const size = Math.random() * 6 + 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.opacity = (Math.random() * 0.35 + 0.1).toString();
      p.style.animationDuration = `${Math.random() * 12 + 10}s`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      p.style.position = 'absolute';
      p.style.borderRadius = '50%';
      p.style.backgroundColor = Math.random() > 0.5 ? 'var(--secondary)' : 'var(--primary-fixed)';
      p.style.filter = 'blur(1px)';
      p.style.pointerEvents = 'none';
      container.appendChild(p);
    }
  }

  /* ==========================================================================
     14. INITIALIZE EVERYTHING ON DOM CONTENT LOADED
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initCountdownTimer();
    initLiveView();
    initProductSlider();
    initOrderSummary();
    initPhoneValidation();
    initOrderForm();
    initStickyPurchaseBar();
    initRecentPurchaseToasts();
    initSmoothScrollLinks();
    initAmbientParticles();
  });
})();
