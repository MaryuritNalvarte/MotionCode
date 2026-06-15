// Importaciones necesarias para el componente NetflixSection
import { useState } from "react";
import { allAnimations } from "../utils/data-bridge";
import type { AnimationProject } from "../utils/types";
import { AnimationCard } from "./AnimationCard";

interface NetflixSectionProps {
  onViewProject: (p: AnimationProject) => void;
}

/**
 * Componente NetflixSection - cuadrícula simple de todas las animaciones
 * Modificado para mostrar todas las animaciones juntas, sin separación por categorías
 * Con paginación: muestra 8 animaciones inicialmente, botón "Ver más" para mostrar todas
 */
export function NetflixSection({ onViewProject }: NetflixSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 8;
  const displayedAnimations = showAll ? allAnimations : allAnimations.slice(0, INITIAL_COUNT);

  return (
    <section className="py-8 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedAnimations.map((project) => (
            <AnimationCard key={project.id} project={project} onView={onViewProject} />
          ))}
        </div>
        
        {/* Botón "Ver más" si hay más animaciones */}
        {!showAll && allAnimations.length > INITIAL_COUNT && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "Inter, sans-serif",
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                color: "#fff",
                boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ver más animaciones ({allAnimations.length - INITIAL_COUNT} restantes)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
