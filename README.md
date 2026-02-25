# Zophira

فروشگاه اینترنتی محصولات بهداشت دهان و دندان، ساخته‌شده با **Next.js 15 (App Router)**، **TypeScript**، **Tailwind CSS** و **Prisma**.

این README برای راه‌اندازی سریع، توسعه، و نگهداری پروژه نوشته شده است.

---

## فهرست
- معرفی
- استک تکنولوژی
- امکانات کلیدی
- شروع سریع (Quick Start)
- تنظیم متغیرهای محیطی
- Prisma (DB / Migrate / Seed)
- پنل مدیریت (AdminJS)
- اسکریپت‌ها
- API های مهم
- عیب‌یابی رایج
- استقرار (Deployment)

---

## معرفی
Zophira یک فروشگاه کامل با تجربه کاربری مدرن و RTL است که شامل:

- کاتالوگ محصولات + جستجو و فیلتر
- سبد خرید و ثبت سفارش
- روش ارسال (پست عادی / تیپاکس)
- پرداخت (نمونه: ZarinPal)
- پنل مدیریت (AdminJS) برای مدیریت محصولات/سفارشات/محتوا

---

## استک تکنولوژی
- **Frontend/Fullstack**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI, lucide-react, Framer Motion
- **State/Forms**: Zustand, react-hook-form, Zod
- **Database/ORM**: Prisma + PostgreSQL (قابل تغییر)
- **Admin Panel**: AdminJS (سرور جدا)

---

## امکانات کلیدی
- **صفحه محصولات**
  - فیلتر/مرتب‌سازی/صفحه‌بندی
  - محصولات مشابه و مشخصات پویا (از دیتابیس)
- **Checkout**
  - انتخاب روش ارسال: `REGULAR_POST` یا `TIPAX`
  - محاسبه هزینه ارسال در خلاصه سفارش
- **پروفایل کاربر**
  - تاریخچه سفارش‌ها با UI مدرن
- **امنیت و احراز هویت**
  - NextAuth
  - سیستم فراموشی/تغییر رمز امن (token hash + expiration)
- **پنل مدیریت**
  - CRUD مدل‌ها (Product, Order, User, ...)
  - UI فارسی/RTL

---

## شروع سریع (Quick Start)

### 1) نصب وابستگی‌ها
```bash
npm install
```

### 2) تنظیم فایل محیطی
اگر فایل نمونه دارید:
```bash
copy env.example .env.local
```

سپس مقادیر `.env.local` را مطابق بخش «تنظیم متغیرهای محیطی» کامل کنید.

### 3) آماده‌سازی دیتابیس
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4) اجرای پروژه
```bash
npm run dev
```

اپ روی آدرس زیر بالا می‌آید:

- `http://localhost:3000`

---

## تنظیم متغیرهای محیطی
حداقل متغیرهای پیشنهادی در `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# AdminJS
ADMIN_EMAIL="admin@zophira.com"
ADMIN_PASSWORD="admin123"
ADMIN_PORT="3001"
SESSION_SECRET="replace_with_long_random_string"
COOKIE_SECRET="replace_with_long_random_string"

# Payment (نمونه)
ZARINPAL_MERCHANT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

نکته:

- **هرگز** فایل‌های `.env*` را کامیت نکن.
- برای production حتماً مقدار `NEXT_PUBLIC_BASE_URL` را دامنه واقعی بگذار.

---

## Prisma (DB / Migrate / Seed)
- تولید Prisma Client:
```bash
npm run db:generate
```

- ساخت/اعمال مهاجرت در محیط توسعه:
```bash
npm run db:migrate
```

- Seed دیتابیس:
```bash
npm run db:seed
```

- Prisma Studio:
```bash
npm run db:studio
```

---

## پنل مدیریت (AdminJS)
پنل مدیریت به صورت یک سرور جدا اجرا می‌شود.

### اجرا
```bash
npm run admin
```

به طور پیش‌فرض:

- URL: `http://localhost:3001`

اطلاعات ورود (در صورت عدم تغییر):

- Email: `admin@zophira.com`
- Password: `admin123`

---

## اسکریپت‌ها
اسکریپت‌های اصلی پروژه:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run admin`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run db:studio`

---

## API های مهم
مسیرها ممکن است با توجه به فایل‌های داخل `src/app/api` کمی متفاوت باشند، اما معمولاً این‌ها کلیدی‌اند:

- `GET /api/products`
- `GET /api/products/[id]`
- `GET /api/products/search?q=...`
- `POST /api/orders`
- `POST /api/payment`
- `POST /api/payment/verify`

---

## عیب‌یابی رایج

### خطای 422 در Checkout
اگر `POST /api/orders` با 422 برگشت:

- payload ارسالی را با اسکیمای اعتبارسنجی (Zod) تطبیق بده.
- لاگ سرور Next را ببین (ترمینال `npm run dev`).
- در کلاینت، بدنه پاسخ خطا را چاپ کن تا دلیل دقیق مشخص شود:

```ts
if (!res.ok) {
  const body = await res.json().catch(() => null)
  console.error('Order error', res.status, body)
}
```

---

## استقرار (Deployment)
- قبل از deploy:
  - `npm run build`
  - اطمینان از تنظیم `DATABASE_URL` و سایر env ها
- برای production، **مهاجرت‌ها** را با:
```bash
npm run db:deploy
```

---

## مجوز / License
این پروژه خصوصی است.
