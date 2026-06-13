// Hook for loading single animation with caching
import { useState, useEffect, useCallback } from 'react';
import type { AnimationProject } from '../utils/types';

interface UseAnimationReturn {
  animation: AnimationProject | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Hook for loading a single animation by slug
 * Currently loads from in-memory data, but ready for API integration
 * 
 * In production, this would fetch from:
 * GET /api/animations/:slug
 * or
 * GET /content/:slug/metadata.json
 * 
 * @param slug - animation slug (e.g., 'ghost-cursor')
 * @param allAnimations - array of all animations for fallback
 * @returns animation data, loading state, error state
 * 
 * Usage:
 * const { animation, loading, error } = useAnimation('ghost-cursor', allAnimations);
 */
export function useAnimation(
  slug: string | undefined,
  allAnimations: AnimationProject[]
): UseAnimationReturn {
  const [animation, setAnimation] = useState<AnimationProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!slug) {
        setError('No animation slug provided');
        setAnimation(null);
        setLoading(false);
        return;
      }

      // TODO: Replace this with actual API/file loading
      // const response = await fetch(`/api/animations/${slug}`);
      // const data = await response.json();

      // For now, find from in-memory array
      const found = allAnimations.find((a) => a.slug === slug);

      if (!found) {
        setError(`Animation "${slug}" not found`);
        setAnimation(null);
      } else {
        setAnimation(found);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load animation');
      setAnimation(null);
    } finally {
      setLoading(false);
    }
  }, [slug, allAnimations]);

  useEffect(() => {
    load();
  }, [load]);

  return { animation, loading, error, reload: load };
}
