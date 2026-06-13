// Hook for dynamic meta tags management (SEO)
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { AnimationProject } from '../utils/types';
import {
  generateAnimationTitle,
  generateAnimationDescription,
  generateCanonicalUrl,
  generateOGTags,
  generateTwitterTags,
  generateAnimationSchema,
} from '../utils/seo';

interface MetaTagsOptions {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  animation?: AnimationProject;
}

/**
 * Hook for managing dynamic meta tags and SEO
 * Automatically updates document head with proper meta tags for the current page
 * 
 * @param options - meta tag configuration options
 * 
 * Usage:
 * useMetaTags({
 *   title: 'Ghost Cursor Trail',
 *   description: 'A glowing ghost cursor animation',
 *   animation: animationProject,
 * });
 */
export function useMetaTags(options: MetaTagsOptions) {
  const location = useLocation();

  useEffect(() => {
    const { title, description, animation } = options;

    // Update document title
    document.title = title;

    // Helper function to set or create meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      let tag = document.querySelector(
        property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      );

      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }

      tag.setAttribute('content', content);
    };

    // Set description
    setMetaTag('description', description);

    // Set keywords
    if (animation) {
      setMetaTag('keywords', animation.tags.join(', '));
    }

    // Set Open Graph tags
    const ogTags = animation ? generateOGTags(animation, location.pathname) : {};
    Object.entries(ogTags).forEach(([key, value]) => {
      setMetaTag(key, String(value), true);
    });

    // Set Twitter tags
    if (animation) {
      const twitterTags = generateTwitterTags(animation);
      Object.entries(twitterTags).forEach(([key, value]) => {
        setMetaTag(key, String(value));
      });
    }

    // Set canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = generateCanonicalUrl(location.pathname);
    if (!canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonicalUrl;
      document.head.appendChild(link);
    } else {
      canonical.setAttribute('href', canonicalUrl);
    }

    // Add structured data (JSON-LD)
    if (animation) {
      const schema = generateAnimationSchema(animation, location.pathname);
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }
  }, [options, location.pathname]);
}
