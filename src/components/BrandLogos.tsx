'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Brand = { src: string; alt: string; width: number; height: number };

// Using reputable sources/CDNs for logos. You can replace with local files under /public/brands later.
const brands: Brand[] = [
  {
    src: '/images/brands/marvis.png',
    alt: 'Marvis',
    width: 120,
    height: 36,
  },
  {
    src: '/images/brands/sephora.png',
    alt: 'Sephora',
    width: 120,
    height: 36,
  },
  {
    src: '/images/brands/harrods.png',
    alt: 'Harrods',
    width: 120,
    height: 36,
  },
];

export default function BrandLogos() {
  const marquee = brands.concat(brands); // loop for seamless scroll
  return (
    <div className="w-full border-y border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="overflow-hidden">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, -150, 0] }}
            transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
            className="flex items-center gap-10 sm:gap-16"
          >
            {marquee.map((b, i) => (
              <div
                key={i}
                className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  width={b.width}
                  height={b.height}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
