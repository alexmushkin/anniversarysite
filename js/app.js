/* ==========================================================================
   Carolina Anniversary Site - Refined Balanced Interaction Engine
   ========================================================================== */

// 1. Easy Credentials Configuration
const CONFIG = {
  // Username check (case-insensitive)
  username: "Carolina",
  
  password: "05/24" 
};

document.addEventListener("DOMContentLoaded", () => {
  initBackgroundCanvas();
  initParallaxEffects();
  initFormInteractions();
  initHomePanelInteractions();
  initMattressRoll();
  initGrassField();

  const loginContainer = document.getElementById("login-container");
  const homeSection = document.getElementById("home-section");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn && loginContainer && homeSection) {
    // Session is active: instantly bypass login card
    loginContainer.classList.add("hidden");
    homeSection.classList.remove("hidden");

    // Auto-open active tab from query parameter (e.g. index.html?tab=us)
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      const tabBtn = document.querySelector(`.nav-tab[data-tab="${tabParam}"]`);
      if (tabBtn) {
        const tabs = document.querySelectorAll(".nav-tab");
        const panes = document.querySelectorAll(".tab-pane");
        const greeting = document.querySelector(".main-greeting-container");

        // Sync tab nav classes instantly
        tabs.forEach(t => t.classList.remove("active"));
        tabBtn.classList.add("active");

        if (greeting) {
          greeting.classList.add("hidden-greeting");
        }

        // Sync pane display classes instantly
        panes.forEach(pane => {
          pane.classList.remove("active");
          if (pane.id === `pane-${tabParam}`) {
            pane.classList.add("active");
          }
        });

        // Ensure the active tab class remains set on the documentElement for tab-specific global styles
        document.documentElement.classList.forEach(cls => {
          if (cls.startsWith("tab-")) {
            document.documentElement.classList.remove(cls);
          }
        });
        document.documentElement.classList.add("tab-" + tabParam);
      }
    }

    // Trigger mattress roll-in automatically on reload (longer delay if active tab to let content/images paint first)
    triggerMattressRollIn(tabParam ? 1500 : 1000);
  }
});

/* ==========================================================================
   Sophisticated Light & Airy Purple/Yellow Canvas Particle System
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById("fun-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const cursorTrail = [];
  const explosions = [];
  
  // Particle classes (Soft Purple Bokeh, Gold Stars, Clouds)
  class BokehParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Distribute on start
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 30;
      this.size = Math.random() * 20 + 10;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.swingSpeed = Math.random() * 0.01 + 0.005;
      this.swingRange = Math.random() * 8 + 3;
      this.angle = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.12 + 0.04;
      this.colorType = Math.random() > 0.5 ? 0 : 1; // 0 = Lavender, 1 = Buttercream
    }

    update() {
      this.y += this.speedY;
      this.angle += this.swingSpeed;
      this.xOffset = Math.sin(this.angle) * this.swingRange;

      if (this.y < -40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x + this.xOffset, this.y, this.size, 0, Math.PI * 2);
      if (this.colorType === 0) {
        ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`; // Dreamy soft lilac purple
      } else {
        ctx.fillStyle = `rgba(116, 185, 255, ${this.opacity})`; // Soft sky-blue
      }
      ctx.fill();
      ctx.restore();
    }
  }

  class TwinkleStar {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 5 + 2;
      this.opacity = Math.random() * 0.5 + 0.15;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.risingSpeed = -(Math.random() * 0.25 + 0.05);
    }

    update() {
      this.y += this.risingSpeed;
      this.opacity += this.twinkleSpeed;
      if (this.opacity > 0.75 || this.opacity < 0.15) {
        this.twinkleSpeed = -this.twinkleSpeed;
      }
      if (this.y < -10) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      drawSparkle(ctx, this.x, this.y, this.size, this.opacity);
    }
  }

  class CloudParticle {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
    }

    reset() {
      this.x = -200;
      this.y = Math.random() * (height * 0.4);
      this.size = Math.random() * 45 + 45;
      this.speedX = Math.random() * 0.12 + 0.04;
      this.opacity = Math.random() * 0.18 + 0.08;
    }

    update() {
      this.x += this.speedX;
      if (this.x > width + 200) {
        this.reset();
      }
    }

    draw() {
      drawCloud(ctx, this.x, this.y, this.size, this.opacity);
    }
  }

  // Cursor Trail Sparkle (Elegant Star Dust in Gold and Lavender)
  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2.5;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.speedY = (Math.random() - 0.5) * 1.2 - 0.2;
      this.opacity = 1;
      this.decay = Math.random() * 0.035 + 0.02;
      this.colorType = Math.random() > 0.4 ? 0 : 1; // 0 = Gold, 1 = Lavender
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.decay;
      if (this.size > 0.5) this.size -= 0.08;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;
      if (this.colorType === 0) {
        ctx.fillStyle = `rgba(9, 132, 227, ${this.opacity})`; // Whimsical sky blue trail
      } else {
        ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`; // Vibrant magical violet trail
      }
      drawSparklePath(ctx, this.size);
      ctx.restore();
    }
  }

  // Magical Starburst Confetti Explosion (Gold & Purple Theme)
  class ExplosionParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 5 + 2;
      this.speedX = Math.cos(angle) * force;
      this.speedY = Math.sin(angle) * force;
      this.opacity = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotateSpeed = (Math.random() - 0.5) * 0.08;
      this.gravity = 0.04;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.opacity -= this.decay;
      this.rotation += this.rotateSpeed;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      
      const colorIndex = Math.floor(Math.random() * 3);
      if (colorIndex === 0) ctx.fillStyle = '#74b9ff'; // Sky blue confetti
      else if (colorIndex === 1) ctx.fillStyle = '#a29bfe'; // Pastel violet confetti
      else ctx.fillStyle = '#fd79a8'; // Whimsical magic pink confetti
      
      drawSparklePath(ctx, this.size);
      ctx.restore();
    }
  }

  // Populate ambient particles
  for (let i = 0; i < 12; i++) particles.push(new BokehParticle());
  for (let i = 0; i < 16; i++) particles.push(new TwinkleStar());
  for (let i = 0; i < 3; i++) particles.push(new CloudParticle());

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    for (let i = cursorTrail.length - 1; i >= 0; i--) {
      const p = cursorTrail[i];
      p.update();
      p.draw();
      if (p.opacity <= 0) {
        cursorTrail.splice(i, 1);
      }
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
      const p = explosions[i];
      p.update();
      p.draw();
      if (p.opacity <= 0) {
        explosions.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  let lastMouseX = null;
  let lastMouseY = null;
  
  window.addEventListener("mousemove", (e) => {
    const dist = lastMouseX !== null ? Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY) : 100;
    if (dist > 10) {
      cursorTrail.push(new TrailParticle(e.clientX, e.clientY));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }
  });

  window.triggerStarExplosion = function(x, y) {
    const burstCount = 50;
    for (let i = 0; i < burstCount; i++) {
      explosions.push(new ExplosionParticle(x, y));
    }
  };

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

function drawSparkle(ctx, x, y, size, opacity) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = `rgba(204, 161, 78, ${opacity})`; // Star sparkles
  drawSparklePath(ctx, size);
  ctx.restore();
}

function drawSparklePath(ctx, size) {
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(0, 0, size, 0);
  ctx.quadraticCurveTo(0, 0, 0, size);
  ctx.quadraticCurveTo(0, 0, -size, 0);
  ctx.quadraticCurveTo(0, 0, 0, -size);
  ctx.fill();
}

function drawCloud(ctx, x, y, size, opacity) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  const r = size * 0.4;
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.arc(r * 0.8, -r * 0.2, r * 0.8, 0, Math.PI * 2);
  ctx.arc(-r * 0.8, -r * 0.2, r * 0.7, 0, Math.PI * 2);
  ctx.arc(r * 1.4, r * 0.1, r * 0.5, 0, Math.PI * 2);
  ctx.arc(-r * 1.4, r * 0.1, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ==========================================================================
   Responsive Parallax Accents Effect & 3D Card Tilt
   ========================================================================== */
function initParallaxEffects() {
  const accents = document.querySelectorAll(".floating-accent");
  const loginCard = document.getElementById("login-card");
  const successCard = document.getElementById("success-card");
  
  window.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    // Parallax background items
    accents.forEach(acc => {
      const depth = parseFloat(acc.getAttribute("data-depth")) || 0.1;
      const xShift = deltaX * depth;
      const yShift = deltaY * depth;
      acc.style.transform = `translate(${xShift}px, ${yShift}px)`;
    });

    const isMotionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 3D Card Tilt (Login/Success Screen)
    const activeCard = !loginCard.classList.contains("hidden") ? loginCard : successCard;
    if (activeCard && isMotionOk) {
      const rotateX = -(deltaY / centerY) * 4;
      const rotateY = (deltaX / centerX) * 4;
      activeCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    // 3D Couple Silhouette Parallax (Home Screen) - Only tilt if active-parallax is set!
    const coupleSil = document.querySelector(".couple-silhouette-wrapper");
    if (coupleSil && isMotionOk && coupleSil.classList.contains("active-parallax")) {
      const rotateX = -(deltaY / centerY) * 6;
      const rotateY = (deltaX / centerX) * 6;
      coupleSil.style.transform = `translateX(-50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });

  document.addEventListener("mouseleave", () => {
    loginCard.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    successCard.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    
    const coupleSil = document.querySelector(".couple-silhouette-wrapper");
    if (coupleSil && coupleSil.classList.contains("active-parallax")) {
      coupleSil.style.transform = "translateX(-50%) rotateX(0deg) rotateY(0deg)";
    }
  });
}

/* ==========================================================================
   Form Handling & Verification Logic (Login Section)
   ========================================================================== */
function initFormInteractions() {
  const form = document.getElementById("login-form");
  const loginCard = document.getElementById("login-card");
  const successCard = document.getElementById("success-card");
  const feedbackMsg = document.getElementById("feedback-msg");
  
  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");
  const togglePassBtn = document.getElementById("toggle-password-btn");
  
  const eyeOpenIcon = togglePassBtn.querySelector(".eye-open");
  const eyeClosedIcon = togglePassBtn.querySelector(".eye-closed");

  // Password Toggle
  togglePassBtn.addEventListener("click", () => {
    const isPass = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPass ? "text" : "password");
    
    eyeOpenIcon.classList.toggle("hidden", isPass);
    eyeClosedIcon.classList.toggle("hidden", !isPass);
  });

  // Robust class-based floating labels (covers autofill, typing, and backspacing)
  const inputs = [usernameInput, passwordInput];
  inputs.forEach(input => {
    const checkFilled = () => {
      if (input.value.trim() !== "") {
        input.classList.add("filled");
      } else {
        input.classList.remove("filled");
      }
    };

    // Delays are necessary for browsers' native autofill timing
    setTimeout(checkFilled, 100);
    setTimeout(checkFilled, 500);

    input.addEventListener("input", () => {
      checkFilled();
      if (feedbackMsg.classList.contains("active")) {
        feedbackMsg.classList.remove("active");
        feedbackMsg.innerHTML = "";
      }
    });
    
    input.addEventListener("change", checkFilled);
    input.addEventListener("blur", checkFilled);
    input.addEventListener("focus", () => {
      input.classList.add("filled");
    });
  });

  // Submit Handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usernameVal = usernameInput.value.trim();
    const passwordVal = passwordInput.value;

    if (!usernameVal) {
      showError("Please enter your name.");
      triggerCardShake();
      return;
    }

    if (usernameVal.toLowerCase() !== CONFIG.username.toLowerCase()) {
      showError("Name unrecognized. Please try again.");
      triggerCardShake();
      return;
    }

    if (CONFIG.password !== null && passwordVal !== CONFIG.password) {
      showError("Incorrect password.");
      triggerCardShake();
      return;
    }

    handleLoginSuccess();
  });

  function triggerCardShake() {
    loginCard.classList.remove("shake");
    void loginCard.offsetWidth; // Reflow
    loginCard.classList.add("shake");
    
    setTimeout(() => {
      loginCard.classList.remove("shake");
    }, 450);
  }

  function showError(msg) {
    feedbackMsg.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${msg}</span>
    `;
    feedbackMsg.classList.add("active");
  }

  function handleLoginSuccess() {
    // Persist login state
    sessionStorage.setItem("isLoggedIn", "true");

    // Starburst Explosion at the button coordinates
    const btnRect = document.getElementById("btn-unlock-id").getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;
    
    if (window.triggerStarExplosion) {
      window.triggerStarExplosion(centerX, centerY);
      setTimeout(() => {
        window.triggerStarExplosion(window.innerWidth / 2, window.innerHeight * 0.4);
      }, 250);
    }

    // Swapping cards
    loginCard.classList.add("hidden");
    
    setTimeout(() => {
      successCard.classList.remove("hidden");
      
      // Animate Loading Progress Bar
      setTimeout(() => {
        const progressBar = document.getElementById("progress-bar");
        if (progressBar) {
          progressBar.style.width = "100%";
        }
      }, 150);
      
      // Transition from Success Welcome Card to Main Home Panel (after 3.2s)
      setTimeout(() => {
        revealHomeDashboard();
      }, 3200);
      
    }, 400);
  }

  // Fades out welcome and transitions in home-section
  function revealHomeDashboard() {
    const loginContainer = document.getElementById("login-container");
    const homeSection = document.getElementById("home-section");

    if (loginContainer && homeSection) {
      // Fade out
      loginContainer.style.opacity = "0";
      
      setTimeout(() => {
        loginContainer.classList.add("hidden");
        homeSection.classList.remove("hidden");
        
        // 1. Initial celebratory entry burst in the center of the track
        if (window.triggerStarExplosion) {
          const track = document.getElementById("mattress-track");
          if (track) {
            const rect = track.getBoundingClientRect();
            window.triggerStarExplosion(rect.left + rect.width / 2, rect.top + rect.height * 0.75);
          }
        }

        // 2. Auto-open active tab from query parameter (e.g. index.html?tab=us)
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab");
        if (tabParam) {
          const tabBtn = document.querySelector(`.nav-tab[data-tab="${tabParam}"]`);
          if (tabBtn) {
            setTimeout(() => tabBtn.click(), 100);
          }
        }

        // 3. Trigger automatic roll-in of the mattress (delayed by 1 second)
        triggerMattressRollIn(1000);
      }, 600);
    }
  }
}

/* ==========================================================================
   Home Section Panel & Navigation Interactions
   ========================================================================== */
function initHomePanelInteractions() {
  const tabs = document.querySelectorAll(".nav-tab");
  const panes = document.querySelectorAll(".tab-pane");
  const brandLogo = document.querySelector(".nav-logo");
  const greeting = document.querySelector(".main-greeting-container");

  // 1. Navigation Tab Swapping
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      const targetId = tab.getAttribute("data-tab");
      if (targetId === "gifts") return; // Allow natural page navigation to gifts.html
      
      // Update Tab Styles
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Hide the main greeting when viewing a tab
      if (greeting) {
        greeting.classList.add("hidden-greeting");
      }

      // Switch Panes
      panes.forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === `pane-${targetId}`) {
          pane.classList.add("active");
        }
      });

      // Keep the html tag tab classes in sync dynamically for tab-specific global styles
      document.documentElement.classList.forEach(cls => {
        if (cls.startsWith("tab-")) {
          document.documentElement.classList.remove(cls);
        }
      });
      document.documentElement.classList.add("tab-" + targetId);

      // Keep the URL query parameter in sync dynamically (solving Bug 1 on refresh!)
      history.replaceState(null, "", `?tab=${targetId}`);

      // Spawn a small gold/purple sparkle explosion at the tab click
      if (window.triggerStarExplosion) {
        window.triggerStarExplosion(e.clientX, e.clientY);
      }

      // Trigger the mattress roll-in fresh!
      triggerMattressRollIn(400);
    });
  });

  // 2. Click Logo to Return to Homescreen
  if (brandLogo) {
    brandLogo.style.cursor = "pointer";
    brandLogo.addEventListener("click", (e) => {
      // Deselect all tabs
      tabs.forEach(t => t.classList.remove("active"));
      
      // Hide all tab panes
      panes.forEach(pane => pane.classList.remove("active"));

      // Show the main greeting again
      if (greeting) {
        greeting.classList.remove("hidden-greeting");
      }

      // Clear tab classes from html tag
      document.documentElement.classList.forEach(cls => {
        if (cls.startsWith("tab-")) {
          document.documentElement.classList.remove(cls);
        }
      });

      // Clear the query parameter in the URL when returning to the homescreen
      history.replaceState(null, "", window.location.pathname);

      // Spawn celebratory sparks
      if (window.triggerStarExplosion) {
        window.triggerStarExplosion(e.clientX, e.clientY);
      }

      // Trigger the mattress roll-in fresh!
      triggerMattressRollIn(400);
    });
  }
}

/* ==========================================================================
   Abstract Rolling Mattress Interactive Click Toggle Handler
   ========================================================================== */
function initMattressRoll() {
  const track = document.getElementById("mattress-track");
  const mattress = document.getElementById("rolling-mattress");
  if (!track || !mattress) return;

  track.addEventListener("click", (e) => {
    const isRolledIn = mattress.classList.contains("rolled-in");
    const coupleSil = mattress.querySelector(".couple-silhouette-wrapper");
    const couplePush = mattress.querySelector(".couple-pushing-wrapper");

    // Spawn a spark explosion at click location
    if (window.triggerStarExplosion) {
      window.triggerStarExplosion(e.clientX, e.clientY);
    }

    if (isRolledIn) {
      // Toggle to roll back off-screen left
      // 1. Instantly snap couple back to pushing behind the mattress
      if (coupleSil) {
        coupleSil.classList.remove("active-parallax");
        coupleSil.classList.remove("hopped-in");
        coupleSil.style.transform = ""; // Reset inline style so CSS transitions/animations run
      }
      if (couplePush) {
        couplePush.classList.remove("hopped-in");
      }
      
      // 2. Remove rolled-in class from mattress. CSS will handle the 300ms delay!
      mattress.classList.remove("rolled-in");
      mattress.classList.add("rolled-out");
    } else {
      // Toggle to roll back in
      // 1. Ensure couple is in pushing state initially
      if (coupleSil) {
        coupleSil.classList.remove("active-parallax");
        coupleSil.classList.remove("hopped-in");
        coupleSil.style.transform = "";
      }
      if (couplePush) {
        couplePush.classList.remove("hopped-in");
      }

      mattress.classList.remove("rolled-out");
      mattress.classList.add("rolled-in");

      // Spawn arrival star explosions & hop in couple after rolling finishes (5.5s)
      setTimeout(() => {
        if (!mattress.classList.contains("rolled-in")) return;
        const wheelLeft = mattress.querySelector(".wheel-left");
        const wheelRight = mattress.querySelector(".wheel-right");
        if (wheelLeft && wheelRight && window.triggerStarExplosion) {
          const rectL = wheelLeft.getBoundingClientRect();
          const rectR = wheelRight.getBoundingClientRect();
          window.triggerStarExplosion(rectL.left + rectL.width / 2, rectL.top + rectL.height / 2);
          window.triggerStarExplosion(rectR.left + rectR.width / 2, rectR.top + rectR.height / 2);
        }

        // Hop in!
        if (coupleSil) {
          coupleSil.classList.add("hopped-in");
        }
        if (couplePush) {
          couplePush.classList.add("hopped-in");
        }
          
        // Let the hop bounce settle (900ms) before allowing interactive mouse parallax
        setTimeout(() => {
          if (mattress.classList.contains("rolled-in") && coupleSil && coupleSil.classList.contains("hopped-in")) {
            coupleSil.classList.add("active-parallax");
          }
        }, 900);
      }, 5500);
    }
  });
}

/* ==========================================================================
   Tactile Reusable Rolling Mattress Core Engine
   ========================================================================== */
function triggerMattressRollIn(delay = 1000) {
  const mattress = document.getElementById("rolling-mattress");
  if (!mattress) return;
  const coupleSil = mattress.querySelector(".couple-silhouette-wrapper");
  const couplePush = mattress.querySelector(".couple-pushing-wrapper");

  // Disable transition temporarily so it snaps off-screen instantly
  mattress.style.transition = "none";
  mattress.classList.remove("rolled-in");
  mattress.classList.add("rolled-out");

  if (coupleSil) {
    coupleSil.style.transition = "none";
    coupleSil.classList.remove("active-parallax");
    coupleSil.classList.remove("hopped-in");
    coupleSil.style.transform = "";
  }
  if (couplePush) {
    couplePush.style.transition = "none";
    couplePush.classList.remove("hopped-in");
  }

  // Force reflow
  void mattress.offsetWidth;
  if (coupleSil) void coupleSil.offsetWidth;
  if (couplePush) void couplePush.offsetWidth;

  // Restore original transitions
  mattress.style.transition = "";
  if (coupleSil) coupleSil.style.transition = "";
  if (couplePush) couplePush.style.transition = "";

  // Wait delay before starting roll-in
  setTimeout(() => {
    // Ensure it wasn't toggled manually during delay
    if (mattress.classList.contains("rolled-in")) return;

    mattress.classList.remove("rolled-out");
    mattress.classList.add("rolled-in");

    // Trigger starry explosions and hop-in couple after rolling finishes (6.5s to ensure they are done pushing)
    setTimeout(() => {
      if (!mattress.classList.contains("rolled-in")) return;
      const wheelLeft = mattress.querySelector(".wheel-left");
      const wheelRight = mattress.querySelector(".wheel-right");
      if (wheelLeft && wheelRight && window.triggerStarExplosion) {
        const rectL = wheelLeft.getBoundingClientRect();
        const rectR = wheelRight.getBoundingClientRect();
        window.triggerStarExplosion(rectL.left + rectL.width / 2, rectL.top + rectL.height / 2);
        window.triggerStarExplosion(rectR.left + rectR.width / 2, rectR.top + rectR.height / 2);
      }

      // Hop in!
      if (coupleSil) {
        coupleSil.classList.add("hopped-in");
      }
      if (couplePush) {
        couplePush.classList.add("hopped-in");
      }

      // Let the hop bounce settle (900ms) before allowing interactive mouse parallax
      setTimeout(() => {
        if (mattress.classList.contains("rolled-in") && coupleSil && coupleSil.classList.contains("hopped-in")) {
          coupleSil.classList.add("active-parallax");
        }
      }, 900);
    }, 6500);
  }, delay);
}

/* ==========================================================================
   Dynamic Ultra-Dense Grass Field Generator (Thin, lush & screen-spanning)
   ========================================================================== */
function initGrassField() {
  const container = document.querySelector(".grass-blades");
  if (!container) return;
  
  // Re-generate blades to fill the entire viewport width with ultra-dense thin blades!
  const generateBlades = () => {
    container.innerHTML = "";
    
    // Generate enough blades to spread out evenly across the screen
    const screenWidth = window.innerWidth;
    const bladeCount = Math.ceil(screenWidth / 3);
    
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < bladeCount; i++) {
      const span = document.createElement("span");
      span.className = "grass-blade";
      fragment.appendChild(span);
    }
    container.appendChild(fragment);
  };

  generateBlades();
  
  // Clean re-render on resize to keep it 100% full screen spanning!
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(generateBlades, 150);
  });
}
