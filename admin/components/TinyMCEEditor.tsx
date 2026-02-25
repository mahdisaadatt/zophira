import React from 'react';
import { BasePropertyProps } from 'adminjs';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor: React.FC<BasePropertyProps> = (props) => {
  const { property, record, onChange } = props;
  
  const value = record?.params?.[property.path] || '';

  const handleEditorChange = (content: string, editor: any) => {
    if (onChange) {
      onChange(property.path, content);
    }
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <Editor
        key={`tinymce-${property.path}-${record?.id || 'new'}`}
        apiKey="yk73my2m2qezj0oxmiqyiv8xlwxhw138n08256oycobeeu5v"
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: 400,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'directionality'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | ltr rtl | link image | code | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; direction: rtl; }',
          directionality: 'rtl',
          language: 'fa',
          branding: false,
          resize: true,
          statusbar: false,
          licenseKey: 'gpl',
        }}
      />
      {property?.description && (
        <p style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>
          {property.description}
        </p>
      )}
    </div>
  );
};

export default TinyMCEEditor;
