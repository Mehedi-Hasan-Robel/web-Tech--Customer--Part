/* ==========================================================================
   EazyMart Customer Portal - Authentication JavaScript (Login & Signup)
   Pure Vanilla JS: Form Validation & DOM Manipulation
   * Strictly NO JSON used *
   ========================================================================== */

/* ==========================================
   DOM Helper: Toggle Password Visibility
   ========================================== */
function togglePasswordVisibility(inputId, toggleBtn) {
    var passwordInput = document.getElementById(inputId);
    if (!passwordInput) return;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.innerText = "Hide";
    } else {
        passwordInput.type = "password";
        toggleBtn.innerText = "Show";
    }
}


/* ==========================================
   DOM Helper: Live Password Strength Meter
   ========================================== */
function checkPasswordStrength() {
    var passwordInput = document.getElementById('signupPassword');
    var strengthBar = document.getElementById('strengthBar');
    var strengthText = document.getElementById('strengthText');

    if (!passwordInput || !strengthBar || !strengthText) return;

    var val = passwordInput.value;

    if (val.length === 0) {
        strengthBar.style.width = "0%";
        strengthBar.style.backgroundColor = "#cbd5e1";
        strengthText.innerText = "Password strength: None";
        strengthText.style.color = "#64748b";
        return;
    }

    var score = 0;

    // Length check
    if (val.length >= 6) {
        score++;
    }
    // Has a number
    if (/\d/.test(val)) {
        score++;
    }
    // Has both lower and uppercase letters
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) {
        score++;
    }
    // Has special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
        score++;
    }

    // Update DOM based on score
    if (score <= 1) {
        strengthBar.style.width = "25%";
        strengthBar.style.backgroundColor = "#ef4444"; // Red
        strengthText.innerText = "Password strength: Weak";
        strengthText.style.color = "#ef4444";
    } else if (score === 2 || score === 3) {
        strengthBar.style.width = "65%";
        strengthBar.style.backgroundColor = "#f59e0b"; // Orange
        strengthText.innerText = "Password strength: Medium";
        strengthText.style.color = "#d97706";
    } else {
        strengthBar.style.width = "100%";
        strengthBar.style.backgroundColor = "#10b981"; // Green
        strengthText.innerText = "Password strength: Strong";
        strengthText.style.color = "#15803d";
    }
}


/* ==========================================
   LOGIN FORM VALIDATION & HANDLING
   ========================================== */
var loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        // Prevent default browser form submission
        event.preventDefault();

        var emailInput = document.getElementById('loginEmail');
        var passwordInput = document.getElementById('loginPassword');

        var emailErr = document.getElementById('loginEmailErr');
        var passwordErr = document.getElementById('loginPasswordErr');

        // Reset errors
        var isValid = true;
        hideAuthError(emailInput, emailErr);
        hideAuthError(passwordInput, passwordErr);

        // 1. Email format validation
        var emailVal = emailInput.value.trim();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal === "" || !emailPattern.test(emailVal)) {
            showAuthError(emailInput, emailErr);
            isValid = false;
        }

        // 2. Password validation (At least 6 characters)
        var passwordVal = passwordInput.value;
        if (passwordVal.length < 6) {
            showAuthError(passwordInput, passwordErr);
            isValid = false;
        }

        // If validation passes
        if (isValid) {
            var alertBox = document.getElementById('loginAlert');
            alertBox.className = "alert-box success-alert";
            alertBox.style.display = "block";
            alertBox.innerText = "Login successful! Redirecting to Customer Portal...";

            // Disable submit button during redirect
            var submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Logging in...";
            }

            // Redirect to customer.html after 1.5 seconds (DOM timing)
            setTimeout(function() {
                window.location.href = "customer.html";
            }, 1500);
        }
    });
}


/* ==========================================
   SIGNUP FORM VALIDATION & HANDLING
   ========================================== */
var signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var nameInput = document.getElementById('signupName');
        var emailInput = document.getElementById('signupEmail');
        var phoneInput = document.getElementById('signupPhone');
        var passwordInput = document.getElementById('signupPassword');
        var confirmInput = document.getElementById('signupConfirmPassword');
        var termsCheckbox = document.getElementById('signupTerms');

        var nameErr = document.getElementById('signupNameErr');
        var emailErr = document.getElementById('signupEmailErr');
        var phoneErr = document.getElementById('signupPhoneErr');
        var passwordErr = document.getElementById('signupPasswordErr');
        var confirmErr = document.getElementById('signupConfirmErr');
        var termsErr = document.getElementById('signupTermsErr');

        // Reset all error states
        var isValid = true;
        hideAuthError(nameInput, nameErr);
        hideAuthError(emailInput, emailErr);
        hideAuthError(phoneInput, phoneErr);
        hideAuthError(passwordInput, passwordErr);
        hideAuthError(confirmInput, confirmErr);
        termsErr.style.display = "none";

        // 1. Full Name: at least 3 letters, alphabetic & spaces only
        var nameVal = nameInput.value.trim();
        if (nameVal.length < 3 || !/^[A-Za-z\s]+$/.test(nameVal)) {
            showAuthError(nameInput, nameErr);
            isValid = false;
        }

        // 2. Email format check
        var emailVal = emailInput.value.trim();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal === "" || !emailPattern.test(emailVal)) {
            showAuthError(emailInput, emailErr);
            isValid = false;
        }

        // 3. Phone: exactly 11 digits, starts with 01, numbers only
        var phoneVal = phoneInput.value.trim();
        if (phoneVal.length !== 11 || phoneVal.indexOf("01") !== 0 || isNaN(phoneVal)) {
            showAuthError(phoneInput, phoneErr);
            isValid = false;
        }

        // 4. Password: at least 6 characters and has at least 1 digit
        var passwordVal = passwordInput.value;
        if (passwordVal.length < 6 || !/\d/.test(passwordVal)) {
            showAuthError(passwordInput, passwordErr);
            isValid = false;
        }

        // 5. Confirm Password: must match password exactly
        var confirmVal = confirmInput.value;
        if (confirmVal === "" || confirmVal !== passwordVal) {
            showAuthError(confirmInput, confirmErr);
            isValid = false;
        }

        // 6. Terms Checkbox: must be checked
        if (!termsCheckbox.checked) {
            termsErr.style.display = "block";
            isValid = false;
        }

        // If all validation passes
        if (isValid) {
            var alertBox = document.getElementById('signupAlert');
            alertBox.className = "alert-box success-alert";
            alertBox.style.display = "block";
            alertBox.innerText = "Account created successfully! Redirecting to Customer Portal...";

            var submitBtn = signupForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Creating Account...";
            }

            // Redirect to customer dashboard
            setTimeout(function() {
                window.location.href = "customer.html";
            }, 1800);
        }
    });
}


/* ==========================================
   Helper Functions (Auth Error Display)
   ========================================== */
function showAuthError(inputElement, errorElement) {
    if (inputElement) {
        inputElement.classList.add('input-error');
    }
    if (errorElement) {
        errorElement.style.display = 'block';
    }
}

function hideAuthError(inputElement, errorElement) {
    if (inputElement) {
        inputElement.classList.remove('input-error');
    }
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    alert("Password Reset Info: Please contact EazyMart customer support at support@eazymart.com or call 01712345678.");
}

function viewTerms(event) {
    event.preventDefault();
    alert("EazyMart Terms & Conditions:\n1. Respect user privacy.\n2. Genuine orders and genuine reviews only.\n3. 7-day hassle-free return policy.");
}
