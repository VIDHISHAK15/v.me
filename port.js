// Progress bar
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const prog = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  document.getElementById('progressBar').style.width = prog + '%';
});

// Coordinate readout
document.addEventListener('mousemove', (e) => {
  const x = String(Math.round(e.clientX)).padStart(4, '0');
  const y = String(Math.round(e.clientY)).padStart(4, '0');
  document.getElementById('coordReadout').textContent = `X:${x} Y:${y}`;
});

// Skill bar animation on scroll
const skillTracks = document.querySelectorAll('.skill-track');
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('animated'); });
}, { threshold: 0.3 });
skillTracks.forEach((t) => skillObs.observe(t));

// Experience items fade in
const expItems = document.querySelectorAll('.exp-item');
const expObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 150);
    }
  });
}, { threshold: 0.3 });
expItems.forEach((i) => expObs.observe(i));

// Section title typewriter on scroll
const secTitles = document.querySelectorAll('.sec-title');
const titleObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = '1';
      const text = e.target.textContent;
      e.target.textContent = '';
      let i = 0;
      const t = setInterval(() => {
        e.target.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(t);
      }, 40);
    }
  });
}, { threshold: 0.5 });
secTitles.forEach((t) => titleObs.observe(t));

// Blueprint computer typewriter on scroll
const blueprintComputer = document.querySelector('.blueprint-computer');
if (blueprintComputer) {
  const blueprintObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = '1';
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });
  blueprintObs.observe(blueprintComputer);
}

// About section specs animation
const specs = document.querySelector('.about-specs');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            specs.classList.add('animate');
        } else {
            specs.classList.remove('animate');
        }
    });
}, {
    threshold: 0.2
});

observer.observe(specs);

// Click sound effect
const clickSound = new Audio("matthewvakaliuk73627-mouse-click-290204.mp3");

document.addEventListener("click", (e) => {
  if (
    e.target.closest(".nav-links a, .form-submit, .btn-primary, .btn-ghost, .resume-badge, .writing-title a,.nav-toggle,.nav-theme-toggle,.contact-links a,.flow-card")
  ) {
    const sound = clickSound.cloneNode();
    sound.play().catch(() => {});
  }
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "day") {
  document.body.classList.add("day-mode");
}

themeToggle.addEventListener("click", () => {
  const isDay = document.body.classList.toggle("day-mode");
  localStorage.setItem("theme", isDay ? "day" : "night");
});

// Contact form email sending

const emailConfig = {
  serviceId: 'service_w35jr8u',
  templateId: 'template_q3o7for',
  publicKey: '5fNLf6MpCw3gT2Gmv'
};

const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');
const submitButton = document.querySelector('.form-submit');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!window.emailjs) {
      if (formStatus) formStatus.textContent = 'TRANSMISSION FAILED: Email service unavailable.';
      return;
    }

    const formData = new FormData(contactForm);
    const templateParams = {
      sender: formData.get('sender'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'TRANSMITTING...';
    }
    if (formStatus) formStatus.textContent = 'TRANSMISSION IN PROGRESS...';

    try {
      await window.emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

      contactForm.reset();
      if (formStatus) formStatus.textContent = 'TRANSMISSION RECEIVED. THANK YOU.';
    } catch (error) {
      console.error('EmailJS send failed:', error);
      if (formStatus) formStatus.textContent = 'TRANSMISSION FAILED. PLEASE TRY AGAIN.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'TRANSMIT MESSAGE ↗';
      }
    }
  });
}


// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const flowSection = document.querySelector('.photo-flow');
const flowCards = document.querySelectorAll('.flow-card');

if (flowSection && flowCards.length) {
  const activeIndex = { value: 0 };
  const state = new Map();
  const velocity = new Map();
  const idleTarget = 0.95;
  const activeTarget = 5.6;
  const stiffness = 0.11;
  const damping = 0.72;

  flowCards.forEach((card, index) => {
    state.set(card, index === 0 ? activeTarget : idleTarget);
    velocity.set(card, 0);
    card.style.flexGrow = String(index === 0 ? activeTarget : idleTarget);

    const activate = () => {
      activeIndex.value = index;
      flowCards.forEach((item, itemIndex) => {
        item.classList.toggle('is-active', itemIndex === index);
        item.setAttribute('aria-pressed', String(itemIndex === index));
      });
      if (!animationId) {
        animationId = requestAnimationFrame(animateFlow);
      }
    };

    card.addEventListener('mouseenter', activate);
    card.addEventListener('focus', activate);
    card.addEventListener('click', activate);
  });

  flowSection.addEventListener('mouseleave', () => {
    activeIndex.value = 0;
    flowCards.forEach((card, index) => {
      card.classList.toggle('is-active', index === 0);
      card.setAttribute('aria-pressed', String(index === 0));
    });
    if (!animationId) {
      animationId = requestAnimationFrame(animateFlow);
    }
  });

  let animationId = null;

  function animateFlow() {
    let running = false;

    flowCards.forEach((card, index) => {
      const target = index === activeIndex.value ? activeTarget : idleTarget;
      const current = state.get(card) ?? idleTarget;
      const currentVelocity = velocity.get(card) ?? 0;
      const springForce = (target - current) * stiffness;
      const nextVelocity = (currentVelocity + springForce) * damping;
      const nextValue = current + nextVelocity;

      state.set(card, nextValue);
      velocity.set(card, nextVelocity);
      card.style.flexGrow = String(nextValue);

      if (Math.abs(target - nextValue) > 0.01 || Math.abs(nextVelocity) > 0.01) {
        running = true;
      } else {
        state.set(card, target);
        velocity.set(card, 0);
        card.style.flexGrow = String(target);
      }
    });

    if (running) {
      animationId = requestAnimationFrame(animateFlow);
    } else {
      animationId = null;
    }
  }

  animateFlow();
}


// Hero subtitle typewriter

const heroTitles = [
  "> AI Engineer · Data Scientist · Design Technologist"
];

const heroTypewriter = document.getElementById("heroTypewriter");

if (heroTypewriter) {

    let word = 0;
    let letter = 0;
    let deleting = false;

    function animateHeroTitle() {

        const current = heroTitles[word];

        if (!deleting) {

            heroTypewriter.textContent =
                current.substring(0, letter + 1);

            letter++;

            if (letter === current.length) {
                deleting = true;
                setTimeout(animateHeroTitle, 1800);
                return;
            }

            setTimeout(animateHeroTitle, 75);

        } else {

            heroTypewriter.textContent =
                current.substring(0, letter - 1);

            letter--;

            if (letter === 0) {

                deleting = false;
                word = (word + 1) % heroTitles.length;

                setTimeout(animateHeroTitle, 350);
                return;
            }

            setTimeout(animateHeroTitle, 40);
        }
    }

    animateHeroTitle();
}
/* Hero "system operator" widget — eye tracking, idle blink,
   and the Pac-Man dot-loading → HELLO! sequence on the CRT screen. */
(function () {
  const eyeL = document.getElementById('opEyeL');
  const eyeR = document.getElementById('opEyeR');
  const screen = document.getElementById('opScreen');
  const pac = document.getElementById('opPac');
  const hello = document.getElementById('opHello');

  if (!eyeL || !eyeR || !screen || !pac || !hello) return; // widget not on this page

  /* ---- eyes follow the cursor, gently ---- */
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = Math.max(-2, Math.min(2, (e.clientX - cx) / 140));
    const dy = Math.max(-2, Math.min(2, (e.clientY - cy) / 140));
    eyeL.style.transform = `translate(${dx}px, ${dy}px)`;
    eyeR.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  /* ---- idle blink, randomized timing so it doesn't feel mechanical ---- */
  function blink() {
    [eyeL, eyeR].forEach((el) => el.classList.add('op-blink'));
    setTimeout(() => {
      [eyeL, eyeR].forEach((el) => el.classList.remove('op-blink'));
    }, 180);
    setTimeout(blink, 2500 + Math.random() * 3000);
  }
  setTimeout(blink, 1500);

  /* ---- Pac-Man loading loop: dots 1-4 appear, pac-man eats them, HELLO! ---- */
  const track = screen.querySelector('.op-track');
  const dots = Array.from(track.querySelectorAll('.op-dot'));

  function runCycle() {
    // reset state
    dots.forEach((d) => d.classList.remove('show', 'eaten'));
    hello.classList.remove('show');
    pac.style.transition = 'none';
    pac.style.left = (dots[0].offsetLeft - 24) + 'px';
    pac.style.opacity = '0';
    pac.classList.remove('chomping');
    void pac.offsetWidth; // force reflow so the next transition applies cleanly
    pac.style.transition = '';

    // phase 1 — dots appear one by one
    const dotStagger = 160;
    dots.forEach((d, i) => {
      setTimeout(() => d.classList.add('show'), 200 + i * dotStagger);
    });

    const dotsSettleAt = 200 + dots.length * dotStagger + 300;

    // phase 2 — pac-man chomps across
    setTimeout(() => {
      pac.style.opacity = '1';
      pac.classList.add('chomping');

      const travelMs = 1100; // was 900 — slowed by 0.2s per feedback
      pac.style.transitionDuration = travelMs + 'ms';
      pac.style.left = (track.offsetWidth + 12) + 'px';

      dots.forEach((d, i) => {
        const arriveAt = (travelMs / dots.length) * (i + 1) - 80;
        setTimeout(() => {
          d.classList.remove('show');
          d.classList.add('eaten');
        }, Math.max(0, arriveAt));
      });

      // phase 3 — HELLO! appears
      setTimeout(() => {
        pac.classList.remove('chomping');
        pac.style.opacity = '0';
        hello.classList.add('show');

        // phase 4 — hold, then reset and loop
        setTimeout(() => {
          hello.classList.remove('show');
          setTimeout(runCycle, 500);
        }, 2400);
      }, travelMs + 150);
    }, dotsSettleAt);
  }

  runCycle();
})();