// Componente de layout raíz que envuelve todas las páginas
// Proporciona elementos de UI comunes: navbar, footer, fondo y superposición de cuadrícula de puntos
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

/**
 * Componente RootLayout - envuelve todas las páginas con:
 * - Navbar fijo en la parte superior
 * - Fondo animado de cuadrícula de puntos
 * - Área de contenido principal (Outlet para routing de páginas)
 * - Footer en la parte inferior
 * 
 * Todas las páginas se renderizan dentro de este layout, manteniendo una UI consistente
 */
export function RootLayout() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#050816', color: '#f0f0ff', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Fondo de superposición de cuadrícula de puntos animada - fija, no interactiva */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,92,246,0.06) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      {/* Barra de navegación fija - siempre visible en la parte superior */}
      <Navbar />

      {/* Área de contenido principal - renderiza la página actual */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Footer - siempre en la parte inferior */}
      <Footer />
    </div>
  );
}
