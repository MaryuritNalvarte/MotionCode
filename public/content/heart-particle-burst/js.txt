// Heart Particle Burst
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1,
      color: Math.random() > 0.5 ? '#f43f5e' : '#ec4899',
    });
  }
});

function animate() {
  ctx.fillStyle = 'rgba(5, 8, 22, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.life -= 0.02;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(animate);
}

animate();
