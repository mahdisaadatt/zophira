import { z } from 'zod'

// User validation schemas
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Product validation schemas
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  content: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  sku: z.string().optional(),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  dentalCategory: z.enum([
    'TOOTHPASTE', 'TOOTHBRUSH', 'MOUTHWASH', 'DENTAL_FLOSS',
    'WHITENING', 'ORTHODONTIC', 'DENTURE_CARE', 'KIDS_DENTAL',
    'PROFESSIONAL', 'ACCESSORIES'
  ]).optional(),
  ageGroup: z.enum(['BABY', 'KIDS', 'TEENS', 'ADULTS', 'SENIORS', 'ALL_AGES']).optional(),
  ingredients: z.string().optional(),
  usage: z.string().optional(),
  warnings: z.string().optional(),
})

// Order validation schemas
export const orderCreateSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, 'حداقل یک محصول برای ثبت سفارش لازم است.'),
  shippingAddress: z.object({
    fullName: z.string().min(3, 'نام و نام خانوادگی الزامی است.'),
    phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست.'),
    address: z.string().min(10, 'آدرس کامل الزامی است.'),
    postalCode: z.string().regex(/^\d{10}$/, 'کد پستی معتبر نیست.'),
  }),
  shippingMethod: z.enum(['REGULAR_POST', 'TIPAX']).default('REGULAR_POST'),
  shippingFee: z.number().min(0, 'هزینه ارسال نمی‌تواند منفی باشد.').default(0),
  // Client can optionally send a discountCode. Server will validate and compute the amount.
  discountCode: z.string().min(1).optional(),
  // discountAmount from client is ignored for security; kept optional for backward compatibility
  discountAmount: z.number().min(0).default(0).optional(),
  customerNotes: z.string().optional(),
});

// Address validation schemas
export const addressCreateSchema = z.object({
  type: z.enum(['SHIPPING', 'BILLING', 'BOTH']).default('SHIPPING'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  company: z.string().optional(),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().default('IR'),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
})

// Review validation schemas
export const reviewCreateSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
})

// Comment validation schemas
export const commentCreateSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment is too long'),
  rating: z.number().int().min(1).max(5).default(5),
  userId: z.string(),
  productId: z.string().optional(),
  blogPostId: z.string().optional(),
  parentId: z.string().optional(),
})

// Blog post validation schemas
export const blogPostCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImage: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})

export type UserRegistration = z.infer<typeof userRegistrationSchema>
export type UserLogin = z.infer<typeof userLoginSchema>
export type ProductCreate = z.infer<typeof productCreateSchema>
export type OrderCreate = z.infer<typeof orderCreateSchema>
export type AddressCreate = z.infer<typeof addressCreateSchema>
export type ReviewCreate = z.infer<typeof reviewCreateSchema>
export type CommentCreate = z.infer<typeof commentCreateSchema>
export type BlogPostCreate = z.infer<typeof blogPostCreateSchema>
