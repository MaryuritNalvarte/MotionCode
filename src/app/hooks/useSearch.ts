// Hook for advanced search functionality with debouncing
import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { AnimationProject } from '../utils/types';
import { performSearch, advancedSearch, getSearchSuggestions } from '../utils/search';

interface SearchFilters {
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
  category?: string;
  isTrending?: boolean;
  isNew?: boolean;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: {
    featured: AnimationProject[];
    trending: AnimationProject[];
    new: AnimationProject[];
    other: AnimationProject[];
  };
  suggestions: Array<{ type: 'tag' | 'category' | 'title'; value: string; count: number }>;
  recentSearches: string[];
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}

/**
 * Hook for advanced search with filtering, suggestions and history
 * Manages search state, results, suggestions, and recent search history
 * with localStorage persistence
 * 
 * @param animations - array of animations to search
 * @returns search state and control functions
 * 
 * Usage:
 * const {
 *   query, setQuery, results, suggestions, recentSearches,
 *   addRecentSearch, filters, setFilters
 * } = useSearch(allAnimations);
 */
export function useSearch(animations: AnimationProject[]): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);

  // Memoize results to prevent unnecessary recalculations
  const results = useMemo(() => {
    if (Object.keys(filters).length > 0) {
      return advancedSearch(animations, query, filters);
    }
    return performSearch(animations, query);
  }, [animations, query, filters]);

  // Memoize suggestions
  const suggestions = useMemo(
    () => getSearchSuggestions(animations, query, 8),
    [animations, query]
  );

  // Add to recent searches
  const addRecentSearch = useCallback(
    (search: string) => {
      if (search.trim().length > 0) {
        setRecentSearches((prev) => {
          const filtered = prev.filter((s) => s !== search);
          return [search, ...filtered].slice(0, 10); // Keep last 10 searches
        });
      }
    },
    [setRecentSearches]
  );

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  return {
    query,
    setQuery,
    results,
    suggestions,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    filters,
    setFilters,
  };
}
