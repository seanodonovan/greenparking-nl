/**
 * GreenParking Schiphol - Main JavaScript
 * Production-quality implementation with proper error handling
 * Handles mobile menu, sticky header, FAQ accordion, smooth scroll, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initializeMobileMenu();
  initializeStickyHeader();
  initializeFAQAccordion();
  initializeSmoothScroll();
  initializeScrollToTopButton();
  initializeBookingForm();
  initializeActiveNavHighlighting();
  initializeGreenBarAnimation();

  console.log('GreenParking Schiphol website initialized successfully');
});

/**
 * MOBILE MENU TOGGLE
 * Handles mobile navigation menu open/close functionality
 */
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle, #menuToggle');
  const mobileNav = document.querySelector('.nav-mobile, #mobileNav');

  if (!menuToggle || !mobileNav) {
    console.warn('Mobile menu elements not found');
    return;
  }

  // Toggle menu on button click
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close menu when clicking a link inside it
  const navLinks = mobileNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    const isClickInsideNav = mobileNav.contains(e.target);
    const isClickOnToggle = menuToggle.contains(e.target);

    if (!isClickInsideNav && !isClickOnToggle && mobileNav.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Helper functions
  function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('active');
    menuToggle.classList.remove('active');
  }
}

/**
 * STICKY HEADER
 * Adds shadow effect when page is scrolled past 100px
 */
function initializeStickyHeader() {
  const header = document.querySelector('header');

  if (!header) {
    console.warn('Header element not found');
    return;
  }

  const scrollThreshold = 100;

  window.addEventListener('scroll', function() {
    try {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    } catch (error) {
      console.error('Error in sticky header function:', error);
    }
  });
}

/**
 * FAQ ACCORDION
 * Toggle FAQ answers with smooth open/close
 * Only one FAQ item open at a time
 */
function initializeFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length === 0) {
    return;
  }

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question, header');

    if (!question) {
      return;
    }

    question.addEventListener('click', function(e) {
      try {
        e.preventDefault();

        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
      } catch (error) {
        console.error('Error in FAQ accordion click handler:', error);
      }
    });
  });
}

/**
 * SMOOTH SCROLL
 * Smooth scroll for anchor links with fixed header offset
 */
function initializeSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  if (links.length === 0) {
    return;
  }

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      try {
        const href = this.getAttribute('href');

        // Skip if href is just "#"
        if (href === '#') {
          return;
        }

        const target = document.querySelector(href);

        if (!target) {
          return;
        }

        e.preventDefault();

        // Get header height for offset
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const offset = 20; // Additional buffer
        const targetPosition = target.offsetTop - headerHeight - offset;

        // Smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      } catch (error) {
        console.error('Error in smooth scroll handler:', error);
      }
    });
  });
}

/**
 * SCROLL TO TOP BUTTON
 * Show button when scrolled past 300px, click to scroll back to top
 */
function initializeScrollToTopButton() {
  const scrollTopButton = document.querySelector('.scroll-top');

  if (!scrollTopButton) {
    return;
  }

  const scrollThreshold = 300;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    try {
      if (window.scrollY > scrollThreshold) {
        scrollTopButton.classList.add('active');
      } else {
        scrollTopButton.classList.remove('active');
      }
    } catch (error) {
      console.error('Error in scroll to top visibility handler:', error);
    }
  });

  // Smooth scroll to top on click
  scrollTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Error in scroll to top click handler:', error);
    }
  });
}

/**
 * BOOKING FORM
 * Validate booking widget inputs and handle "Bereken mijn prijs" button
 */
function initializeBookingForm() {
  const calculateButton = document.querySelector('.booking-form button, .booking-widget button');

  if (!calculateButton) {
    return;
  }

  calculateButton.addEventListener('click', function(e) {
    try {
      // Check for specific button text (case-insensitive)
      const buttonText = this.textContent.toLowerCase().trim();
      const isCalculateButton = buttonText.includes('bereken') || buttonText.includes('price') || buttonText.includes('prijs');

      if (!isCalculateButton) {
        return;
      }

      e.preventDefault();

      // Get form and validate
      const form = this.closest('form') || document.querySelector('.booking-form, .booking-widget');

      if (!form) {
        console.warn('Booking form not found');
        return;
      }

      // Validate required fields
      const dateInput = form.querySelector('input[type="date"], input[name*="date"], input[name*="Date"]');
      const timeInput = form.querySelector('input[type="time"], input[name*="time"], input[name*="Time"]');

      let isValid = true;

      if (dateInput && !dateInput.value) {
        dateInput.classList.add('error');
        isValid = false;
      } else if (dateInput) {
        dateInput.classList.remove('error');
      }

      if (timeInput && !timeInput.value) {
        timeInput.classList.add('error');
        isValid = false;
      } else if (timeInput) {
        timeInput.classList.remove('error');
      }

      if (!isValid) {
        alert('Please fill in all required fields');
        return;
      }

      // Redirect to reserveren page or show confirmation
      const reserverenUrl = document.querySelector('a[href*="reserveren"]');
      if (reserverenUrl) {
        window.location.href = reserverenUrl.href;
      } else {
        // Fallback: try common paths
        const possibleUrls = ['reserveren.html', '/reserveren.html', '/reserveren', 'reserveren'];
        window.location.href = possibleUrls[0];
      }
    } catch (error) {
      console.error('Error in booking form handler:', error);
    }
  });

  // Clear error state when user starts typing
  const formInputs = document.querySelectorAll('.booking-form input, .booking-widget input');
  formInputs.forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('error');
    });
  });
}

/**
 * ACTIVE NAV HIGHLIGHTING
 * Add "active" class to current page's navigation link
 */
function initializeActiveNavHighlighting() {
  try {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a, .nav-desktop a, .nav-mobile a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');

      if (!href) {
        return;
      }

      // Check if link href matches current page
      const linkPage = href.split('/').pop();

      if (href === '/' || href === '') {
        // Home link
        if (currentPage === '' || currentPage === 'index.html') {
          link.classList.add('active');
        }
      } else if (linkPage && currentPage.includes(linkPage)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  } catch (error) {
    console.error('Error in active nav highlighting:', error);
  }
}

/**
 * GREEN BAR ANIMATION
 * Fade in green bar items on page load using Intersection Observer
 */
function initializeGreenBarAnimation() {
  const greenBarItems = document.querySelectorAll('.green-bar-item, .feature-item, .feature-card, .step, .location-card');

  if (greenBarItems.length === 0) {
    return;
  }

  try {
    // Use Intersection Observer for performance
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    greenBarItems.forEach(item => {
      observer.observe(item);
    });
  } catch (error) {
    console.error('Error in green bar animation:', error);
    // Fallback: animate immediately
    greenBarItems.forEach(item => {
      item.classList.add('animate-in');
    });
  }
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * Format amount as currency
 */
function formatCurrency(amount) {
  return '€' + amount.toFixed(2);
}

/**
 * Format date string to Dutch locale
 */
function formatDate(dateString) {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('nl-NL', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}
