import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است'),
  newPassword: z.string().min(8, 'رمز عبور جدید باید حداقل 8 کاراکتر باشد'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'احراز هویت نشده است' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, password: true }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد یا رمز عبور تنظیم نشده است' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'رمز عبور فعلی نادرست است' },
        { status: 400 }
      );
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(
      validatedData.newPassword,
      user.password
    );

    if (isSamePassword) {
      return NextResponse.json(
        { error: 'رمز عبور جدید نمی‌تواند مشابه رمز عبور فعلی باشد' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12);

    // Update password in database
    await db.user.update({
      where: { id: user.id },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'رمز عبور با موفقیت تغییر کرد'
    });

  } catch (error) {
    console.error('Password change error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}
