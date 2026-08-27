/**
 * Propylax Landing Page - Main Scripts
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    countdownMinutes: 25,
    countdownStorageKey: 'propylax_deal_end_timestamp_aug2026',

    liveView: {
      min: 11,
      max: 20,
      initial: 17,
      minInterval: 4000,
      maxInterval: 7500
    },

    product: {
      name: 'دهان PROPYLAX GEL (عبوة 100GM)',
      qtyLabel: 'عبوة واحدة (100GM)',
      currentPrice: 420,
      oldPrice: 560,
      savings: 140,
      discountPercent: '25%'
    }
  };

  const state = {
    liveCount: CONFIG.liveView.initial
  };

  // Countdown timer
  function initCountdownTimer() {
    const minutesEl = document.getElementById('timerMinutes');
    const secondsEl = document.getElementById('timerSeconds');
    if (!minutesEl || !secondsEl) return;

    let targetEndTime;
    const stored = localStorage.getItem(CONFIG.countdownStorageKey);
    const now = Date.now();

    if (stored && parseInt(stored, 10) > now) {
      targetEndTime = parseInt(stored, 10);
    } else {
      targetEndTime = now + CONFIG.countdownMinutes * 60 * 1000;
      localStorage.setItem(CONFIG.countdownStorageKey, targetEndTime.toString());
    }

    function update() {
      const remainingMs = targetEndTime - Date.now();

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

    update();
    setInterval(update, 1000);
  }

  // Live viewers counter
  function initLiveView() {
    const el = document.getElementById('liveCount');
    if (!el) return;

    let current = state.liveCount;
    el.textContent = current;

    function tick() {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
      let next = current + delta;

      if (next < CONFIG.liveView.min) next = CONFIG.liveView.min + 2;
      if (next > CONFIG.liveView.max) next = CONFIG.liveView.max - 2;

      current = next;
      state.liveCount = current;

      el.classList.add('num-updated');
      el.textContent = current;

      setTimeout(() => {
        el.classList.remove('num-updated');
      }, 350);

      const delay = Math.floor(
        Math.random() * (CONFIG.liveView.maxInterval - CONFIG.liveView.minInterval) + CONFIG.liveView.minInterval
      );
      setTimeout(tick, delay);
    }

    setTimeout(tick, 4000);
  }

  // Product gallery slider
  function initProductSlider() {
    const wrapper = document.getElementById('productSliderWrapper');
    const track = document.getElementById('productSliderTrack');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('sliderPrevBtn');
    const nextBtn = document.getElementById('sliderNextBtn');
    const dots = document.querySelectorAll('.slider-dot');
    const thumbs = document.querySelectorAll('.slider-thumb-item');
    const counter = document.getElementById('currentSlideNum');

    if (!wrapper || slides.length === 0) return;

    let activeIndex = 0;
    const total = slides.length;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;

      activeIndex = index;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === activeIndex);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });

      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === activeIndex);
      });

      if (counter) counter.textContent = activeIndex + 1;
    }

    if (prevBtn) {
      const onPrev = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        goTo(activeIndex - 1);
      };
      prevBtn.addEventListener('click', onPrev);
      prevBtn.addEventListener('touchend', onPrev);
    }

    if (nextBtn) {
      const onNext = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        goTo(activeIndex + 1);
      };
      nextBtn.addEventListener('click', onNext);
      nextBtn.addEventListener('touchend', onNext);
    }

    dots.forEach((dot) => {
      const onDot = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const idx = parseInt(dot.dataset.index, 10);
        if (!isNaN(idx)) goTo(idx);
      };
      dot.addEventListener('click', onDot);
      dot.addEventListener('touchend', onDot);
    });

    thumbs.forEach((thumb) => {
      const onThumb = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const idx = parseInt(thumb.dataset.index, 10);
        if (!isNaN(idx)) goTo(idx);
      };
      thumb.addEventListener('click', onThumb);
      thumb.addEventListener('touchend', onThumb);
    });

    // Touch swipe support
    let startX = 0;
    let endX = 0;

    if (track) {
      track.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].screenX;
        const diff = endX - startX;
        if (Math.abs(diff) > 35) {
          if (diff > 0) {
            goTo(activeIndex - 1);
          } else {
            goTo(activeIndex + 1);
          }
        }
      }, { passive: true });
    }
  }

  // Populate dynamic prices in form summary
  function initOrderSummary() {
    const titleEl = document.getElementById('summaryProductText');
    const oldPriceEl = document.getElementById('summaryOldPrice');
    const savingsEl = document.getElementById('summarySavings');
    const finalPriceEl = document.getElementById('summaryFinalPrice');

    const p = CONFIG.product;
    if (titleEl) titleEl.textContent = p.name;
    if (oldPriceEl) oldPriceEl.textContent = `${p.oldPrice} جنيه`;
    if (savingsEl) savingsEl.textContent = `${p.savings} جنيه (خصم ${p.discountPercent})`;
    if (finalPriceEl) finalPriceEl.textContent = p.currentPrice;
  }

  // Live input validation & carrier detector
  function initPhoneValidation() {
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const nameBadge = document.getElementById('nameValidBadge');
    const phoneBadge = document.getElementById('phoneValidBadge');
    const carrierPill = document.getElementById('carrierPill');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');

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

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^\d]/g, '');

        if (val.length > 11) {
          val = val.substring(0, 11);
        }
        phoneInput.value = val;

        // Carrier badge
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

        const isValid = val.length === 11 && /^01[0125][0-9]{8}$/.test(val);
        if (isValid) {
          phoneInput.classList.remove('has-error');
          if (phoneError) phoneError.classList.remove('show');
          if (phoneBadge) phoneBadge.classList.add('show');
        } else {
          if (phoneBadge) phoneBadge.classList.remove('show');
        }
      });
    }
  }

  // Form submission handling
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

    function shake(element) {
      if (!element) return;
      element.classList.remove('shake');
      void element.offsetWidth;
      element.classList.add('shake');
      setTimeout(() => element.classList.remove('shake'), 400);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      if (nameVal.length < 3) {
        if (nameInput) nameInput.classList.add('has-error');
        if (nameError) nameError.classList.add('show');
        shake(groupName);
        valid = false;
      } else {
        if (nameInput) nameInput.classList.remove('has-error');
        if (nameError) nameError.classList.remove('show');
      }

      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phoneRegex.test(phoneVal)) {
        if (phoneInput) phoneInput.classList.add('has-error');
        if (phoneError) phoneError.classList.add('show');
        shake(groupPhone);
        valid = false;
      } else {
        if (phoneInput) phoneInput.classList.remove('has-error');
        if (phoneError) phoneError.classList.remove('show');
      }

      if (!valid) {
        if (nameVal.length < 3 && nameInput) {
          nameInput.focus();
        } else if (phoneInput) {
          phoneInput.focus();
        }
        return;
      }

      submitBtn.disabled = true;
      btnSpinner.style.display = 'inline-block';
      btnText.textContent = 'جاري تسجيل طلبك...';

      setTimeout(() => {
        const orderId = '#PR-' + Math.floor(10000 + Math.random() * 90000);
        const prod = CONFIG.product;

        if (successCustomerName) successCustomerName.textContent = nameVal;
        if (successCustomerPhone) successCustomerPhone.textContent = phoneVal;
        if (successOrderId) successOrderId.textContent = orderId;
        if (recapProduct) recapProduct.textContent = prod.name;
        if (recapQty) recapQty.textContent = prod.qtyLabel;
        if (recapTotal) recapTotal.textContent = `${prod.currentPrice} جنيه مصري`;

        formView.style.display = 'none';
        successView.style.display = 'block';

        fireConfetti();

        const card = document.getElementById('orderCardGlass');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        
        const hero = document.getElementById('hero-section');
        if (hero) {
          hero.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // Mobile customer reviews carousel
  function initReviewsMobileCarousel() {
    const grid = document.getElementById('reviewsGrid');
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.review-dot');

    if (!grid || cards.length === 0) return;

    let activeReview = 0;
    let timer = null;
    const total = cards.length;

    function show(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;

      activeReview = index;

      cards.forEach((card, i) => {
        card.classList.toggle('active', i === activeReview);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeReview);
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(dot.dataset.index, 10);
        if (!isNaN(idx)) {
          show(idx);
          resetAutoPlay();
        }
      });
    });

    let startX = 0;
    let endX = 0;

    grid.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    grid.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      const diff = endX - startX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          show(activeReview - 1);
        } else {
          show(activeReview + 1);
        }
      }
      startAutoPlay();
    }, { passive: true });

    function startAutoPlay() {
      if (window.innerWidth <= 768) {
        stopAutoPlay();
        timer = setInterval(() => {
          show(activeReview + 1);
        }, 4500);
      }
    }

    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    startAutoPlay();
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        stopAutoPlay();
      } else if (!timer) {
        startAutoPlay();
      }
    }, { passive: true });
  }

  // Sticky bottom purchase bar
  function initStickyPurchaseBar() {
    const bar = document.getElementById('stickyPurchaseBar');
    const heroCta = document.getElementById('heroCtaBtn');
    const orderSection = document.getElementById('order-section');

    if (!bar) return;

    function check() {
      const scrollY = window.scrollY || window.pageYOffset;
      const threshold = heroCta ? (heroCta.offsetTop + 100) : 400;
      const orderTop = orderSection ? (orderSection.offsetTop - 300) : 2000;

      if (scrollY > threshold && scrollY < orderTop) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  // Toast notifications for recent purchases
  function initRecentPurchaseToasts() {
    const toast = document.getElementById('recentPurchaseToast');
    const avatar = document.getElementById('toastAvatar');
    const nameEl = document.getElementById('toastBuyerName');
    const locEl = document.getElementById('toastBuyerLoc');
    const timeEl = document.getElementById('toastTimeAgo');
    const closeBtn = document.getElementById('toastCloseBtn');

    if (!toast) return;

    const data = [
      { name: 'أحمد م.', loc: 'من القاهرة', time: 'منذ دقيقتين', avatar: '👨‍⚕️' },
      { name: 'د. وائل ر.', loc: 'من الإسكندرية', time: 'منذ 4 دقائق', avatar: '🩺' },
      { name: 'م. طارق خ.', loc: 'من الجيزة', time: 'منذ دقيقة', avatar: '👨‍💼' },
      { name: 'أ. مروة ش.', loc: 'من المنصورة', time: 'منذ 5 دقائق', avatar: '👩‍💼' },
      { name: 'الحاج محمود س.', loc: 'من طنطا', time: 'منذ 3 دقائق', avatar: '🧔' },
      { name: 'د. سهام ن.', loc: 'من الزقازيق', time: 'منذ 7 دقائق', avatar: '🧕' }
    ];

    let index = 0;
    let timer = null;

    function displayNext() {
      const item = data[index];
      index = (index + 1) % data.length;

      if (avatar) avatar.textContent = item.avatar;
      if (nameEl) nameEl.textContent = item.name;
      if (locEl) locEl.textContent = item.loc;
      if (timeEl) timeEl.textContent = item.time;

      toast.classList.add('show');

      timer = setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        if (timer) clearTimeout(timer);
      });
    }

    setTimeout(() => {
      displayNext();
      setInterval(displayNext, 20000);
    }, 6000);
  }

  // Canvas confetti animation
  function fireConfetti() {
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

    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let running = false;
      particles.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle - (i / 3)) * 15;
        p.alpha -= 0.009;

        if (p.alpha > 0) {
          running = true;
          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
          ctx.stroke();
        }
      });

      if (running) {
        animId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animId);
      }
    }

    draw();
  }

  // Smooth scroll
  function initSmoothScrollLinks() {
    const links = document.querySelectorAll('a[href="#order-section"]');
    const target = document.getElementById('order-section');
    const nameInput = document.getElementById('customerName');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            if (nameInput) nameInput.focus();
          }, 600);
        }
      });
    });
  }

  // Background floating particles
  function initAmbientParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    const count = 14;
    for (let i = 0; i < count; i++) {
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

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initCountdownTimer();
    initLiveView();
    initProductSlider();
    initReviewsMobileCarousel();
    initOrderSummary();
    initPhoneValidation();
    initOrderForm();
    initStickyPurchaseBar();
    initRecentPurchaseToasts();
    initSmoothScrollLinks();
    initAmbientParticles();
  });
})();
