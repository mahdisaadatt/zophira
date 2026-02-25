import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DiscountType {
  code: string;
  percent: number | null;
  amount: number;
  maxAmount?: number;
  minOrder?: number;
}

interface StoreState {
  cart: CartItem[];
  discount: DiscountType | null;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    set => ({
      cart: [],
      discount: null,
      addToCart: newItem =>
        set(state => {
          const existingItem = state.cart.find(item => item.id === newItem.id);
          if (existingItem) {
            // If item exists, increment its quantity
            return {
              cart: state.cart.map(item =>
                item.id === newItem.id
                  ? {
                      ...item,
                      quantity: item.quantity + (newItem.quantity || 1),
                    }
                  : item
              ),
            };
          }
          // If item does not exist, add it to the cart with quantity 1
          return {
            cart: [
              ...state.cart,
              { ...newItem, quantity: newItem.quantity || 1 },
            ],
          };
        }),
      removeFromCart: id =>
        set(state => ({
          cart: state.cart.filter(item => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set(state => ({
          cart: state.cart
            .map(item =>
              item.id === id
                ? { ...item, quantity: Math.max(0, quantity) }
                : item
            )
            .filter(item => item.quantity > 0), // Remove item if quantity is 0
        })),
      clearCart: () => set({ cart: [], discount: null }),
      applyDiscount: async code => {
        try {
          const response = await fetch('/api/discount/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          const contentType = response.headers.get('content-type') || '';

          if (!response.ok) {
            let message = 'کد تخفیف نامعتبر است';
            try {
              if (contentType.includes('application/json')) {
                const errJson = await response.json();
                message = errJson?.error || errJson?.message || message;
              } else {
                const errText = await response.text();
                message = errText || message;
              }
            } catch {
              // ignore parsing errors
            }
            toast.error(message);
            return;
          }

          const data = await response.json();
          set({
            discount: {
              code,
              percent: data.percent ?? 0,
              amount: data.amount ?? 0,
              maxAmount: data.maxAmount ?? undefined,
              minOrder: data.minOrder ?? undefined,
            },
          });
          toast.success('کد تخفیف با موفقیت اعمال شد');
        } catch (error) {
          toast.error('خطا در اعمال کد تخفیف');
        }
      },
      removeDiscount: () => set({ discount: null }),
    }),
    {
      name: 'zophira-cart-storage',
    }
  )
);
