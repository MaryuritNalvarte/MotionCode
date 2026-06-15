// AnimationProject type is now in src/app/utils/types.ts to avoid duplication
// This file now contains only categories and Netflix row definitions

// CATEGORÍAS: Definición de categorías de animaciones
// Para agregar una nueva categoría, agregar aquí con id, nombre, icono, gradiente y descripción
export const categories = [
  { id: "css",             name: "CSS Animations",     count: 142, icon: "✨", gradient: ["#8b5cf6", "#ec4899"], description: "Pure CSS magic with zero JS" },
  { id: "javascript",      name: "JavaScript Effects",  count: 98,  icon: "⚡", gradient: ["#f59e0b", "#ef4444"], description: "Dynamic interactive effects" },
  { id: "cursors",        name: "Cursor Effects",      count: 34,  icon: "🖱️", gradient: ["#06b6d4", "#3b82f6"], description: "Custom mouse interactions" },
  { id: "particles",      name: "Particle Systems",    count: 67,  icon: "🌌", gradient: ["#a855f7", "#3b82f6"], description: "Physics-based motion art" },
  { id: "loading",        name: "Loading Animations",  count: 89,  icon: "⏳", gradient: ["#3b82f6", "#8b5cf6"], description: "Elegant loaders & spinners" },
  { id: "text-effects",   name: "Text Effects",        count: 56,  icon: "📝", gradient: ["#10b981", "#06b6d4"], description: "Typography in motion" },
  { id: "threejs",        name: "Three.js",            count: 41,  icon: "🎲", gradient: ["#ec4899", "#f59e0b"], description: "3D browser experiences" },
  { id: "interactive-ui", name: "Interactive UI",      count: 73,  icon: "🎨", gradient: ["#ef4444", "#ec4899"], description: "UI microinteractions" },
];

// NETFLIX ROWS: Definición de filas para el carrusel estilo Netflix
// Para agregar una nueva fila, agregar aquí con id, labelKey y filtro
import type { AnimationProject } from "../utils/types";

export interface NetflixRowDef {
  id: string;
  labelKey: string;       // key into STRINGS[lang]
  categoryFilter?: string; // filter animations.rows includes this
  customFilter?: (a: AnimationProject) => boolean;
}

export const NETFLIX_ROWS: NetflixRowDef[] = [
  { id: "trending",  labelKey: "rowTrending",  customFilter: (a) => !!a.isTrending },
  { id: "new",       labelKey: "rowNew",        customFilter: (a) => !!a.isNew },
  { id: "css",       labelKey: "rowCSS",        categoryFilter: "css" },
  { id: "javascript",labelKey: "rowJS",          categoryFilter: "javascript" },
  { id: "particles", labelKey: "rowParticles",   categoryFilter: "particles" },
  { id: "canvas",    labelKey: "rowCanvas",      categoryFilter: "canvas" },
  { id: "threejs",   labelKey: "rowThreeJS",     categoryFilter: "threejs" },
  { id: "cursors",   labelKey: "rowCursors",     categoryFilter: "cursors" },
  { id: "loading",   labelKey: "rowLoading",     categoryFilter: "loading" },
  { id: "hearts",    labelKey: "rowHearts",      categoryFilter: "hearts" },
];
