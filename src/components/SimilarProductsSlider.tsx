'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Percent } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { formatPrice } from '@/lib/utils';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface SimilarProduct {
  id: string;
  name: string;
  slug: string;
  price: number; // Plain number after serialization
  comparePrice: number | null; // Plain number after serialization
  rating: number;
  brand: { name: string } | null;
  images: { url: string }[];
}

interface SimilarProductsSliderProps {
  products: SimilarProduct[];
}

export default function SimilarProductsSlider({
  products,
}: SimilarProductsSliderProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-foreground/90 text-right mb-8">
        محصولات مشابه
      </h2>

      {/* SwiperJS Slider */}
      <div className="relative group">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={2}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              spaceBetween: 20,
            },
            768: {
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="similar-products-swiper pb-12"
        >
          {products.map(similarProduct => {
            const hasDiscount =
              similarProduct.comparePrice &&
              similarProduct.comparePrice > similarProduct.price;
            const discountPercent =
              hasDiscount && similarProduct.comparePrice
                ? Math.round(
                    ((similarProduct.comparePrice - similarProduct.price) /
                      similarProduct.comparePrice) *
                      100
                  )
                : 0;

            return (
              <SwiperSlide key={similarProduct.id}>
                <Link
                  href={`/products/${similarProduct.slug}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-background/80 backdrop-blur-xl shadow-lg ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>

                    {/* Product Image or Placeholder */}
                    {similarProduct.images &&
                    similarProduct.images.length > 0 ? (
                      <Image
                        src={similarProduct.images[0].url}
                        alt={similarProduct.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500 p-3"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-3xl">🦷</span>
                        </div>
                      </div>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 rounded-md bg-red-600 text-white text-xs font-bold px-2 py-1 flex items-center gap-1 shadow-sm">
                        <Percent className="w-3.5 h-3.5" />
                        <span>
                          %{discountPercent} تخفیف
                        </span>
                      </div>
                    )}

                    {/* Rating */}
                    {similarProduct.rating > 0 && (
                      <div className="absolute bottom-4 left-4 z-10">
                        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-sm font-medium text-foreground">
                            {similarProduct.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-right">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg leading-tight line-clamp-2">
                      {similarProduct.name}
                    </h3>
                    {similarProduct.brand?.name && (
                      <p className="text-foreground/70 mt-2">
                        برند {similarProduct.brand.name}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-3 mt-3">
                      {hasDiscount ? (
                        <>
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(similarProduct.price)} تومان
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(similarProduct.comparePrice || 0)}{' '}
                            تومان
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(similarProduct.price)} تومان
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100">
          <ChevronRight className="w-5 h-5 text-foreground rotate-180" />
        </button>

        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </section>
  );
}
