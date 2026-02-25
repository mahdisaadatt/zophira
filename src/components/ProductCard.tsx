import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import StarRating from './StarRating';
import { Percent } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name,
    slug,
    description,
    price,
    comparePrice,
    image,
    images,
    rating,
  } = product;

  const addToCart = useStore(state => state.addToCart);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  // Normalize price values for discount computations (API may return strings)
  const priceNum = Number(price);
  const compareNum = Number(comparePrice);
  const hasDiscount = Number.isFinite(priceNum) && Number.isFinite(compareNum) && compareNum > priceNum;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full"
      >
        <Card
          className="relative cursor-pointer w-full h-full flex flex-col group gradient-border backdrop-blur-xl bg-background/30 overflow-hidden"
          onClick={() => router.push(`/products/${slug}`)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
          />
          <CardHeader className="flex-none">
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="relative w-full h-64 mb-4 overflow-hidden rounded-lg"
            >
              <Image
                src={images?.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url || image || '/images/placeholder.jpg'}
                alt={images?.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.altText || name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Discount badge */}
              {hasDiscount && (
                <div className="absolute top-2 left-2 rounded-md bg-red-600 text-white text-xs font-bold px-2 py-1 flex items-center gap-1 shadow-sm">
                  <Percent className="w-3.5 h-3.5" />
                  <span>
                    {`٪${Math.max(1, Math.round((1 - priceNum / compareNum) * 100))}`} تخفیف
                  </span>
                </div>
              )}
              {/* Low-stock badge removed per request */}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CardTitle className="text-xl font-bold text-foreground/90 group-hover:text-foreground transition-colors line-clamp-1">
                {name}
              </CardTitle>
              <StarRating rating={rating} className="mt-2" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-x-2 mt-2">
                {comparePrice && comparePrice > price ? (
                  <>
                    <CardDescription className="text-lg font-semibold text-primary">
                      {formatPrice(price)} تومان
                    </CardDescription>
                    <CardDescription className="text-sm font-light text-gray-500 line-through">
                      {formatPrice(comparePrice)} تومان
                    </CardDescription>
                  </>
                ) : (
                  <CardDescription className="text-lg font-semibold text-primary">
                    {formatPrice(price)} تومان
                  </CardDescription>
                )}
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="flex-grow">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-foreground/70 line-clamp-2 group-hover:text-foreground/90 transition-colors h-12"
            >
              {description}
            </motion.p>
          </CardContent>
          <CardFooter className="flex-none pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="w-full"
            >
              <Button
                className="w-full bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-300"
                onClick={e => {
                  e.stopPropagation();
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image:
                      product.images?.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ||
                      product.image ||
                      '/images/placeholder.jpg',
                    quantity: 1,
                  });
                }}
              >
                افزودن به سبد خرید
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}
