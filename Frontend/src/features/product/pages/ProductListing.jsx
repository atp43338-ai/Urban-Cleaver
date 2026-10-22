import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import ProductListingHero from '../components/ProductListingHero';
import ProductListingSidebar from '../components/ProductListingSidebar';
import ProductListingGrid from '../components/ProductListingGrid';
import { X, ArrowUpDown, Search } from 'lucide-react';

/**
 * ProductListing:
 * Modern butcher shop e-commerce catalog page.
 * Composed of:
 * 1. ProductListingHero: Top Category Banner & Breadcrumbs
 * 2. ProductListingSidebar: Sticky filter sidebar with Price Range Slider & Culinary Cut Tags
 * 3. ProductListingGrid: 4-Column responsive product grid with loading skeletons & empty state
 */
const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  // Catalog Data
  const [categories, setCategories] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 1500]);
  const [selectedCut, setSelectedCut] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // 1. Fetch Categories & Culinary Cuts on Mount
  useEffect(() => {
    let isMounted = true;

    const fetchMeta = async () => {
      try {
        const [catRes, cutRes] = await Promise.allSettled([
          productService.getCategories(),
          productService.getCuts(),
        ]);

        if (isMounted) {
          if (catRes.status === 'fulfilled' && Array.isArray(catRes.value?.categories)) {
            setCategories(catRes.value.categories);
          } else {
            setCategories([]);
          }
          if (cutRes.status === 'fulfilled' && Array.isArray(cutRes.value?.cuts)) {
            setCuts(cutRes.value.cuts);
          } else {
            setCuts([]);
          }
        }
      } catch (err) {
        console.warn('Failed to load catalog metadata:', err.message);
        if (isMounted) {
          setCategories([]);
          setCuts([]);
        }
      }
    };

    fetchMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Products whenever categoryParam changes
  useEffect(() => {
    let isMounted = true;

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (categoryParam && categoryParam !== 'all') {
          params.category = categoryParam;
        }

        const res = await productService.getProducts(params);
        if (isMounted) {
          const fetchedList = res.products || [];
          setProducts(fetchedList);

          // Dynamically scale max price range if products exist
          if (Array.isArray(fetchedList) && fetchedList.length > 0) {
            const maxP = Math.max(...(fetchedList || []).map((p) => Number(p?.price) || 0));
            const calculatedMax = Math.max(Math.ceil(maxP / 100) * 100, 1000);
            setPriceRange([0, calculatedMax]);
            setAppliedPriceRange([0, calculatedMax]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch catalog products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryProducts();
    return () => {
      isMounted = false;
    };
  }, [categoryParam]);

  // 3. Resolve Current Category Object
  const currentCategory = useMemo(() => {
    if (!categoryParam || categoryParam === 'all') {
      return {
        name: 'All Meats',
        description:
          '100% net usable weight standards. Trimmed clean of sinew, bone dust, and excess fat before precision portioning.',
      };
    }

    const cleanParam = String(categoryParam).toLowerCase().replace(/[^a-z0-9]/g, '');

    const matched = categories.find((cat) => {
      const catId = String(cat._id || cat.id || '');
      const cleanName = String(cat.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanSlug = String(cat.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return catId === categoryParam || cleanParam === cleanSlug || cleanParam === cleanName;
    });

    if (matched) return matched;

    // Fallback humanized name
    const humanized = categoryParam
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      name: humanized,
      description: 'Precision portioned artisanal cuts sourced directly from certified butchers.',
    };
  }, [categoryParam, categories]);

  // Max price available for slider
  const maxAvailablePrice = useMemo(() => {
    if (!Array.isArray(products) || !products.length) return 1500;
    const max = Math.max(...(products || []).map((p) => Number(p?.price) || 0));
    return Math.max(Math.ceil(max / 100) * 100, 1000);
  }, [products]);

  // 4. Apply In-Memory Filters (Cut, Price, Stock, Search & Sort)
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    // Culinary Cut Filter
    if (selectedCut && selectedCut !== 'all') {
      const cleanCut = String(selectedCut).toLowerCase().replace(/[^a-z0-9]/g, '');
      list = list.filter((product) => {
        const productCut = String(product.cutType || product.recipeCategory || product.recipe || '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
        const productName = String(product.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const hasCutArray =
          Array.isArray(product.cutTypes) &&
          product.cutTypes.some((ct) => {
            const cleanCt = String(ct?.name || ct?.slug || ct || '')
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '');
            return cleanCt.includes(cleanCut) || cleanCut.includes(cleanCt);
          });

        return (
          productCut.includes(cleanCut) ||
          cleanCut.includes(productCut) ||
          productName.includes(cleanCut) ||
          hasCutArray
        );
      });
    }

    // Price Range Filter
    list = list.filter((product) => {
      const price = Number(product.price || 0);
      return price >= appliedPriceRange[0] && price <= appliedPriceRange[1];
    });

    // In Stock Only Filter
    if (inStockOnly) {
      list = list.filter((product) => product.isStock !== false);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (product) =>
          (product.name || '').toLowerCase().includes(q) ||
          (product.description || '').toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [products, selectedCut, appliedPriceRange, inStockOnly, searchQuery, sortBy]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSelectedCut('all');
    setPriceRange([0, maxAvailablePrice]);
    setAppliedPriceRange([0, maxAvailablePrice]);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCut !== 'all' ||
    appliedPriceRange[0] > 0 ||
    appliedPriceRange[1] < maxAvailablePrice ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* 1. Category Hero Banner */}
      <ProductListingHero
        category={currentCategory}
        count={filteredProducts.length}
      />

      {/* Main Listing Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Content Area (4-Column Grid) */}
          <main className="flex-1 w-full min-w-0">
            {/* Top Toolbar: Search, Active Tags & Sort */}
            <div className="bg-white border border-zinc-200 rounded-xl p-3.5 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left: Quick Search */}
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search cuts in this category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
                />
              </div>

              {/* Right: Items Count & Sort Selector */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="text-xs text-zinc-500 font-mono">
                  Showing <strong className="text-black font-semibold">{filteredProducts.length}</strong> items
                </span>

                <div className="flex items-center gap-1.5 border border-zinc-200 bg-zinc-50 rounded-lg px-2.5 py-1">
                  <ArrowUpDown size={12} className="text-zinc-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs text-zinc-800 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                  Active Filters:
                </span>

                {selectedCut !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-md font-medium">
                    <span>Cut: {selectedCut}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCut('all')}
                      className="hover:text-red-400 transition cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {(appliedPriceRange[0] > 0 || appliedPriceRange[1] < maxAvailablePrice) && (
                  <span className="inline-flex items-center gap-1 text-xs bg-zinc-100 text-zinc-800 border border-zinc-200 px-2.5 py-1 rounded-md font-medium font-mono">
                    <span>₹{appliedPriceRange[0]} - ₹{appliedPriceRange[1]}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceRange([0, maxAvailablePrice]);
                        setAppliedPriceRange([0, maxAvailablePrice]);
                      }}
                      className="hover:text-red-500 transition cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
                    <span>In Stock Only</span>
                    <button
                      type="button"
                      onClick={() => setInStockOnly(false)}
                      className="hover:text-emerald-950 transition cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-800 underline font-medium cursor-pointer ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* 4-Column Product Grid */}
            <ProductListingGrid
              products={filteredProducts}
              loading={loading}
              onResetFilters={handleResetFilters}
            />
          </main>

          {/* Sticky Filter Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <ProductListingSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCut={selectedCut}
              setSelectedCut={setSelectedCut}
              onApplyFilter={(range) => setAppliedPriceRange(range)}
              onResetFilters={handleResetFilters}
              cuts={cuts}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              maxAvailablePrice={maxAvailablePrice}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
