const header = document.querySelector("[data-nav]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".primary-nav a");
const canvas = document.querySelector("#energy-field");
const context = canvas.getContext("2d");

let width = 0;
let height = 0;
let points = [];
let frame = 0;

const setScrolledState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeMenu = () => {
  header.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

const resizeCanvas = () => {
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

setScrolledState();
resizeCanvas();
drawField();

window.addEventListener("scroll", setScrolledState, { passive: true });
window.addEventListener("resize", resizeCanvas);

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
