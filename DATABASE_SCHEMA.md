# Zophira Dental Products - Database Schema Documentation

## Overview
This document describes the comprehensive PostgreSQL database schema designed for the Zophira dental products e-commerce platform. The schema is optimized for performance, scalability, and dental industry-specific requirements.

## Database Technology Stack
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 6.11.1
- **Language**: TypeScript
- **Framework**: Next.js 15

## Schema Architecture

### 1. User Management System

#### Users Table (`users`)
Stores customer and admin user information with comprehensive profile data.

**Key Features:**
- Support for multiple authentication methods
- Role-based access control (Customer, Admin, Super Admin)
- Gender and demographic tracking for targeted marketing
- Email verification system
- User activity tracking (last login)

**Relationships:**
- One-to-many with addresses, orders, reviews, wishlist, cart, loyalty points

#### Addresses Table (`addresses`)
Manages shipping and billing addresses with Iranian address format support.

**Key Features:**
- Support for multiple address types (shipping, billing, both)
- Default address selection
- Iranian postal code format
- Company address support for B2B customers

### 2. Product Catalog System

#### Categories Table (`categories`)
Hierarchical category system for dental products organization.

**Key Features:**
- Self-referencing hierarchy (parent-child relationships)
- SEO optimization (meta titles, descriptions)
- Slug-based URLs for better SEO
- Sort ordering for custom arrangement
- Icon support for UI enhancement

#### Brands Table (`brands`)
Dental product brand management.

**Key Features:**
- Brand logo and website integration
- SEO optimization
- Unique slug system

#### Products Table (`products`)
Comprehensive product information with dental-specific attributes.

**Key Features:**
- Flexible pricing (regular, compare, cost prices)
- Advanced inventory tracking with low stock alerts
- Physical attributes (weight, dimensions)
- Dental-specific categorization
- Age group targeting
- Ingredient tracking (JSON format)
- Usage instructions and warnings
- SEO optimization
- Product status management (draft, active, inactive, archived)
- Featured product highlighting

**Dental-Specific Enums:**
- `DentalCategory`: TOOTHPASTE, TOOTHBRUSH, MOUTHWASH, DENTAL_FLOSS, WHITENING, ORTHODONTIC, DENTURE_CARE, KIDS_DENTAL, PROFESSIONAL, ACCESSORIES
- `AgeGroup`: BABY, KIDS, TEENS, ADULTS, SENIORS, ALL_AGES

#### Product Images Table (`product_images`)
Product media management with sorting capabilities.

#### Product Variants Table (`product_variants`)
Support for product variations (size, color, flavor, etc.) with JSON attributes.

### 3. E-commerce System

#### Orders Table (`orders`)
Complete order management system.

**Key Features:**
- Unique order number generation
- Comprehensive pricing breakdown (subtotal, tax, shipping, discount)
- Order and payment status tracking
- Shipping address integration
- Order tracking with shipping numbers
- Customer and admin notes
- Delivery confirmation

**Order Status Flow:**
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
(with CANCELLED and REFUNDED as alternative states)

#### Order Items Table (`order_items`)
Individual items within orders with pricing snapshot.

#### Cart System (`cart_items`)
Persistent shopping cart with user session management.

#### Wishlist System (`wishlist_items`)
Customer wishlist functionality.

### 4. Payment System

#### Payments Table (`payments`)
Multi-gateway payment processing support.

**Supported Payment Methods:**
- Credit/Debit Cards
- Bank Transfer
- Cash on Delivery
- Digital Wallets
- Iranian Gateways: ZarinPal, Mellat, Parsian

**Features:**
- Gateway response logging (JSON format)
- Transaction ID tracking
- Multi-currency support (default: IRR)
- Payment status management

### 5. Review & Rating System

#### Reviews Table (`reviews`)
Customer product reviews with moderation capabilities.

**Key Features:**
- 5-star rating system
- Review moderation (approval required)
- Verified purchase validation
- Title and detailed comment support

### 6. Loyalty Program

#### Loyalty Points Table (`loyalty_points`)
Customer loyalty and rewards system.

**Point Types:**
- EARNED: Points gained from purchases
- REDEEMED: Points used for discounts
- EXPIRED: Expired points
- BONUS: Special promotional points

## Database Optimization Features

### Indexing Strategy
- Primary keys on all tables (CUID format)
- Unique constraints on email, slug, SKU fields
- Composite indexes on frequently queried combinations
- Foreign key indexes for join optimization

### Performance Considerations
- Decimal type for precise monetary calculations
- JSON fields for flexible attribute storage
- Cascade delete for data integrity
- Optimized query patterns in API routes

### Security Features
- Password hashing with bcrypt
- Email verification system
- Role-based access control
- Input validation with Zod schemas

## API Endpoints

### Products API (`/api/products`)
- **GET**: Fetch products with advanced filtering
  - Category, brand, price range filtering
  - Search functionality
  - Pagination support
  - Featured products
  - Dental category and age group filtering
- **POST**: Create new products (Admin only)

### Users API (`/api/users`)
- **POST**: User registration with validation

### Orders API (`/api/orders`)
- **GET**: Fetch user orders with full details
- **POST**: Create new orders with inventory management

### Cart API (`/api/cart`)
- **GET**: Fetch user cart with totals
- **POST**: Add items to cart with stock validation
- **DELETE**: Remove items from cart

## Setup Instructions

### 1. Environment Configuration
Copy `env.example` to `.env` and configure:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/zophira_db"
NEXTAUTH_SECRET="your-secret-key"
# ... other configurations
```

### 2. Database Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed
```

### 3. Sample Data
The seed script creates:
- Admin user: `admin@zophira.com` / `admin123456`
- Customer user: `customer@example.com` / `customer123`
- Sample categories and brands
- Sample dental products
- Sample addresses

## Future Enhancements

### Planned Features
1. **Inventory Management**: Advanced stock tracking with suppliers
2. **Promotions System**: Discount codes and promotional campaigns
3. **Subscription System**: Recurring orders for dental care products
4. **Analytics**: Customer behavior and sales analytics
5. **Multi-language Support**: Persian and English localization
6. **Advanced Search**: Elasticsearch integration
7. **Notification System**: Email and SMS notifications
8. **Mobile App API**: Extended API for mobile applications

### Scalability Considerations
- Database sharding for large datasets
- Redis caching for frequently accessed data
- CDN integration for product images
- Microservices architecture for high-traffic scenarios

## Maintenance

### Regular Tasks
- Database backup and recovery procedures
- Performance monitoring and optimization
- Security updates and vulnerability assessments
- Data cleanup and archival processes

### Monitoring
- Query performance analysis
- Database size and growth monitoring
- User activity and engagement metrics
- Error logging and alerting

---

**Last Updated**: July 2025
**Version**: 1.0
**Maintainer**: Zophira Development Team
