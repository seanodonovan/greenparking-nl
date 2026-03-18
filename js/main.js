/* GreenParking Schiphol - Main JS */

document.addEventListener('DOMContentLoaded', function() {

  // === MOBILE MENU TOGGLE ===
  var toggle = document.getElementById('mobile-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      var spans = toggle.querySelectorAll('span');
      if (nav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(function(s) { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // === FAQ ACCORDION ===
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var answer = this.nextElementSibling;
      var expanded = this.getAttribute('aria-expanded') === 'true';
      faqQuestions.forEach(function(q) {
        q.setAttribute('aria-expanded', 'false');
        var a = q.nextElementSibling;
        if (a) a.classList.remove('open');
      });
      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('open');
      }
    });
  });

  // === STICKY HEADER SHADOW ===
  var headerOuter = document.getElementById('header-outer');
  if (headerOuter) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        headerOuter.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
      } else {
        headerOuter.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }
    });
  }

  // === SCROLL TO TOP ===
  var scrollBtn = document.createElement('button');
  scrollBtn.id = 'scroll-top';
  scrollBtn.innerHTML = '&#8679;';
  scrollBtn.setAttribute('aria-label', 'Terug naar boven');
  scrollBtn.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:9999;width:42px;height:42px;border-radius:50%;background:#8695A9;color:#fff;font-size:22px;display:none;align-items:center;justify-content:center;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', function() {
    scrollBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  });
  scrollBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
