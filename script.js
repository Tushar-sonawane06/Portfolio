// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
});
(function animFollower() {
  fx += (mouseX - fx) * 0.12; fy += (mouseY - fy) * 0.12;
  follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
  requestAnimationFrame(animFollower);
})();
document.querySelectorAll('a, button, .tech-card, .stat-card, .project-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; follower.style.transform = 'translate(-50%,-50%) scale(1.4)'; follower.style.borderColor = 'rgba(245,197,24,0.8)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.borderColor = 'var(--gold)'; });
});

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
const PARTICLES = Array.from({ length: 80 }, () => ({
  x: Math.random() * W, y: Math.random() * H,
  vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
  r: Math.random() * 1.5 + 0.5, a: Math.random()
}));
function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  PARTICLES.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,197,24,${p.a * 0.4})`; ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('active'); navLinks.classList.remove('open');
}));
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) { hamburger.classList.remove('active'); navLinks.classList.remove('open'); }
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// ===== TYPING ANIMATION =====
const words = ['Full Stack Developer', 'Open Source Contributor', 'Problem Solver', 'Frontend Developer'];
let wi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typedText');
function type() {
  const word = words[wi];
  typedEl.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
  let delay = deleting ? 60 : 100;
  if (!deleting && ci > word.length) { delay = 1800; deleting = true; }
  else if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 400; }
  setTimeout(type, delay);
}
type();

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.1 + 's';
  observer.observe(el);
});

// ===== COUNTER ANIMATION =====
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target; const target = +el.dataset.target;
      let count = 0; const step = target / 60;
      const timer = setInterval(() => {
        count += step; el.textContent = Math.min(Math.ceil(count), target) + (target >= 100 ? '+' : '');
        if (count >= target) clearInterval(timer);
      }, 25);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => counterObs.observe(el));

// ===== BUTTON RIPPLE =====
document.querySelectorAll('.btn, .btn-sm, .btn-outline-sm').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);transform:scale(0);animation:rippleAnim 0.55s linear;pointer-events:none;width:100px;height:100px;left:${e.clientX - rect.left - 50}px;top:${e.clientY - rect.top - 50}px;`;
    this.style.position = 'relative'; this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim { to { transform: scale(3); opacity: 0; } }';
document.head.appendChild(rippleStyle);

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('sendBtn');
    const statusDiv = document.getElementById('formStatus');
    const originalBtnHtml = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    // Check honeypot spam protection
    const honey = contactForm.querySelector('input[name="_honey"]');
    if (honey && honey.value) {
      return; // Silently ignore bot submission
    }

    // Set sending state
    btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    if (statusDiv) {
      statusDiv.style.display = 'none';
      statusDiv.className = 'form-status';
      statusDiv.innerHTML = '';
    }

    const recipientEmail = 'tusharsonawane1903@gmail.com';
    const endpoint = `https://formsubmit.co/ajax/${recipientEmail}`;

    // If opened via local file protocol, fallback to standard form submit
    if (window.location.protocol === 'file:') {
      contactForm.submit();
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          message: messageVal,
          _subject: `New Portfolio Message from ${nameVal || 'Visitor'}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        // Success: email dispatched to tusharsonawane1903@gmail.com
        btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
        contactForm.reset();

        if (statusDiv) {
          statusDiv.className = 'form-status success';
          statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> <span>Thank you! Your message has been sent successfully. I will get back to you soon.</span>';
          statusDiv.style.display = 'flex';
        }

        setTimeout(() => {
          btn.innerHTML = originalBtnHtml;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        // First-time FormSubmit activation notice
        btn.innerHTML = '<span>Check Inbox</span> <i class="fas fa-info-circle"></i>';
        btn.style.background = 'linear-gradient(135deg, #f5c518, #c9a214)';
        btn.style.color = '#000';

        if (statusDiv) {
          statusDiv.className = 'form-status info';
          statusDiv.innerHTML = `<i class="fas fa-envelope-open-text"></i> <span><strong>One-Time Activation:</strong> FormSubmit sent an activation email to <em>${recipientEmail}</em>. Please click "Activate Form" in your inbox once to enable incoming messages!</span>`;
          statusDiv.style.display = 'flex';
        }

        setTimeout(() => {
          btn.innerHTML = originalBtnHtml;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 6000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Contact Form Error:', err);
      btn.innerHTML = '<span>Failed to Send</span> <i class="fas fa-exclamation-triangle"></i>';
      btn.style.background = 'linear-gradient(135deg, #e53935, #c62828)';

      if (statusDiv) {
        statusDiv.className = 'form-status error';
        statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>Could not send automatically. <a href="mailto:${recipientEmail}?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(nameVal)}&body=${encodeURIComponent(messageVal)}">Click here to email me directly</a></span>`;
        statusDiv.style.display = 'flex';
      }

      setTimeout(() => {
        btn.innerHTML = originalBtnHtml;
        btn.style.background = '';
        btn.disabled = false;
      }, 5000);
    }
  });
}

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
