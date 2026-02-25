import { NextRequest, NextResponse } from 'next/server';
import ZarinPal from 'zarinpal-checkout';
import { db } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

const zarinpal = ZarinPal.create(
  process.env.ZARINPAL_MERCHANT_ID!,
  process.env.ZARINPAL_SANDBOX === 'true'
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authority = searchParams.get('Authority');
  const status = searchParams.get('Status');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (status === 'NOK' || !authority) {
    return NextResponse.redirect(new URL('/payment/failed', siteUrl));
  }

  try {
    const order = await db.order.findFirst({
      where: { payments: { some: { authority } } },
    });

    if (!order) {
      return NextResponse.redirect(new URL('/payment/failed?error=not_found', siteUrl));
    }

    const totalAmount = order.total.toNumber();

    const verificationResponse = await zarinpal.PaymentVerification({
      Amount: totalAmount,
      Authority: authority,
    });

    if (verificationResponse.status === 100 || verificationResponse.status === 101) {
      // Prevent double side-effects if callback is retried (e.g., status 101 AlreadyVerified)
      const wasAlreadyPaid = order.paymentStatus === 'PAID' || order.status === OrderStatus.CONFIRMED;
      await db.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: 'PAID',
          payments: {
            updateMany: {
              where: { authority: authority },
              data: {
                status: 'PAID',
                refId: verificationResponse.refId.toString(),
                paidAt: new Date(),
              },
            },
          },
        },
      });

      // If a discount was applied on this order, increment its usedCount only once
      if (!wasAlreadyPaid && order.discountId) {
        try {
          await db.discount.update({
            where: { id: order.discountId },
            data: { usedCount: { increment: 1 } },
          });
        } catch (e) {
          console.error('Failed to increment discount usedCount:', e);
        }
      }
      
      // Clear user's cart after successful payment
      console.log('Clearing cart for user:', order.userId);
      const deletedItems = await db.cartItem.deleteMany({
        where: { userId: order.userId },
      });
      console.log('Deleted cart items count:', deletedItems.count);
      
      // Redirect to success page with a parameter
      return NextResponse.redirect(new URL(`/payment/success?order_id=${order.id}`, siteUrl));
    } else {
      await db.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
      });
      return NextResponse.redirect(new URL('/payment/failed', siteUrl));
    }
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.redirect(new URL('/payment/failed?error=internal_error', siteUrl));
  }
}
