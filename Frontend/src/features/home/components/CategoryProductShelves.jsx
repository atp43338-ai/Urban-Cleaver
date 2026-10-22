import React from 'react';
import { Link } from 'react-router-dom';
import HomeProductCard from './HomeProductCard';
import { PackageOpen, ArrowRight, RotateCcw } from 'lucide-react';

const ORDERED_CATEGORY_NAMES = [
  'Indian beef boneless',
  'Indian mutton with bone',
  'Indian mutton boneless',
  'Pakisthan beef boneless',
  'Pakisthan beef with bone',
  'Keniyan mutton with bone',
];

const DEFAULT_FALLBACK_CATEGORIES = [
  { id: 'indian-beef-boneless', name: 'Indian beef boneless' },
  { id: 'indian-mutton-with-bone', name: 'Indian mutton with bone' },
  { id: 'indian-mutton-boneless', name: 'Indian mutton boneless' },
  { id: 'pakisthan-beef-boneless', name: 'Pakisthan beef boneless' },
  { id: 'pakisthan-beef-with-bone', name: 'Pakisthan beef with bone' },
  { id: 'keniyan-mutton-with-bone', name: 'Keniyan mutton with bone' },
];

/**
 * CategoryProductShelves:
 * Multi-row category-segregated product showcase matching the visual structure:
 * - Displays 6 dedicated category shelves (Indian beef boneless, Indian mutton with bone, etc.)
 * - Up to 5 compact product cards horizontally per shelf (grid-cols-2 to lg:grid-cols-5)
 * - Dynamic category matching by MongoDB ObjectId or normalized name
 * - Resilient filtering when a specific category, recipe, or search query is active
 */
const CategoryProductShelves = ({
  categories = [],
  products = [],
  loading = false,
  selectedCategory = 'all',
  activeRecipe = 'all',
  searchQuery = '',
  onSelectCategory,
  onResetFilters,
}) => {
  // Skeleton Loader for 5-card shelf
  if (loading) {
    return (
      <div className="space-y-12">
        {[1, 2, 3].map((shelfIdx) => (
          <div key={shelfIdx} className="space-y-4 animate-pulse">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
              <div className="h-5 bg-zinc-200 rounded w-48"></div>
              <div className="h-4 bg-zinc-100 rounded w-16"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5].map((cardIdx) => (
                <div key={cardIdx} className="bg-white border border-zinc-200 rounded-xl p-3 space-y-2">
                  <div className="w-full aspect-square bg-zinc-100 rounded-lg"></div>
                  <div className="h-3 bg-zinc-100 rounded w-3/4"></div>
                  <div className="h-2 bg-zinc-100 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-100 rounded w-1/3"></div>
                  <div className="h-7 bg-zinc-200 rounded-md w-full"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Use provided categories or fallback
  const rawList = categories.length > 0 ? categories : DEFAULT_FALLBACK_CATEGORIES;

  // Sort categories according to official base order, then append any additional admin categories
  const sortedCategories = [...rawList].sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();

    const aIdx = ORDERED_CATEGORY_NAMES.findIndex((n) => n.toLowerCase() === aName);
    const bIdx = ORDERED_CATEGORY_NAMES.findIndex((n) => n.toLowerCase() === bName);

    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return aName.localeCompare(bName);
  });

  // Category filter check
  const isCategoryMatch = (cat) => {
    if (!selectedCategory || selectedCategory === 'all') return true;
    const catId = String(cat._id || cat.id || '');
    const cleanSelected = String(selectedCategory).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = String(cat.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSlug = String(cat.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      catId === String(selectedCategory) ||
      cleanSelected === cleanName ||
      cleanSelected === cleanSlug ||
      cleanName.includes(cleanSelected)
    );
  };

  // Determine shelves to process
  let visibleCategories = sortedCategories;
  if (selectedCategory && selectedCategory !== 'all') {
    const filtered = sortedCategories.filter(isCategoryMatch);
    if (filtered.length > 0) {
      visibleCategories = filtered;
    }
  }

  // Group products by category
  const shelvesData = visibleCategories.map((category) => {
    const catId = String(category._id || category.id || '');
    const catNameLower = (category.name || '').toLowerCase();
    const cleanCatName = catNameLower.replace(/[^a-z0-9]/g, '');

    const matchedProducts = products.filter((prod) => {
      // 1. Direct ObjectId match
      const prodCatId = String(prod.category?._id || prod.category || '');
      if (prodCatId && catId && prodCatId === catId) return true;

      // 2. Normalized category name match
      const prodCatName = (prod.category?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (prodCatName && cleanCatName && prodCatName === cleanCatName) return true;

      // 3. Fallback: Check if product name or description contains category origin/cut
      const prodName = (prod.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanCatName && prodName.includes(cleanCatName)) return true;

      return false;
    });

    return {
      category,
      products: matchedProducts,
    };
  });

  const isFilterActive =
    (selectedCategory && selectedCategory !== 'all') ||
    (activeRecipe && activeRecipe !== 'all') ||
    (searchQuery && searchQuery.trim().length > 0);

  const totalMatchedCount = shelvesData.reduce((acc, s) => acc + s.products.length, 0);

  // If a filter is active and 0 products match overall, show clean search empty state
  if (isFilterActive && totalMatchedCount === 0) {
    return (
      <div className="py-14 text-center bg-zinc-50 border border-zinc-200 rounded-2xl p-8 max-w-lg mx-auto space-y-4">
        <PackageOpen size={32} className="mx-auto text-zinc-400 stroke-[1.5]" />
        <div className="space-y-1">
          <h4 className="text-base font-bold text-black">No matching cuts found</h4>
          <p className="text-xs text-zinc-500">
            We couldn't find any butchery cuts matching your current filter or search criteria.
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    );
  }

  // Filter out empty shelves if a specific cut/recipe filter or search is active
  const shelvesToRender = isFilterActive
    ? shelvesData.filter((shelf) => shelf.products.length > 0)
    : shelvesData;

  return (
    <div className="space-y-10 sm:space-y-14">
      {shelvesToRender.map(({ category, products: shelfMatchedProducts }) => {
        const catId = category._id || category.id;
        const displayProducts = shelfMatchedProducts.slice(0, 5);

        return (
          <section key={catId || category.name} className="space-y-4">
            {/* Shelf Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
              <div className="flex items-baseline gap-2.5">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-zinc-900 uppercase">
                  {category.name}
                </h3>
                <span className="text-[11px] font-mono text-zinc-400">
                  ({shelfMatchedProducts.length} {shelfMatchedProducts.length === 1 ? 'Cut' : 'Cuts'})
                </span>
              </div>

              <Link
                to={`/products?category=${catId || category.slug || category.name}`}
                className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 hover:text-black flex items-center gap-1 transition cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Product Cards Row (5 Columns on Desktop) */}
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {displayProducts.map((product) => (
                  <HomeProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Clean shelf empty state */
              <div className="py-8 text-center bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                <p className="text-xs text-zinc-400">
                  Fresh morning butchery cuts arriving soon for {category.name}.
                </p>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default CategoryProductShelves;
