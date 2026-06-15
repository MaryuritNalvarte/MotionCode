// Puente de datos centralizado para todas las animaciones, categorías y creadores
// Este es la única fuente de verdad que alimenta todas las páginas y hooks
// Carga dinámicamente desde public/content/ usando auto-descubrimiento
// No requiere edición manual al agregar nuevas animaciones

import type { AnimationProject, Category } from './types';
import { discoverAnimations, getDiscoveredAnimations, initializeDiscovery } from './route-discovery';
import { categories } from '../components/data';

/**
 * Cargar animaciones usando sistema de auto-descubrimiento
 * Este sistema detecta automáticamente nuevas animaciones en content/
 * Valida cada carpeta y excluye automáticamente animaciones inválidas
 */
async function loadAnimationsWithDiscovery(): Promise<AnimationProject[]> {
  try {
    // Usar sistema de descubrimiento dinámico
    const discovered = await discoverAnimations();
    
    // Si no se descubrieron animaciones, retornar array vacío
    if (discovered.length === 0) {
      console.warn('⚠️  No se descubrieron animaciones en content/');
      return [];
    }
    
    return discovered;
  } catch (error) {
    console.error('Error cargando animaciones con descubrimiento:', error);
    // Retornar array vacío en caso de error
    return [];
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
 * Inicialmente retorna array vacío, luego se actualiza con descubrimiento
 */
export const allAnimations: AnimationProject[] = [];

// Iniciar carga de animaciones en background para actualizar con descubrimiento
getAllAnimations().then(animations => {
  // Ordenar por publishedAt descendente (más recientes primero)
  const sortedAnimations = animations.sort((a, b) => {
    const dateA = new Date(a.publishedAt || '1970-01-01');
    const dateB = new Date(b.publishedAt || '1970-01-01');
    return dateB.getTime() - dateA.getTime();
  });
  
  // Reemplazar array vacío con las animaciones descubiertas y ordenadas
  allAnimations.length = 0;
  allAnimations.push(...sortedAnimations);
});

// CATEGORÍAS: Re-exportar categorías desde data.ts para mantener compatibilidad
// Las categorías se definen en src/app/components/data.ts
export { categories };
