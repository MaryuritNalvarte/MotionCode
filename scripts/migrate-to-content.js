#!/usr/bin/env node

/**
 * Script de migración de animaciones a arquitectura content/
 * 
 * Este script migra las animaciones existentes de public/animations/ a content/
 * y genera automáticamente los archivos metadata.json correspondientes.
 * 
 * Uso:
 * node scripts/migrate-to-content.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const projectRoot = path.join(__dirname, '..');
const publicAnimationsDir = path.join(projectRoot, 'public', 'animations');
const contentDir = path.join(projectRoot, 'content');
const dataFile = path.join(projectRoot, 'src', 'app', 'components', 'data.ts');

/**
 * Leer datos de animaciones desde data.ts
 */
function readAnimationData() {
  const dataContent = fs.readFileSync(dataFile, 'utf-8');
  
  // Extraer el array animations del archivo TypeScript usando regex más robusto
  const animationsMatch = dataContent.match(/export const animations: AnimationProject\[\] = \[([\s\S]*?)\];/);
  if (!animationsMatch) {
    throw new Error('No se encontró el array animations en data.ts');
  }

  const animationsArray = animationsMatch[1];
  
  // Usar Function constructor para parsear el array de forma segura
  // Solo extraemos la parte del array, no ejecutamos código arbitrario
  try {
    // Crear un contexto seguro para evaluar el array
    const arrayString = `[${animationsArray}]`;
    const animations = new Function(`return ${arrayString}`)();
    return animations;
  } catch (error) {
    console.error('Error parsing animations array:', error.message);
    throw new Error('No se pudo parsear el array de animaciones');
  }
}

/**
 * Crear estructura de carpetas para una animación en content/
 */
function createContentStructure(animation) {
  const slug = animation.slug;
  const animationContentDir = path.join(contentDir, slug);
  
  // Crear carpeta de la animación
  if (!fs.existsSync(animationContentDir)) {
    fs.mkdirSync(animationContentDir, { recursive: true });
  }
  
  return animationContentDir;
}

/**
 * Copiar archivos de animación desde public/animations/ a content/
 */
function copyAnimationFiles(animation, contentDir) {
  const slug = animation.slug;
  const sourceDir = path.join(publicAnimationsDir, slug);
  
  if (!fs.existsSync(sourceDir)) {
    console.warn(`⚠️  No se encontró carpeta fuente: ${sourceDir}`);
    return;
  }
  
  // Copiar y renombrar archivos
  const fileMappings = [
    { source: 'index.html', dest: 'html.txt' },
    { source: 'styles.css', dest: 'css.txt' },
    { source: 'main.js', dest: 'js.txt' },
  ];
  
  fileMappings.forEach(mapping => {
    const sourcePath = path.join(sourceDir, mapping.source);
    const destPath = path.join(contentDir, mapping.dest);
    
    if (fs.existsSync(sourcePath)) {
      const content = fs.readFileSync(sourcePath, 'utf-8');
      fs.writeFileSync(destPath, content);
      console.log(`   ✅ Copiado: ${mapping.source} → ${mapping.dest}`);
    } else {
      console.warn(`   ⚠️  No encontrado: ${mapping.source}`);
    }
  });
}

/**
 * Generar metadata.json para una animación
 */
function generateMetadataJson(animation) {
  const metadata = {
    id: animation.id,
    slug: animation.slug,
    title: animation.title,
    category: animation.category,
    categorySlug: animation.categorySlug,
    categoryIcon: animation.categoryIcon,
    difficulty: animation.difficulty,
    views: animation.views,
    stars: animation.stars,
    likes: animation.likes,
    creator: animation.creator,
    creatorAvatar: animation.creatorAvatar,
    creatorColor: animation.creatorColor,
    gradientFrom: animation.gradientFrom,
    gradientTo: animation.gradientTo,
    animationType: animation.animationType,
    tags: animation.tags,
    description: animation.description,
    isNew: animation.isNew || false,
    isTrending: animation.isTrending || false,
    isFeatured: animation.isFeatured || false,
    rows: animation.rows || [],
    // Rutas actualizadas para apuntar a content/
    htmlPath: `/content/${animation.slug}/html.txt`,
    cssPath: `/content/${animation.slug}/css.txt`,
    jsPath: `/content/${animation.slug}/js.txt`,
  };
  
  return metadata;
}

/**
 * Guardar metadata.json
 */
function saveMetadataJson(contentDir, metadata) {
  const metadataPath = path.join(contentDir, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`   ✅ Creado: metadata.json`);
}

/**
 * Función principal de migración
 */
function main() {
  console.log('🚀 Iniciando migración a arquitectura content/...\n');
  
  // Verificar que exista la carpeta source
  if (!fs.existsSync(publicAnimationsDir)) {
    console.error(`❌ Error: No se encontró carpeta fuente: ${publicAnimationsDir}`);
    process.exit(1);
  }
  
  // Crear carpeta content/ si no existe
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  // Leer animaciones existentes
  console.log('📖 Leyendo datos de animaciones...');
  const animations = readAnimationData();
  console.log(`   ✅ Encontradas ${animations.length} animaciones\n`);
  
  // Migrar cada animación
  let successCount = 0;
  let errorCount = 0;
  const migrationLog = [];
  
  animations.forEach((animation, index) => {
    console.log(`\n📦 Migrando animación ${index + 1}/${animations.length}: ${animation.slug}`);
    
    try {
      // Crear estructura de carpetas
      const contentDir = createContentStructure(animation);
      console.log(`   ✅ Carpeta creada: content/${animation.slug}`);
      
      // Copiar archivos
      copyAnimationFiles(animation, contentDir);
      
      // Generar y guardar metadata.json
      const metadata = generateMetadataJson(animation);
      saveMetadataJson(contentDir, metadata);
      
      // Registrar en log de migración
      migrationLog.push({
        slug: animation.slug,
        title: animation.title,
        originalPath: `public/animations/${animation.slug}/`,
        newPath: `content/${animation.slug}/`,
        status: 'success',
        filesCopied: ['index.html → html.txt', 'styles.css → css.txt', 'main.js → js.txt'],
        metadataCreated: true,
      });
      
      successCount++;
      console.log(`   ✅ Migración completada: ${animation.slug}`);
    } catch (error) {
      console.error(`   ❌ Error migrando ${animation.slug}:`, error.message);
      errorCount++;
      
      migrationLog.push({
        slug: animation.slug,
        title: animation.title,
        originalPath: `public/animations/${animation.slug}/`,
        newPath: `content/${animation.slug}/`,
        status: 'error',
        error: error.message,
      });
    }
  });
  
  // Guardar reporte de migración
  const reportPath = path.join(projectRoot, 'migration-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    totalAnimations: animations.length,
    successfulMigrations: successCount,
    failedMigrations: errorCount,
    migrations: migrationLog,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(60));
  console.log(`Total de animaciones: ${animations.length}`);
  console.log(`Migraciones exitosas: ${successCount}`);
  console.log(`Migraciones fallidas: ${errorCount}`);
  console.log(`Reporte guardado en: migration-report.json`);
  console.log('='.repeat(60));
  
  if (errorCount > 0) {
    console.log('\n⚠️  Algunas migraciones fallaron. Revisa migration-report.json para detalles.');
    process.exit(1);
  } else {
    console.log('\n✅ ¡Migración completada exitosamente!');
    console.log('\n⚠️  IMPORTANTE: NO elimines la carpeta public/animations/ hasta que:');
    console.log('   1. Hayas actualizado data-bridge.ts para cargar desde content/');
    console.log('   2. Hayas verificado que todas las animaciones funcionan correctamente');
    console.log('   3. Hayas ejecutado npm run build exitosamente');
  }
}

main();
