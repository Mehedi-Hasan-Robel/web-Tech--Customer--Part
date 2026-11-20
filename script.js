/* ==========================================================================
   EazyMart Customer Portal JavaScript
   Pure Vanilla JS: Form Validation & DOM Manipulation
   * Strictly NO JSON used *
   ========================================================================== */

/* ==========================================
   Global Variables & State Tracking
   (Stored in standard variables, no JSON)
   ========================================= */
var reviewCount = 1;
var ticketCount = 1;
var wishlistCounter = 3; // Starting from 3 because 1 and 2 are pre-loaded

// Budget tracking numbers
var currentSubtotal = 120.00;
var currentDiscount = 0.00;
var currentDelivery = 5.00;
var activeCoupon = "";


/* ==========================================
   Navigation Tab Switcher (DOM Manipulation)
   ========================================== */
function switchTab(sectionId, btnElement) {
    // List of all section IDs
    var sections = ['profile-section', 'reviews-section', 'wishlist-section', 'support-section'];

    // Hide all sections
    for (var i = 0; i < sections.length; i++) {
        var sec = document.getElementById(sections[i]);
        if (sec) {
            sec.style.display = 'none';
        }
    }

    // Show the selected section
    var targetSec = document.getElementById(sectionId);
    if (targetSec) {
        targetSec.style.display = 'block';
    }

    // Update active state on navigation buttons
    var buttons = document.querySelectorAll('.nav-btn');
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove('active');
    }

    // Set clicked button to active
    if (btnElement) {
        btnElement.classList.add('active');
    }
}


/* ==========================================
   FEATURE 1: Profile & Delivery Address
   Validation and DOM Updates
   ========================================== */
var profileForm = document.getElementById('profileForm');

profileForm.addEventListener('submit', function(event) {
    // Prevent normal browser page reload
    event.preventDefault();

    // Fetch input elements
    var nameInput = document.getElementById('profName');
    var emailInput = document.getElementById('profEmail');
    var phoneInput = document.getElementById('profPhone');
    var addressInput = document.getElementById('profAddress');
    var cityInput = document.getElementById('profCity');

    // Fetch error message elements
    var nameErr = document.getElementById('profNameErr');
    var emailErr = document.getElementById('profEmailErr');
    var phoneErr = document.getElementById('profPhoneErr');
    var addressErr = document.getElementById('profAddressErr');
    var cityErr = document.getElementById('profCityErr');

    // Reset error styles before validation
    var isValid = true;
    hideError(nameInput, nameErr);
    hideError(emailInput, emailErr);
    hideError(phoneInput, phoneErr);
    hideError(addressInput, addressErr);
    hideError(cityInput, cityErr);

    // 1. Validate Full Name (At least 3 characters, alphabets and spaces only)
    var nameVal = nameInput.value.trim();
    if (nameVal.length < 3 || !/^[A-Za-z\s]+$/.test(nameVal)) {
        showError(nameInput, nameErr);
        isValid = false;
    }

    // 2. Validate Email (Contains '@' and '.' with basic valid format)
    var emailVal = emailInput.value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal === "" || !emailPattern.test(emailVal)) {
        showError(emailInput, emailErr);
        isValid = false;
    }

    // 3. Validate Phone (Must be 11 digits starting with '01')
    var phoneVal = phoneInput.value.trim();
    if (phoneVal.length !== 11 || phoneVal.indexOf("01") !== 0 || isNaN(phoneVal)) {
        showError(phoneInput, phoneErr);
        isValid = false;
    }

    // 4. Validate Delivery Address (At least 10 characters long)
    var addressVal = addressInput.value.trim();
    if (addressVal.length < 10) {
        showError(addressInput, addressErr);
        isValid = false;
    }

    // 5. Validate City (Must select a valid option)
    var cityVal = cityInput.value;
    if (cityVal === "") {
        showError(cityInput, cityErr);
        isValid = false;
    }

    // Get selected Address Type radio value
    var addressType = "Home";
    var typeRadios = document.getElementsByName('addressType');
    for (var r = 0; r < typeRadios.length; r++) {
        if (typeRadios[r].checked) {
            addressType = typeRadios[r].value;
            break;
        }
    }

    // If all inputs pass validation, update DOM
    if (isValid) {
        // DOM Manipulation: update current profile preview card
        document.getElementById('dispName').innerText = nameVal;
        document.getElementById('dispEmail').innerText = emailVal;
        document.getElementById('dispPhone').innerText = phoneVal;
        document.getElementById('dispAddress').innerText = addressVal;
        document.getElementById('dispCity').innerText = cityVal;
        document.getElementById('dispType').innerText = addressType;

        // Also update greeting in top header
        document.getElementById('navCustomerName').innerText = nameVal;

        // Show success alert message
        var alertBox = document.getElementById('profileAlert');
        alertBox.style.display = 'block';
        alertBox.innerText = "Profile and delivery details updated successfully!";

        // Auto hide success alert after 4 seconds
        setTimeout(function() {
            alertBox.style.display = 'none';
        }, 4000);
    }
});


/* ==========================================
   FEATURE 2: Product Review & Rating System
   Validation and DOM Updates
   ========================================== */
var reviewForm = document.getElementById('reviewForm');

reviewForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var productSelect = document.getElementById('revProduct');
    var ratingSelect = document.getElementById('revRating');
    var titleInput = document.getElementById('revTitle');
    var commentInput = document.getElementById('revComment');
    var recommendBox = document.getElementById('revRecommend');

    var productErr = document.getElementById('revProductErr');
    var ratingErr = document.getElementById('revRatingErr');
    var titleErr = document.getElementById('revTitleErr');
    var commentErr = document.getElementById('revCommentErr');

    // Reset error styles
    var isReviewValid = true;
    hideError(productSelect, productErr);
    hideError(ratingSelect, ratingErr);
    hideError(titleInput, titleErr);
    hideError(commentInput, commentErr);

    // 1. Validate Product selection
    if (productSelect.value === "") {
        showError(productSelect, productErr);
        isReviewValid = false;
    }

    // 2. Validate Rating
    if (ratingSelect.value === "") {
        showError(ratingSelect, ratingErr);
        isReviewValid = false;
    }

    // 3. Validate Title (5 to 50 characters)
    var titleVal = titleInput.value.trim();
    if (titleVal.length < 5 || titleVal.length > 50) {
        showError(titleInput, titleErr);
        isReviewValid = false;
    }

    // 4. Validate Detailed Feedback (At least 15 characters)
    var commentVal = commentInput.value.trim();
    if (commentVal.length < 15) {
        showError(commentInput, commentErr);
        isReviewValid = false;
    }

    // If valid, create new review element using DOM Manipulation
    if (isReviewValid) {
        var numStars = parseInt(ratingSelect.value);
        var starString = "";
        for (var s = 0; s < numStars; s++) {
            starString += "⭐";
        }

        var isRecommended = recommendBox.checked;
        var tagHtml = isRecommended ? '<span class="rev-tag tag-rec">✓ Recommended</span>' : '<span class="rev-tag" style="color: #64748b;">Not Recommended</span>';

        // Get current date string
        var today = new Date();
        var dateString = today.getDate() + " " + today.toLocaleString('default', { month: 'short' }) + ", " + today.getFullYear();

        // Generate unique ID for this review card
        var newReviewId = "reviewCard_" + new Date().getTime();

        // Create new DOM card
        var cardDiv = document.createElement('div');
        cardDiv.className = 'review-card';
        cardDiv.id = newReviewId;

        // Populate inner HTML of the review card
        cardDiv.innerHTML = 
            '<div class="review-header">' +
                '<h4 class="rev-product-title">' + escapeHTML(productSelect.value) + '</h4>' +
                '<span class="rev-stars">' + starString + '</span>' +
            '</div>' +
            '<h5 class="rev-headline">"' + escapeHTML(titleVal) + '"</h5>' +
            '<p class="rev-body">' + escapeHTML(commentVal) + '</p>' +
            '<div class="review-footer">' +
                tagHtml +
                '<span class="rev-date">Posted on: ' + dateString + '</span>' +
                '<button type="button" class="btn-delete" onclick="removeReview(\'' + newReviewId + '\')">Delete</button>' +
            '</div>';

        // Prepend to the reviews container (DOM Manipulation)
        var reviewsList = document.getElementById('reviewsList');
        reviewsList.insertBefore(cardDiv, reviewsList.firstChild);

        // Update count badge
        reviewCount++;
        updateReviewCountBadge();

        // Reset form
        reviewForm.reset();

        // Show feedback message
        var alertBox = document.getElementById('reviewAlert');
        alertBox.style.display = 'block';
        setTimeout(function() {
            alertBox.style.display = 'none';
        }, 4000);
    }
});

// Function to remove a review card from DOM
function removeReview(reviewElementId) {
    var element = document.getElementById(reviewElementId);
    if (element) {
        element.parentNode.removeChild(element);
        reviewCount--;
        updateReviewCountBadge();
    }
}

// Function to update review badge text
function updateReviewCountBadge() {
    var badge = document.getElementById('reviewCountBadge');
    if (reviewCount === 1) {
        badge.innerText = "1 Review";
    } else {
        badge.innerText = reviewCount + " Reviews";
    }
}


/* ==========================================
   FEATURE 3: Wishlist & Budget Calculator
   Table DOM Operations & Real-time Calculations
   ========================================== */
function addWishlistItem() {
    var itemSelect = document.getElementById('wishItemSelect');
    var qtyInput = document.getElementById('wishQuantity');
    var prioritySelect = document.getElementById('wishPriority');

    var itemErr = document.getElementById('wishItemErr');
    var qtyErr = document.getElementById('wishQtyErr');

    // Reset errors
    hideError(itemSelect, itemErr);
    hideError(qtyInput, qtyErr);

    var isValid = true;

    // Validate Item selection
    if (itemSelect.value === "") {
        showError(itemSelect, itemErr);
        isValid = false;
    }

    // Validate Quantity (1 - 10)
    var qty = parseInt(qtyInput.value);
    if (isNaN(qty) || qty < 1 || qty > 10) {
        showError(qtyInput, qtyErr);
        isValid = false;
    }

    if (isValid) {
        // Extract Product Name and Price from selected value: "Name|Price"
        var parts = itemSelect.value.split('|');
        var itemName = parts[0];
        var itemPrice = parseFloat(parts[1]);
        var priority = prioritySelect.value;

        var rowSubtotal = itemPrice * qty;

        // Generate badge class for priority
        var badgeClass = "badge-med";
        if (priority === "High") {
            badgeClass = "badge-high";
        } else if (priority === "Low") {
            badgeClass = "badge-low";
        }

        var rowId = "wishRow_" + wishlistCounter;
        wishlistCounter++;

        // Create table row (DOM Manipulation)
        var tr = document.createElement('tr');
        tr.id = rowId;
        tr.innerHTML = 
            '<td>' + itemName + '</td>' +
            '<td>$' + itemPrice.toFixed(2) + '</td>' +
            '<td>' + qty + '</td>' +
            '<td><span class="badge ' + badgeClass + '">' + priority + '</span></td>' +
            '<td class="row-total">$' + rowSubtotal.toFixed(2) + '</td>' +
            '<td><button class="btn-delete" onclick="removeWishlistItem(\'' + rowId + '\', ' + rowSubtotal + ')">Remove</button></td>';

        // Append to table body
        var tbody = document.getElementById('wishlistBody');
        tbody.appendChild(tr);

        // Hide empty notice if showing
        document.getElementById('emptyWishlistNotice').style.display = 'none';

        // Update subtotal
        currentSubtotal += rowSubtotal;
        recalculateBudget();

        // Show success alert
        var alertBox = document.getElementById('wishlistAlert');
        alertBox.style.display = 'block';
        setTimeout(function() {
            alertBox.style.display = 'none';
        }, 3000);

        // Reset inputs
        itemSelect.value = "";
        qtyInput.value = "1";
    }
}

// Remove item from Wishlist table (DOM Manipulation)
function removeWishlistItem(rowId, rowAmount) {
    var row = document.getElementById(rowId);
    if (row) {
        row.parentNode.removeChild(row);
        currentSubtotal -= rowAmount;
        if (currentSubtotal < 0) {
            currentSubtotal = 0;
        }

        // Check if table is empty
        var tbody = document.getElementById('wishlistBody');
        if (tbody.children.length === 0) {
            document.getElementById('emptyWishlistNotice').style.display = 'block';
        }

        recalculateBudget();
    }
}

// Coupon Code Logic
function applyCoupon() {
    var input = document.getElementById('couponInput');
    var msgSpan = document.getElementById('couponMsg');
    var code = input.value.trim().toUpperCase();

    if (code === "") {
        msgSpan.style.color = "#dc2626";
        msgSpan.innerText = "Please enter a coupon code.";
        return;
    }

    if (code === "EAZY10") {
        activeCoupon = "EAZY10";
        msgSpan.style.color = "#15803d";
        msgSpan.innerText = "Success! 10% discount applied to your budget.";
    } else if (code === "FREESHIP") {
        activeCoupon = "FREESHIP";
        msgSpan.style.color = "#15803d";
        msgSpan.innerText = "Success! Free delivery shipping applied.";
    } else {
        activeCoupon = "";
        msgSpan.style.color = "#dc2626";
        msgSpan.innerText = "Invalid coupon code. Try 'EAZY10' or 'FREESHIP'.";
    }

    recalculateBudget();
}

// Budget Calculation function
function recalculateBudget() {
    // If cart is empty
    if (currentSubtotal <= 0) {
        currentDiscount = 0;
        currentDelivery = 0;
    } else {
        // Base delivery is $5.00
        currentDelivery = 5.00;

        // Apply active coupons
        if (activeCoupon === "EAZY10") {
            currentDiscount = currentSubtotal * 0.10;
        } else {
            currentDiscount = 0.00;
        }

        if (activeCoupon === "FREESHIP") {
            currentDelivery = 0.00;
        }
    }

    var finalTotal = currentSubtotal - currentDiscount + currentDelivery;
    if (finalTotal < 0) {
        finalTotal = 0;
    }

    // Update DOM elements
    document.getElementById('calcSubtotal').innerText = "$" + currentSubtotal.toFixed(2);
    document.getElementById('calcDiscount').innerText = "-$" + currentDiscount.toFixed(2);
    document.getElementById('calcDelivery').innerText = "$" + currentDelivery.toFixed(2);
    document.getElementById('calcTotal').innerText = "$" + finalTotal.toFixed(2);
}


/* ==========================================
   FEATURE 4: Support Ticket & Return Request
   Validation and DOM Updates
   ========================================== */
var supportForm = document.getElementById('supportForm');

supportForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var orderInput = document.getElementById('tickOrderId');
    var catSelect = document.getElementById('tickCategory');
    var descInput = document.getElementById('tickDescription');

    var orderErr = document.getElementById('tickOrderIdErr');
    var catErr = document.getElementById('tickCategoryErr');
    var descErr = document.getElementById('tickDescErr');

    // Reset errors
    var isValid = true;
    hideError(orderInput, orderErr);
    hideError(catSelect, catErr);
    hideError(descInput, descErr);

    // 1. Validate Order ID (Must start with ORD- and have at least 1 digit)
    var orderVal = orderInput.value.trim().toUpperCase();
    if (!orderVal.startsWith("ORD-") || orderVal.length < 5) {
        showError(orderInput, orderErr);
        isValid = false;
    }

    // 2. Validate Category
    if (catSelect.value === "") {
        showError(catSelect, catErr);
        isValid = false;
    }

    // 3. Validate Description (At least 15 characters)
    var descVal = descInput.value.trim();
    if (descVal.length < 15) {
        showError(descInput, descErr);
        isValid = false;
    }

    // Get selected Urgency
    var urgency = "Normal";
    var urgRadios = document.getElementsByName('tickUrgency');
    for (var u = 0; u < urgRadios.length; u++) {
        if (urgRadios[u].checked) {
            urgency = urgRadios[u].value;
            break;
        }
    }

    if (isValid) {
        // Generate random ticket number
        var randomNum = Math.floor(100 + Math.random() * 900);
        var ticketId = "TCK-" + randomNum;
        var cardElementId = "ticketCard_" + randomNum;

        // Get date
        var today = new Date();
        var dateString = today.getDate() + " " + today.toLocaleString('default', { month: 'short' }) + ", " + today.getFullYear();

        // Create new ticket card (DOM Manipulation)
        var cardDiv = document.createElement('div');
        cardDiv.className = 'ticket-card';
        cardDiv.id = cardElementId;

        cardDiv.innerHTML = 
            '<div class="ticket-header">' +
                '<span class="ticket-id">Ticket #' + ticketId + '</span>' +
                '<span class="badge badge-pending" id="status_' + cardElementId + '">Under Review</span>' +
            '</div>' +
            '<div class="ticket-meta">' +
                '<span><strong>Order:</strong> ' + escapeHTML(orderVal) + '</span> | ' +
                '<span><strong>Category:</strong> ' + escapeHTML(catSelect.value) + '</span> | ' +
                '<span><strong>Priority:</strong> ' + urgency + '</span>' +
            '</div>' +
            '<p class="ticket-desc">"' + escapeHTML(descVal) + '"</p>' +
            '<div class="ticket-footer">' +
                '<span class="ticket-date">Created: ' + dateString + '</span>' +
                '<button type="button" class="btn-resolve" onclick="resolveTicket(\'' + cardElementId + '\')">Mark as Resolved</button>' +
            '</div>';

        // Prepend to tickets container (DOM Manipulation)
        var container = document.getElementById('ticketsContainer');
        container.insertBefore(cardDiv, container.firstChild);

        ticketCount++;
        updateTicketCountBadge();

        // Reset form
        supportForm.reset();

        // Show alert
        var alertBox = document.getElementById('supportAlert');
        alertBox.style.display = 'block';
        setTimeout(function() {
            alertBox.style.display = 'none';
        }, 4000);
    }
});

// Function to resolve a ticket via DOM Manipulation
function resolveTicket(ticketCardId) {
    var card = document.getElementById(ticketCardId);
    var statusBadge = document.getElementById('status_' + ticketCardId);

    if (card && statusBadge) {
        // Change badge text and class
        statusBadge.innerText = "Resolved";
        statusBadge.className = "badge badge-resolved";

        // Add resolved class to card
        card.classList.add('resolved');

        // Disable or update the action button
        var btn = card.querySelector('.btn-resolve');
        if (btn) {
            btn.innerText = "✓ Solved";
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.style.cursor = "default";
        }
    }
}

// Function to update ticket count badge
function updateTicketCountBadge() {
    var badge = document.getElementById('ticketCountBadge');
    if (ticketCount === 1) {
        badge.innerText = "1 Active Ticket";
    } else {
        badge.innerText = ticketCount + " Active Tickets";
    }
}


/* ==========================================
   Helper Functions for Validation & Clean DOM
   ========================================== */
function showError(inputElement, errorElement) {
    inputElement.classList.add('input-error');
    errorElement.style.display = 'block';
}

function hideError(inputElement, errorElement) {
    inputElement.classList.remove('input-error');
    errorElement.style.display = 'none';
}

// Simple escaping to prevent XSS and ensure safe DOM insertion
function escapeHTML(str) {
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}
