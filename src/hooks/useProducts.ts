import { useState, useEffect } from 'react';
import { Product } from '@/types';



export interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  dentalCategory?: string;
  ageGroup?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  featured?: boolean;
}

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(options.page || 1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.category) params.append('category', options.category);
      if (options.brand) params.append('brand', options.brand);
      if (options.dentalCategory) params.append('dentalCategory', options.dentalCategory);
      if (options.ageGroup) params.append('ageGroup', options.ageGroup);
      if (options.minPrice) params.append('minPrice', options.minPrice);
      if (options.maxPrice) params.append('maxPrice', options.maxPrice);
      if (options.search) params.append('search', options.search);
      if (options.featured) params.append('featured', 'true');

      const response = await fetch(`/api/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const parsedProducts = data.data.products.map((p: any) => ({ 
          ...p, 
          price: parseFloat(p.price),
          comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : undefined,
        }));
        setProducts(parsedProducts);
        setTotalPages(data.data.pagination.totalPages);
        setCurrentPage(data.data.pagination.page);
        setTotalProducts(data.data.pagination.total);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(options)]);

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    totalProducts,
    refetch: fetchProducts,
  };
}
