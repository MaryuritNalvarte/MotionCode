#!/usr/bin/env node

/**
 * Script generador de metadata.json para animaciones
 * 
 * Este script genera automáticamente archivos metadata.json para nuevas animaciones.
 * No requiere edición manual del código de la aplicación al agregar nuevas animaciones.
 * 
 * Uso:
 * node scripts/generate-metadata.js <slug> <title> <category> <difficulty> <creator>
 * 
 * Ejemplo:
 * node scripts/generate-metadata.js neon-pulse-loader "Neon Pulse Loader" css Beginner chromawave
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de categorías
const CATEGORIES = {
  css: { name: "CSS Animations", icon: "✨" },
  javascript: { name: "JavaScript Effects", icon: "⚡" },
  cursors: { name: "Cursor Effects", icon: "🖱" },
  canvas: { name: "Particle Systems", icon: "🌌" },
  loading: { name: "Loading Animations", icon: "⏳" },
  svg: { name: "Text Effects", icon: "🎨" },
  threejs: { name: "Three.js", icon: "🧊" },
  ui: { name: "Interactive UI", icon: "🎯" },
};

// Configuración de dificultades
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

// Colores de gradiente predefinidos
const GRADIENTS = [
  { from: "#8b5cf6", to: "#ec4899" },
  { from: "#06b6d4", to: "#3b82f6" },
  { from: "#a855f7", to: "#3b82f6" },
  { from: "#ec4899", to: "#8b5cf6" },
  { from: "#10b981", to: "#06b6d4" },
  { from: "#f59e0b", to: "#ef4444" },
  { from: "#7c3aed", to: "#06b6d4" },
  { from: "#34d399", to: "#10b981" },
];

/**
 * Generar ID único para la animación
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Generar slug a partir del título
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Seleccionar gradiente aleatorio
 */
function selectGradient() {
  return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
}

/**
 * Generar metadata.json
 */
function generateMetadata(options) {
  const {
    slug,
    title,
    category,
    difficulty,
    creator,
    description,
    tags,
    animationType,
    isNew = false,
    isTrending = false,
    isFeatured = false,
  } = options;

  const categoryConfig = CATEGORIES[category] || CATEGORIES.css;
  const gradient = selectGradient();
  const id = generateId();

  const metadata = {
    id,
    slug,
    title,
    category: categoryConfig.name,
    categorySlug: category,
    categoryIcon: categoryConfig.icon,
    difficulty,
    views: 0,
    stars: 0,
    likes: 0,
    creator,
    creatorAvatar: creator.charAt(0).toUpperCase(),
    creatorColor: gradient.from,
    gradientFrom: gradient.from,
    gradientTo: gradient.to,
    animationType: animationType || category,
    tags: tags || [category],
    description: description || `A beautiful ${categoryConfig.name.toLowerCase()} animation.`,
    isNew,
    isTrending,
    isFeatured,
    rows: isNew ? ["new"] : isTrending ? ["trending"] : [category],
    // Rutas a archivos de código (relativas a content/)
    htmlPath: `/content/${slug}/html.txt`,
    cssPath: `/content/${slug}/css.txt`,
    jsPath: `/content/${slug}/js.txt`,
  };

  return metadata;
}

/**
 * Crear estructura de carpetas para una animación
 */
function createAnimationStructure(slug, metadata) {
  const contentDir = path.join(process.cwd(), 'content', slug);
  
  // Crear carpeta de la animación
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Crear archivos vacíos si no existen
  const files = ['html.txt', 'css.txt', 'js.txt', 'metadata.json'];
  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    if (!fs.existsSync(filePath)) {
      if (file === 'metadata.json') {
        fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
      } else {
        fs.writeFileSync(filePath, '');
      }
    }
  });

  return contentDir;
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 5) {
    console.log('Uso: node scripts/generate-metadata.js <slug> <title> <category> <difficulty> <creator> [description] [tags] [animationType]');
    console.log('');
    console.log('Categorías disponibles:', Object.keys(CATEGORIES).join(', '));
    console.log('Dificultades disponibles:', DIFFICULTIES.join(', '));
    console.log('');
    console.log('Ejemplo:');
    console.log('  node scripts/generate-metadata.js neon-pulse-loader "Neon Pulse Loader" css Beginner chromawave "A beautiful neon pulse animation" ["neon","pulse","loader"] loader');
    process.exit(1);
  }

  const [slug, title, category, difficulty, creator, description, tagsStr, animationType] = args;

  // Validar categoría
  if (!CATEGORIES[category]) {
    console.error(`Error: Categoría "${category}" no válida.`);
    console.error(`Categorías disponibles: ${Object.keys(CATEGORIES).join(', ')}`);
    process.exit(1);
  }

  // Validar dificultad
  if (!DIFFICULTIES.includes(difficulty)) {
    console.error(`Error: Dificultad "${difficulty}" no válida.`);
    console.error(`Dificultades disponibles: ${DIFFICULTIES.join(', ')}`);
    process.exit(1);
  }

  // Parsear tags si se proporcionan
  let tags = [];
  if (tagsStr) {
    try {
      tags = JSON.parse(tagsStr);
    } catch (e) {
      tags = tagsStr.split(',').map(t => t.trim());
    }
  }

  // Generar metadata
  const metadata = generateMetadata({
    slug,
    title,
    category,
    difficulty,
    creator,
    description,
    tags,
    animationType,
  });

  // Crear estructura de carpetas
  const contentDir = createAnimationStructure(slug, metadata);

  console.log(`✅ Animación creada exitosamente:`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Título: ${title}`);
  console.log(`   Categoría: ${category}`);
  console.log(`   Dificultad: ${difficulty}`);
  console.log(`   Creador: ${creator}`);
  console.log(`   Ubicación: ${contentDir}`);
  console.log('');
  console.log(`📝 Archivos creados:`);
  console.log(`   - content/${slug}/metadata.json`);
  console.log(`   - content/${slug}/html.txt (vacío - agregar código HTML)`);
  console.log(`   - content/${slug}/css.txt (vacío - agregar código CSS)`);
  console.log(`   - content/${slug}/js.txt (vacío - agregar código JavaScript)`);
  console.log('');
  console.log(`⚠️  Próximos pasos:`);
  console.log(`   1. Agregar código HTML a content/${slug}/html.txt`);
  console.log(`   2. Agregar código CSS a content/${slug}/css.txt`);
  console.log(`   3. Agregar código JavaScript a content/${slug}/js.txt`);
  console.log(`   4. (Opcional) Agregar preview.webp y thumbnail.webp`);
  console.log(`   5. (Opcional) Agregar video.json para videos embebidos`);
}

main();
