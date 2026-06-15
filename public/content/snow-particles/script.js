// Snow Particles
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snowflakes = [];

for (let i = 0; i < 100; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    speed: Math.random() * 2 + 1,
    wind: Math.random() * 2 - 1,
  });
}

function animate() {
  ctx.fillStyle = 'rgba(5, 8, 22, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snowflakes.forEach(s => {
    s.y += s.speed;
    s.x += s.wind;

    if (s.y > canvas.height) {
      s.y = -10;
      s.x = Math.random() * canvas.width;
    }

    if (s.x > canvas.width) s.x = 0;
    if (s.x < 0) s.x = canvas.width;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
