// ── FORM VALIDATION & SUBMISSION ──
const form = document.getElementById('contact-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  let valid = true;

  // Reset errors
  [name, email, message].forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.err-msg').forEach(el => el.classList.remove('show'));

  // Validate name
  if (!name.value.trim()) {
    name.classList.add('error');
    document.getElementById('name-err').classList.add('show');
    valid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
    email.classList.add('error');
    document.getElementById('email-err').classList.add('show');
    valid = false;
  }

  // Validate message
  if (!message.value.trim()) {
    message.classList.add('error');
    document.getElementById('message-err').classList.add('show');
    valid = false;
  }

  if (!valid) return;

  // Save feedback to localStorage
  const feedback = {
    name: name.value.trim(),
    email: email.value.trim(),
    message: message.value.trim(),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  };

  const stored = JSON.parse(localStorage.getItem('portfolio_feedback') || '[]');
  stored.unshift(feedback);
  localStorage.setItem('portfolio_feedback', JSON.stringify(stored));

  // Show success message
  document.getElementById('success-msg').classList.add('show');

  // Reset form fields
  form.reset();

  // Refresh displayed feedback
  renderFeedback();
});

// ── RENDER FEEDBACK FROM LOCALSTORAGE ──
function renderFeedback() {
  const list = document.getElementById('feedback-list');
  const clearBtn = document.getElementById('clear-btn');
  const stored = JSON.parse(localStorage.getItem('portfolio_feedback') || '[]');

  if (stored.length === 0) {
    list.innerHTML = '<p class="no-feedback">No feedback yet. Be the first!</p>';
    clearBtn.style.display = 'none';
    return;
  }

  clearBtn.style.display = 'inline-block';

  list.innerHTML = stored.map(fb => `
    <div class="feedback-item">
      <div class="feedback-meta">
        <span class="feedback-name">${escapeHtml(fb.name)}</span>
        <span class="feedback-date">${fb.date}</span>
      </div>
      <div class="feedback-msg">${escapeHtml(fb.message)}</div>
    </div>
  `).join('');
}

// ── CLEAR ALL FEEDBACK ──
function clearFeedback() {
  localStorage.removeItem('portfolio_feedback');
  document.getElementById('success-msg').classList.remove('show');
  renderFeedback();
}

// ── ESCAPE HTML TO PREVENT XSS ──
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Load feedback on page load
renderFeedback();
