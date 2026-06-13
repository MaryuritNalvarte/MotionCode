// Importaciones necesarias para el componente TrendingSection
import { useState } from "react";
import { TrendingUp, Filter, LayoutGrid, LayoutList, Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimationCard } from "./AnimationCard";
import { allAnimations } from "../utils/data-bridge";
import type { AnimationProject } from "../utils/types";

// Filtros disponibles para las animaciones
const FILTERS = ["All", "CSS", "JavaScript", "Canvas", "SVG"];
// Opciones de ordenamiento
const SORTS = ["Popular", "New", "Trending"];

interface Props {
  onViewProject: (p: AnimationProject) => void;
}

/**
 * Componente TrendingSection - muestra animaciones en tendencia
 * Modificado para mostrar solo 4-5 animaciones grandes al inicio con botón "Ver todo"
 */
export function TrendingSection({ onViewProject }: Props) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showAll, setShowAll] = useState(false);

  // Filtrar y ordenar animaciones
  const filtered = allAnimations
    .filter((a: AnimationProject) => filter === "All" || a.category === filter)
    .sort((a: AnimationProject, b: AnimationProject) => {
      if (sort === "New") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sort === "Trending") return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      return b.views - a.views;
    });

  // Mostrar solo 4 animaciones al inicio, o todas si se presiona "Ver todo"
  const displayed = showAll ? filtered : filtered.slice(0, 4);

  return (
    <section className="py-20 px-5 sm:px-8 relative">
      {/* Resplandor de sección */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(124,58,237,0.04), transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative">
        {/* Encabezado */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <Flame size={13} style={{ color: "#ec4899" }} />
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#ec4899", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Animaciones en Tendencia
              </span>
            </div>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.7rem,3.5vw,2.6rem)", color: "#f0f0ff", letterSpacing: "-0.03em" }}>
              Más Populares{" "}
              <span style={{
                background: "linear-gradient(135deg, #a78bfa, #67e8f9)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>Esta Semana</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Ordenar */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {SORTS.map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    background: sort === s ? "rgba(139,92,246,0.2)" : "transparent",
                    color: sort === s ? "#c4b5fd" : "#4b5563",
                    border: sort === s ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                  }}>
                  {s === "Popular" ? "Popular" : s === "New" ? "Nuevas" : "Tendencia"}
                </button>
              ))}
            </div>

            {/* Separador */}
            <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.07)" }} />

            {/* Toggle de vista */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { mode: "grid" as const, Icon: LayoutGrid },
                { mode: "list" as const, Icon: LayoutList },
              ].map(({ mode, Icon }) => (
                <button key={mode} onClick={() => setView(mode)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: view === mode ? "rgba(139,92,246,0.2)" : "transparent",
                    color: view === mode ? "#c4b5fd" : "#4b5563",
                  }}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chips de filtro */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Filter size={13} className="text-gray-600" />
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105"
              style={{
                fontFamily: "Inter, sans-serif",
                background: filter === f ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.03)",
                color: filter === f ? "#c4b5fd" : "#4b5563",
                border: filter === f ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
              }}>
              {f === "All" ? "Todas" : f}
              <span className="px-1.5 py-0.5 rounded text-[9px]"
                style={{ background: "rgba(255,255,255,0.06)", color: "#4b5563" }}>
                {f === "All" ? allAnimations.length : allAnimations.filter((a: AnimationProject) => a.category === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Cuadrícula - muestra 4 animaciones grandes al inicio */}
        <div className={view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
          : "flex flex-col gap-4"
        }>
          {displayed.map((project) => (
            <AnimationCard key={project.id} project={project} onView={onViewProject} />
          ))}
        </div>

        {/* Botón "Ver todo" - muestra todas las animaciones o navega a la página de tendencias */}
        {!showAll && filtered.length > 4 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: "Inter, sans-serif",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#a78bfa",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.1)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.2)";
              }}
            >
              Ver Todas las Animaciones <ArrowRight size={14} />
            </button>
          </div>
        )}

        {showAll && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate("/trending")}
              className="group flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: "Inter, sans-serif",
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                color: "#fff",
                boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              Ver Página Completa de Tendencias <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
