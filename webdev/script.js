//DOM Elements
const form = document.getElementById('memberForm') || document.querySelector('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const roleSelect = document.getElementById('role');
const bioInput = document.getElementById('bio');

// Error message containers
const nameError = document.getElementById('nameError') || document.querySelector('#name + .error');
const emailError = document.getElementById('emailError') || document.querySelector('#email + .error');
const roleError = document.getElementById('roleError') || document.querySelector('#role + .error');

// Feedback, List & Controls
const successMessage = document.getElementById('successMessage') || document.querySelector('.success-message');
const memberList = document.getElementById('memberList') || document.querySelector('ul');
const memberCounter = document.getElementById('memberCounter') || document.querySelector('.member-count');
const darkModeToggle = document.getElementById('darkModeToggle') || document.querySelector('.dark-mode-btn');

// Log to console to confirm all elements are correctly referenced
console.log('DOM Elements Found:', {
  form,
  nameInput,
  emailInput,
  roleSelect,
  bioInput,
  nameError,
  emailError,
  roleError,
  successMessage,
  memberList,
  memberCounter,
  darkModeToggle
});




// Prevents Cross-Site Scripting (XSS) when inserting text into innerHTML
function sanitizeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validates a field and toggles error message
function validateField(input, errorElement, validationFn, errorMsg) {
  const value = input.value.trim();
  if (!validationFn(value)) {
    if (errorElement) errorElement.textContent = errorMsg;
    input.classList.add('invalid');
    return false;
  } else {
    if (errorElement) errorElement.textContent = '';
    input.classList.remove('invalid');
    return true;
  }
}

// STEP 7: Update member counter display
function updateCounter(change) {
  if (!memberCounter) return;
  const currentCount = parseInt(memberCounter.textContent, 10) || 0;
  const newCount = Math.max(0, currentCount + change);
  memberCounter.textContent = newCount;
}



// STEP 5: Clear Errors on User Input

if (nameInput) {
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') {
      if (nameError) nameError.textContent = '';
      nameInput.classList.remove('invalid');
    }
  });
}

if (emailInput) {
  emailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value.trim())) {
      if (emailError) emailError.textContent = '';
      emailInput.classList.remove('invalid');
    }
  });
}

if (roleSelect) {
  roleSelect.addEventListener('change', () => {
    if (roleSelect.value !== '') {
      if (roleError) roleError.textContent = '';
      roleSelect.classList.remove('invalid');
    }
  });
}



if (form) {
  // STEP 3: Capture the form submission
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // STEP 4: Validate each field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isNameValid = validateField(
      nameInput,
      nameError,
      val => val.length > 0,
      'Name is required.'
    );

    const isEmailValid = validateField(
      emailInput,
      emailError,
      val => emailRegex.test(val),
      'Please enter a valid email address.'
    );

    const isRoleValid = validateField(
      roleSelect,
      roleError,
      val => val !== '',
      'Please select a role.'
    );

    // Stop if validation fails
    if (!isNameValid || !isEmailValid || !isRoleValid) {
      return;
    }

    // STEP 6: Register the member (DOM creation)
    const li = document.createElement('li');
    li.className = 'member-item';

    const cleanName = sanitizeHTML(nameInput.value.trim());
    const cleanEmail = sanitizeHTML(emailInput.value.trim());
    const cleanRole = sanitizeHTML(roleSelect.value);
    const cleanBio = sanitizeHTML(bioInput ? bioInput.value.trim() : '');

    li.innerHTML = `
      <div class="member-info">
        <h3>${cleanName} <span class="role-badge">${cleanRole}</span></h3>
        <p class="member-email">${cleanEmail}</p>
        ${cleanBio ? `<p class="member-bio">${cleanBio}</p>` : ''}
      </div>
      <button type="button" class="remove-btn">Remove</button>
    `;

    if (memberList) {
      memberList.appendChild(li);
    }

    // STEP 7: Update member counter
    updateCounter(1);

    // STEP 8: Show success message and reset form
    if (successMessage) {
      successMessage.textContent = 'Member successfully registered!';
      successMessage.classList.add('show');
      
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 3000);
    }

    form.reset();
  });
}


// STEP 9: Remove a Member (Event Delegation)

if (memberList) {
  memberList.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('remove-btn')) {
      const memberCard = event.target.closest('li');
      if (memberCard) {
        memberCard.remove();
        updateCounter(-1);
      }
    }
  });
}


if (darkModeToggle) {
  darkModeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  });
}