/*
===========================================================
 Project: LocateX – Smart Lost and Found Solution
 Author: Pralhad Saw
 Copyright (c) 2026 Pralhad Saw

 Unauthorized copying, modification, or distribution is prohibited.
===========================================================
*/

// public/js/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  // --- Item Modal Functionality (from GitHub, with homemade checks) ---
  const addBtn = document.getElementById("addItemBtn");
const modal = document.getElementById("itemModal");
const closeModal = document.getElementById("closeModal");

if (addBtn && modal && closeModal) {

  addBtn.addEventListener("click", () => {
    modal.classList.add("show");
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });

}

 else {
    console.warn("One or more elements for the item modal were not found.");
  }

  // --- Navigation Button Event Listeners (from GitHub) ---
  document.getElementById("showLostBtn").addEventListener("click", () => {
    window.location.href = "/items/lost";
  });

  document.getElementById("showFoundBtn").addEventListener("click", () => {
    window.location.href = "/items/found";
  });

  document.getElementById("showMyBtn").addEventListener("click", () => {
    window.location.href = "/items/my";
  });

  document.getElementById("showAllBtn").addEventListener("click", () => {
    window.location.href = "/items/all";
  });

  // --- Image Preview Functionality (from GitHub) ---
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");

  if (imageInput) {
    imageInput.addEventListener("change", function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.style.display = "none";
      }
    });
  }

  // --- Flash Message Handling (from Homemade) ---
  // Optional: Auto-hide flash messages after a few seconds
  const flashMessage = document.querySelector('.flash-message');
  if (flashMessage) {
    setTimeout(() => {
      flashMessage.style.display = 'none';
    }, 5000); // Hide after 5 seconds
  }

  // --- Dynamic Claim/Verification Logic (from Homemade, commented for optional AJAX) ---
  // For this setup, forms are submitted directly via HTTP POST/PUT.
  // If you wanted AJAX for claims/verification (e.g., without page reload),
  // you would add event listeners here to intercept form submissions,
  // use fetch() to send data to the backend, and then update the UI dynamically.
  // For example, to handle the verification buttons via AJAX:
  /*
  document.querySelectorAll('.verification-section form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent default form submission

      const formData = new FormData(form);
      const action = formData.get('action');
      const url = form.action;

      try {
        const response = await fetch(url, {
          method: 'PUT', // Using PUT as per our backend route
          headers: {
            'Content-Type': 'application/json' // Assuming backend expects JSON for action
          },
          body: JSON.stringify({ action: action })
        });
        const result = await response.json();

        if (response.ok) {
          // Update UI dynamically: remove claim, update item status, reveal contact
          alert(result.message); // Show success message
          // You would typically re-fetch item data or update specific elements here
          // For simplicity now, we'll rely on page refresh after manual submission.
          window.location.reload(); // Reload page to show updated status
        } else {
          alert('Error: ' + result.message || response.statusText);
        }
      } catch (error) {
        console.error('AJAX Error:', error);
        alert('An error occurred while processing your request.');
      }
    });
  });
  */

  const hamburger = document.getElementById('hamburger');
const menu = document.querySelector('nav.menu');

if (hamburger && menu) {
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('show');
    hamburger.classList.toggle('open');
  });
}


});