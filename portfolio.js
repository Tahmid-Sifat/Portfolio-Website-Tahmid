// Scroll-trigger animation

// Select all sections

const sections = document.querySelectorAll("section");

// Create an IntersectionObserver
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add 'visible' class when section enters view
      entry.target.classList.add("visible");
      // Optional: stop observing once it's visible (so it doesn’t re-trigger)
      observer.unobserve(entry.target);
    }

  });
}, {
  threshold: 0.2 // Section is considered "visible" when 20% of it is on screen
});

// Observe each section
sections.forEach(section => {
  observer.observe(section);
});

// Scrollspy - highlight nav link for active section
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let currentSection = "";

  // Check each section's position
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - sectionHeight / 3) 
      // Checks if the page has scrolled at least one-third into the section
      {
      currentSection = section.getAttribute("id");
    }
  });

  // Remove active from all links, then add to the current one
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(currentSection)) {
      link.classList.add("active");
    }
  });
});

// Back to Top Button

const backToTopBtn = document.getElementById("backToTop"); // grabbing element by id

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});



// Contact form validation

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Stop form from refreshing page

  // Simple checks   for name box

  if (nameInput.value.trim() === "") {
    formMessage.textContent = "Please enter your name.";
    formMessage.className = "error";
    return;
  }

  if (!/^[a-zA-Z\s'-]{2,50}$/.test(nameInput.value.trim())) {
    formMessage.textContent = "Name must be 2 to 50 characters and only contain letters, spaces, apostrophes, or hyphens.";
    formMessage.className = "error";
    return;
  }

  // Email validation using regex

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.className = "error";
    return;
  }

  // checks for message 

  if (messageInput.value.trim().length < 10) {
    formMessage.textContent = "Message should be at least 10 characters long.";
    formMessage.className = "error";
    return;
  }

  // If everything is fine

  formMessage.textContent = " Message submitted successfully! ";
  formMessage.className = "success";

  // Reset form

  form.reset();
});

// ========================
// Typing Animation for Hero Tagline
// ========================

 
const taglineElement = document.getElementById("typedText"); // now target the span
const taglineText = "A driven Computer Science student, I blend technical expertise with proven leadership and teamwork to create truly impactful solutions   ";
let i = 0;

function typeWriter() {
  if (i < taglineText.length) {
    taglineElement.textContent += taglineText.charAt(i); // add chars into span
    i++;
    setTimeout(typeWriter, 40); // typing speed
  }
}

window.addEventListener("load", () => {
  typeWriter();
});


// === DARK MODE TOGGLE SWITCH ===

// Grab the dark mode toggle checkbox from HTML

const darkToggle = document.getElementById("darkToggle");

//    Check if the user has a saved preference in localStorage
//    - If the saved theme is "dark", we apply the dark-mode class to <body>
//    - Also update the toggle to appear switched ON

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode"); // enable dark mode on load
  darkToggle.checked = true; // move toggle button to "ON" position
}

// Listen for changes when user clicks the toggle switch
darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    //  User turned ON dark mode
    document.body.classList.add("dark-mode");  // add dark-mode class to <body>
    localStorage.setItem("theme", "dark");     // save preference so it stays after refresh
  } else {
    //  User turned OFF dark mode
    document.body.classList.remove("dark-mode"); // remove dark-mode class
    localStorage.setItem("theme", "light");      // save preference as light
  }
});


// ===============================
// EmailJS Contact Form Integration (Manual Mapping Mode)
// ===============================

// Contact Form Email Script (EmailJS)

// This script lets the contact form send emails directly via EmailJS
// without needing an own backend server. 
// It does TWO things when a user submits the form:
//   1. Sends the message to me (admin email).
//   2. Sends an automatic confirmation reply back to THEM (auto-reply).
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // ---------- CONFIG (from EmailJS dashboard) ----------

  const SERVICE_ID   = "service_ygydvif";    // Your EmailJS service ID
  const TEMPLATE_ID  = "template_bzbt5u8";   // Template that sends message to me
  const AUTOREPLY_ID = "template_qhsu2mk";   // Template that sends auto-reply to USER

  // ---------- DOM REFERENCES ----------
  const form     = document.getElementById("contactForm");   // The contact form element
  const msgLine  = document.getElementById("formMessage");   // <p> used for showing status updates
  const sendBtn  = form ? form.querySelector('button[type="submit"]') : null; // submit button
  const honeypot = form ? form.querySelector('[name="hp_field"]') : null;     // hidden anti-bot field

  // Safety check: if form doesn’t exist, stop running

  if (!form) {
    console.warn("Contact form not found (#contactForm) — EmailJS code will not run.");
    return;
  }

  // Safety check: ensure EmailJS SDK is loaded

  if (typeof emailjs === "undefined") {
    console.error("EmailJS SDK not loaded. Check your <script> include in HTML.");
    if (msgLine) msgLine.textContent = "Email service not loaded (check console).";
    return;
  }

  // ---------- HELPER FUNCTION ----------

  // Updates status line in UI (e.g., “Sending…”, “Success!”, “Error”)

  function setStatus(text, cls = "") {
    if (msgLine) {
      msgLine.textContent = text; // set text
      msgLine.className = cls;    // apply style (CSS .success or .error)
    }
  }

  // ---------- FORM SUBMIT HANDLER ----------

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevents the page from reloading after form submit

    // STEP 1: Anti-bot honeypot check
    // If bots fill the hidden "hp_field", ignore submission.

    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    // STEP 2: Update button UI while sending

    const originalBtn = sendBtn ? sendBtn.textContent : "";
    if (sendBtn) {
      sendBtn.disabled = true;   // disable button to prevent spam clicks
      sendBtn.textContent = "Sending…";
    }
    setStatus("Sending…"); // show status message below form

    // Debug log: capture form values before sending

    console.log("Form values:", {
      from_name: form.elements["from_name"]?.value,
      reply_to: form.elements["reply_to"]?.value,
      message: form.elements["message"]?.value
    });

    try {
      // STEP 3: Build template parameters (MUST match EmailJS template variable names)
      const templateParams = {
        from_name: form.elements["from_name"].value,   // {{from_name}}
        reply_to: form.elements["reply_to"].value,     // {{reply_to}}
        message: form.elements["message"].value        // {{message}}
      };

      console.log("Sending with params:", templateParams); 

      // STEP 4a: Send email to me (admin notification)
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

      // STEP 4b: Send auto-reply to USER (confirmation mail)
      await emailjs.send(SERVICE_ID, AUTOREPLY_ID, templateParams);

      // STEP 5: If both succeed → show success and reset form
      setStatus("Message sent successfully! A confirmation email has been sent to you.", "success");
      form.reset(); // clear form inputs
    } catch (err) {
      // STEP 6: If something fails → log + show error message
      console.error("EmailJS send error:", err);
      setStatus("Failed to send. Please try again later.", "error");
    } finally {
      // STEP 7: Always restore button to original state
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = originalBtn || "Send";
      }
    }
  });
});

// ===== MOBILE NAV TOGGLE =====
const menuToggle = document.getElementById("menuToggle");
const NLinks = document.querySelector(".nav-links");

// Only run if toggle button exists (avoids errors)
if (menuToggle && NLinks) {
  menuToggle.addEventListener("click", () => {
    NLinks.classList.toggle("show");
  });
}
