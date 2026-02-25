import React from 'react';
import { BasePropertyProps } from 'adminjs';

const TinyMCEViewer: React.FC<BasePropertyProps> = ({ property, record }) => {
  const value = (record?.params?.[property.path] as string) || '';

  return (
    <div
      dir="rtl"
      style={{
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #eee',
        padding: 16,
      }}
      className="prose prose-rtl max-w-none prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-gray-700"
      // Render HTML as-is, viewer only
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default TinyMCEViewer;
