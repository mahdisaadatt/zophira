// AdminJS configuration in ESM JavaScript
// Connects to Prisma and exposes all models as resources

import AdminJS from 'adminjs';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';
import faLocale from './locale/fa.mjs';

// Register Prisma adapter
AdminJS.registerAdapter({ Database, Resource });

// Create a singleton Prisma client
export const prisma = new PrismaClient();

// Map Prisma models to AdminJS resources using Prisma DMMF + getModelByName
const models = Prisma?.dmmf?.datamodel?.models ?? [];

const componentLoader = new ComponentLoader();
// Resolve absolute path to custom components (ESM-compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dashboardPath = path.join(__dirname, 'components', 'Dashboard.tsx');
const tinyMCEPath = path.join(__dirname, 'components', 'TinyMCEEditor.tsx');
const tinyMCEViewerPath = path.join(__dirname, 'components', 'TinyMCEViewer.tsx');
const Components = {
  Dashboard: componentLoader.add('Dashboard', dashboardPath),
  TinyMCEEditor: componentLoader.add('TinyMCEEditor', tinyMCEPath),
  TinyMCEViewer: componentLoader.add('TinyMCEViewer', tinyMCEViewerPath),
  // other custom components
};

// Helpers: map model names to navigation sections
const getNavigationForModel = name => {
  // Sections with numeric prefixes to control order in sidebar
  const NAV = {
    CATALOG: { name: 'مدیریت کالا', icon: 'Box' },
    SALES: { name: 'فروش و سفارشات', icon: 'ShoppingCart' },
    CONTENT: { name: 'مدیریت محتوا', icon: 'FileText' },
    USERS: { name: 'کاربران و آدرس‌ها', icon: 'User' },
    OTHER: { name: 'تنظیمات و سایر', icon: 'Settings' },
  };

  switch (name) {
    // Catalog
    case 'Product':
    case 'Category':
    case 'Brand':
    case 'ProductImage':
    case 'ProductVariant':
      return NAV.CATALOG;

    // Sales
    case 'Order':
    case 'OrderItem':
    case 'Payment':
    case 'Discount':
    case 'CartItem':
      return NAV.SALES;

    // Content
    case 'BlogPost':
    case 'Comment':
    case 'Review':
      return NAV.CONTENT;

    // Users
    case 'User':
    case 'Address':
      return NAV.USERS;

    default:
      return NAV.OTHER;
  }
};

// Helpers: localized Persian names per resource
const getResourceNameForModel = name => {
  switch (name) {
    case 'Product':
      return 'محصولات';
    case 'Category':
      return 'دسته‌بندی‌ها';
    case 'Brand':
      return 'برندها';
    case 'ProductImage':
      return 'تصاویر محصول';
    case 'ProductVariant':
      return 'متغیرهای محصول';
    case 'Order':
      return 'سفارش‌ها';
    case 'OrderItem':
      return 'آیتم‌های سفارش';
    case 'Payment':
      return 'پرداخت‌ها';
    case 'Discount':
      return 'کدهای تخفیف';
    case 'CartItem':
      return 'سبدهای خرید';
    case 'BlogPost':
      return 'مقالات';
    case 'Comment':
      return 'نظرات';
    case 'Review':
      return 'نقد و بررسی‌ها';
    case 'User':
      return 'کاربران';
    case 'Address':
      return 'آدرس‌ها';
    default:
      return name;
  }
};

// Build resources and also collect dynamic labels/resources to feed i18n
const dynamicLabels = {};
const dynamicResources = {};

const resources = models.map(model => {
  // Default options
  const options = {
    navigation: getNavigationForModel(model?.name),
    name: getResourceNameForModel(model?.name),
  };

  // Set resource-specific icons for better semantics
  switch (model?.name) {
    case 'Product':
      options.icon = 'Box';
      break;
    case 'Category':
      options.icon = 'Tag';
      break;
    case 'Brand':
      options.icon = 'Tag';
      break;
    case 'ProductImage':
      options.icon = 'Image';
      break;
    case 'ProductVariant':
      options.icon = 'Adjustments';
      break;
    case 'Order':
      options.icon = 'ShoppingCart';
      break;
    case 'OrderItem':
      options.icon = 'List';
      break;
    case 'Payment':
      options.icon = 'CurrencyDollar';
      break;
    case 'Discount':
      options.icon = 'Percent';
      break;
    case 'CartItem':
      options.icon = 'ShoppingCart';
      break;
    case 'BlogPost':
      options.icon = 'Document';
      break;
    case 'Comment':
      options.icon = 'Chat';
      break;
    case 'Review':
      options.icon = 'Star';
      break;
    case 'User':
      options.icon = 'User';
      break;
    case 'Address':
      options.icon = 'MapPin';
      break;
    default:
      // leave default icon
      break;
  }

  // Customize Product model to use rich text editor for description
  if (model?.name === 'Product') {
    options.properties = {
      ...(options.properties || {}),
      content: {
        // Hide content from list to avoid long rich text in table
        isVisible: { list: false, edit: true, show: true, filter: false },
        components: {
          edit: Components.TinyMCEEditor,
          show: Components.TinyMCEViewer,
        },
        props: {
          tinymceApiKey: process.env.TINYMCE_API_KEY,
        },
      },
    };
  }

  // Customize BlogPost model to use rich text editor for content
  if (model?.name === 'BlogPost') {
    options.properties = {
      ...(options.properties || {}),
      content: {
        isVisible: { list: false, edit: true, show: true, filter: false },
        components: {
          edit: Components.TinyMCEEditor,
          show: Components.TinyMCEViewer,
        },
        props: {
          tinymceApiKey: process.env.TINYMCE_API_KEY,
        },
      },
    };
  }

  return {
    resource: { model: getModelByName(model.name), client: prisma },
    options,
  };
});

// Fill dynamicLabels from navigation sections and resource names
try {
  // Navigation section names (Persian) used as labels
  const navNames = Array.from(
    new Set(
      models.map(m => getNavigationForModel(m?.name)?.name).filter(Boolean)
    )
  );
  navNames.forEach(n => {
    dynamicLabels[n] = n; // label key is the name, value is same Persian string
  });

  // Resource labels: key is model name (AdminJS uses labels.<resourceId>)
  models.forEach(m => {
    dynamicLabels[m.name] = getResourceNameForModel(m.name);
    dynamicResources[m.name] = { name: getResourceNameForModel(m.name) };
  });
} catch (e) {
  // no-op: labels are best-effort; avoid crashing admin config
}

// Persian locale: import from external file and merge dynamic labels/resources
const locale = {
  ...faLocale,
  translations: {
    ...faLocale.translations,
    fa: {
      ...faLocale.translations.fa,
      labels: {
        ...(faLocale.translations.fa?.labels || {}),
        ...dynamicLabels,
      },
      resources: {
        ...(faLocale.translations.fa?.resources || {}),
        ...dynamicResources,
      },
      // keep other sections from faLocale (actions, buttons, messages, etc.)
    },
  },
};

// Branding with dental theme colors
const branding = {
  companyName: 'زوفیرا | پنل مدیریت',
  // Use absolute URL to avoid basePath/iframe issues
  logo: `http://localhost:${
    process.env.ADMIN_PORT ? Number(process.env.ADMIN_PORT) : 3001
  }/brand-logo.svg`,
  favicon: '/favicon.ico',
  withMadeWithLove: false,
};

export const buildAdminOptions = () => ({
  resources,
  rootPath: '/admin',
  locale,
  branding,
  assets: {
    styles: ['/assets/styles.css'],
  },
  dashboard: {
    component: Components.Dashboard,
  },
  componentLoader,
});
