// Confetti Burst
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confetti = [];
const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#3b82f6'];

canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15 - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      life: 1,
    });
  }
});

function animate() {
  ctx.fillStyle = 'rgba(5, 8, 22, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.x += c.vx;
    c.y += c.vy;
    c.vy += 0.3;
    c.rotation += c.rotationSpeed;
    c.life -= 0.01;

    if (c.life <= 0) {
      confetti.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation * Math.PI / 180);
    ctx.fillStyle = c.color;
    ctx.globalAlpha = c.life;
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(animate);
}

animate();
