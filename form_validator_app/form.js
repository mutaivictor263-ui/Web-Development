// 2. DOM Elements Selection & Logging


// Form & Controls
const memberForm = document.getElementById('member-form') || document.querySelector('form');
const darkModeBtn = document.getElementById('dark-mode-btn');

// Input Fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const roleSelect = document.getElementById('role');
const bioTextarea = document.getElementById('bio');

// Error Elements (Matching .error span for each field)
const nameError = document.getElementById('name-error') || nameInput?.parentElement.querySelector('.error');
const emailError = document.getElementById('email-error') || emailInput?.parentElement.querySelector('.error');
const roleError = document.getElementById('role-error') || roleSelect?.parentElement.querySelector('.error');
const bioError = document.getElementById('bio-error') || bioTextarea?.parentElement.querySelector('.error');

// Output & Display Elements
const successMessage = document.getElementById('success-message');
const memberList = document.getElementById('member-list');
const memberCounter = document.getElementById('member-counter');

// Confirm references are found
console.log('--- DOM Elements Loaded ---');
console.log('Form:', memberForm);
console.log('Inputs/Controls:', { nameInput, emailInput, roleSelect, bioTextarea, darkModeBtn });
console.log('Error Spans:', { nameError, emailError, roleError, bioError });
console.log('Display Elements:', { successMessage, memberList, memberCounter });


// Helper Functions: Error Management & Counters


// Helper to show field error
function showError(errorElement, message) {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

// Helper to clear field error
function clearError(errorElement) {
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

// 7. Update the member counter
function updateMemberCounter() {
  if (memberCounter) {
    const totalMembers = memberList ? memberList.children.length : 0;
    memberCounter.textContent = `Total Members: ${totalMembers}`;
  }
}



// 4. Validate Each Field

function validateForm() {
  let isValid = true;

  // Name Validation (Required, min 2 chars)
  if (!nameInput.value.trim()) {
    showError(nameError, 'Name is required.');
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    showError(nameError, 'Name must be at least 2 characters.');
    isValid = false;
  } else {
    clearError(nameError);
  }

  // Email Validation (Required & Basic Pattern Check)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim()) {
    showError(emailError, 'Email is required.');
    isValid = false;
  } else if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailError, 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError(emailError);
  }

  // Role Select Validation (Required selection)
  if (!roleSelect.value || roleSelect.value === '') {
    showError(roleError, 'Please select a role.');
    isValid = false;
  } else {
    clearError(roleError);
  }

  // Bio Textarea Validation (Optional or simple length check)
  if (bioTextarea && bioTextarea.value.length > 200) {
    showError(bioError, 'Bio cannot exceed 200 characters.');
    isValid = false;
  } else {
    clearError(bioError);
  }

  return isValid;
}


// 5. Clear errors dynamically as user fixes them (Real-time)

const inputsWithErrors = [
  { input: nameInput, error: nameError },
  { input: emailInput, error: emailError },
  { input: roleSelect, error: roleError },
  { input: bioTextarea, error: bioError }
];

inputsWithErrors.forEach(({ input, error }) => {
  if (input) {
    input.addEventListener('input', () => clearError(error));
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => clearError(error));
    }
  }
});



// 3 & 8. Capture Form Submission, Success & Reset

if (memberForm) {
  memberForm.addEventListener('submit', function (event) {
    // 3. Prevent page refresh on submit
    event.preventDefault();

    // 4. Run field validation
    if (validateForm()) {
      // Extract form values
      const memberData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        role: roleSelect.value,
        bio: bioTextarea ? bioTextarea.value.trim() : ''
      };

      // 6. Register member (DOM Creation)
      registerMember(memberData);

      // 7. Update Counter
      updateMemberCounter();

      // 8. Show success message and reset form
      if (successMessage) {
        successMessage.textContent = 'Member successfully registered!';
        successMessage.style.display = 'block';

        // Hide success message after 3 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 3000);
      }

      // Reset form input fields
      memberForm.reset();
    }
  });
}



// 6 & 9. Register & Remove Member (DOM Creation & Event Delegation)

function registerMember(data) {
  if (!memberList) return;

  // Create list item <li>
  const li = document.createElement('li');
  li.className = 'member-item';

  // Create member details content
  li.innerHTML = `
    <div class="member-info">
      <strong>${data.name}</strong> (${data.role}) - <em>${data.email}</em>
      ${data.bio ? `<p>${data.bio}</p>` : ''}
    </div>
    <button class="remove-btn">Remove</button>
  `;

  // 9. Attach removal event listener to button
  const removeBtn = li.querySelector('.remove-btn');
  removeBtn.addEventListener('click', function () {
    li.remove();
    // 7. Re-update total count after removal
    updateMemberCounter();
  });

  // Append new item to list
  memberList.appendChild(li);
}



// 10. Dark Mode Toggle

if (darkModeBtn) {
  darkModeBtn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    // Optional label change
    if (document.body.classList.contains('dark-mode')) {
      darkModeBtn.textContent = 'Light Mode';
    } else {
      darkModeBtn.textContent = 'Dark Mode';
    }
  });
}

// Initial counter setup on page load
updateMemberCounter();