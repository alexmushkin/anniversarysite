/* ==========================================================================
   Carolina Anniversary Site - Gifts Interactive Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initGiftsCanvas();
  initGiftsInteractions();
  initParallaxEffects();
});

/* ==========================================================================
   Tactile Illustrated Sticker Quadrant Peeling Interaction
   ========================================================================== */
function initGiftsInteractions() {
  const stickerCards = document.querySelectorAll(".sticker-card");

  stickerCards.forEach(card => {
    const peelLayer = card.querySelector(".sticker-peel-layer");
    const revealCard = card.querySelector(".sticker-reveal-card");

    // Peeling sticker layer open
    if (peelLayer) {
      peelLayer.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Add peel class to sticker card container
        card.classList.add("peeled");
        
        // Trigger a gorgeous starburst explosion exactly at coordinates!
        if (window.triggerStarExplosion) {
          const rect = peelLayer.getBoundingClientRect();
          window.triggerStarExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
          
          // Secondary delay burst for extra celebratory pop feel
          setTimeout(() => {
            window.triggerStarExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2 - 40);
          }, 180);
        }
      });
    }

    // Re-covering ("putting it back") when clicking the revealed gift card
    if (revealCard) {
      revealCard.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (card.classList.contains("peeled")) {
          // Remove peel class to cover the card back up
          card.classList.remove("peeled");
          
          // Trigger a beautiful starburst explosion exactly at user click position!
          if (window.triggerStarExplosion) {
            window.triggerStarExplosion(e.clientX, e.clientY);
            
            // Secondary delay burst for a nice springy snap-back effect
            setTimeout(() => {
              window.triggerStarExplosion(e.clientX, e.clientY - 25);
            }, 150);
          }
        }
      });
    }
  });
}

/* ==========================================================================
   Subtle Parallax Background Elements Tilt
   ========================================================================== */
function initParallaxEffects() {
  const accents = document.querySelectorAll(".floating-accent");
  
  window.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    // Subtle parallax float for background items
    accents.forEach(acc => {
      const depth = parseFloat(acc.getAttribute("data-depth")) || 0.1;
      const xShift = deltaX * depth;
      const yShift = deltaY * depth;
      acc.style.transform = `translate(${xShift}px, ${yShift}px)`;
    });
  });
}

/* ==========================================================================
   Tactile Sparkle Dust Particle Canvas System (Synced with App)
   ========================================================================== */
function initGiftsCanvas() {
  const canvas = document.getElementById("fun-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const cursorTrail = [];
  const explosions = [];

  class BokehParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
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
      this.colorType = Math.random() > 0.5 ? 0 : 1;
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
        ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
      } else {
        ctx.fillStyle = `rgba(116, 185, 255, ${this.opacity})`;
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

  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2.5;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.speedY = (Math.random() - 0.5) * 1.2 - 0.2;
      this.opacity = 1;
      this.decay = Math.random() * 0.035 + 0.02;
      this.colorType = Math.random() > 0.4 ? 0 : 1;
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
        ctx.fillStyle = `rgba(116, 185, 255, ${this.opacity})`; // Sky Blue
      } else {
        ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`; // Pastel Violet
      }
      drawSparklePath(ctx, this.size);
      ctx.restore();
    }
  }

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
      if (colorIndex === 0) ctx.fillStyle = '#74b9ff'; // sky blue
      else if (colorIndex === 1) ctx.fillStyle = '#a29bfe'; // pastel violet
      else ctx.fillStyle = '#ff6b4a'; // coral orange confetti
      
      drawSparklePath(ctx, this.size);
      ctx.restore();
    }
  }

  // Populate ambient particles
  for (let i = 0; i < 10; i++) particles.push(new BokehParticle());
  for (let i = 0; i < 12; i++) particles.push(new TwinkleStar());

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
    const burstCount = 45;
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
  ctx.fillStyle = `rgba(251, 197, 49, ${opacity})`;
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
