// Trending page - dedicated trending animations showcase
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { TrendingPage as TrendingPageComponent } from '../components/TrendingPage';

/**
 * TrendingPage component
 * 
 * URL: /trending
 * 
 * Dedicated page showcasing the most trending animations this week
 * SEO optimized with dynamic meta tags
 */
export function TrendingPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* SEO meta tags for trending page */}
      <SEOHead
        title="Trending Animations - MotionCode"
        description="The most popular and trending web animations this week. Copy-paste ready code snippets for your projects."
        keywords={['trending', 'animation', 'popular', 'viral']}
      />

      <div style={{ paddingTop: '60px' }}>
        <TrendingPageComponent
          onBack={() => navigate('/')}
          onViewProject={(proj) => navigate(`/animation/${proj.slug}`)}
        />
      </div>
    </>
  );
}
