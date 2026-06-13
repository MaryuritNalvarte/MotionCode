// Enhanced search utility with full-text indexing and filtering
import type { AnimationProject } from './types';

/**
 * Search weight configuration for different fields
 * Higher weight = higher relevance in search results
 */
const SEARCH_WEIGHTS = {
  title: 10,
  tags: 8,
  category: 7,
  creator: 6,
  description: 5,
};

/**
 * Calculate relevance score for an animation based on search query
 * Uses weighted scoring across multiple fields
 */
function calculateSearchScore(animation: AnimationProject, query: string): number {
  let score = 0;
  const queryLower = query.toLowerCase();

  // Title matching (highest weight)
  if (animation.title.toLowerCase().includes(queryLower)) {
    score += SEARCH_WEIGHTS.title;
    // Exact title match gets extra boost
    if (animation.title.toLowerCase() === queryLower) {
      score += 5;
    }
  }

  // Tags matching
  animation.tags.forEach((tag) => {
    if (tag.toLowerCase().includes(queryLower)) {
      score += SEARCH_WEIGHTS.tags;
    }
  });

  // Category matching
  if (animation.category.toLowerCase().includes(queryLower)) {
    score += SEARCH_WEIGHTS.category;
  }

  // Creator matching
  if (animation.creator.toLowerCase().includes(queryLower)) {
    score += SEARCH_WEIGHTS.creator;
  }

  // Description matching
  if (animation.description.toLowerCase().includes(queryLower)) {
    score += SEARCH_WEIGHTS.description;
  }

  return score;
}

/**
 * Interface for grouped search results
 */
interface GroupedSearchResults {
  featured: AnimationProject[];
  trending: AnimationProject[];
  new: AnimationProject[];
  other: AnimationProject[];
}

/**
 * Search animations with weighted scoring and grouping
 * Groups results by category: Featured/Trending, New, Others
 * 
 * @param animations - array of animation projects to search
 * @param query - search query string
 * @param limit - maximum number of results to return (default: 50)
 * @returns grouped and scored search results
 * 
 * Usage:
 * const results = performSearch(allAnimations, 'cursor');
 * console.log(results.featured); // [{ title: 'Ghost Cursor Trail', ... }]
 */
export function performSearch(
  animations: AnimationProject[],
  query: string,
  limit: number = 50
): GroupedSearchResults {
  // Return empty results if query is empty
  if (!query.trim()) {
    return { featured: [], trending: [], new: [], other: [] };
  }

  // Score all animations and filter out zero-score results
  const scored = animations
    .map((animation) => ({
      animation,
      score: calculateSearchScore(animation, query),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Group results by category
  const result: GroupedSearchResults = {
    featured: [],
    trending: [],
    new: [],
    other: [],
  };

  scored.forEach(({ animation }) => {
    if (animation.isFeatured) {
      result.featured.push(animation);
    } else if (animation.isTrending) {
      result.trending.push(animation);
    } else if (animation.isNew) {
      result.new.push(animation);
    } else {
      result.other.push(animation);
    }
  });

  return result;
}

/**
 * Interface for search filter options
 */
interface SearchFilters {
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
  category?: string;
  isTrending?: boolean;
  isNew?: boolean;
}

/**
 * Advanced search with multiple filter options
 * Combines keyword search with categorical filters
 * 
 * @param animations - array of animations to filter
 * @param query - keyword search query
 * @param filters - filter options
 * @returns filtered and ranked results
 */
export function advancedSearch(
  animations: AnimationProject[],
  query: string,
  filters: SearchFilters = {}
): GroupedSearchResults {
  // Apply categorical filters first
  let filtered = animations;

  if (filters.difficulty && filters.difficulty !== 'All') {
    filtered = filtered.filter((a) => a.difficulty === filters.difficulty);
  }

  if (filters.category) {
    filtered = filtered.filter(
      (a) => a.categorySlug === filters.category || a.rows?.includes(filters.category)
    );
  }

  if (filters.isTrending) {
    filtered = filtered.filter((a) => a.isTrending);
  }

  if (filters.isNew) {
    filtered = filtered.filter((a) => a.isNew);
  }

  // Then apply keyword search on filtered results
  return performSearch(filtered, query);
}

/**
 * Get search suggestions based on partial query
 * Returns tags and categories that match the query
 */
export function getSearchSuggestions(
  animations: AnimationProject[],
  query: string,
  limit: number = 8
): Array<{ type: 'tag' | 'category' | 'title'; value: string; count: number }> {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase();
  const suggestions: Map<string, { type: string; count: number }> = new Map();

  animations.forEach((animation) => {
    // Check tags
    animation.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        const key = `tag:${tag}`;
        suggestions.set(key, {
          type: 'tag',
          count: (suggestions.get(key)?.count || 0) + 1,
        });
      }
    });

    // Check category
    if (animation.category.toLowerCase().includes(queryLower)) {
      const key = `category:${animation.category}`;
      suggestions.set(key, {
        type: 'category',
        count: (suggestions.get(key)?.count || 0) + 1,
      });
    }

    // Check title
    if (animation.title.toLowerCase().includes(queryLower)) {
      const key = `title:${animation.title}`;
      suggestions.set(key, {
        type: 'title',
        count: (suggestions.get(key)?.count || 0) + 1,
      });
    }
  });

  // Convert to array and sort by frequency
  return Array.from(suggestions.entries())
    .map(([key, data]) => {
      const [type, value] = key.split(':');
      return { type: type as 'tag' | 'category' | 'title', value, count: data.count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
