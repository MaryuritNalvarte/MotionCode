// Categories overview page - grid of all animation categories
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { CategoriesSection } from '../components/CategoriesSection';

/**
 * CategoriesPage component
 * 
 * URL: /categories
 * 
 * Shows grid view of all available animation categories
 * Each category links to its dedicated page
 * SEO optimized
 */
export function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* SEO meta tags */}
      <SEOHead
        title="Animation Categories - MotionCode"
        description="Browse all animation categories including CSS, JavaScript, Canvas, Three.js, and more. Discover animations by technology and type."
        keywords={['categories', 'CSS', 'JavaScript', 'Canvas', 'Three.js', 'animation']}
      />

      <div style={{ paddingTop: '60px', minHeight: '100vh' }}>
        <CategoriesSection onNavigate={(target) => navigate(`/category/${target}`)} />
      </div>
    </>
  );
}
