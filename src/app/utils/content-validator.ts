// Validador de contenido de animaciones
// Valida que cada carpeta de animación tenga los archivos requeridos
// Excluye automáticamente animaciones inválidas y genera reporte

import type { AnimationProject } from './types';

/**
 * Resultado de validación de una animación
 */
export interface ValidationResult {
  slug: string;
  isValid: boolean;
  missingFiles: string[];
  invalidMetadata: boolean;
  errors: string[];
}

/**
 * Reporte de validación de todas las animaciones
 */
export interface ValidationReport {
  totalFolders: number;
  validAnimations: number;
  invalidAnimations: number;
  results: ValidationResult[];
  timestamp: string;
}

/**
 * Archivos requeridos para una animación válida
 */
const REQUIRED_FILES = ['metadata.json', 'html.txt', 'css.txt', 'js.txt'];

/**
 * Campos requeridos en metadata.json
 */
const REQUIRED_METADATA_FIELDS = [
  'id',
  'slug',
  'title',
  'category',
  'categorySlug',
  'categoryIcon',
  'difficulty',
  'views',
  'stars',
  'likes',
  'creator',
  'creatorAvatar',
  'creatorColor',
  'gradientFrom',
  'gradientTo',
  'animationType',
  'tags',
  'description',
  'htmlPath',
  'cssPath',
  'jsPath',
];

/**
 * Validar una carpeta de animación
 * Verifica que tenga todos los archivos requeridos y metadata válido
 */
export async function validateAnimationFolder(slug: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    slug,
    isValid: true,
    missingFiles: [],
    invalidMetadata: false,
    errors: [],
  };

  try {
    // Verificar archivos requeridos
    for (const file of REQUIRED_FILES) {
      try {
        const response = await fetch(`/content/${slug}/${file}`);
        if (!response.ok) {
          result.missingFiles.push(file);
          result.isValid = false;
          result.errors.push(`Archivo faltante: ${file}`);
        }
      } catch (error) {
        result.missingFiles.push(file);
        result.isValid = false;
        result.errors.push(`Error al verificar ${file}: ${error}`);
      }
    }

    // Si faltan archivos, no validar metadata
    if (result.missingFiles.length > 0) {
      return result;
    }

    // Validar metadata.json
    try {
      const metadataResponse = await fetch(`/content/${slug}/metadata.json`);
      if (!metadataResponse.ok) {
        result.invalidMetadata = true;
        result.isValid = false;
        result.errors.push('No se pudo cargar metadata.json');
        return result;
      }

      const metadata = await metadataResponse.json();

      // Verificar campos requeridos
      for (const field of REQUIRED_METADATA_FIELDS) {
        if (!(field in metadata)) {
          result.invalidMetadata = true;
          result.isValid = false;
          result.errors.push(`Campo faltante en metadata: ${field}`);
        }
      }

      // Verificar que slug coincida
      if (metadata.slug !== slug) {
        result.invalidMetadata = true;
        result.isValid = false;
        result.errors.push(`Slug en metadata (${metadata.slug}) no coincide con carpeta (${slug})`);
      }

      // Verificar rutas de archivos
      if (metadata.htmlPath && !metadata.htmlPath.startsWith('/content/')) {
        result.invalidMetadata = true;
        result.isValid = false;
        result.errors.push('htmlPath debe comenzar con /content/');
      }

      if (metadata.cssPath && !metadata.cssPath.startsWith('/content/')) {
        result.invalidMetadata = true;
        result.isValid = false;
        result.errors.push('cssPath debe comenzar con /content/');
      }

      if (metadata.jsPath && !metadata.jsPath.startsWith('/content/')) {
        result.invalidMetadata = true;
        result.isValid = false;
        result.errors.push('jsPath debe comenzar con /content/');
      }
    } catch (error) {
      result.invalidMetadata = true;
      result.isValid = false;
      result.errors.push(`Error al validar metadata: ${error}`);
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Error general de validación: ${error}`);
  }

  return result;
}

/**
 * Validar todas las carpetas de animación en content/
 * Genera reporte de validación
 */
export async function validateAllAnimations(): Promise<ValidationReport> {
  const report: ValidationReport = {
    totalFolders: 0,
    validAnimations: 0,
    invalidAnimations: 0,
    results: [],
    timestamp: new Date().toISOString(),
  };

  try {
    // Obtener lista de carpetas en content/
    // En producción, esto podría venir de un endpoint del servidor
    // Por ahora, usamos la lista conocida de animaciones
    const knownSlugs = [
      "neon-orbit-system",
      "liquid-wave-equalizer",
      "particle-galaxy-field",
      "aurora-gradient-flow",
      "matrix-code-rain",
      "morphing-blob-shape",
      "glitch-text-effect",
      "3d-floating-cards",
      "neon-pulse-loader",
      "typewriter-terminal",
      "fluid-ripple-click",
      "css-grid-mosaic",
      "ghost-cursor",
      "magnetic-cursor",
      "spotlight-cursor",
      "dna-helix-loader",
      "skeleton-shimmer",
      "progress-neon-bar",
      "neon-heart-pulse",
      "heart-particle-burst",
      "floating-hearts",
      "particle-sphere-threejs",
      "galaxy-spiral-threejs",
      "liquid-blob-threejs",
      "fireflies",
      "snow-particles",
      "confetti-burst",
    ];

    report.totalFolders = knownSlugs.length;

    // Validar cada carpeta
    const validationResults = await Promise.all(
      knownSlugs.map(async (slug) => {
        const result = await validateAnimationFolder(slug);
        
        if (result.isValid) {
          report.validAnimations++;
        } else {
          report.invalidAnimations++;
          // Loguear animaciones inválidas
          console.warn(`Animación inválida: ${slug}`, result.errors);
        }
        
        return result;
      })
    );

    report.results = validationResults;
  } catch (error) {
    console.error('Error validando todas las animaciones:', error);
  }

  return report;
}

/**
 * Filtrar animaciones válidas de un array
 * Excluye automáticamente animaciones inválidas
 */
export function filterValidAnimations(animations: AnimationProject[], validationReport: ValidationReport): AnimationProject[] {
  const validSlugs = new Set(
    validationReport.results
      .filter((r) => r.isValid)
      .map((r) => r.slug)
  );

  return animations.filter((anim) => validSlugs.has(anim.slug));
}
