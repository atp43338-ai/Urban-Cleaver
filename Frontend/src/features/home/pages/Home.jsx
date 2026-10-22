import React, { useState, useEffect } from 'react';
import productService from '@/features/product/services/productService';
import Navbar from '../components/Navbar';
import SubCategoryNav from '../components/SubCategoryNav';
import HeroSection from '../components/HeroSection';
import CircularCategoryBar from '../components/CircularCategoryBar';
import RecipeFilterSection from '../components/RecipeFilterSection';
import CategoryFilterSection from '../components/CategoryFilterSection';
import CategoryProductShelves from '../components/CategoryProductShelves';
import SubscriptionBanner from '../components/SubscriptionBanner';
import FreshBatchBadge from '../components/FreshBatchBadge';
import { Search, X } from 'lucide-react';

/**
 * Home:
 * Orchestrator for Urban Cleaver customer storefront.
 * Structure:
 * 1. Fixed Top Dark Navbar
 * 2. SubCategoryNav (Flows beneath fixed navbar with mt-20 offset)
 * 3. Edge-to-Edge HeroSection (Hero butcher banner)
 * 4. CircularCategoryBar (Curated meat plate categories)
 * 5. CategoryProductShelves (Multi-row category-segregated product showcase, 5 cards per shelf)
 * 6. Weekly Subscription Cleaver Pass
 */
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState('all');
  const [search, setSearch] = useState('');

  // Fetch Categories & Cuts on mount
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const [catRes, cutRes] = await Promise.allSettled([
          productService.getCategories(),
          productService.getCuts(),
        ]);

        if (isMounted) {
          if (catRes.status === 'fulfilled' && catRes.value?.categories) {
            setCategories(catRes.value.categories);
          }
          if (cutRes.status === 'fulfilled' && cutRes.value?.cuts) {
            setCuts(cutRes.value.cuts);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial home catalog data:', err);
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Products with Debounce whenever filters change
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (selectedRecipe && selectedRecipe !== 'all') {
          params.recipe = selectedRecipe;
        }
        if (search.trim()) {
          params.search = search.trim();
        }

        const res = await productService.getProducts(params);
        if (isMounted) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 150);
    return () => {
      isMounted = false;
      clearTimeout(debounce);
    };
  }, [selectedCategory, selectedRecipe, search]);

  // Handle Category Selection from any component
  const handleSelectCategory = (catOrItem) => {
    const targetId = catOrItem?._id || catOrItem?.id || catOrItem;

    if (!targetId || targetId === 'all' || catOrItem?.isAll || selectedCategory === targetId) {
      setSelectedCategory('all');
    } else {
      setSelectedCategory(targetId);
    }

    const el = document.getElementById('cuts-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Recipe / Cut Style Selection
  const handleSelectRecipe = (recipeId) => {
    setSelectedRecipe((prev) => (prev === recipeId ? 'all' : recipeId));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedRecipe('all');
    setSearch('');
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* 1. Fixed Dark Navbar */}
      <Navbar
        search={search}
        onSearchChange={setSearch}
        cartCount={0}
      />

      {/* 2. Sub-Category Strip (Flows directly beneath navbar) */}
      <SubCategoryNav
        categories={categories}
        activeCategoryId={selectedCategory}
        onSelectCategory={handleSelectCategory}
        className="mt-20"
      />

      {/* 3. Full-Bleed Edge-to-Edge Hero Banner */}
      <HeroSection />

      {/* 4. Circular Plate Categories Showcase (Dynamic from Backend) */}
      <CircularCategoryBar
        categories={categories}
        activeId={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 5. Product Catalog & Category Shelves Container */}
      <section id="cuts-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-8">
          {/* Header Strip with Live Batch Status & In-Catalog Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-5">
            <div className="space-y-1">
              <FreshBatchBadge time="6:00 AM" facility="Sterile Cold-Chain" />
              <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight uppercase">
                Artisanal Cuts Prepared for Your Pot
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
                Pakistani &amp; Indian cuts — precision sliced daily. Zero unwanted trimmings.
              </p>
            </div>

            {/* Catalog Search Field */}
            <div className="relative w-full md:w-72">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search cuts (e.g. mutton, biriyani)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-8 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-0.5 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Department Tabs */}
          <CategoryFilterSection
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />

          {/* Dynamic Recipe / Cut Style Filter */}
          <RecipeFilterSection
            cuts={cuts}
            activeRecipe={selectedRecipe}
            onSelectRecipe={handleSelectRecipe}
            totalCount={products.length}
          />

          {/* Multi-Row Category-Segregated Product Shelves (5 Cards Per Row) */}
          <CategoryProductShelves
            categories={categories}
            products={products}
            loading={loading}
            selectedCategory={selectedCategory}
            activeRecipe={selectedRecipe}
            searchQuery={search}
            onSelectCategory={handleSelectCategory}
            onResetFilters={handleResetFilters}
          />
        </div>
      </section>

      {/* 6. Weekly Cleaver Subscription Pass */}
      <SubscriptionBanner />
    </div>
  );
};

export default Home;
