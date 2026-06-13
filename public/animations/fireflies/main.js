// Firefly Forest
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireflies = [];

for (let i = 0; i < 50; i++) {
  fireflies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    radius: Math.random() * 2 + 1,
    alpha: Math.random(),
    pulseSpeed: Math.random() * 0.02 + 0.01,
  });
}

function animate() {
  ctx.fillStyle = 'rgba(5, 8, 22, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireflies.forEach(f => {
    f.x += f.vx;
    f.y += f.vy;
    f.alpha += f.pulseSpeed;

    if (f.alpha > 1 || f.alpha < 0) {
      f.pulseSpeed *= -1;
    }

    if (f.x < 0 || f.x > canvas.width) f.vx *= -1;
    if (f.y < 0 || f.y > canvas.height) f.vy *= -1;

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(16, 185, 129, ${Math.abs(f.alpha)})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#10b981';
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  requestAnimationFrame(animate);
}

animate();
