import React, { useState, useEffect } from 'react';
import productService from '@/features/product/services/productService';
import Navbar from '../components/Navbar';
import SubCategoryNav from '../components/SubCategoryNav';
import HeroSection from '../components/HeroSection';
import CircularCategoryBar from '../components/CircularCategoryBar';
import RecipeFilterSection from '../components/RecipeFilterSection';
import CategoryFilterSection from '../components/CategoryFilterSection';
import HomeProductGrid from '../components/HomeProductGrid';
import SubscriptionBanner from '../components/SubscriptionBanner';
import NetWeightModal from '../components/NetWeightModal';
import FreshBatchBadge from '../components/FreshBatchBadge';
import { Search, X } from 'lucide-react';

/**
 * Home:
 * Orchestrator customer home page strictly adhering to feature-based architecture:
 * 1. <Navbar /> (Fixed top dark header navigation matching visual reference)
 * 2. <SubCategoryNav /> (Non-fixed strip that smoothly scrolls under fixed navbar)
 * 3. <HeroSection /> (Cinematic butchery hero banner)
 * 4. <CircularCategoryBar /> (Dynamic circular meat plates showcase from backend)
 * 5. Catalog Section with Search, Category Filter, Dynamic Recipe/Cut Filter & <HomeProductGrid />
 * 6. <SubscriptionBanner /> (Weekly Cleaver Pass subscription highlight)
 * 7. <NetWeightModal />
 */
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedSubCatId, setSelectedSubCatId] = useState('all');
  const [selectedCircularId, setSelectedCircularId] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState('all');
  const [search, setSearch] = useState('');

  // Info Modal State
  const [isNetWeightModalOpen, setIsNetWeightModalOpen] = useState(false);

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
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedRecipe !== 'all') params.recipe = selectedRecipe;
        if (search.trim()) params.search = search.trim();

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

  // Handle Sub-Category Strip Selection
  const handleSelectSubCategory = (item) => {
    if (item.isAll || item.id === 'all' || selectedSubCatId === item.id) {
      setSelectedSubCatId('all');
      setSelectedCircularId('all');
      setSelectedCategory('all');
      setSearch('');
    } else {
      setSelectedSubCatId(item.id);
      setSelectedCircularId(item.id);
      setSelectedCategory(item.id);
      setSearch('');
    }

    const el = document.getElementById('cuts-catalog') || document.getElementById('catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Circular Category Selection
  const handleSelectCircularCategory = (item) => {
    const id = item._id || item.id;
    if (item.isAll || id === 'all' || selectedCircularId === id) {
      setSelectedCircularId('all');
      setSelectedSubCatId('all');
      setSelectedCategory('all');
      setSearch('');
    } else {
      setSelectedCircularId(id);
      setSelectedSubCatId(id);
      setSelectedCategory(id);
      setSearch('');
    }

    const el = document.getElementById('cuts-catalog') || document.getElementById('catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedSubCatId('all');
    setSelectedCircularId('all');
    setSelectedCategory('all');
    setSelectedRecipe('all');
    setSearch('');
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* 1. Fixed Dark Navbar (Matching Visual Reference) */}
      <Navbar
        search={search}
        onSearchChange={setSearch}
        cartCount={0}
      />

      {/* 2. Sub-Category Strip (Non-fixed with mt-20 offset, scrolls smoothly under fixed navbar) */}
      <SubCategoryNav
        categories={categories}
        activeCategoryId={selectedSubCatId}
        onSelectCategory={handleSelectSubCategory}
        className="mt-20"
      />

      {/* 3. Full-Bleed Edge-to-Edge Hero Banner */}
      <HeroSection onOpenStandardModal={() => setIsNetWeightModalOpen(true)} />

      {/* 4. Circular Plate Categories Showcase (Dynamic from Backend) */}
      <CircularCategoryBar
        categories={categories}
        activeId={selectedCircularId}
        onSelectCategory={handleSelectCircularCategory}
      />

      {/* 5. Product Catalog Container */}
      <section id="cuts-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-6">
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
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setSelectedSubCatId(catId);
              setSelectedCircularId(catId);
            }}
          />

          {/* Dynamic Recipe / Cut Style Filter */}
          <RecipeFilterSection
            cuts={cuts}
            activeRecipe={selectedRecipe}
            onSelectRecipe={setSelectedRecipe}
            totalCount={products.length}
          />

          {/* Products Grid */}
          <HomeProductGrid
            products={products}
            loading={loading}
            onResetFilters={handleResetFilters}
            onOpenStandardModal={() => setIsNetWeightModalOpen(true)}
          />
        </div>
      </section>

      {/* 6. Weekly Cleaver Subscription Pass */}
      <SubscriptionBanner />

      {/* 7. 100% Net Usable Weight Transparency Modal */}
      <NetWeightModal
        isOpen={isNetWeightModalOpen}
        onClose={() => setIsNetWeightModalOpen(false)}
      />
    </div>
  );
};

export default Home;
