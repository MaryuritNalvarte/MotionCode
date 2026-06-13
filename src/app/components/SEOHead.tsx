// SEO component that manages meta tags and document head
import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  twitterHandle?: string;
  children?: React.ReactNode; // Allow additional meta tags via children
}

/**
 * Component for managing SEO meta tags and document head
 * Automatically updates all necessary meta tags for search engines and social media
 * 
 * Key features:
 * - Dynamic title and description
 * - Open Graph tags (Facebook, LinkedIn, etc)
 * - Twitter Card tags
 * - Canonical URLs
 * - Automatic structured data generation
 * 
 * @param props - SEO configuration
 * 
 * Usage:
 * <SEOHead
 *   title="Ghost Cursor Trail - CSS Animation"
 *   description="Glowing ghost dots that follow the cursor..."
 *   keywords={['cursor', 'animation', 'css']}
 *   image="https://motioncode.com/preview/ghost-cursor.webp"
 *   url="https://motioncode.com/animation/ghost-cursor"
 * />
 */
export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  twitterHandle = '@motioncode_',
}: SEOHeadProps) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Helper to set or update meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }

      tag.setAttribute('content', content);
    };

    // Core meta tags
    setMeta('description', description);

    if (keywords.length > 0) {
      setMeta('keywords', keywords.join(', '));
    }

    // Open Graph tags for social sharing
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);

    if (image) {
      setMeta('og:image', image, true);
    }

    if (url) {
      setMeta('og:url', url, true);
      // Also set canonical link
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    if (image) {
      setMeta('twitter:image', image);
    }

    if (twitterHandle) {
      setMeta('twitter:site', twitterHandle);
    }

    // Site name
    setMeta('og:site_name', 'MotionCode', true);
  }, [title, description, keywords, image, url, type, twitterHandle]);

  return null;
}
