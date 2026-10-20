import React, { useState, useEffect } from 'react';
import productService from '@/features/product/services/productService';
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
 * 1. <HeroSection />
 * 2. <CircularCategoryBar /> (Curated circular meat plates showcase directly under hero)
 * 3. Catalog Section with Search, Category Filter, Recipe Filter & <HomeProductGrid />
 * 4. <SubscriptionBanner /> (Weekly Cleaver Pass subscription highlight)
 * 5. <NetWeightModal />
 */
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCircularId, setSelectedCircularId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState('all');
  const [search, setSearch] = useState('');

  // Info Modal State
  const [isNetWeightModalOpen, setIsNetWeightModalOpen] = useState(false);

  // Fetch Categories on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategories();
        if (isMounted) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Products whenever filters change (with debounce)
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

  const handleSelectCircularCategory = (item) => {
    if (selectedCircularId === item.id) {
      setSelectedCircularId(null);
      setSelectedCategory('all');
      setSearch('');
    } else {
      setSelectedCircularId(item.id);

      // Check if keyword maps to a backend category
      const matchedCat = categories.find((cat) => {
        const catName = (cat.name || '').toLowerCase();
        return catName.includes(item.keyword);
      });

      if (matchedCat) {
        setSelectedCategory(matchedCat._id || matchedCat.id);
        if (item.id === 'kuttan-beef') {
          setSearch('Kuttan');
        } else if (item.id === 'pakistani-mutton') {
          setSearch('Pakistani');
        } else if (item.id === 'pakistani-beef') {
          setSearch('Pakistani');
        } else if (item.id === 'artisanal-mince') {
          setSearch('Mince');
        } else if (item.id === 'rare-cuts') {
          setSearch('Nalli');
        } else {
          setSearch('');
        }
      } else {
        setSelectedCategory('all');
        setSearch(item.name);
      }
    }

    // Scroll smoothly to catalog section
    const el = document.getElementById('cuts-catalog') || document.getElementById('catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCircularId(null);
    setSelectedCategory('all');
    setSelectedRecipe('all');
    setSearch('');
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* 1. Cinematic Hero Section */}
      <HeroSection onOpenStandardModal={() => setIsNetWeightModalOpen(true)} />

      {/* 2. New Circular Quick-Category Showcase Strip (Directly beneath hero in white space) */}
      <CircularCategoryBar
        activeId={selectedCircularId}
        onSelectCategory={handleSelectCircularCategory}
      />

      {/* 3. Catalog Section Container */}
      <section id="cuts-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          {/* Section Header, Fresh Batch Badge & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-5">
            <div className="space-y-1.5">
              <FreshBatchBadge time="6:00 AM" facility="Sterile Cold-Chain" />
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Fresh Cuts Prepared for Your Recipe
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
                Selected from 100% antibiotic-free farm livestock. Zero waste, precision-sliced to order.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-72">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search cuts (e.g. biryani, boneless)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-8 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 4. Category Filter Section (Meat Department Tabs) */}
          <CategoryFilterSection
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setSelectedCircularId(null);
            }}
          />

          {/* 5. Recipe Filter Section (Shop by Dish Purpose) */}
          <RecipeFilterSection
            activeRecipe={selectedRecipe}
            onSelectRecipe={setSelectedRecipe}
            totalCount={products.length}
          />

          {/* 6. Products Grid */}
          <HomeProductGrid
            products={products}
            loading={loading}
            onResetFilters={handleResetFilters}
            onOpenStandardModal={() => setIsNetWeightModalOpen(true)}
          />
        </div>
      </section>

      {/* 4. Weekly Subscription Cleaver Pass Highlight */}
      <SubscriptionBanner />

      {/* 5. 100% Net Usable Weight Transparency Modal */}
      <NetWeightModal
        isOpen={isNetWeightModalOpen}
        onClose={() => setIsNetWeightModalOpen(false)}
      />
    </div>
  );
};

export default Home;