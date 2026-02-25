import { Brand, Category, ProductImage, Review } from '@prisma/client';

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  content: string | null;
  price: number;
  comparePrice: number | null;
  isFeatured: boolean;
  isActive: boolean;
  sku: string | null;
  stock: number;
  rating: number;
  image?: string; // Legacy or fallback image
  images: ProductImage[];
  category: Category;
  brand: Brand;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
};
