// Sistema de descubrimiento dinámico de rutas
// Detecta automáticamente animaciones en content/ y genera rutas
// No requiere registro manual de rutas ni arrays hardcodeados

import type { AnimationProject } from './types';
import { validateAllAnimations, filterValidAnimations, type ValidationReport } from './content-validator';

/**
 * Caché de animaciones descubiertas
 */
let discoveredAnimations: AnimationProject[] | null = null;
let validationReport: ValidationReport | null = null;
let isDiscovering = false;

/**
 * Descubrir animaciones dinámicamente desde content/
 * Valida cada carpeta y carga metadata.json
 */
export async function discoverAnimations(): Promise<AnimationProject[]> {
  // Retornar caché si existe
  if (discoveredAnimations) {
    return discoveredAnimations;
  }

  // Esperar si ya está descubriendo
  if (isDiscovering) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return discoverAnimations();
  }

  isDiscovering = true;

  try {
    console.log('🔍 Descubriendo animaciones desde content/...');

    // Validar todas las carpetas de animación
    validationReport = await validateAllAnimations();

    console.log(`📊 Reporte de validación:`, {
      total: validationReport.totalFolders,
      valid: validationReport.validAnimations,
      invalid: validationReport.invalidAnimations,
    });

    // Cargar metadata.json de animaciones válidas
    const validSlugs = validationReport.results
      .filter((r) => r.isValid)
      .map((r) => r.slug);

    const animations = await Promise.all(
      validSlugs.map(async (slug) => {
        try {
          const response = await fetch(`/content/${slug}/metadata.json`);
          if (!response.ok) {
            console.warn(`No se pudo cargar metadata para ${slug}`);
            return null;
          }
          const metadata = await response.json();
          return metadata as AnimationProject;
        } catch (error) {
          console.warn(`Error cargando metadata para ${slug}:`, error);
          return null;
        }
      })
    );

    // Filtrar nulls
    discoveredAnimations = animations.filter((anim): anim is AnimationProject => anim !== null);

    console.log(`✅ Animaciones descubiertas: ${discoveredAnimations.length}`);

    return discoveredAnimations;
  } catch (error) {
    console.error('❌ Error descubriendo animaciones:', error);
    return [];
  } finally {
    isDiscovering = false;
  }
}

/**
 * Obtener reporte de validación
 */
export function getValidationReport(): ValidationReport | null {
  return validationReport;
}

/**
 * Limpiar caché de descubrimiento
 * Útil para forzar re-descubrimiento después de agregar nuevas animaciones
 */
export function clearDiscoveryCache(): void {
  discoveredAnimations = null;
  validationReport = null;
  console.log('🧹 Caché de descubrimiento limpiado');
}

/**
 * Obtener animaciones descubiertas (versión síncrona con caché)
 */
export function getDiscoveredAnimations(): AnimationProject[] {
  return discoveredAnimations || [];
}

/**
 * Verificar si el descubrimiento está completo
 */
export function isDiscoveryComplete(): boolean {
  return discoveredAnimations !== null;
}

/**
 * Iniciar descubrimiento en background
 * Llamar esto al inicio de la aplicación
 */
export async function initializeDiscovery(): Promise<void> {
  if (!isDiscoveryComplete()) {
    await discoverAnimations();
  }
}
