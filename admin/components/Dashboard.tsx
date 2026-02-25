import React, { useEffect, useState } from 'react';
import { Box, ShoppingCart, Users, FileText, TrendingUp, Package, CreditCard, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    productsActive: number;
    ordersTotal: number;
    usersTotal: number;
    avgRating: number;
    todayOrders: number;
    successRate: number;
    recentActivity: { type: 'order'|'product'|'user'; message: string; createdAt: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/admin/api/stats', { credentials: 'same-origin' });
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        if (mounted) setStats(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'خطا در دریافت آمار');
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <div className="dashboard">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-title">🦷 پنل ادمین زوفیرا</div>
          <div className="hero-sub">مدیریت کامل فروشگاه محصولات بهداشت دهان و دندان</div>
        </div>
        <div className="hero-metrics">
          <div className="hero-metric">
            <ShoppingCart className="kpi-icon" />
            <span className="kpi-value">{stats ? stats.todayOrders : '—'}</span>
            <span className="kpi-label">سفارش امروز</span>
          </div>
          <div className="hero-metric">
            <CreditCard className="kpi-icon" />
            <span className="kpi-value">{stats ? `${stats.successRate}%` : '—'}</span>
            <span className="kpi-label">نرخ موفقیت پرداخت</span>
          </div>
          <div className="hero-metric">
            <TrendingUp className="kpi-icon" />
            <span className="kpi-value">{stats ? stats.productsActive : '—'}</span>
            <span className="kpi-label">محصول فعال</span>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="kpis-grid">
        <div className="kpi-card">
          <div className="kpi-left">
            <Package className="kpi-icon" />
          </div>
          <div className="kpi-right">
            <div className="kpi-value">{stats ? stats.productsActive.toLocaleString('fa-IR') : '—'}</div>
            <div className="kpi-label">محصول فعال</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left">
            <ShoppingCart className="kpi-icon" />
          </div>
          <div className="kpi-right">
            <div className="kpi-value">{stats ? stats.ordersTotal.toLocaleString('fa-IR') : '—'}</div>
            <div className="kpi-label">سفارش کل</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left">
            <Users className="kpi-icon" />
          </div>
          <div className="kpi-right">
            <div className="kpi-value">{stats ? stats.usersTotal.toLocaleString('fa-IR') : '—'}</div>
            <div className="kpi-label">کاربران</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-left">
            <Star className="kpi-icon" />
          </div>
          <div className="kpi-right">
            <div className="kpi-value">{stats ? stats.avgRating.toFixed(1) : '—'}</div>
            <div className="kpi-label">میانگین امتیاز</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="section">
        <h2 className="section-title">دسترسی سریع</h2>
        <div className="actions-grid">
          <a href="/admin/resources/Product" className="quick-button btn-products"><Box size={18}/> افزودن محصول</a>
          <a href="/admin/resources/Order" className="quick-button btn-orders"><ShoppingCart size={18}/> سفارشات</a>
          <a href="/admin/resources/User" className="quick-button btn-users"><Users size={18}/> کاربران</a>
          <a href="/admin/resources/BlogPost" className="quick-button btn-categories"><FileText size={18}/> محتوا</a>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="section">
        <h2 className="section-title">فعالیت اخیر</h2>
        <ul className="activity-list">
          {stats?.recentActivity?.length ? (
            stats.recentActivity.map((a, idx) => (
              <li key={idx} className="activity-item">
                {a.type === 'order' ? <ShoppingCart size={16}/> : a.type === 'product' ? <Package size={16}/> : <Users size={16}/>}
                {a.message}
                <span className="activity-time">{new Date(a.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
              </li>
            ))
          ) : (
            <li className="activity-item"><FileText size={16}/> در حال بارگذاری فعالیت‌ها...</li>
          )}
        </ul>
      </section>

      {/* Resources */}
      <section className="section">
        <h2 className="section-title">مدیریت منابع</h2>
        <div className="resource-cards">
          <a href="/admin/resources/Product" className="resource-card">
            <Package/>
            <div>
              <div className="resource-title">محصولات</div>
              <div className="resource-sub">مدیریت و موجودی</div>
            </div>
          </a>
          <a href="/admin/resources/Order" className="resource-card">
            <ShoppingCart/>
            <div>
              <div className="resource-title">سفارشات</div>
              <div className="resource-sub">پیگیری تراکنش‌ها</div>
            </div>
          </a>
          <a href="/admin/resources/User" className="resource-card">
            <Users/>
            <div>
              <div className="resource-title">کاربران</div>
              <div className="resource-sub">پروفایل و دسترسی</div>
            </div>
          </a>
          <a href="/admin/resources/BlogPost" className="resource-card">
            <FileText/>
            <div>
              <div className="resource-title">محتوا</div>
              <div className="resource-sub">مقالات و صفحات</div>
            </div>
          </a>
        </div>
      </section>

      <div className="footer-info">
        {error ? <p style={{ color: '#fda4af' }}>خطا: {error}</p> : <p>💡 نکته: برای دسترسی بهتر از منوی سمت راست استفاده کنید</p>}
        <p>پنل ادمین زوفیرا - نسخه 1.0.0</p>
      </div>
    </div>
  );
}

export default Dashboard;
