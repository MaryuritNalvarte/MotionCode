// 404 Not Found page
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

/**
 * NotFoundPage component
 * 
 * URL: /* (catch-all)
 * 
 * 404 page shown when route is not found
 * SEO friendly with proper status indication
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* SEO meta tags */}
      <SEOHead
        title="Page Not Found - MotionCode"
        description="The page you're looking for doesn't exist. Return to MotionCode to explore animations."
      />

      <div style={{ paddingTop: '60px', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div style={{ textAlign: 'center' }}>
            {/* 404 heading with gradient */}
            <div
              style={{
                fontSize: '120px',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '20px',
              }}
            >
              404
            </div>

            {/* Error message */}
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
              Page Not Found
            </h1>

            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '40px' }}>
              The animation you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Back to Home
              </button>

              <button
                onClick={() => navigate('/animations')}
                style={{
                  padding: '12px 32px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: '#8b5cf6',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                }}
              >
                Browse All Animations
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
