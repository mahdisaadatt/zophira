import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'توکن و رمز عبور مورد نیاز است' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'رمز عبور باید حداقل ۸ کاراکتر باشد' }, { status: 400 });
    }

    // Hash the token to compare with the stored hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with the reset token and check if it's not expired
    const user = await db.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gt: new Date(), // Token should not be expired
        },
      },
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'توکن بازنشانی رمز عبور معتبر نیست یا منقضی شده است' 
      }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password and clear reset token fields
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({ 
      message: 'رمز عبور با موفقیت تغییر یافت' 
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ 
      error: 'خطایی در سمت سرور رخ داد' 
    }, { status: 500 });
  }
}
