"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Pagination, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  images: string[];
  name: string;
};

export default function ProductImageGallery({ images, name }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [thumbs, setThumbs] = useState<any>(null);

  const openLightbox = useCallback((index?: number) => {
    if (typeof index === "number") setCurrent(index);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen]);

  const currentSrc = images?.[current] || "/images/placeholder.jpg";

  return (
    <div className="flex flex-col gap-4">
      {/* Main image - click to open Swiper lightbox */}
      <button
        type="button"
        onClick={() => openLightbox(current)}
        className="relative aspect-square rounded-2xl overflow-hidden bg-background/80 backdrop-blur-xl shadow-xl ring-1 ring-primary/10 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="نمایش گالری تصاویر"
      >
        <Image
          src={currentSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </button>

      {/* Thumbnails */}
      {images?.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1">
          {images.map((src, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden ring-1 transition-all duration-200 shrink-0 ${
                current === idx
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                  : "ring-border hover:ring-primary/40"
              }`}
              aria-selected={current === idx}
            >
              <Image
                src={src}
                alt={`${name} - ${idx + 1}`}
                fill
                className="object-contain"
                sizes="80px"
              />
              {/* Active indicator tab (pill) */}
              <span
                className={`pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-10 rounded-full ${
                  current === idx ? "bg-primary ring-2 ring-white" : "bg-transparent"
                }`}
                aria-hidden
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox with Swiper */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-[92vw] h-[88vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-3 left-3 z-10 inline-flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-white/90 p-2.5 md:p-3 shadow-lg ring-1 ring-white backdrop-blur-sm transition-transform hover:scale-105"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Custom nav buttons */}
            <button
              type="button"
              className="custom-prev absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10 inline-flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-white/90 p-2.5 md:p-3 shadow-lg ring-1 ring-white backdrop-blur-sm transition-transform hover:scale-105"
              aria-label="قبلی"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="custom-next absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10 inline-flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-white/90 p-2.5 md:p-3 shadow-lg ring-1 ring-white backdrop-blur-sm transition-transform hover:scale-105"
              aria-label="بعدی"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Swiper */}
            <Swiper
              modules={[Navigation, Keyboard, Pagination, Thumbs, FreeMode]}
              initialSlide={current}
              onSlideChange={(s) => setCurrent(s.activeIndex)}
              navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
              keyboard={{ enabled: true }}
              rewind={true}
              thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
              className="w-full h-[68vh] sm:h-[78vh]"
            >
              {images?.map((src, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center sm:pb-7">
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={`${name} - ${idx + 1}`}
                      fill
                      className="object-contain select-none"
                      sizes="100vw"
                      priority
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails */}
            {images?.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[94vw] sm:w-[92vw] max-w-6xl px-4 sm:px-8">
                <Swiper
                  modules={[FreeMode, Thumbs]}
                  onSwiper={setThumbs}
                  watchSlidesProgress
                  freeMode
                  slidesPerView={Math.min(6, images.length)}
                  spaceBetween={6}
                  className="w-full"
                >
                  {images.map((src, idx) => (
                    <SwiperSlide key={`thumb-${idx}`} className="!w-auto">
                      <button
                        type="button"
                        onClick={() => setCurrent(idx)}
                        className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden ring-1 transition-all duration-200 ${
                          current === idx
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-105"
                            : "ring-white/20 hover:ring-white/40"
                        }`}
                        aria-selected={current === idx}
                      >
                        <Image
                          src={src}
                          alt={`${name} - thumb ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        {/* Active indicator tab (pill) */}
                        <span
                          className={`pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-10 rounded-full ${
                            current === idx ? "bg-primary ring-2 ring-white" : "bg-transparent"
                          }`}
                          aria-hidden
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
