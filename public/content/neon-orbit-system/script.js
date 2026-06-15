// Interactive 3D tilt on mouse move
const system = document.querySelector('.orbit-system');
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  targetX = (e.clientY - cy) / cy * -20;
  targetY = (e.clientX - cx) / cx * 20;
});

function lerp(a, b, t) { return a + (b - a) * t; }

(function animate() {
  currentX = lerp(currentX, targetX, 0.06);
  currentY = lerp(currentY, targetY, 0.06);
  system.style.transform =
    `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
  requestAnimationFrame(animate);
})();

document.querySelector('.core').addEventListener('click', () => {
  document.querySelectorAll('.ring').forEach((ring, i) => {
    ring.style.transition = 'transform 0.3s ease';
    ring.style.transform += ` scale(${1.2 - i * 0.05})`;
    setTimeout(() => ring.style.transform = '', 300 + i * 50);
  });
});
