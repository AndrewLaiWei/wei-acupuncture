/* ============================================================
   Wei's Acupuncture Clinic — JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Navigation scroll effect ---
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      nav.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Hamburger menu ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(function (other) {
          other.classList.remove('open');
        });
        // Toggle current (unless it was already open)
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // --- Product Slider ---
  const slider = document.getElementById('productSlider');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (slider) {
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        slider.scrollBy({ left: -260, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        slider.scrollBy({ left: 260, behavior: 'smooth' });
      });
    }
  }

  // --- Subscribe Form (Formspree compatible) ---
  const subscribeForm = document.getElementById('subscribeForm');
  const subscribeSuccess = document.getElementById('subscribeSuccess');

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (e) {
      // If no real Formspree endpoint, prevent actual submission
      const action = subscribeForm.getAttribute('action');
      if (action.includes('PLACEHOLDER')) {
        e.preventDefault();
        subscribeForm.style.display = 'none';
        subscribeSuccess.style.display = 'block';
      }
    });
  }

  // --- Booking Form (Formspree AJAX) ---
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(bookingForm);

      fetch(bookingForm.getAttribute('action'), {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          bookingForm.reset();
          bookingForm.style.display = 'none';
          bookingSuccess.style.display = 'block';
        } else {
          return response.json().then(function (data) {
            if (data.errors) {
              alert(data.errors.map(function (err) { return err.message; }).join(', '));
            } else {
              // Fallback: redirect to Formspree thank-you page
              bookingForm.submit();
            }
          });
        }
      })
      .catch(function () {
        // Network error — fallback to standard submit
        bookingForm.submit();
      });
    });
  }

  // --- Smooth scroll for hash links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link highlight ---
  var sections = document.querySelectorAll('section[id]');
  var navAs = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navAs.length) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY + 100;
      var current = '';

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          current = section.getAttribute('id');
        }
      });

      navAs.forEach(function (a) {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) {
          a.classList.add('active');
        }
      });
    });
  }

  // --- Load approved reviews from data/reviews.json ---
  var reviewsContainer = document.getElementById('reviewsContainer');
  if (reviewsContainer) {
    fetch('data/reviews.json')
      .then(function (res) { return res.json(); })
      .then(function (reviews) {
        if (!reviews.length) {
          reviewsContainer.innerHTML = '<p style="color:var(--color-text-light);grid-column:1/-1;">No reviews yet. Be the first!</p>';
          return;
        }
        reviews.forEach(function (r) {
          var card = document.createElement('div');
          card.className = 'testimonial-card';

          // Avatar (initials)
          var initials = (r.name || '?').split(' ').map(function (w) { return w.charAt(0).toUpperCase(); }).slice(0, 2).join('');
          var avatar = document.createElement('div');
          avatar.className = 'testimonial-avatar';
          avatar.textContent = initials;

          // Stars
          var stars = document.createElement('div');
          stars.className = 'testimonial-stars';
          for (var s = 1; s <= 5; s++) {
            var star = document.createElement('span');
            star.textContent = s <= (r.rating || 5) ? '\u2605' : '\u2606';
            stars.appendChild(star);
          }

          // Text
          var text = document.createElement('p');
          text.className = 'testimonial-text';
          text.textContent = r.text;

          // Name + date
          var name = document.createElement('p');
          name.className = 'testimonial-name';
          name.textContent = r.name + (r.date ? ' · ' + r.date : '');

          card.appendChild(avatar);
          card.appendChild(stars);
          card.appendChild(text);
          card.appendChild(name);
          reviewsContainer.appendChild(card);
        });
      })
      .catch(function () {
        reviewsContainer.innerHTML = '<p style="color:var(--color-text-light);grid-column:1/-1;">Reviews coming soon.</p>';
      });
  }

  // --- Star Rating Interaction ---
  var starContainer = document.getElementById('reviewStars');
  var ratingInput = document.getElementById('reviewRating');
  var stars = starContainer ? starContainer.querySelectorAll('.review-star') : [];

  stars.forEach(function (star) {
    star.addEventListener('mouseenter', function () {
      var val = parseInt(this.getAttribute('data-rating'));
      stars.forEach(function (s, i) { s.classList.toggle('hover', i < val); });
    });
    star.addEventListener('click', function () {
      var val = parseInt(this.getAttribute('data-rating'));
      ratingInput.value = val;
      stars.forEach(function (s, i) { s.classList.toggle('active', i < val); });
    });
  });

  if (starContainer) {
    starContainer.addEventListener('mouseleave', function () {
      stars.forEach(function (s) { s.classList.remove('hover'); });
    });
  }

  // --- Review Form AJAX Submit ---
  var reviewForm = document.getElementById('reviewForm');
  var reviewSuccess = document.getElementById('reviewSuccess');

  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      if (!ratingInput.value) {
        e.preventDefault();
        alert('Please select a star rating.');
        return;
      }
      e.preventDefault();
      var formData = new FormData(reviewForm);

      fetch(reviewForm.getAttribute('action'), {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          reviewForm.style.display = 'none';
          reviewSuccess.style.display = 'block';
        } else {
          return response.json().then(function (data) {
            if (data.errors) {
              alert(data.errors.map(function (err) { return err.message; }).join(', '));
            } else {
              reviewForm.submit();
            }
          });
        }
      })
      .catch(function () {
        reviewForm.submit();
      });
    });
  }

});
