/**
 * Lothan Website - Main JavaScript
 * Handles navbar and contact form functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // =====================
  // Mobile Menu Toggle
  // =====================
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const menuLinks = document.querySelectorAll('.navbar-menu a');

  navbarToggle.addEventListener('click', () => {
    const isActive = navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    // Update aria-expanded for accessibility
    navbarToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      document.body.style.overflow = '';
      navbarToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      document.body.style.overflow = '';
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (e) => {
    const isMenuOpen = navbarMenu.classList.contains('active');
    const isClickInsideMenu = navbarMenu.contains(e.target);
    const isClickOnToggle = navbarToggle.contains(e.target);
    
    if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      document.body.style.overflow = '';
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // =====================
  // Products Slider - Expand/Collapse Cards
  // =====================
  const sliderTrack = document.querySelector('.slider-track');
  const sliderArrowLeft = document.querySelector('.slider-arrow-left');
  const sliderArrowRight = document.querySelector('.slider-arrow-right');
  const sliderDots = document.querySelectorAll('.slider-dot');
  const productCards = document.querySelectorAll('.product-card');

  if (sliderTrack && productCards.length > 0) {
    let activeIndex = 0;
    const totalCards = productCards.length;

    // Check if mobile view
    function isMobile() {
      return window.innerWidth <= 768;
    }

    // Calculate slide position for mobile
    function updateSliderPosition() {
      if (isMobile()) {
        const cardWidth = 260; // Mobile card width
        const gap = 16;
        const containerPadding = 16;
        const viewportWidth = window.innerWidth;
        
        // Center the active card
        const cardCenter = activeIndex * (cardWidth + gap) + (cardWidth / 2) + containerPadding;
        const offset = cardCenter - (viewportWidth / 2);
        
        // Only clamp to prevent scrolling before first card (no max clamp)
        const clampedOffset = Math.max(0, offset);
        
        sliderTrack.style.transform = `translateX(-${clampedOffset}px)`;
      } else {
        sliderTrack.style.transform = '';
      }
    }

    // Initialize first card as active
    function initCards() {
      productCards.forEach((card, index) => {
        card.classList.toggle('active', index === activeIndex);
      });
      updateDots();
      updateSliderPosition();
    }

    // Update active card
    function setActiveCard(index) {
      // Ensure index is within bounds
      if (index < 0) index = 0;
      if (index >= totalCards) index = totalCards - 1;
      
      activeIndex = index;
      
      // Update card states
      productCards.forEach((card, i) => {
        card.classList.toggle('active', i === activeIndex);
      });
      
      updateDots();
      updateSliderPosition();
    }

    // Update dots
    function updateDots() {
      sliderDots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle('active', isActive);
        // Update aria-selected for accessibility
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    // Navigate next
    function goNext() {
      if (activeIndex < totalCards - 1) {
        setActiveCard(activeIndex + 1);
      }
    }

    // Navigate previous
    function goPrev() {
      if (activeIndex > 0) {
        setActiveCard(activeIndex - 1);
      }
    }

    // Arrow click handlers
    if (sliderArrowRight) {
      sliderArrowRight.addEventListener('click', goNext);
    }

    if (sliderArrowLeft) {
      sliderArrowLeft.addEventListener('click', goPrev);
    }

    // Card click to expand
    productCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        setActiveCard(index);
      });
    });

    // Dot navigation
    sliderDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        setActiveCard(index);
      });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    });

    // Update position on resize
    window.addEventListener('resize', () => {
      updateSliderPosition();
    });

    // Initialize
    initCards();
  }

  // =====================
  // Contact Form
  // =====================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      // Basic validation
      if (!name || !email || !message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Create mailto link
      const subject = encodeURIComponent(`Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:hello@lothan.com?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      showFormStatus('Opening your email client...', 'success');

      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
      }, 3000);
    });

    function showFormStatus(message, type) {
      formStatus.textContent = message;
      formStatus.className = `form-status ${type}`;
      formStatus.style.display = 'block';
    }
  }

  // =====================
  // Smooth Scroll for anchor links
  // =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
