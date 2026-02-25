import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const discountSchema = z.object({
  code: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const body = await req.json();
    const { code } = discountSchema.parse(body);

    const discount = await db.discount.findFirst({
      where: {
        code,
        isActive: true,
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
    });

    // First, check if a discount with the given code exists and is active/valid.
    if (!discount) {
      return NextResponse.json(
        { success: false, error: 'کد تخفیف نامعتبر است' },
        { status: 404 }
      );
    }

    // Check per-user usage (authenticated users): user can use each discount code at most once.
    if (session?.user?.id) {
      const alreadyUsedByUser = await db.order.findFirst({
        where: {
          userId: session.user.id,
          discountId: discount.id,
        },
        select: { id: true },
      });

      if (alreadyUsedByUser) {
        return NextResponse.json(
          { success: false, error: 'شما قبلاً از این کد تخفیف استفاده کرده‌اید' },
          { status: 409 }
        );
      }
    }

    // Now, check the global usage limit in the application logic.
    const isUsageLimitReached =
      discount.maxUses !== null && discount.usedCount >= discount.maxUses;

    if (isUsageLimitReached) {
      return NextResponse.json(
        { success: false, error: 'تعداد استفاده از این کد تخفیف به پایان رسیده است' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      percent: discount.percent || 0,
      amount: discount.amount || 0,
      minOrder: discount.minOrder,
      maxAmount: discount.maxAmount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
