import { create } from 'zustand';
import { Product } from '@/types';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchProducts: () => Promise<void>;
  searchProducts: (query: string, priceRange?: { minPrice?: string; maxPrice?: string }) => Product[];
  sortProducts: (products: Product[], sortBy: string) => Product[];
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchProducts: async () => {
    const state = get();
    
    // Only fetch if we haven't fetched in the last 5 minutes (300000ms)
    const now = Date.now();
    if (state.lastFetched && now - state.lastFetched < 300000 && state.products.length > 0) {
      return;
    }

    set({ loading: true, error: null });

    try {
      // Fetch all products without pagination
      const response = await fetch('/api/products?limit=100');
      const data = await response.json();

      if (data.success) {
        set({
          products: data.data.products,
          loading: false,
          lastFetched: now,
          error: null,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  },

  searchProducts: (query, priceRange) => {
    const { products } = get();
    
    let filtered = [...products];

    // Apply search filter
    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply price range filter
    if (priceRange) {
      const { minPrice, maxPrice } = priceRange;
      
      if (minPrice) {
        const min = parseFloat(minPrice);
        filtered = filtered.filter(product => product.price >= min);
      }
      
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        filtered = filtered.filter(product => product.price <= max);
      }
    }

    return filtered;
  },

  sortProducts: (products, sortBy) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'newest': {
          const at = new Date(a.createdAt as any).getTime();
          const bt = new Date(b.createdAt as any).getTime();
          return bt - at; // newest first
        }
        default:
          return 0;
      }
    });
  },
}));
