// Página de inicio - página de aterrizaje con hero, búsqueda, filas tipo netflix, categorías
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { GlobalSearch } from '../components/GlobalSearch';
import { NetflixSection } from '../components/NetflixSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { SEOHead } from '../components/SEOHead';
import { allAnimations } from '../utils/data-bridge';
import type { AnimationProject } from '../utils/types';

// Componente de banner de publicidad placeholder (listo para integración con Google AdSense)
// Puedes reemplazar este componente con tu código real de AdSense
function AdBanner({ label }: { label?: string }) {
  return (
    <div className="px-5 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto">
        <div
          className="w-full rounded-2xl flex flex-col items-center justify-center gap-1"
          style={{
            minHeight: 64,
            background: 'rgba(8,10,28,0.4)',
            border: '1px dashed rgba(99,62,210,0.08)',
          }}
        >
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#1a1a2e' }}>
            {label ?? '[Google AdSense — 728×90]'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Divisor de sección con línea de gradiente
function SectionDivider() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div
        className="h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.12), transparent)',
        }}
      />
    </div>
  );
}

/**
 * Componente de página de inicio
 * Página de aterrizaje principal con todas las secciones:
 * - Sección hero con botones CTA
 * - Búsqueda global
 * - Filas de animaciones estilo Netflix
 * - Cuadrícula de animaciones en tendencia
 * - Sección de categorías
 * - Se eliminaron: creadores, estadísticas y newsletter para diseño simplificado
 */
export function Home() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<AnimationProject | null>(null);

  // Función para ver un proyecto individual - navega a la página de animación
  const handleViewProject = (project: AnimationProject) => {
    navigate(`/animation/${project.slug}`);
  };

  // Función para navegar a diferentes páginas
  const handleNavigate = (path: string) => {
    if (path.startsWith('category:')) {
      navigate(`/category/${path.replace('category:', '')}`);
    } else if (path === 'explore') {
      navigate('/');
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* Meta tags SEO para página de inicio */}
      <SEOHead
        title="MotionCode - Animaciones de Código Efectivas & Interactivas"
        description="Descubre cientos de animaciones virales CSS, JavaScript, Canvas y Three.js. Código listo para copiar y pegar para desarrollo web moderno. Gratis para siempre."
        keywords={['animación', 'CSS', 'JavaScript', 'Canvas', 'Three.js', 'código', 'efectos']}
      />

      <div style={{ paddingTop: '84px' }} className="space-y-6">
        {/* Sección hero con CTA principal */}
        <HeroSection onNavigate={handleNavigate} />

        {/* Ubicación de anuncio - debajo del hero */}
        <AdBanner label="[Google AdSense — Debajo del Hero 728×90]" />

        {/* Búsqueda global con sugerencias */}
        <GlobalSearch onViewProject={handleViewProject} />

        <SectionDivider />

        {/* Filas de carrusel horizontal estilo Netflix */}
        <NetflixSection onViewProject={handleViewProject} />

        <SectionDivider />

        {/* Ubicación de anuncio - entre secciones */}
        <AdBanner label="[Google AdSense — Entre Secciones 728×90]" />

        {/* Cuadrícula de categorías de animación */}
        <CategoriesSection />

        <SectionDivider />

        {/* Ubicación de anuncio - mitad de página (rectángulo) */}
        <div className="px-5 sm:px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <div
              className="w-full rounded-2xl flex flex-col items-center justify-center"
              style={{
                minHeight: 250,
                background: 'rgba(8,10,28,0.4)',
                border: '1px dashed rgba(99,62,210,0.08)',
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#1a1a2e' }}>
                [Google AdSense — Mitad de página 300×250]
              </span>
            </div>
          </div>
        </div>

        {/* Se eliminaron creadores, estadísticas y newsletter para diseño simplificado */}

        {/* Ubicación de anuncio - antes del footer */}
        <AdBanner label="[Google AdSense — Antes del Footer 728×90]" />
      </div>
    </>
  );
}
