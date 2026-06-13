// Importaciones necesarias para el componente NetflixSection
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { allAnimations } from "../utils/data-bridge";
import { NETFLIX_ROWS } from "./data";
import type { AnimationProject } from "../utils/types";
import { AnimationCard } from "./AnimationCard";
import { useLang } from "./LangContext";

interface RowProps {
  rowId: string;
  label: string;
  items: AnimationProject[];
  onViewProject: (p: AnimationProject) => void;
  onSeeAll?: () => void;
}

/**
 * Componente NetflixRow - fila horizontal de animaciones estilo Netflix
 */
function NetflixRow({ rowId, label, items, onViewProject, onSeeAll }: RowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  if (items.length === 0) return null;

  const CARD_W = 260; // ancho aproximado de tarjeta + gap

  // Función para desplazamiento horizontal
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  // Manejar evento de scroll para mostrar/ocultar flechas
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  return (
    <div className="relative group/row py-2">
      {/* Encabezado de fila */}
      <div className="flex items-center justify-between px-5 sm:px-8 mb-4">
        <div className="flex items-center gap-3">
          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#f0f0ff",
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </h2>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              color: "#374151",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              paddingLeft: 10,
            }}
          >
            {items.length} elementos
          </span>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="flex items-center gap-1.5 text-xs font-medium transition-all hover:gap-2.5 duration-200"
            style={{ fontFamily: "Inter, sans-serif", color: "#6b5de3" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa"}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#6b5de3"}
          >
            Ver todo <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* Flechas de scroll */}
      {canLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover/row:opacity-100"
          style={{
            background: "rgba(8,10,28,0.95)",
            border: "1px solid rgba(139,92,246,0.35)",
            color: "#c4b5fd",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover/row:opacity-100"
          style={{
            background: "rgba(8,10,28,0.95)",
            border: "1px solid rgba(139,92,246,0.35)",
            color: "#c4b5fd",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Desvanecimiento izquierdo */}
      {canLeft && (
        <div
          className="absolute left-0 top-8 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #050816, transparent)" }}
        />
      )}
      {/* Desvanecimiento derecho */}
      {canRight && (
        <div
          className="absolute right-0 top-8 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #050816, transparent)" }}
        />
      )}

      {/* Fila desplazable */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto pb-3"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingLeft: "clamp(20px, 2rem, 32px)",
          paddingRight: "clamp(20px, 2rem, 32px)",
        }}
      >
        <style>{`.netflix-row::-webkit-scrollbar { display: none; }`}</style>
        {items.map((project) => (
          <div key={project.id} style={{ minWidth: 240, maxWidth: 260, flex: "0 0 auto" }}>
            <AnimationCard project={project} onView={onViewProject} />
          </div>
        ))}
        {/* Tarjeta "Ver más" */}
        {onSeeAll && (
          <div style={{ minWidth: 180, flex: "0 0 auto" }}>
            <button
              onClick={onSeeAll}
              className="w-full h-full min-h-[300px] rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(8,10,28,0.6)",
                border: "1px solid rgba(99,62,210,0.15)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.35)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,62,210,0.15)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(8,10,28,0.6)"; }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <ArrowRight size={20} style={{ color: "#8b5cf6" }} />
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "13px", color: "#72729a" }}>
                Ver todo
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface NetflixSectionProps {
  onViewProject: (p: AnimationProject) => void;
  onNavigate: (page: string) => void;
}

/**
 * Componente NetflixSection - sección principal con filas de animaciones estilo Netflix
 */
export function NetflixSection({ onViewProject, onNavigate }: NetflixSectionProps) {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-8 py-4">
      {NETFLIX_ROWS.map((rowDef, idx) => {
        const label = (t as any)[rowDef.labelKey] as string;

        const items = rowDef.customFilter
          ? allAnimations.filter(rowDef.customFilter)
          : allAnimations.filter((a: AnimationProject) => a.rows?.includes(rowDef.categoryFilter!));

        if (items.length === 0) return null;

        // Colocar banner de anuncio cada 3 filas
        const showAd = idx > 0 && idx % 3 === 0;

        return (
          <div key={rowDef.id}>
            {showAd && (
              <div className="px-5 sm:px-8 py-3 mb-2">
                <div className="max-w-7xl mx-auto">
                  <div
                    className="w-full rounded-2xl flex items-center justify-center"
                    style={{ minHeight: 64, background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(99,62,210,0.08)" }}
                  >
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
                      [Google AdSense — Entre Filas]
                    </span>
                  </div>
                </div>
              </div>
            )}
            <NetflixRow
              rowId={rowDef.id}
              label={label}
              items={items}
              onViewProject={onViewProject}
              onSeeAll={() => onNavigate(rowDef.id === "trending" ? "trending" : `category:${rowDef.categoryFilter ?? rowDef.id}`)}
            />
          </div>
        );
      })}
    </div>
  );
}
