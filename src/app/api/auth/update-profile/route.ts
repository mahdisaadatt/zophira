import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'لطفا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, phone } = body;

    const user = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        firstName,
        lastName,
        phone,
      },
    });

    return NextResponse.json(
      { message: 'اطلاعات حساب کاربری با موفقیت به‌روز شد' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'خطایی در به‌روزرسانی اطلاعات رخ داد' },
      { status: 500 }
    );
  }
}
