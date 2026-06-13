// Hook for loading category animations with filtering and sorting
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AnimationProject } from '../utils/types';

interface UseCategoryReturn {
  animations: AnimationProject[];
  loading: boolean;
  error: string | null;
  total: number;
}

/**
 * Hook for loading animations for a specific category
 * Handles filtering by category and special categories like 'trending' and 'new'
 * 
 * In production, would fetch from:
 * GET /api/categories/:categoryId
 * or
 * GET /content/metadata.json?category=:categoryId
 * 
 * @param categoryId - category identifier (e.g., 'css', 'trending', 'new')
 * @param allAnimations - array of all animations for filtering
 * @returns filtered animations, loading state, error state
 * 
 * Usage:
 * const { animations, loading, total } = useCategory('css', allAnimations);
 */
export function useCategory(
  categoryId: string | undefined,
  allAnimations: AnimationProject[]
): UseCategoryReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize filtered results to avoid unnecessary recalculations
  const animations = useMemo(() => {
    if (!categoryId) return [];

    // TODO: Replace this with actual API/file loading
    // const response = await fetch(`/api/categories/${categoryId}`);
    // const data = await response.json();

    // For now, filter from in-memory array
    let filtered = allAnimations;

    if (categoryId === 'trending') {
      filtered = filtered.filter((a) => a.isTrending);
    } else if (categoryId === 'new') {
      filtered = filtered.filter((a) => a.isNew);
    } else {
      // Filter by categorySlug or rows array
      filtered = filtered.filter(
        (a) => a.categorySlug === categoryId || a.rows?.includes(categoryId)
      );
    }

    return filtered;
  }, [categoryId, allAnimations]);

  useEffect(() => {
    setLoading(false);
  }, [categoryId]);

  return {
    animations,
    loading,
    error,
    total: animations.length,
  };
}
