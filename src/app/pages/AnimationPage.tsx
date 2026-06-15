// Individual animation page - SEO optimized with dynamic URL
// Shows detailed animation info, code, video, and related animations
import { useParams, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { useMetaTags } from '../hooks/useMetaTags';
import { allAnimations } from '../utils/data-bridge';
import { ProjectPage } from '../components/ProjectPage';
import type { AnimationProject } from '../utils/types';

/**
 * AnimationPage component
 * 
 * URL: /animation/:slug
 * Examples: /animation/ghost-cursor, /animation/neon-heart, /animation/particle-galaxy
 * 
 * Features:
 * - Dynamic SEO with meta tags and structured data
 * - Shows animation code (HTML, CSS, JavaScript)
 * - Displays embedded video if available
 * - Shows related animations
 * - Real URLs for each animation (indexable by Google)
 */
export function AnimationPage() {
  // Get animation slug from URL params
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Find animation by slug from allAnimations (uses auto-discovery system)
  const animation = allAnimations.find((a: AnimationProject) => a.slug === slug);

  // Dynamically update meta tags based on animation data
  useMetaTags({
    title: animation?.title || 'Loading...',
    description: animation?.description || 'View this amazing animation',
    animation,
  });

  // Handle error state
  if (!animation) {
    return (
      <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="max-w-7xl mx-auto">
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
            Animation Not Found
          </h1>
          <p style={{ marginBottom: '20px' }}>
            The animation "{slug}" could not be found.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Render animation detail page
  return (
    <>
      <SEOHead
        title={`${animation.title} - ${animation.category} Animation | MotionCode`}
        description={animation.description}
        keywords={animation.tags}
        image={`https://motioncode.com/preview/${animation.slug}.webp`}
        url={`https://motioncode.com/animation/${animation.slug}`}
      />
      
      {/* Reuse existing ProjectPage component */}
      <ProjectPage
        project={animation}
        onBack={() => navigate('/')}
        onViewProject={(proj: AnimationProject) => navigate(`/animation/${proj.slug}`)}
      />
    </>
  );
}
