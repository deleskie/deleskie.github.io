const header = document.querySelector("[data-nav]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".primary-nav a");
const canvas = document.querySelector("#energy-field");
const context = canvas ? canvas.getContext("2d") : null;

let width = 0;
let height = 0;
let points = [];
let frame = 0;

const setScrolledState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeMenu = () => {
  if (!header || !menuToggle) {
    return;
  }

  header.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

const resizeCanvas = () => {
  if (!canvas || !context) {
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const count = Math.max(54, Math.floor((width * height) / 18000));
  points = Array.from({ length: count }, (_, index) => ({
    x: (index * 137.5) % width,
    y: ((index * 91.7) % height) + Math.sin(index) * 12,
    size: 0.8 + (index % 5) * 0.28,
    phase: index * 0.39
  }));
};

const drawField = () => {
  if (!canvas || !context) {
    return;
  }

  frame += 0.005;
  context.clearRect(0, 0, width, height);

  context.strokeStyle = "rgba(241, 231, 209, 0.08)";
  context.lineWidth = 1;
  points.forEach((point, index) => {
    const driftX = Math.sin(frame * 1.8 + point.phase) * 18;
    const driftY = Math.cos(frame * 1.4 + point.phase) * 14;
    const x = point.x + driftX;
    const y = point.y + driftY;

    context.beginPath();
    context.arc(x, y, point.size, 0, Math.PI * 2);
    context.fillStyle = index % 7 === 0 ? "rgba(180, 107, 55, 0.38)" : "rgba(241, 231, 209, 0.22)";
    context.fill();

    if (index % 3 === 0) {
      const next = points[(index + 9) % points.length];
      const nextX = next.x + Math.sin(frame * 1.8 + next.phase) * 18;
      const nextY = next.y + Math.cos(frame * 1.4 + next.phase) * 14;
      const distance = Math.hypot(nextX - x, nextY - y);

      if (distance < 230) {
        context.beginPath();
        context.moveTo(x, y);
        context.quadraticCurveTo((x + nextX) / 2, (y + nextY) / 2 - 22, nextX, nextY);
        context.stroke();
      }
    }
  });

  window.requestAnimationFrame(drawField);
};

const loadImage = (source) =>
  new Promise((resolve) => {
    if (!source) {
      resolve(false);
      return;
    }

    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = source;
  });

const setArtSource = async (element) => {
  const source = element.dataset.artSrc;
  const isLoaded = await loadImage(source);

  if (!isLoaded) {
    element.classList.add("missing-art");
    return;
  }

  element.style.setProperty("--art-image", `url("${source}")`);
  element.classList.add("has-art");
};

const setPageArt = async (property, source) => {
  const isLoaded = await loadImage(source);

  if (isLoaded) {
    document.documentElement.style.setProperty(property, `url("${source}")`);
  }
};

const hardenAssetLinks = async () => {
  const links = document.querySelectorAll("[data-asset-link]");

  links.forEach(async (link) => {
    const source = link.dataset.assetHref || link.getAttribute("href");
    const isLoaded = await loadImage(source);

    if (isLoaded && source) {
      link.setAttribute("href", source);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
      link.removeAttribute("aria-disabled");
      link.classList.remove("is-disabled");

      if (link.dataset.readyLabel) {
        link.textContent = link.dataset.readyLabel;
      }

      return;
    }

    link.removeAttribute("href");
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("aria-disabled", "true");
    link.classList.add("is-disabled");

    if (link.dataset.missingLabel) {
      link.textContent = link.dataset.missingLabel;
    }
  });
};

const hydrateArt = () => {
  document.querySelectorAll("[data-art-src]").forEach(setArtSource);
  setPageArt("--hero-body-art", "assets/daemon-reference-05-body-map-sleeve.jpg");
  setPageArt("--hero-detail-art", "assets/daemon-reference-01-energy-bird.jpg");
  setPageArt("--archive-art", "assets/daemon-reference-02-soul-print-article.jpg");
  hardenAssetLinks();
};

setScrolledState();
resizeCanvas();
drawField();
hydrateArt();

window.addEventListener("scroll", setScrolledState, { passive: true });
window.addEventListener("resize", resizeCanvas);

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
