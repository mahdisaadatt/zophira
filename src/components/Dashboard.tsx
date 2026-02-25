import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#333', marginBottom: '8px' }}>داشبورد مدیریت زوفیرا</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>پنل مدیریت محصولات دندانپزشکی</p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', color: '#0891b2', marginBottom: '10px' }}>آمار کلی</h2>
          <p style={{ color: '#666' }}>مشاهده آمار کلی فروشگاه</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', color: '#0891b2', marginBottom: '10px' }}>سفارشات جدید</h2>
          <p style={{ color: '#666' }}>مدیریت سفارشات در انتظار</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', color: '#0891b2', marginBottom: '10px' }}>محصولات</h2>
          <p style={{ color: '#666' }}>مدیریت محصولات دندانپزشکی</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', color: '#0891b2', marginBottom: '10px' }}>کاربران</h2>
          <p style={{ color: '#666' }}>مدیریت کاربران و مشتریان</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
