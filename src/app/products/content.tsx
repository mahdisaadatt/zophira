'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductsStore } from '@/store/useProductsStore';
import { useResponsiveLoadCount } from '@/hooks/useResponsiveLoadCount';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import Loading from '@/components/Loading';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Displays a list of products, with filters for searching, sorting, and price range.
 * It also handles pagination, and displays a loading skeleton or error message
 * when necessary.
 *
 * @returns A React component that renders a list of products.
 */
export default function ProductsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Use responsive load count
  const responsiveLoadCount = useResponsiveLoadCount();
  const [displayedCount, setDisplayedCount] = useState(responsiveLoadCount);

  // Use products store
  const {
    products: allProducts,
    loading,
    error,
    fetchProducts,
    searchProducts,
    sortProducts,
  } = useProductsStore();

  // Update displayed count when screen size changes
  useEffect(() => {
    setDisplayedCount(responsiveLoadCount);
  }, [responsiveLoadCount]);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchQuery(search);
  }, [searchParams]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle search input submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayedCount(responsiveLoadCount); // Reset displayed count when searching
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setDisplayedCount(responsiveLoadCount); // Reset displayed count when sorting
  };

  // Handle price range change
  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
    setDisplayedCount(responsiveLoadCount); // Reset displayed count when filtering
  };

  // Calculate price range for filtering
  const getPriceRange = () => {
    switch (priceRange) {
      case 'low':
        return { minPrice: '0', maxPrice: '700000' };
      case 'medium':
        return { minPrice: '700000', maxPrice: '1000000' };
      case 'high':
        return { minPrice: '1000000', maxPrice: '' };
      default:
        return {};
    }
  };

  // Filter and sort products locally
  const sortedProducts = useMemo(() => {
    const filtered = searchProducts(searchQuery, getPriceRange());
    return sortProducts(filtered, sortBy);
  }, [
    searchQuery,
    priceRange,
    sortBy,
    allProducts,
    searchProducts,
    sortProducts,
  ]);

  // Handle loading more products
  const handleLoadMore = useCallback(() => {
    if (displayedCount < sortedProducts.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedCount(prev => prev + responsiveLoadCount); // Load more rows based on screen size
        setIsLoadingMore(false);
      }, 800); // Minimal delay for smooth UX
    }
  }, [displayedCount, sortedProducts.length, isLoadingMore]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Get the last visible product element
      const productElements = document.querySelectorAll('[data-product-card]');
      if (productElements.length === 0) return;

      const lastVisibleProduct = productElements[displayedCount - 1];
      if (!lastVisibleProduct) return;

      const rect = lastVisibleProduct.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      // Load more when the last visible product is in view
      if (isVisible) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore, displayedCount]);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-right">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
            محصولات ما
          </h1>
          <p className="text-base sm:text-lg text-foreground/70 mb-12">
            مجموعه کامل محصولات خمیردندان با کیفیت ماریس را کاوش کنید.
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-foreground/70 mb-2 text-right">
              جستجو
            </label>
            <form onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="جستجو در محصولات..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
                className="w-full text-right bg-background/80 backdrop-blur-sm border-border"
              />
            </form>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-foreground/70 mb-2 text-right">
              مرتب‌سازی
            </label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full text-right bg-background/80 backdrop-blur-sm border-border">
                <SelectValue placeholder="مرتب‌سازی بر اساس..." />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-border">
                <SelectItem value="name">بر اساس نام</SelectItem>
                <SelectItem value="newest">جدیدترین</SelectItem>
                <SelectItem value="price-asc">ارزان ترین</SelectItem>
                <SelectItem value="price-desc">گران ترین</SelectItem>
                <SelectItem value="rating-desc">بیشترین امتیاز</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-foreground/70 mb-2 text-right">
              محدوده قیمت
            </label>
            <Select value={priceRange} onValueChange={handlePriceRangeChange}>
              <SelectTrigger className="w-full text-right bg-background/80 backdrop-blur-sm border-border">
                <SelectValue placeholder="انتخاب محدوده قیمت" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-border">
                <SelectItem value="all">همه قیمت‌ها</SelectItem>
                <SelectItem value="low">تا 700,000 تومان</SelectItem>
                <SelectItem value="medium">
                  از 700,000 تا 1,000,000 تومان
                </SelectItem>
                <SelectItem value="high">بالای 1,000,000 تومان</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: responsiveLoadCount }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-destructive mb-4">
                خطا در بارگذاری محصولات: {error}
              </p>
              <button
                onClick={fetchProducts}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                تلاش مجدد
              </button>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-foreground/70 mb-3">محصولی با این جستجو پیدا نشد.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
                  setSortBy('name');
                  setDisplayedCount(responsiveLoadCount);
                }}
                className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
              >
                حذف فیلترها و نمایش همه محصولات
              </button>
            </div>
          ) : (
            sortedProducts.slice(0, displayedCount).map((product, index) => (
              <motion.div
                key={product.id}
                data-product-card
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>

        {/* Loading indicator for infinite scroll - show card skeletons */}
        {isLoadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {Array.from({ length: responsiveLoadCount }).map((_, index) => (
              <ProductCardSkeleton key={`loading-${index}`} />
            ))}
          </div>
        )}

        {/* Products count info */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            نمایش {Math.min(displayedCount, sortedProducts.length)} از{' '}
            {sortedProducts.length} محصول
            {displayedCount < sortedProducts.length && (
              <div className="mt-1 text-xs opacity-70">
                برای مشاهده بیشتر به پایین اسکرول کنید
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
