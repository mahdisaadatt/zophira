import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zophira.com' },
    update: {},
    create: {
      email: 'admin@zophira.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  // Create dental product categories
  const categories = [
    {
      name: 'خمیر دندان',
      slug: 'toothpaste',
      description: 'انواع خمیر دندان برای مراقبت روزانه از دندان‌ها',
      icon: '🦷'
    },
    {
      name: 'مسواک',
      slug: 'toothbrush',
      description: 'مسواک‌های دستی و برقی برای تمیز کردن دندان‌ها',
      icon: '🪥'
    },
    {
      name: 'دهان‌شویه',
      slug: 'mouthwash',
      description: 'دهان‌شویه‌های ضدباکتری و تازه‌کننده',
      icon: '🧴'
    },
    {
      name: 'نخ دندان',
      slug: 'dental-floss',
      description: 'نخ دندان برای تمیز کردن بین دندان‌ها',
      icon: '🧵'
    },
    {
      name: 'سفیدکننده دندان',
      slug: 'whitening',
      description: 'محصولات سفیدکننده و زیبایی دندان',
      icon: '✨'
    },
    {
      name: 'محصولات کودکان',
      slug: 'kids-dental',
      description: 'محصولات مخصوص بهداشت دهان و دندان کودکان',
      icon: '👶'
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create dental brands
  const brands = [
    {
      name: 'Marvis',
      slug: 'marvis',
      description: 'خمیر دندان‌های لوکس مارویس با طعم‌های خاص و کیفیت بالا',
      logo: '/images/brands/marvis.png',
      website: 'https://www.marvis.com',
    },
    {
      name: 'Oral-B',
      slug: 'oral-b',
      description: 'برند معتبر محصولات بهداشت دهان و دندان',
      website: 'https://oralb.com'
    },
    {
      name: 'Colgate',
      slug: 'colgate',
      description: 'برند جهانی مراقبت از دندان',
      website: 'https://colgate.com'
    },
    {
      name: 'Sensodyne',
      slug: 'sensodyne',
      description: 'متخصص در مراقبت از دندان‌های حساس',
      website: 'https://sensodyne.com'
    },
    {
      name: 'Listerine',
      slug: 'listerine',
      description: 'برند معتبر دهان‌شویه',
      website: 'https://listerine.com'
    },
    {
      name: 'Aquafresh',
      slug: 'aquafresh',
      description: 'محصولات مراقبت کامل از دندان',
      website: 'https://aquafresh.com'
    }
  ]

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    })
  }

  // Create a sample discount code 'first'
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  await prisma.discount.upsert({
    where: { code: 'first' },
    update: {
      isActive: true,
      startDate: now,
      endDate: in30Days,
      percent: 10,
      maxUses: 100000,
      minOrder: 0,
    },
    create: {
      code: 'first',
      amount: 0,
      percent: 10,
      maxUses: 100000,
      minOrder: 0,
      maxAmount: 0,
      startDate: now,
      endDate: in30Days,
      isActive: true,
    },
  })

  // Get created categories and brands for products
  const toothpasteCategory = await prisma.category.findUnique({ where: { slug: 'toothpaste' } })
  const marvisBrand = await prisma.brand.findUnique({ where: { slug: 'marvis' } })

  if (!marvisBrand) {
    throw new Error('Marvis brand not found. Make sure brand seed is running correctly.')
  }

  const nonMarvisOrderItemProductIds = (
    await prisma.orderItem.findMany({
      where: {
        product: {
          OR: [{ brandId: null }, { NOT: { brandId: marvisBrand.id } }],
        },
      },
      select: { productId: true },
      distinct: ['productId'],
    })
  ).map((x) => x.productId)

  await prisma.product.updateMany({
    where: {
      id: { in: nonMarvisOrderItemProductIds },
    },
    data: {
      isActive: false,
      status: 'INACTIVE',
    },
  })

  await prisma.product.deleteMany({
    where: {
      OR: [{ brandId: null }, { NOT: { brandId: marvisBrand.id } }],
      id: { notIn: nonMarvisOrderItemProductIds },
    },
  })

  // Create Marvis-only products (10 items)
  const fakeRating = (slug: string) => {
    const sum = Array.from(slug).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    const rating = 3.9 + (sum % 111) / 100
    return Math.round(rating * 100) / 100
  }

  const fakeReviewCount = (slug: string) => {
    const sum = Array.from(slug).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    return 12 + (sum % 180)
  }

  const USD_TO_TOMAN = 165_000
  const roundToTenThousand = (toman: number) => Math.round(toman / 10_000) * 10_000

  const usdPriceBySlug: Record<string, number> = {
    // Based on common retail pricing (e.g., Dermstore):
    'marvis-classic-strong-mint': 10.5,
    'marvis-aquatic-mint': 10.5,
    'marvis-ginger-mint': 10.5,
    'marvis-cinnamon-mint': 10.5,
    'marvis-jasmine-mint': 10.5,
    'marvis-amarelli-licorice': 10.5,
    'marvis-black-forest': 10.5,
    'marvis-sweet-sour-rhubarb': 10.5,
    'marvis-anise-mint': 10.5,
    'marvis-whitening-mint': 13.5,
    'marvis-smokers-whitening-mint': 13.5,
    // 100ml special size is typically priced higher than 75ml
    'marvis-classic-strong-mint-special': 15,
    'marvis-sensitive-gums-gentle-mint': 12.5,
  }

  const discountPercentBySlug: Record<string, number> = {
    'marvis-whitening-mint': 10,
    'marvis-cinnamon-mint': 5,
    'marvis-black-forest': 12,
    'marvis-classic-strong-mint-special': 15,
    'marvis-smokers-whitening-mint': 8,
  }

  const products = [
    {
      name: 'خمیر دندان Marvis Classic Strong Mint',
      slug: 'marvis-classic-strong-mint',
      description: 'خمیر دندان مارویس با طعم نعناع قوی برای تازگی طولانی‌مدت و تمیزی عمیق.',
      shortDescription: 'نعناع قوی و ماندگار',
      price: '290000',
      comparePrice: '340000',
      sku: 'MRV-CLSM-075',
      quantity: 60,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: true,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'برای کودکان زیر ۶ سال با نظر پزشک.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p1.webp', altText: 'Marvis Classic Strong Mint', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Whitening Mint',
      slug: 'marvis-whitening-mint',
      description: 'خمیر دندان سفیدکننده مارویس با طعم نعناع برای کمک به کاهش لکه‌های سطحی.',
      shortDescription: 'نعناع + سفیدکننده',
      price: '315000',
      comparePrice: null,
      sku: 'MRV-WHM-075',
      quantity: 45,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'WHITENING',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: true,
      usage: 'برای نتیجه بهتر حداقل ۲ هفته مرتب استفاده شود.',
      warnings: 'در صورت حساسیت مصرف را کاهش دهید.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p2.webp', altText: 'Marvis Whitening Mint', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Aquatic Mint',
      slug: 'marvis-aquatic-mint',
      description: 'ترکیب خنک نعناع و حس طراوت دریایی برای نفس تازه و تمیزی روزانه.',
      shortDescription: 'طراوت دریایی',
      price: '295000',
      comparePrice: '330000',
      sku: 'MRV-AQM-075',
      quantity: 50,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: false,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'دور از دسترس کودکان نگهداری شود.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p3.webp', altText: 'Marvis Aquatic Mint', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Ginger Mint',
      slug: 'marvis-ginger-mint',
      description: 'طعم خاص زنجبیل و نعناع برای تجربه‌ای متفاوت و انرژی‌بخش.',
      shortDescription: 'زنجبیل + نعناع',
      price: '305000',
      comparePrice: '355000',
      sku: 'MRV-GNM-075',
      quantity: 35,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: false,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'برای لثه‌های حساس با ملایمت استفاده شود.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p4.webp', altText: 'Marvis Ginger Mint', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Cinnamon Mint',
      slug: 'marvis-cinnamon-mint',
      description: 'ترکیب دارچین گرم و نعناع خنک برای طعمی کلاسیک و متفاوت.',
      shortDescription: 'دارچین + نعناع',
      price: '305000',
      comparePrice: null,
      sku: 'MRV-CNM-075',
      quantity: 40,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: true,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'برای کودکان توصیه نمی‌شود.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p5.webp', altText: 'Marvis Cinnamon Mint', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Jasmine Mint',
      slug: 'marvis-jasmine-mint',
      description: 'عطر لطیف یاس در کنار نعناع برای طعمی نرم و لوکس.',
      shortDescription: 'یاس + نعناع',
      price: '315000',
      comparePrice: '360000',
      sku: 'MRV-JSM-075',
      quantity: 30,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: false,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'در صورت بروز حساسیت مصرف قطع شود.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p6.webp', altText: 'Marvis Jasmine Mint', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Amarelli Licorice',
      slug: 'marvis-amarelli-licorice',
      description: 'طعم شیرین‌بیان (لیکوریش) با حس خاص و متفاوت برای علاقه‌مندان طعم‌های خاص.',
      shortDescription: 'لیکوریش خاص',
      price: '325000',
      comparePrice: '385000',
      sku: 'MRV-LIC-075',
      quantity: 25,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: false,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'برای ذائقه‌های حساس ممکن است مناسب نباشد.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p7.webp', altText: 'Marvis Amarelli Licorice', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Black Forest',
      slug: 'marvis-black-forest',
      description: 'ترکیب طعم میوه‌ای/شیرین با نعناع برای تجربه‌ای خاص و جذاب.',
      shortDescription: 'طعم خاص و متمایز',
      price: '330000',
      comparePrice: '390000',
      sku: 'MRV-BLF-075',
      quantity: 20,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: false,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'برای استفاده روزانه مناسب است.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p8.webp', altText: 'Marvis Black Forest', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Sweet & Sour Rhubarb',
      slug: 'marvis-sweet-sour-rhubarb',
      description: 'طعم ریواس شیرین و ترش در کنار حس تازه نعناع.',
      shortDescription: 'ریواس شیرین و ترش',
      price: '330000',
      comparePrice: null,
      sku: 'MRV-RHB-075',
      quantity: 22,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: false,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'دور از نور مستقیم نگهداری شود.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p9.webp', altText: 'Marvis Sweet & Sour Rhubarb', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Classic Strong Mint (سایز ویژه)',
      slug: 'marvis-classic-strong-mint-special',
      description: 'نسخه ویژه با همان طعم کلاسیک نعناع قوی؛ مناسب طرفداران مارویس.',
      shortDescription: 'نسخه ویژه',
      price: '365000',
      comparePrice: '420000',
      sku: 'MRV-CLSM-100',
      quantity: 15,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: true,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'برای کودکان زیر ۶ سال با نظر پزشک.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '100ml',
      images: [{ url: '/images/products/p10.webp', altText: 'Marvis Classic Strong Mint Special', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Anise Mint',
      slug: 'marvis-anise-mint',
      description: 'طعم خاص بادیان در کنار نعناع برای حس متفاوت، تازه و ماندگار.',
      shortDescription: 'بادیان + نعناع',
      price: '315000',
      comparePrice: null,
      sku: 'MRV-ANM-075',
      quantity: 28,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: false,
      usage: 'روزانه ۲ بار استفاده شود.',
      warnings: 'در صورت حساسیت مصرف را قطع کنید.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p11.webp', altText: 'Marvis Anise Mint', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Smokers Whitening Mint',
      slug: 'marvis-smokers-whitening-mint',
      description: 'فرمول سفیدکننده مخصوص لکه‌های سطحی (مناسب افراد سیگاری) با طعم نعناع.',
      shortDescription: 'سفیدکننده مخصوص',
      price: '345000',
      comparePrice: '395000',
      sku: 'MRV-SWM-075',
      quantity: 20,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'WHITENING',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: true,
      usage: 'روزانه ۲ بار استفاده شود. برای نتیجه بهتر دوره‌ای استفاده شود.',
      warnings: 'برای دندان‌های خیلی حساس با احتیاط استفاده شود.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p12.webp', altText: 'Marvis Smokers Whitening Mint', sortOrder: 0 }],
    },
    {
      name: 'خمیر دندان Marvis Sensitive Gums Gentle Mint',
      slug: 'marvis-sensitive-gums-gentle-mint',
      description: 'نعناع ملایم با فرمول مناسب لثه و دندان‌های حساس برای استفاده روزانه.',
      shortDescription: 'مناسب حساسیت',
      price: '335000',
      comparePrice: null,
      sku: 'MRV-SGM-075',
      quantity: 24,
      categoryId: toothpasteCategory?.id,
      brandId: marvisBrand.id,
      dentalCategory: 'TOOTHPASTE',
      ageGroup: 'ADULTS',
      status: 'ACTIVE',
      isFeatured: false,
      usage: 'روزانه ۲ بار با مسواک نرم استفاده شود.',
      warnings: 'در صورت تحریک لثه مصرف را کاهش دهید.',
      countryOfOrigin: 'ایتالیا',
      expiryPeriod: '24 ماه',
      packaging: 'تیوب',
      volume: '75ml',
      images: [{ url: '/images/products/p13.webp', altText: 'Marvis Sensitive Gums Gentle Mint', sortOrder: 0 }],
    },
  ]

  for (const product of products) {
    const { categoryId, brandId, images, ...productData } = product as any

    const data: any = {
      ...productData,
    };

    // Override pricing based on USD retail price
    const usd = usdPriceBySlug[product.slug] ?? 10.5
    const originalToman = roundToTenThousand(usd * USD_TO_TOMAN)
    const discountPercent = discountPercentBySlug[product.slug]
    if (typeof discountPercent === 'number' && discountPercent > 0) {
      const discountedToman = roundToTenThousand(originalToman * (1 - discountPercent / 100))
      data.price = String(discountedToman)
      data.comparePrice = String(originalToman)
    } else {
      data.price = String(originalToman)
      data.comparePrice = null
    }

    if (data.rating === undefined || data.rating === null) {
      data.rating = fakeRating(product.slug)
    }

    if (data.reviewCount === undefined || data.reviewCount === null) {
      data.reviewCount = fakeReviewCount(product.slug)
    }

    if (categoryId) {
      data.categoryId = categoryId;
    }

    if (brandId) {
      data.brandId = brandId;
    }

    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
    })

    if (Array.isArray(images) && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } })
      await prisma.productImage.createMany({
        data: images.map((img: any) => ({
          productId: createdProduct.id,
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder ?? 0,
        })),
      })
    }
  }

  const blogPosts = [
    {
      title: 'راهنمای کامل انتخاب خمیر دندان برای دندان\u200cهای حساس',
      slug: 'guide-sensitive-teeth-toothpaste',
      excerpt: 'چطور خمیر دندان مناسب دندان\u200cهای حساس را انتخاب کنیم و چه ترکیباتی مهم\u200cاند؟',
      content:
        'اگر دندان\u200cهای حساسی دارید، انتخاب خمیر دندان مناسب می\u200cتواند درد را کاهش دهد.\n\nدر این مقاله درباره ترکیبات رایج مثل نیترات پتاسیم و فلوراید، نحوه استفاده صحیح و نکات سبک زندگی صحبت می\u200cکنیم.',
      featuredImage: '/images/blog/sensitive-teeth.jpg',
      tags: '["حساسیت دندان", "خمیر دندان", "مراقبت روزانه"]',
      status: 'PUBLISHED',
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: 'دهان\u200cشویه: چه زمانی لازم است و کدام نوع بهتر است؟',
      slug: 'mouthwash-when-and-which',
      excerpt: 'همه دهان\u200cشویه\u200cها مثل هم نیستند؛ انتخاب درست به نیاز شما بستگی دارد.',
      content:
        'دهان\u200cشویه می\u200cتواند مکمل مسواک و نخ دندان باشد، اما جایگزین آن\u200cها نیست.\n\nدر این مقاله انواع دهان\u200cشویه (ضدباکتری، بدون الکل، مخصوص لثه) و نکات انتخاب را بررسی می\u200cکنیم.',
      featuredImage: '/images/blog/mouthwash.jpg',
      tags: '["دهان\u200cشویه", "لثه", "بهداشت دهان"]',
      status: 'PUBLISHED',
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date(),
    },
    {
      title: 'نخ دندان کشیدن صحیح در ۵ قدم',
      slug: 'how-to-floss-5-steps',
      excerpt: 'اگر نخ دندان استفاده نمی\u200cکنی، بخش مهمی از پلاک\u200cزدایی را از دست می\u200cدهی.',
      content:
        'نخ دندان باعث تمیز شدن نواحی بین دندان\u200cها می\u200cشود که مسواک دسترسی ندارد.\n\nدر این راهنما ۵ قدم ساده برای نخ دندان کشیدن صحیح را یاد می\u200cگیریم.',
      featuredImage: '/images/blog/floss.jpg',
      tags: '["نخ دندان", "پلاک", "آموزش"]',
      status: 'PUBLISHED',
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date(),
    },
    {
      title: 'چطور مسواک مناسب انتخاب کنیم؟ (سختی برس، سری، و تکنیک)',
      slug: 'choose-toothbrush-guide',
      excerpt: 'مسواک خوب فقط برند نیست؛ ویژگی\u200cها و تکنیک استفاده هم مهم است.',
      content:
        'برای بیشتر افراد، مسواک با برس نرم بهترین انتخاب است.\n\nدر این مقاله درباره سختی برس، اندازه سری، زاویه دسته و نکات تعویض مسواک صحبت می\u200cکنیم.',
      featuredImage: '/images/blog/brush.jpg',
      tags: '["مسواک", "راهنمای خرید", "بهداشت"]',
      status: 'PUBLISHED',
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date(),
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        tags: post.tags,
        status: post.status as any,
        isPublished: post.isPublished,
        isFeatured: post.isFeatured,
        publishedAt: post.publishedAt,
      },
      create: {
        ...post,
        authorId: admin.id,
      } as any,
    })
  }

  // Create sample customer
  const customerPassword = await hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'مشتری',
      lastName: 'نمونه',
      phone: '09123456789',
      role: 'CUSTOMER',
    },
  })

  // Create sample address for customer
  await prisma.address.upsert({
    where: { id: 'sample-address-id' },
    update: {},
    create: {
      id: 'sample-address-id',
      userId: customer.id,
      type: 'BOTH',
      firstName: 'مشتری',
      lastName: 'نمونه',
      addressLine1: 'خیابان ولیعصر، پلاک 123',
      city: 'تهران',
      state: 'تهران',
      postalCode: '1234567890',
      country: 'IR',
      phone: '09123456789',
      isDefault: true,
    },
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('👤 Admin user: admin@zophira.com / admin123456')
  console.log('👤 Customer user: customer@example.com / customer123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
