'use client';

import { useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Define a specific type for the product prop to avoid importing the entire Prisma type in a client component.
interface ProductClientInteractionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    inventory: number;
    images: string[];
  };
}

export default function ProductClientInteractions({ product }: ProductClientInteractionsProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useStore(state => state.addToCart);
  const router = useRouter();
  const clickLockRef = useRef(false);

  const handleAddToCart = () => {
    // Prevent rapid double-clicks from creating duplicate toasts
    if (clickLockRef.current) return;
    clickLockRef.current = true;
    setTimeout(() => { clickLockRef.current = false; }, 500);

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/placeholder.jpg',
      quantity,
    });
    // Show success toast only here (product page)
    // Remove any existing toasts instantly to avoid flicker/re-show
    toast.remove();
    toast.custom(
      t => (
        <div
          className={`max-w-md w-full rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-lg p-3 ${
            t.visible ? 'animate-in fade-in-0 zoom-in-95' : 'animate-out fade-out-0 zoom-out-95'
          }`}
        >
          <div className="text-sm font-medium">به سبد خرید اضافه شد</div>
          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toast.remove(t.id);
                router.push('/cart');
              }}
              className="w-full px-3 py-2 text-sm rounded-md bg-white text-zinc-900 hover:bg-zinc-200"
            >
              برو به سبد خرید
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toast.remove(t.id);
              }}
              className="w-full px-3 py-2 text-xs rounded-md border border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
            >
              بستن
            </button>
          </div>
        </div>
      ),
      { duration: 4000, id: 'add-to-cart' }
    );
  };

  const isOutOfStock = product.inventory <= 0;

  return (
    <div className="pt-6 mt-6 border-t border-border/30">
      {isOutOfStock ? (
        <div className="flex items-center justify-center p-3 text-lg font-semibold text-destructive bg-destructive/10 rounded-lg">
          اتمام موجودی
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-2 p-1 border rounded-lg border-border/50 bg-secondary/20">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-2 transition-colors rounded-md hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
              aria-label="کاهش تعداد"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-10 text-lg font-semibold text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(product.inventory, q + 1))}
              className="p-2 transition-colors rounded-md hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity >= product.inventory}
              aria-label="افزایش تعداد"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-full gap-2 px-6 py-3 text-lg font-semibold transition-colors rounded-lg sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>افزودن به سبد خرید</span>
          </button>
        </div>
      )}
    </div>
  );
}
