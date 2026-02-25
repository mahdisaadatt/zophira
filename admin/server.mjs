import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import AdminJS from 'adminjs';
import { dark, light, noSidebar } from '@adminjs/themes';
import AdminJSExpress from '@adminjs/express';
import { buildAdminOptions, prisma } from './admin.config.mjs';

async function main() {
  const app = express();

  // Resolve project root relative to this file to avoid CWD issues
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(__dirname, '..');

  // Serve Next.js public folder (favicons, images, etc.)
  const publicDir = path.join(rootDir, 'public');
  app.use(express.static(publicDir));

  // Serve only admin/assets under /assets so files map cleanly
  const adminAssetsDir = path.join(rootDir, 'admin', 'assets');
  app.use('/assets', express.static(adminAssetsDir));

  // (Deprecated) site-fonts mount no longer used after switching to /fonts

  // Serve brand logo from an absolute filesystem path under a stable URL
  // This ensures we can reference a URL in AdminJS branding while reading from disk path
  app.get('/brand-logo.svg', (req, res) => {
    const logoPath = path.join(publicDir, 'images', 'logotype.svg');
    return res.sendFile(logoPath);
  });

  const admin = new AdminJS({
    ...buildAdminOptions(),
    defaultTheme: dark.id,
    availableThemes: [dark, light],
  });

  // Debug logs: verify resources grouping and icons
  try {
    const resLogs = (admin?.options?.resources || []).map((r, idx) => ({
      index: idx,
      name: r?.options?.name || r?.resource?.name || '—',
      navigation: r?.options?.navigation,
      icon: r?.options?.icon || 'default',
    }));
  } catch (e) {
    console.log('[AdminJS] Failed to log resources:', e);
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@zophira.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';
  const COOKIE_SECRET =
    process.env.ADMIN_COOKIE_SECRET || 'zophira_admin_cookie_secret_change_me';

  app.use(
    session({
      secret: COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          return { email };
        }
        return null;
      },
      cookiePassword: COOKIE_SECRET,
    },
    null,
    {
      resave: false,
      saveUninitialized: false,
      secret: COOKIE_SECRET,
    }
  );

  // Simple guard to ensure only authenticated admin can access stats API
  const requireAdmin = (req, res, next) => {
    try {
      if (req?.session?.adminUser) return next();
    } catch (_) {}
    return res.status(401).json({ error: 'unauthorized' });
  };

  // Real-time dashboard stats
  app.get('/admin/api/stats', requireAdmin, async (req, res) => {
    try {
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);
      const last30Days = new Date(now);
      last30Days.setDate(now.getDate() - 30);

      // Parallel queries
      const [
        productsActive,
        ordersTotal,
        usersTotal,
        productAgg,
        todayOrders,
        payments30Total,
        payments30Paid,
        recentOrders,
        recentProducts,
        recentUsers,
      ] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.product.aggregate({ _avg: { rating: true } }),
        prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.payment.count({ where: { createdAt: { gte: last30Days } } }),
        prisma.payment.count({ where: { createdAt: { gte: last30Days }, status: 'PAID' } }),
        prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, orderNumber: true, status: true, createdAt: true } }),
        prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, createdAt: true } }),
        prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, email: true, createdAt: true } }),
      ]);

      const successRate = payments30Total > 0 ? Math.round((payments30Paid / payments30Total) * 100) : 0;
      const avgRating = productAgg?._avg?.rating ? Math.round(productAgg._avg.rating * 10) / 10 : 0;

      const recentActivity = [
        ...recentOrders.map(o => ({
          type: 'order',
          message: `سفارش #${o.orderNumber} ${o.status.toLowerCase()}`,
          createdAt: o.createdAt,
        })),
        ...recentProducts.map(p => ({
          type: 'product',
          message: `محصول جدید «${p.name}» اضافه شد`,
          createdAt: p.createdAt,
        })),
        ...recentUsers.map(u => ({
          type: 'user',
          message: `کاربر جدید ${u.email} ثبت‌نام کرد`,
          createdAt: u.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      res.json({
        productsActive,
        ordersTotal,
        usersTotal,
        avgRating,
        todayOrders,
        successRate,
        recentActivity,
      });
    } catch (err) {
      console.error('Failed to compute stats', err);
      res.status(500).json({ error: 'failed_to_compute_stats' });
    }
  });

  app.use(admin.options.rootPath, adminRouter);

  const PORT = process.env.ADMIN_PORT ? Number(process.env.ADMIN_PORT) : 3001;
  app.listen(PORT, () => {
    console.log(
      `AdminJS is running at http://localhost:${PORT}${admin.options.rootPath}`
    );
  });

  const shutdown = async () => {
    try {
      await prisma.$disconnect();
    } finally {
      process.exit(0);
    }
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(err => {
  console.error('Failed to start AdminJS server:', err);
  process.exit(1);
});
