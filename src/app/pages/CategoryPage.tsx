// Category page - shows animations filtered by category with sorting and filtering
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CategoryPage as CategoryPageComponent } from '../components/CategoryPage';
import { SEOHead } from '../components/SEOHead';
import { allAnimations, categories } from '../utils/data-bridge';

/**
 * CategoryPage component
 * 
 * URL: /category/:categoryId
 * Examples: /category/css, /category/javascript, /category/trending, /category/new
 * 
 * Shows animations filtered by:
 * - Category slug (css, javascript, canvas, etc)
 * - Special categories (trending, new, featured)
 * 
 * Features:
 * - Sorting by popularity, newest, most stars, A-Z
 * - Filtering by difficulty level
 * - Grid/list view toggle
 * - SEO optimized with category meta tags
 */
export function CategoryPage() {
  // Get category ID from URL params
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  // Find category metadata
  const category = categories.find((c) => c.id === categoryId);
  const isTrending = categoryId === 'trending';
  const isNew = categoryId === 'new';

  // Determine page title and icon
  let pageTitle = category?.name || (isTrending ? 'Trending Animations' : isNew ? 'New Animations' : categoryId || 'Animations');
  let pageIcon = category?.icon || (isTrending ? '🔥' : isNew ? '✨' : '✨');

  // Filter animations by category
  const filteredAnimations = useMemo(() => {
    let items = allAnimations;

    if (isTrending) {
      items = items.filter((a) => a.isTrending);
    } else if (isNew) {
      items = items.filter((a) => a.isNew);
    } else if (categoryId) {
      items = items.filter((a) => a.categorySlug === categoryId || a.rows?.includes(categoryId));
    }

    return items;
  }, [categoryId, isTrending, isNew]);

  return (
    <>
      {/* SEO meta tags */}
      <SEOHead
        title={`${pageTitle} - MotionCode Animation Library`}
        description={`Explore ${filteredAnimations.length} ${pageTitle.toLowerCase()} animations with copy-paste ready code`}
        keywords={[categoryId || 'animation', 'animation', 'code']}
      />

      <div style={{ paddingTop: '60px', minHeight: '100vh' }}>
        <CategoryPageComponent
          categoryId={categoryId!}
          onBack={() => navigate('/')}
          onViewProject={(proj) => navigate(`/animation/${proj.slug}`)}
        />
      </div>
    </>
  );
}
