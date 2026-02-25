import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { getSession } from '@/lib/auth';

const createPaymentSchema = z.object({
  amount: z.number(),
  orderId: z.string(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount: clientAmount, orderId, description } = createPaymentSchema.parse(body);

    const paymentMode = (process.env.PAYMENT_MODE || '').toLowerCase();
    const isDemoPaymentEnv =
      process.env.DEMO_PAYMENT === 'true' ||
      process.env.NEXT_PUBLIC_DEMO_PAYMENT === 'true';

    const resolvedPaymentMode = paymentMode || (isDemoPaymentEnv ? 'demo' : 'live');

    if (resolvedPaymentMode !== 'demo' && resolvedPaymentMode !== 'live') {
      return NextResponse.json(
        { success: false, error: 'PAYMENT_MODE نامعتبر است. مقدار مجاز: demo یا live' },
        { status: 400 }
      );
    }

    // Fetch order and compute amount server-side to match verification logic
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'سفارش یافت نشد' }, { status: 404 });
    }
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'دسترسی غیرمجاز به سفارش' }, { status: 403 });
    }

    // Amounts in our app are in Tomans; Zarinpal expects Rial.
    const computedToman = Math.floor(Number((order as any).total || 0));
    if (computedToman <= 0) {
      const freeRefId = `FREE-${Date.now()}`;

      await db.payment.create({
        data: {
          amount: 0,
          orderId,
          userId: session.user.id,
          authority: `FREE-${orderId}`,
          refId: freeRefId,
          status: PaymentStatus.PAID,
          method: PaymentMethod.ZARINPAL,
          paidAt: new Date(),
          gatewayData: {
            freeOrder: true,
            computedToman,
            clientAmount,
            description,
          } as any,
        },
      });

      await db.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
        },
      });

      await db.cartItem.deleteMany({ where: { userId: session.user.id } });

      return NextResponse.json({
        success: true,
        paymentUrl: `/payment/success?order_id=${orderId}&refId=${encodeURIComponent(freeRefId)}`,
      });
    }

    const amountRial = Math.max(10000, computedToman * 10);

    if (resolvedPaymentMode === 'demo') {
      const demoRefId = `DEMO-${Date.now()}`;

      await db.payment.create({
        data: {
          amount: amountRial,
          orderId,
          userId: session.user.id,
          authority: `DEMO-${orderId}`,
          refId: demoRefId,
          status: PaymentStatus.PAID,
          method: PaymentMethod.ZARINPAL,
          paidAt: new Date(),
          gatewayData: {
            demo: true,
            clientAmount,
            description,
          } as any,
        },
      });

      await db.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
        },
      });

      await db.cartItem.deleteMany({ where: { userId: session.user.id } });

      return NextResponse.json({
        success: true,
        paymentUrl: `/payment/success?order_id=${orderId}&refId=${encodeURIComponent(demoRefId)}`,
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'http://localhost:3000';

    // Live mode
    const merchantID = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantID) {
      return NextResponse.json(
        {
          success: false,
          error: 'ZARINPAL_MERCHANT_ID تنظیم نشده است. برای تست، PAYMENT_MODE=demo بگذارید.',
        },
        { status: 500 }
      );
    }

    const isSandbox = process.env.ZARINPAL_SANDBOX === 'true';
    const apiHost = isSandbox ? 'https://sandbox.zarinpal.com' : 'https://api.zarinpal.com';
    const startPayHost = isSandbox ? 'https://sandbox.zarinpal.com' : 'https://www.zarinpal.com';

    const zarinpal = await fetch(`${apiHost}/pg/v4/payment/request.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: merchantID,
        amount: amountRial,
        description: description || 'پرداخت سفارش در زوفیرا',
        callback_url: `${baseUrl}/api/payment`,
        metadata: {
          order_id: orderId,
          user_id: session.user.id,
        },
      }),
    });

    const response = await zarinpal.json();

    if (response.data.code === 100) {
      // Save payment info in database
      await db.payment.create({
        data: {
          amount: amountRial,
          orderId,
          userId: session.user.id,
          authority: response.data.authority,
          status: PaymentStatus.PENDING,
          method: PaymentMethod.ZARINPAL,
        },
      });

      return NextResponse.json({
        success: true,
        paymentUrl: `${startPayHost}/pg/StartPay/${response.data.authority}`,
      });
    } else {
      const errMsg = response?.errors?.message || 'نامشخص';
      const errCode = response?.errors?.code;
      return NextResponse.json(
        { success: false, error: `خطا در ایجاد تراکنش: ${errMsg}${errCode ? ` (کد ${errCode})` : ''}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطا در ایجاد تراکنش' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const Authority = searchParams.get('Authority');
    const Status = searchParams.get('Status');

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'http://localhost:3000';

    if (!Authority || !Status) {
      throw new Error('اطلاعات تراکنش ناقص است');
    }

    // Get payment details from database
    const payment = await db.payment.findFirst({
      where: {
        authority: Authority,
      },
    });

    if (!payment) {
      throw new Error('تراکنش یافت نشد');
    }

    if (Status && Status.toUpperCase() === 'OK') {
      // Verify payment with ZarinPal
      const merchantID = process.env.ZARINPAL_MERCHANT_ID;
      if (!merchantID) {
        throw new Error('ZARINPAL_MERCHANT_ID is not defined');
      }
      
      const isSandbox = process.env.ZARINPAL_SANDBOX === 'true';
      const apiHost = isSandbox ? 'https://sandbox.zarinpal.com' : 'https://api.zarinpal.com';
      const verification = await fetch(`${apiHost}/pg/v4/payment/verify.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: merchantID,
          amount: payment.amount,
          authority: Authority,
        }),
      });

      const response = await verification.json();

      if (response.data.code === 100 || response.data.code === 101) {
        // Update payment status
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.PAID,
            refId: response.data.ref_id.toString(),
          },
        });

        // Update order status
        await db.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID },
        });

        return NextResponse.redirect(
          `${baseUrl}/payment/success?order_id=${payment.orderId}&refId=${response.data.ref_id}`
        );
      } else {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.FAILED },
        });
        return NextResponse.redirect(
          `${baseUrl}/payment/failed?message=${encodeURIComponent(
            (response.errors?.message || 'خطا در تراکنش') +
              (response.errors?.code ? ` (کد ${response.errors.code})` : '')
          )}`
        );
      }
    } else {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      return NextResponse.redirect(`${baseUrl}/payment/cancelled`);
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'http://localhost:3000';
    return NextResponse.redirect(
      `${baseUrl}/payment/failed?message=${encodeURIComponent(
        error instanceof Error ? error.message : 'خطا در تأیید تراکنش'
      )}`
    );
  }
}
