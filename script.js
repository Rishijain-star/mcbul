const initMenu = () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
};

const initHeaderState = () => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
};

const initFloatingButton = () => {
  const fab = document.querySelector(".whatsapp-float");

  if (!fab) {
    return;
  }

  fab.addEventListener("mousemove", (event) => {
    const bounds = fab.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    const moveX = x / 7;
    const moveY = y / 7;

    fab.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.07)`;
  });

  fab.addEventListener("mouseleave", () => {
    fab.style.transform = "";
  });
};

const initRevealAnimations = () => {
  const items = document.querySelectorAll(".reveal");

  if (!items.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    observer.observe(item);
  });
};

const initVisionParticles = () => {
  const canvas = document.getElementById("vision-particles");

  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  const particles = [];
  const particleCount = 34;

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const section = canvas.parentElement;
    const width = section.clientWidth;
    const height = section.clientHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const createParticle = () => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    radius: Math.random() * 2.2 + 0.8,
    speedX: (Math.random() - 0.5) * 0.32,
    speedY: (Math.random() - 0.5) * 0.32,
    alpha: Math.random() * 0.45 + 0.18,
  });

  const fillParticles = () => {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push(createParticle());
    }
  };

  const draw = () => {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.clientWidth) {
        particle.speedX *= -1;
      }

      if (particle.y < 0 || particle.y > canvas.clientHeight) {
        particle.speedY *= -1;
      }

      context.beginPath();
      context.fillStyle = `rgba(121, 214, 255, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const neighbor = particles[next];
        const dx = particle.x - neighbor.x;
        const dy = particle.y - neighbor.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 110) {
          context.beginPath();
          context.strokeStyle = `rgba(120, 208, 255, ${0.12 - distance / 1000})`;
          context.lineWidth = 1;
          context.moveTo(particle.x, particle.y);
          context.lineTo(neighbor.x, neighbor.y);
          context.stroke();
        }
      }
    });

    window.requestAnimationFrame(draw);
  };

  resize();
  fillParticles();
  draw();

  window.addEventListener("resize", () => {
    resize();
    fillParticles();
  });
};

const initContactForm = () => {
  const form = document.getElementById("contactForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const subject = encodeURIComponent(`New inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    window.location.href = `mailto:info@mcbul.com?subject=${subject}&body=${body}`;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initHeaderState();
  initFloatingButton();
  initRevealAnimations();
  initVisionParticles();
  initContactForm();
});
