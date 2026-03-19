/* GreenParking Schiphol - Main JS */

document.addEventListener('DOMContentLoaded', function() {

  // === MOBILE MENU TOGGLE ===
  var toggle = document.getElementById('mobile-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      var spans = toggle.querySelectorAll('span');
      if (expanded) {
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

  // === BOOKING FORM ===
  (function() {
    var form       = document.getElementById('booking-form');
    if (!form) return;

    var departDateEl = document.getElementById('depart-date');
    var departTimeEl = document.getElementById('depart-time');
    var returnDateEl = document.getElementById('return-date');
    var returnTimeEl = document.getElementById('return-time');

    // Helper: format a Date as YYYY-MM-DD in local time
    function formatDate(d) {
      var y  = d.getFullYear();
      var m  = String(d.getMonth() + 1).padStart(2, '0');
      var dd = String(d.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + dd;
    }

    // Helper: parse YYYY-MM-DD into a local Date (avoids UTC offset shifting the day)
    function parseLocalDate(str) {
      var p = str.split('-');
      return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
    }

    // Set min = today for both date fields
    var todayStr = formatDate(new Date());
    if (departDateEl) departDateEl.min = todayStr;
    if (returnDateEl) returnDateEl.min = todayStr;

    // Default departure to today, return to today+8
    if (departDateEl) departDateEl.value = todayStr;
    if (returnDateEl) {
      var returnDefault = new Date();
      returnDefault.setDate(returnDefault.getDate() + 8);
      returnDateEl.value = formatDate(returnDefault);
    }

    // When departure date changes: update return min and default +8 days
    if (departDateEl) {
      departDateEl.addEventListener('change', function() {
        var val = this.value;
        if (!val) return;

        // Return must be >= departure date
        if (returnDateEl) {
          returnDateEl.min = val;
          // Auto-fill return if blank or set before departure
          if (!returnDateEl.value || returnDateEl.value < val) {
            var d = parseLocalDate(val);
            d.setDate(d.getDate() + 8);
            returnDateEl.value = formatDate(d);
          }
        }
      });
    }

    // When return date changes: make sure it can't be before departure
    if (returnDateEl && departDateEl) {
      returnDateEl.addEventListener('change', function() {
        if (departDateEl.value && this.value < departDateEl.value) {
          this.value = departDateEl.value;
        }
      });
    }

    // Build the booking URL and navigate
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var dDate = departDateEl ? departDateEl.value : '';
      var dTime = departTimeEl ? (departTimeEl.value || '11:00') : '11:00';
      var rDate = returnDateEl ? returnDateEl.value : '';
      var rTime = returnTimeEl ? (returnTimeEl.value || '11:00') : '11:00';

      if (!dDate) {
        alert('Selecteer uw vertrekdatum.');
        if (departDateEl) departDateEl.focus();
        return;
      }
      if (!rDate) {
        alert('Selecteer uw aankomstdatum.');
        if (returnDateEl) returnDateEl.focus();
        return;
      }
      if (rDate < dDate) {
        alert('Aankomstdatum moet na de vertrekdatum liggen.');
        if (returnDateEl) returnDateEl.focus();
        return;
      }

      // Build URL matching the booking engine format:
      // https://book.greenparkingschiphol.nl/en/static/?selectProduct=cp&#/carpark?agent=OP649&...
      var url =
        'https://book.greenparkingschiphol.nl/en/static/?selectProduct=cp' +
        '&#/carpark?agent=OP649&ppts=&customer_ref=&lang=en&adults=2' +
        '&depart=BRU&terminal=&arrive=&flight=' +
        '&in=' + dDate +
        '&out=' + rDate +
        '&park_from=' + encodeURIComponent(dTime) +
        '&park_to='   + encodeURIComponent(rTime) +
        '&filter_meetandgreet=&filter_parkandride=&children=0&infants=0';

      window.open(url, '_blank', 'noopener,noreferrer');
    });
  })();

});
