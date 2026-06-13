// Fluid Ripple Click
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ripples = [];

canvas.addEventListener('click', (e) => {
  ripples.push({
    x: e.clientX,
    y: e.clientY,
    radius: 0,
    maxRadius: 200,
    alpha: 1,
  });
});

function animate() {
  ctx.fillStyle = 'rgba(5, 8, 22, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.radius += 5;
    r.alpha -= 0.02;

    if (r.alpha <= 0) {
      ripples.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(6, 182, 212, ${r.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}

animate();
