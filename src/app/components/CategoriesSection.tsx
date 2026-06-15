// Importaciones necesarias para el componente CategoriesSection
import { useState } from "react";
import { Layers } from "lucide-react";
import { categories } from "./data";

/**
 * Componente CategoriesSection - muestra cuadrícula de categorías de animación
 * Modificado para ser puramente visual - sin funcionalidad de navegación ni conteo de proyectos
 * Conserva efectos visuales de hover
 */
export function CategoriesSection() {
  return (
    <section className="py-20 px-5 sm:px-8 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(6,182,212,0.04), transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}>
            <Layers size={13} style={{ color: "#06b6d4" }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#22d3ee", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Explorar Categorías
            </span>
          </div>
          <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.7rem,3.5vw,2.6rem)", color: "#f0f0ff", letterSpacing: "-0.03em", marginBottom: 12 }}>
            Encuentra Tu{" "}
            <span style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Estilo Perfecto
            </span>
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#4b5563", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Desde magia CSS pura hasta WebGL 3D completo — cada estilo de animación que necesitas.
          </p>
        </div>

        {/* Cuadrícula de 8 columnas — 4×2 en desktop, 2×4 en móvil */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, index }: {
  cat: typeof categories[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [A, B] = cat.gradient;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-left w-full p-5 rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: hovered ? `linear-gradient(135deg, ${A}14, ${B}10)` : "rgba(8,10,28,0.7)",
        border: hovered ? `1px solid ${A}55` : "1px solid rgba(99,62,210,0.12)",
        transform: hovered ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.35), 0 0 30px ${A}18` : "none",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Blob de resplandor de fondo */}
      <div
        className="absolute pointer-events-none transition-opacity duration-400"
        style={{
          inset: 0,
          background: `radial-gradient(ellipse 80% 80% at 20% 20%, ${A}25, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          borderRadius: "inherit",
        }}
      />

      {/* Línea de escaneo animada al hover */}
      {hovered && (
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            top: 0,
            background: `linear-gradient(90deg, transparent, ${A}80, transparent)`,
            animation: "scanDown 1.5s ease infinite",
          }}
        />
      )}

      <style>{`@keyframes scanDown { 0%{top:0;opacity:0.8} 100%{top:100%;opacity:0} }`}</style>

      <div className="relative flex flex-col gap-3">
        {/* Icono */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all duration-300"
          style={{
            background: hovered ? `linear-gradient(135deg, ${A}30, ${B}20)` : `rgba(255,255,255,0.04)`,
            border: hovered ? `1px solid ${A}50` : "1px solid rgba(255,255,255,0.06)",
            transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
            boxShadow: hovered ? `0 0 20px ${A}40` : "none",
          }}
        >
          {cat.icon}
        </div>

        <div>
          <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "14px", color: hovered ? "#f0f0ff" : "#c4c8ff", marginBottom: 3, transition: "color 0.2s" }}>
            {cat.name}
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#4b5563", lineHeight: 1.5 }}>
            {cat.description}
          </p>
        </div>
      </div>
    </div>
  );
}
