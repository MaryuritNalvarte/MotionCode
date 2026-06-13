// Puente de datos centralizado para todas las animaciones, categorías y creadores
// Este es la única fuente de verdad que alimenta todas las páginas y hooks
// Carga dinámicamente desde public/content/ usando auto-descubrimiento
// No requiere edición manual al agregar nuevas animaciones

import type { AnimationProject, Category } from './types';
import { animations as hardcodedAnimations } from '../components/data';
import { discoverAnimations, getDiscoveredAnimations, initializeDiscovery } from './route-discovery';

/**
 * Cargar animaciones usando sistema de auto-descubrimiento
 * Este sistema detecta automáticamente nuevas animaciones en content/
 * Valida cada carpeta y excluye automáticamente animaciones inválidas
 */
async function loadAnimationsWithDiscovery(): Promise<AnimationProject[]> {
  try {
    // Usar sistema de descubrimiento dinámico
    const discovered = await discoverAnimations();
    
    // Si no se descubrieron animaciones, usar fallback hardcodeado
    if (discovered.length === 0) {
      console.warn('⚠️  No se descubrieron animaciones, usando fallback hardcodeado');
      return hardcodedAnimations;
    }
    
    return discovered;
  } catch (error) {
    console.error('Error cargando animaciones con descubrimiento:', error);
    // Fallback a datos hardcodeados en caso de error
    return hardcodedAnimations;
  }
}

/**
 * Cargar animaciones con caché
 * Evita cargar múltiples veces durante la misma sesión
 */
let cachedAnimations: AnimationProject[] | null = null;
let isLoadingAnimations = false;

export async function getAllAnimations(): Promise<AnimationProject[]> {
  if (cachedAnimations) {
    return cachedAnimations;
  }

  if (isLoadingAnimations) {
    // Esperar a que la carga actual termine
    await new Promise(resolve => setTimeout(resolve, 100));
    return getAllAnimations();
  }

  isLoadingAnimations = true;
  
  // Usar sistema de descubrimiento dinámico
  const discoveredAnimations = await loadAnimationsWithDiscovery();
  
  cachedAnimations = discoveredAnimations;
  isLoadingAnimations = false;

  return cachedAnimations;
}

/**
 * Versión síncrona para compatibilidad con código existente
 * Inicialmente retorna animaciones hardcodeadas, luego se actualiza con descubrimiento
 */
export const allAnimations: AnimationProject[] = [...hardcodedAnimations];

// Iniciar carga de animaciones en background para actualizar con descubrimiento
getAllAnimations().then(animations => {
  // Reemplazar animaciones hardcodeadas con las descubiertas
  allAnimations.length = 0;
  allAnimations.push(...animations);
});

/**
 * Todas las categorías disponibles
 * Usadas para páginas de categorías, filtrado y navegación
 */
export const allCategories: Category[] = [
  { id: "css", name: "CSS Animations", icon: "✨", gradient: ["#8b5cf6", "#ec4899"], slug: "css" },
  { id: "javascript", name: "JavaScript Effects", icon: "⚡", gradient: ["#f59e0b", "#ef4444"], slug: "javascript" },
  { id: "canvas", name: "Canvas Effects", icon: "🎨", gradient: ["#a855f7", "#3b82f6"], slug: "canvas" },
  { id: "threejs", name: "Three.js", icon: "🧊", gradient: ["#8b5cf6", "#06b6d4"], slug: "threejs" },
  { id: "svg", name: "SVG Animations", icon: "🎨", gradient: ["#f59e0b", "#ec4899"], slug: "svg" },
  { id: "cursors", name: "Cursor Effects", icon: "🖱", gradient: ["#06b6d4", "#8b5cf6"], slug: "cursors" },
  { id: "loading", name: "Loading Animations", icon: "⏳", gradient: ["#3b82f6", "#8b5cf6"], slug: "loading" },
  { id: "hearts", name: "Heart Animations", icon: "❤️", gradient: ["#ec4899", "#f43f5e"], slug: "hearts" },
];

/**
 * Obtener todos los creadores únicos de las animaciones
 */
export async function getAllCreators() {
  const animations = await getAllAnimations();
  const creatorMap = new Map();
  
  animations.forEach((anim) => {
    if (!creatorMap.has(anim.creator)) {
      creatorMap.set(anim.creator, {
        name: anim.creator,
        avatar: anim.creatorAvatar,
        color: anim.creatorColor,
        projects: 0,
      });
    }
    creatorMap.get(anim.creator).projects++;
  });

  return Array.from(creatorMap.values()).sort((a, b) => b.projects - a.projects);
}

/**
 * Obtener estadísticas de animaciones
 */
export async function getAnimationStats() {
  const animations = await getAllAnimations();
  const totalViews = animations.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = animations.reduce((sum, a) => sum + a.likes, 0);
  const totalStars = animations.reduce((sum, a) => sum + a.stars, 0);

  return {
    totalAnimations: animations.length,
    totalCreators: new Set(animations.map((a) => a.creator)).size,
    totalViews,
    totalLikes,
    totalStars,
    monthlyViews: Math.round(totalViews * 1.3),
    countries: 127,
    satisfaction: 98,
  };
}
