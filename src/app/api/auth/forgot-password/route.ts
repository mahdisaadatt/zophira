import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate email format
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'ایمیل مورد نیاز است' }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'فرمت ایمیل صحیح نمی‌باشد' }, { status: 400 });
    }

    // Normalize email (convert to lowercase)
    const normalizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json({ 
        error: 'این ایمیل در سیستم موجود نمی‌باشد' 
      }, { status: 404 });
    }

    // Check if user has an active password reset token (prevent spam)
    // if (user.passwordResetExpires && user.passwordResetExpires > new Date()) {
    //   const timeLeft = Math.ceil((user.passwordResetExpires.getTime() - Date.now()) / 60000);
    //   return NextResponse.json({ 
    //     error: `لینک بازنشانی قبلی هنوز معتبر است. لطفا ${timeLeft} دقیقه دیگر تلاش کنید.` 
    //   }, { status: 429 });
    // }

    // Create a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = new Date(Date.now() + 600000); // 10 minutes from now

    await db.user.update({
      where: { email: normalizedEmail },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // Create reset URL
    const resetURL = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Always log the reset URL for development and testing
    console.log('\n🔐 PASSWORD RESET REQUEST 🔐');
    console.log('📧 Email:', normalizedEmail);
    console.log('🔑 Reset Token:', resetToken);
    console.log('🔗 Reset URL:', resetURL);
    console.log('⏰ Expires at:', passwordResetExpires.toLocaleString('fa-IR'));
    console.log('⚠️  IMPORTANT: Copy the Reset URL above and paste it in your browser!');
    console.log('================================\n');

    // TODO: In production, implement email sending here
    // Example email template:
    /*
    const emailTemplate = `
      <div style="font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>بازنشانی رمز عبور زوفیرا</h2>
        <p>سلام ${user.firstName || 'کاربر عزیز'},</p>
        <p>درخواست بازنشانی رمز عبور برای حساب کاربری شما دریافت شد.</p>
        <p>برای بازنشانی رمز عبور، روی لینک زیر کلیک کنید:</p>
        <a href="${resetURL}" style="background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">بازنشانی رمز عبور</a>
        <p>این لینک تا ۱ ساعت معتبر است.</p>
        <p>اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">تیم زوفیرا</p>
      </div>
    `;
    */

    return NextResponse.json({ 
      message: 'لینک بازنشانی رمز عبور به ایمیل شما ارسال شد' 
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ 
      error: 'خطایی در سمت سرور رخ داد. لطفا دوباره تلاش کنید.' 
    }, { status: 500 });
  }
}
