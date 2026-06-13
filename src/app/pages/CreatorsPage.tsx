// Creators page - showcase all animation creators
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { CreatorsSection } from '../components/CreatorsSection';

/**
 * CreatorsPage component
 * 
 * URL: /creators
 * 
 * Shows all animation creators with their statistics
 * SEO optimized
 */
export function CreatorsPage() {
  return (
    <>
      {/* SEO meta tags */}
      <SEOHead
        title="Animation Creators & Artists - MotionCode"
        description="Meet the talented creators behind MotionCode animations. Discover creators by their work and follow their latest animations."
        keywords={['creators', 'artists', 'developers', 'animators']}
      />

      <div style={{ paddingTop: '60px', minHeight: '100vh' }}>
        <CreatorsSection />
      </div>
    </>
  );
}
