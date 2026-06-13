// Importaciones necesarias para el componente AnimationCard
import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { Eye, Star, Heart, Code2, Flame, Sparkles } from "lucide-react";
import type { AnimationProject } from "./data";

export type { AnimationProject };

// Estilos de dificultad para badges - colores según nivel
const DIFF_STYLE = {
  Beginner:     { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.25)" },
  Intermediate: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  Advanced:     { bg: "rgba(239,68,68,0.12)",  text: "#ef4444",  border: "rgba(239,68,68,0.25)"  },
};

/* ─── Mini-previews en vivo ─── */

/**
 * PreviewOrbit - animación de órbita planetaria
 * Muestra un núcleo central pulsante con anillos orbitales
 */
export function PreviewOrbit({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <style>{`
        @keyframes mc-orbit { to { transform: rotate(360deg); } }
        @keyframes mc-core-pulse {
          0%,100% { box-shadow: 0 0 8px ${from}, 0 0 20px ${from}88; }
          50%      { box-shadow: 0 0 16px ${from}, 0 0 40px ${from}88; }
        }
      `}</style>
      <div className="w-3 h-3 rounded-full" style={{ background: from, animation: "mc-core-pulse 2s ease-in-out infinite" }} />
      {[[55, from, "3s", ""], [88, to, "5s", "reverse"], [120, from, "8s", ""]].map(([size, color, dur, dir], i) => (
        <div key={i} className="absolute rounded-full border" style={{
          width: size as number, height: size as number,
          borderColor: `${color}50`,
          animation: `mc-orbit ${dur} linear infinite ${dir}`,
        }}>
          <div className="absolute w-2.5 h-2.5 rounded-full" style={{
            top: -5, left: "50%", transform: "translateX(-50%)",
            background: color as string, boxShadow: `0 0 8px ${color}`,
          }} />
        </div>
      ))}
    </div>
  );
}

/**
 * PreviewWave - animación de ondas de audio
 * Muestra barras que se animan como un ecualizador de audio
 */
export function PreviewWave({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-full flex items-end justify-center gap-[3px] px-4 pb-4">
      <style>{`@keyframes mc-wave { 0%,100%{transform:scaleY(0.2)} 50%{transform:scaleY(1)} }`}</style>
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} className="flex-1 rounded-full"
          style={{
            height: "60%",
            transformOrigin: "bottom",
            animation: `mc-wave 1.4s ease-in-out ${i * 0.07}s infinite`,
            background: `linear-gradient(to top, ${from}, ${to})`,
            boxShadow: `0 0 4px ${from}66`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * PreviewParticles - animación de partículas con canvas
 * Muestra partículas conectadas con líneas que se mueven y rebotan
 */
export function PreviewParticles({ from, to }: { from: string; to: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 0.5,
      c: Math.random() > 0.5 ? from : to,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        pts.slice(i + 1).forEach((q) => {
          const d = Math.hypot(q.x - p.x, q.y - p.y);
          if (d < 60) {
            ctx.globalAlpha = (1 - d / 60) * 0.18;
            ctx.strokeStyle = p.c;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        });
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = p.c;
        ctx.shadowBlur = 8; ctx.shadowColor = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [from, to]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function PreviewAurora({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <style>{`
        @keyframes mc-aurora1 { 0%,100%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.3)} }
        @keyframes mc-aurora2 { 0%,100%{transform:rotate(360deg) scale(1.2)} 50%{transform:rotate(180deg) scale(0.9)} }
      `}</style>
      <div className="absolute w-full h-full" style={{ background: "#050816" }}>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 60% 50% at 30% 50%, ${from}55, transparent 70%)`,
          animation: "mc-aurora1 6s ease-in-out infinite",
        }} />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 50% 60% at 70% 50%, ${to}44, transparent 70%)`,
          animation: "mc-aurora2 8s ease-in-out infinite",
        }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl" style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
          }} />
        </div>
      </div>
    </div>
  );
}

export function PreviewMatrix({ from, to }: { from: string; to: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols = Math.floor(canvas.width / 14);
    const drops = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコ";
    const draw = () => {
      ctx.fillStyle = "rgba(5,8,22,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = from;
      ctx.font = "12px JetBrains Mono, monospace";
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [from]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function PreviewMorph({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes mc-morph {
          0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
          25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}
          50%{border-radius:50% 60% 30% 40%/30% 60% 70% 40%}
          75%{border-radius:40% 30% 60% 70%/40% 50% 60% 30%}
        }
      `}</style>
      <div className="w-24 h-24" style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        animation: "mc-morph 8s ease-in-out infinite",
        boxShadow: `0 0 30px ${from}66`,
      }} />
    </div>
  );
}

export function PreviewGlitch({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes mc-glitch1 {
          0%,90%,100%{clip-path:inset(0 0 100% 0)}
          2%{clip-path:inset(20% 0 30% 0); transform:translate(-4px,0); color:${from}}
          4%{clip-path:inset(50% 0 10% 0); transform:translate(4px,0); color:${to}}
          6%{clip-path:inset(70% 0 5% 0); transform:translate(0,0)}
        }
        @keyframes mc-flicker { 0%,100%{opacity:1} 50%{opacity:0.85} 75%{opacity:0.95} }
      `}</style>
      <div className="relative text-center">
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "20px", fontWeight: 700, color: "#f0f0ff", position: "relative", animation: "mc-flicker 3s ease-in-out infinite" }}>
          GLITCH
          <div className="absolute inset-0" style={{ animation: "mc-glitch1 4s infinite", color: from }}>GLITCH</div>
        </div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#4b5563", marginTop: 4, letterSpacing: "0.2em" }}>
          SYSTEM.ERROR
        </div>
      </div>
    </div>
  );
}

export function Preview3DCards({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes mc-float3d {
          0%,100%{transform:perspective(400px) rotateX(8deg) rotateY(-8deg) translateY(0)}
          50%{transform:perspective(400px) rotateX(-8deg) rotateY(8deg) translateY(-8px)}
        }
      `}</style>
      <div className="relative" style={{ animation: "mc-float3d 4s ease-in-out infinite", transformStyle: "preserve-3d" }}>
        {[{ s: 70, op: 0.3, off: 10 }, { s: 60, op: 0.5, off: 5 }, { s: 52, op: 1, off: 0 }].map((c, i) => (
          <div key={i} className="rounded-xl absolute"
            style={{
              width: c.s, height: c.s,
              top: c.off, left: c.off,
              opacity: c.op,
              background: `linear-gradient(135deg, ${from}33, ${to}33)`,
              border: `1px solid ${from}44`,
              backdropFilter: "blur(8px)",
              boxShadow: `0 ${c.off}px ${20 + c.off}px rgba(0,0,0,0.3)`,
              position: i === 0 ? "relative" : "absolute",
              transform: `translateZ(${(2 - i) * 10}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function PreviewLoader({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <style>{`
        @keyframes mc-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes mc-spin-r { to{transform:rotate(360deg)} }
      `}</style>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{
              background: i % 2 ? from : to,
              boxShadow: `0 0 8px ${i % 2 ? from : to}`,
              animation: `mc-bounce 1.1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="w-10 h-10 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: from,
          borderRightColor: to,
          animation: "mc-spin-r 1s linear infinite",
          boxShadow: `0 0 12px ${from}66`,
        }}
      />
    </div>
  );
}

export function PreviewTypewriter({ from, to }: { from: string; to: string }) {
  const [step, setStep] = useState(0);
  const strings = ["Hello, World!", "const anim = {};", "/* motion code */"];
  const current = strings[Math.floor(step / 16) % strings.length];
  const charIdx = step % 16;

  useEffect(() => {
    const t = setInterval(() => setStep((s) => s + 1), 120);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-4">
      <div className="rounded-xl w-full px-4 py-3" style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${from}30` }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#4b5563", marginBottom: 4 }}>
          <span style={{ color: from }}>{">"}</span> terminal
        </div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: from, minHeight: "1.2em" }}>
          {current.slice(0, Math.min(charIdx, current.length))}
          <span className="animate-pulse" style={{ color: to }}>|</span>
        </div>
      </div>
    </div>
  );
}

export function PreviewRipple({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes mc-ripple { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(4);opacity:0} }
      `}</style>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {[0, 0.6, 1.2].map((delay) => (
          <div key={delay} className="absolute rounded-full border"
            style={{
              width: 40, height: 40,
              borderColor: from,
              animation: `mc-ripple 2.4s ease-out ${delay}s infinite`,
            }}
          />
        ))}
        <div className="w-4 h-4 rounded-full" style={{ background: from, boxShadow: `0 0 10px ${from}` }} />
      </div>
    </div>
  );
}

export function PreviewMosaic({ from, to }: { from: string; to: string }) {
  const cells = Array.from({ length: 25 }, (_, i) => i);
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <style>{`
        @keyframes mc-mosaic { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
      <div className="grid grid-cols-5 gap-1 w-full">
        {cells.map((i) => (
          <div key={i} className="aspect-square rounded"
            style={{
              background: i % 2 ? from : to,
              opacity: 0.4,
              animation: `mc-mosaic ${1.5 + (i % 3) * 0.5}s ease-in-out ${i * 0.08}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Mapa de componentes de preview - asocia tipos de animación con sus componentes correspondientes
const PREVIEWS: Record<string, (props: { from: string; to: string }) => ReactElement> = {
  orbit:      (p) => <PreviewOrbit {...p} />,
  wave:       (p) => <PreviewWave {...p} />,
  particles:  (p) => <PreviewParticles {...p} />,
  aurora:     (p) => <PreviewAurora {...p} />,
  matrix:     (p) => <PreviewMatrix {...p} />,
  morph:      (p) => <PreviewMorph {...p} />,
  glitch:     (p) => <PreviewGlitch {...p} />,
  cards3d:    (p) => <Preview3DCards {...p} />,
  loader:     (p) => <PreviewLoader {...p} />,
  typewriter: (p) => <PreviewTypewriter {...p} />,
  ripple:     (p) => <PreviewRipple {...p} />,
  mosaic:     (p) => <PreviewMosaic {...p} />,
};

/* ─── Tarjeta de animación ─── */

interface CardProps {
  project: AnimationProject;
  onView: (p: AnimationProject) => void;
}

/**
 * Componente AnimationCard - tarjeta individual de animación
 * Muestra preview, título, categoría, dificultad, creador y estadísticas
 * Incluye botones de like, preview y código
 */
export function AnimationCard({ project, onView }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes);
  const diff = DIFF_STYLE[project.difficulty];
  const PreviewComp = PREVIEWS[project.animationType] ?? PREVIEWS.particles;

  // Manejador de like - evita propagación del evento
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((l) => !l);
    setLikeCount((c) => liked ? c - 1 : c + 1);
  };

  return (
    <article
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-300"
      style={{
        background: "rgba(8,10,28,0.8)",
        border: hovered ? "1px solid rgba(139,92,246,0.45)" : "1px solid rgba(99,62,210,0.14)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.12), 0 0 40px rgba(139,92,246,0.12)"
          : "0 4px 20px rgba(0,0,0,0.25)",
        backdropFilter: "blur(20px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(project)}
    >
      {/* Barra de resplandor superior */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.gradientFrom}80, ${project.gradientTo}80, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Área de preview */}
      <div
        className="relative overflow-hidden"
        style={{ height: 190, background: "rgba(4,5,18,0.9)" }}
      >
        <PreviewComp from={project.gradientFrom} to={project.gradientTo} />

        {/* Badges de estado (NEW, HOT) */}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.isNew && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold"
              style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.4)", color: "#c4b5fd", backdropFilter: "blur(8px)" }}>
              <Sparkles size={8} /> NEW
            </span>
          )}
          {project.isTrending && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold"
              style={{ background: "rgba(236,72,153,0.2)", border: "1px solid rgba(236,72,153,0.35)", color: "#f472b6", backdropFilter: "blur(8px)" }}>
              <Flame size={8} /> HOT
            </span>
          )}
        </div>

        {/* Botón de like */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
          style={{
            background: liked ? "rgba(236,72,153,0.2)" : "rgba(0,0,0,0.5)",
            border: liked ? "1px solid rgba(236,72,153,0.4)" : "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
          onClick={handleLike}
        >
          <Heart size={12} className={liked ? "fill-pink-500 text-pink-500" : "text-gray-400"} />
        </button>

        {/* Overlay de acciones al hover - posicionado en la parte inferior para no tapar la animación */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 transition-all duration-300 p-3"
          style={{
            background: hovered ? "linear-gradient(to top, rgba(4,5,18,0.95), rgba(4,5,18,0.7), transparent)" : "transparent",
            opacity: hovered ? 1 : 0,
            backdropFilter: hovered ? "blur(4px)" : "none",
          }}
        >
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{
              fontFamily: "Inter, sans-serif",
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              color: "#fff",
              boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
            }}
          >
            <Eye size={12} /> Preview
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{
              fontFamily: "Inter, sans-serif",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#e2e8f0",
              backdropFilter: "blur(8px)",
            }}
          >
            <Code2 size={12} /> Code
          </button>
        </div>

        {/* Gradiente en la parte inferior del preview */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: `linear-gradient(to top, rgba(8,10,28,0.9), transparent)` }}
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="flex-1 leading-snug"
            style={{ fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "14px", color: "#e8e8ff" }}
          >
            {project.title}
          </h3>
        </div>

        {/* Badges de categoría y dificultad */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
            style={{ fontFamily: "Inter, sans-serif", background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.22)" }}>
            {project.categoryIcon} {project.category}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
            style={{ fontFamily: "Inter, sans-serif", background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
            {project.difficulty}
          </span>
        </div>

        {/* Estadísticas (estrellas y vistas) */}
        <div className="flex items-center justify-end pt-1 mt-auto"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#4b5563" }}>
              <Star size={9} className="text-yellow-500 fill-yellow-500" />
              {project.stars}
            </span>
            <span className="flex items-center gap-1" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#4b5563" }}>
              <Eye size={9} />
              {project.views >= 1000 ? `${(project.views / 1000).toFixed(1)}k` : project.views}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
