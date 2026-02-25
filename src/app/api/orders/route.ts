import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '../../../lib/api-response';
import { orderCreateSchema } from '../../../lib/validations';
import type { OrderCreate } from '../../../lib/validations';

// GET /api/orders - Get user orders
export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get userId from session/JWT
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('User ID is required', 400);
    }

    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
        shippingAddress: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return errorResponse('Failed to fetch orders', 500);
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  console.log('Received order creation request');
  let body;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return errorResponse('لطفاً ابتدا وارد حساب کاربری خود شوید.', 401);
    }

    const userId = session.user.id;
    console.log('Authenticated user ID:', userId);

    body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    // Validate input
    const result = orderCreateSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path.join('.');
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      return validationErrorResponse(errors);
    }

    const { items, shippingAddress, customerNotes, shippingMethod, shippingFee, discountCode } = result.data as OrderCreate & { discountCode?: string };

    // --- Start Transaction ---
    const newOrder = await db.$transaction(async tx => {
      // 1. Get all products and lock the rows for update to prevent race conditions
      const itemsList: { productId: string; quantity: number }[] = items as any;
      const productIds = itemsList.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        // Use `select` for better performance
        select: { id: true, name: true, price: true, quantity: true, trackQuantity: true },
      });

      let subtotal = 0;
      const orderItemsData = [];

      // 2. Check stock and calculate totals
      for (const item of itemsList) {
        const product = products.find(p => p.id === item.productId);

        if (!product) {
          throw new Error(`محصول با شناسه ${item.productId} یافت نشد.`);
        }

        if (product.trackQuantity && product.quantity < item.quantity) {
          throw new Error(`موجودی محصول '${product.name}' کافی نیست.`);
        }

        const itemTotal = parseFloat(product.price.toString()) * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal.toString(),
        });
      }

      // Use the shipping fee from the request, or default to 0 for regular post
      const finalShippingFee = shippingFee || 0;

      // --- Discount handling ---
      let appliedDiscountId: string | null = null;
      let computedDiscountAmount = 0;

      if (discountCode && typeof discountCode === 'string' && discountCode.trim()) {
        const discount = await tx.discount.findFirst({
          where: {
            code: discountCode,
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
        });

        if (!discount) {
          throw new Error('کد تخفیف نامعتبر است یا منقضی شده است.');
        }

        // Global usage limit
        const isUsageLimitReached =
          discount.maxUses !== null && discount.usedCount >= discount.maxUses;
        if (isUsageLimitReached) {
          throw new Error('تعداد استفاده از این کد تخفیف به پایان رسیده است.');
        }

        // Per-user single use
        const alreadyUsedByUser = await tx.order.findFirst({
          where: { userId, discountId: discount.id },
          select: { id: true },
        });
        if (alreadyUsedByUser) {
          throw new Error('شما قبلاً از این کد تخفیف استفاده کرده‌اید.');
        }

        // Min order requirement
        if (discount.minOrder && subtotal < discount.minOrder) {
          throw new Error('مبلغ سفارش برای استفاده از این کد کافی نیست.');
        }

        // Compute amount
        if (discount.percent && discount.percent > 0) {
          const percentAmount = Math.floor((subtotal * discount.percent) / 100);
          const capped = discount.maxAmount ? Math.min(percentAmount, discount.maxAmount) : percentAmount;
          computedDiscountAmount = Math.max(0, capped);
        } else if (discount.amount && discount.amount > 0) {
          computedDiscountAmount = Math.max(0, Math.min(Number(discount.amount), subtotal));
        }

        appliedDiscountId = discount.id;
      }

      const total = Math.max(0, subtotal + finalShippingFee - computedDiscountAmount);

      // 3. Generate a more robust order number
      const orderNumber = `ZPH-${Date.now()}`;

      // 4. Get the authenticated user
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('کاربر یافت نشد. لطفاً دوباره وارد شوید.');
      }

      // 4. Create the shipping address
      const newAddress = await tx.address.create({
        data: {
          userId: user.id,
          firstName: shippingAddress.fullName.split(' ')[0] || '',
          lastName: shippingAddress.fullName.split(' ').slice(1).join(' ') || '',
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.address,
          postalCode: shippingAddress.postalCode,
          city: 'Unknown', // Or parse from address if possible
          state: 'Unknown', // Or parse from address if possible
          country: 'IR',
          type: 'SHIPPING',
        },
      });

      // 5. Create the order and its items
      // 5. Create the order and its items
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          subtotal: subtotal.toString(),
          shippingMethod: shippingMethod || 'REGULAR_POST',
          shippingFee: finalShippingFee.toString(),
          total: total.toString(),
          discountId: appliedDiscountId || undefined,
          shippingAddressId: newAddress.id,
          customerNotes,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
        },
      });

      // 6. Update stock for all products
      for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (product && product.trackQuantity) {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }
      
      // 7. Clear the user's cart after successful order creation
      console.log('About to clear cart for user:', userId);
      const deletedCartItems = await tx.cartItem.deleteMany({
        where: { userId: userId },
      });
      console.log('Cart clearing result:', deletedCartItems);
      console.log('Number of cart items deleted:', deletedCartItems.count);

      // If a discount was applied, increment its usedCount
      if (appliedDiscountId) {
        await tx.discount.update({
          where: { id: appliedDiscountId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return order;
    });
    // --- End Transaction ---

    return successResponse(newOrder, 'سفارش با موفقیت ثبت شد.');

  } catch (error) {
    console.error('[ORDER_CREATION_ERROR]', error);
    if (body) {
      console.log('Request body on error:', JSON.stringify(body, null, 2));
    }
    if (error instanceof Error) {
      // Return specific stock/product not found errors to the client
      if (
        error.message.includes('موجودی') ||
        error.message.includes('یافت نشد') ||
        error.message.includes('کد تخفیف') ||
        error.message.includes('تخفیف') ||
        error.message.includes('قبلاً') ||
        error.message.includes('پایان رسیده') ||
        error.message.includes('مبلغ سفارش')
      ) {
        return errorResponse(error.message, 400);
      }
    }
    return errorResponse('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.', 500);
  }
}
