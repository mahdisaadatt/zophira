'use client';

import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { itemVariants } from '@/animations';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export default function LatestProducts() {
  const { products, loading, error } = useProducts({ limit: 3 });

  return (
    <div className="w-full">
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">محصولات جدید</h2>
          <p className="text-base sm:text-lg text-foreground/70 mt-4">
            جدیدترین محصولات ما را کشف کنید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-destructive mb-4">خطا در بارگذاری محصولات</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                تلاش مجدد
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">محصولی یافت نشد</p>
            </div>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
