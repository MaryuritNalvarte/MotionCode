import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const resizeRef = useRef<() => void>(() => {});

  const palette = [
    "#8b5cf6", "#a78bfa", "#7c3aed",
    "#3b82f6", "#60a5fa",
    "#06b6d4", "#22d3ee",
    "#ec4899", "#f472b6",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeRef.current = resize;
    resize();
    window.addEventListener("resize", resize);

    const makeParticle = (): Particle => ({
      x: Math.random() * (canvas.offsetWidth || 1200),
      y: Math.random() * (canvas.offsetHeight || 800),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: Math.random() * 0.5 + 0.15,
      life: Math.random() * 200,
      maxLife: 200 + Math.random() * 200,
    });

    // Initialize particles
    particlesRef.current = Array.from({ length: 100 }, makeParticle);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const particles = particlesRef.current;

      // Draw connections first
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 110) * 0.12;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw + update particles
      particles.forEach((p, idx) => {
        // Mouse repulsion
        const mdx = mouseRef.current.x - p.x;
        const mdy = mouseRef.current.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 130 && mDist > 0) {
          const force = (130 - mDist) / 130;
          p.vx -= (mdx / mDist) * force * 0.08;
          p.vy -= (mdy / mDist) * force * 0.08;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.8;

        // Breathe alpha
        const lifeFrac = (p.life % p.maxLife) / p.maxLife;
        const breathe = Math.sin(lifeFrac * Math.PI);
        const currentAlpha = p.alpha * (0.3 + breathe * 0.7);

        // Wrap edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // Soft outer glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        grd.addColorStop(0, p.color + "44");
        grd.addColorStop(1, "transparent");
        ctx.save();
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Core dot
        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }}
    />
  );
}
