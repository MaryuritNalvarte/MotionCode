// Importaciones necesarias para el componente NetflixSection
import { useState, useEffect } from "react";
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
  const [localAnimations, setLocalAnimations] = useState<AnimationProject[]>([]);
  const INITIAL_COUNT = 8;

  // Sincronizar estado local con allAnimations cuando esté disponible
  useEffect(() => {
    // Verificar periódicamente si allAnimations tiene datos
    const checkAnimations = () => {
      if (allAnimations.length > 0) {
        setLocalAnimations(allAnimations);
      }
    };

    // Verificar inmediatamente
    checkAnimations();

    // Verificar cada 100ms hasta que haya datos
    const interval = setInterval(() => {
      if (allAnimations.length > 0) {
        setLocalAnimations(allAnimations);
        clearInterval(interval);
      }
    }, 100);

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  const displayedAnimations = showAll ? localAnimations : localAnimations.slice(0, INITIAL_COUNT);

  // Mostrar estado de carga si no hay animaciones
  if (localAnimations.length === 0) {
    return (
      <section className="py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#4b5563" }}>
              Cargando animaciones...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedAnimations.map((project) => (
            <AnimationCard key={project.id} project={project} onView={onViewProject} />
          ))}
        </div>
        
        {/* Botón "Ver más" si hay más animaciones */}
        {!showAll && localAnimations.length > INITIAL_COUNT && (
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
              Ver más animaciones ({localAnimations.length - INITIAL_COUNT} restantes)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
