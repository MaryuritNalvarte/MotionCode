// Main application entry point with React Router v6
// Provides routing infrastructure, language context, and lazy-loaded pages
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './components/LangContext';
import { lazy, Suspense } from 'react';
import { RootLayout } from './layouts/RootLayout';

// Carga diferida de todas las páginas para mejor rendimiento inicial y división de código
// Cada página se carga solo cuando se navega a ella
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const AnimationPage = lazy(() => import('./pages/AnimationPage').then((m) => ({ default: m.AnimationPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const TrendingPage = lazy(() => import('./pages/TrendingPage').then((m) => ({ default: m.TrendingPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Componente de carga que se muestra mientras las páginas se están cargando
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        background: '#050816',
        color: '#f0f0ff',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(139, 92, 246, 0.2)',
            borderTop: '3px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }}
        />
        <p>Cargando...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

/**
 * Componente principal de la aplicación
 * 
 * Proporciona:
 * - Contexto de idioma (LangProvider) con estado de traducción
 * - React Router v6 con BrowserRouter
 * - Páginas con carga diferida para mejor rendimiento
 * - RootLayout para navbar/footer consistente
 * 
 * Estructura de rutas:
 * /                          → Home (hero + todas las secciones)
 * /animation/:slug           → Página de animación individual (URLs optimizadas para SEO)
 * /category/:categoryId      → Página de categoría (CSS, JavaScript, trending, etc)
 * /trending                  → Página de tendencias
 * /categories                → Vista general de categorías
 * /*                         → 404 No encontrado
 */
export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          {/* RootLayout envuelve todas las páginas con navbar, footer y UI global */}
          <Route element={<RootLayout />}>
            {/* Página de inicio - sección hero + filas tipo netflix + búsqueda + categorías */}
            <Route
              path="/"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Home />
                </Suspense>
              }
            />

            {/* Página de animación individual - DINÁMICA por slug para SEO */}
            {/* Ejemplos: /animation/ghost-cursor, /animation/neon-heart, /animation/particle-galaxy */}
            <Route
              path="/animation/:slug"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AnimationPage />
                </Suspense>
              }
            />

            {/* Página de categoría - filtra animaciones por categoría o tipos especiales */}
            {/* Ejemplos: /category/css, /category/javascript, /category/trending, /category/new */}
            <Route
              path="/category/:categoryId"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CategoryPage />
                </Suspense>
              }
            />

            {/* Página de tendencias - página dedicada para animaciones en tendencia */}
            <Route
              path="/trending"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <TrendingPage />
                </Suspense>
              }
            />

            {/* Vista general de categorías - cuadrícula de todas las categorías */}
            <Route
              path="/categories"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CategoriesPage />
                </Suspense>
              }
            />

            {/* 404 Not Found - catch-all route */}
            <Route
              path="*"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}
