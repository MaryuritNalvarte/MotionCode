// Utility functions for SEO meta tags and structured data generation
import type { AnimationProject } from '../utils/types';

/**
 * Generate SEO title for animation page
 * Format: "Title - Category Animation | MotionCode"
 */
export function generateAnimationTitle(animation: AnimationProject): string {
  return `${animation.title} - ${animation.category} Animation | MotionCode`;
}

/**
 * Generate SEO description for animation page (120-160 chars)
 * Uses animation description or generates from metadata
 */
export function generateAnimationDescription(animation: AnimationProject): string {
  if (animation.description && animation.description.length <= 160) {
    return animation.description;
  }
  return `${animation.title} animation with ${animation.difficulty} difficulty level. ${animation.views} views, ${animation.stars} stars. Copy-paste ready code.`;
}

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://motioncode.com';
  return `${baseUrl}${path}`;
}

/**
 * Generate Open Graph meta tags object
 */
export function generateOGTags(animation: AnimationProject, path: string) {
  return {
    'og:title': generateAnimationTitle(animation),
    'og:description': generateAnimationDescription(animation),
    'og:type': 'website',
    'og:url': generateCanonicalUrl(path),
    'og:image': `${generateCanonicalUrl('/preview')}/${animation.slug}.webp`,
    'og:site_name': 'MotionCode',
  };
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterTags(animation: AnimationProject) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': generateAnimationTitle(animation),
    'twitter:description': generateAnimationDescription(animation),
    'twitter:image': `https://motioncode.com/preview/${animation.slug}.webp`,
    'twitter:site': '@motioncode_',
  };
}

/**
 * Generate JSON-LD structured data for animation
 */
export function generateAnimationSchema(animation: AnimationProject, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': animation.title,
    'description': animation.description,
    'url': generateCanonicalUrl(path),
    'image': `https://motioncode.com/preview/${animation.slug}.webp`,
    'creator': {
      '@type': 'Person',
      'name': animation.creator,
    },
    'datePublished': new Date().toISOString().split('T')[0],
    'keywords': animation.tags.join(', '),
    'inLanguage': 'en',
    'isAccessibleForFree': true,
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'MotionCode',
    'description': 'The premier copy-paste animation library for frontend developers',
    'url': 'https://motioncode.com',
    'sameAs': [
      'https://twitter.com/motioncode_',
      'https://github.com/motioncode',
    ],
  };
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'MotionCode',
    'description': 'The premier copy-paste animation library for modern frontend developers',
    'url': 'https://motioncode.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://motioncode.com?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
