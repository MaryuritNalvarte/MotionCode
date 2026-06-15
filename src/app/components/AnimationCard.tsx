// Importaciones necesarias para el componente AnimationCard
import { useState } from "react";
import { Eye, Code2 } from "lucide-react";
import type { AnimationProject } from "../utils/types";

// Estilos de dificultad para badges - colores según nivel
const DIFF_STYLE = {
  Beginner:     { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.25)" },
  Intermediate: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  Advanced:     { bg: "rgba(239,68,68,0.12)",  text: "#ef4444",  border: "rgba(239,68,68,0.25)"  },
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
  const diff = DIFF_STYLE[project.difficulty];

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
        {/* Ubicación para insertar código de Google AdSense si se desea monetizar el preview de tarjeta */}
        <iframe
          src={`/content/${project.slug}/index.html`}
          sandbox="allow-scripts allow-same-origin"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          title={`${project.title} Preview`}
          loading="lazy"
        />

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
      </div>
    </article>
  );
}
