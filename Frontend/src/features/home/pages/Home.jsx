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
import FreshBatchBadge from '../components/FreshBatchBadge';
import { Search, X } from 'lucide-react';

/**
 * Home:
 * Clean orchestrator for Urban Cleaver customer storefront.
 * Structure:
 * 1. Fixed Top Dark Navbar
 * 2. SubCategoryNav (Flows beneath fixed navbar)
 * 3. Edge-to-Edge HeroSection (w-screen safe)
 * 4. CircularCategoryBar (Curated meat plate categories)
 * 5. Catalog Grid with Search & Purpose Filters
 * 6. Weekly Subscription Cleaver Pass
 */
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedSubCatId, setSelectedSubCatId] = useState('all');
  const [selectedCircularId, setSelectedCircularId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState('all');
  const [search, setSearch] = useState('');

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

  // Fetch Products with Debounce
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
    if (item.id === 'all' || selectedSubCatId === item.id) {
      setSelectedSubCatId('all');
      setSelectedCategory('all');
      setSearch('');
    } else {
      setSelectedSubCatId(item.id);
      setSelectedCircularId(null);

      const isMutton = item.keyword.toLowerCase().includes('mutton');
      const isBeef = item.keyword.toLowerCase().includes('beef');

      const matchedCat = categories.find((cat) => {
        const name = (cat.name || '').toLowerCase();
        if (isMutton && name.includes('mutton')) return true;
        if (isBeef && name.includes('beef')) return true;
        return false;
      });

      if (matchedCat) {
        setSelectedCategory(matchedCat._id || matchedCat.id);
      }

      setSearch(item.keyword);
    }

    const el = document.getElementById('cuts-catalog') || document.getElementById('catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Circular Category Selection
  const handleSelectCircularCategory = (item) => {
    if (selectedCircularId === item.id) {
      setSelectedCircularId(null);
      setSelectedCategory('all');
      setSearch('');
    } else {
      setSelectedCircularId(item.id);
      setSelectedSubCatId('all');

      const matchedCat = categories.find((cat) => {
        const catName = (cat.name || '').toLowerCase();
        return catName.includes(item.keyword);
      });

      if (matchedCat) {
        setSelectedCategory(matchedCat._id || matchedCat.id);
        if (item.id === 'kuttan-beef') {
          setSearch('Kuttan');
        } else if (item.id === 'pakistani-mutton' || item.id === 'pakistani-beef') {
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

    const el = document.getElementById('cuts-catalog') || document.getElementById('catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedSubCatId('all');
    setSelectedCircularId(null);
    setSelectedCategory('all');
    setSelectedRecipe('all');
    setSearch('');
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen overflow-x-hidden">
      {/* 1. Fixed Top Dark Navbar */}
      <Navbar
        search={search}
        onSearchChange={setSearch}
        cartCount={0}
      />

      {/* 2. Sub-Category Strip (Flows directly beneath navbar) */}
      <SubCategoryNav
        activeCategoryId={selectedSubCatId}
        onSelectCategory={handleSelectSubCategory}
        className="mt-20"
      />

      {/* 3. Full-Bleed Edge-to-Edge Hero Banner */}
      <HeroSection />

      {/* 4. Circular Plate Categories Showcase */}
      <CircularCategoryBar
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
                placeholder="Search cuts (e.g. mutton, kuttan)..."
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
              setSelectedSubCatId('all');
              setSelectedCircularId(null);
            }}
          />

          {/* Recipe / Purpose Filter */}
          <RecipeFilterSection
            activeRecipe={selectedRecipe}
            onSelectRecipe={setSelectedRecipe}
            totalCount={products.length}
          />

          {/* Products Grid */}
          <HomeProductGrid
            products={products}
            loading={loading}
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