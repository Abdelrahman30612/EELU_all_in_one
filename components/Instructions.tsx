import React from 'react';

interface InstructionsProps {
  error: string;
}

const Instructions: React.FC<InstructionsProps> = ({ error }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-cyan-500/30">
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg relative text-center mb-6" role="alert">
            <strong className="font-bold block mb-2">خطأ في الإعداد!</strong>
            <span className="block sm:inline">{error}</span>
        </div>
      
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">كيفية الحصول على رابط Google Sheet CSV</h2>
      <p className="mb-4 text-gray-300">
        لتشغيل هذا التطبيق، تحتاج إلى نشر ملف Google Sheet الخاص بك على الويب كملف CSV. اتبع الخطوات التالية:
      </p>
      <ol className="list-decimal list-inside space-y-3 text-gray-300">
        <li>
          افتح ملف Google Sheet الذي يحتوي على بياناتك. تأكد من أن الأعمدة مرتبة كالتالي:
          <ul className="list-disc list-inside mt-2 mr-6 bg-gray-700/50 p-3 rounded space-y-1">
            <li><strong>العمود A:</strong> اسم المادة (Subject)</li>
            <li><strong>العمود B:</strong> عنوان المحتوى (Content Title)</li>
            <li><strong>العمود C:</strong> رابط المحتوى (Content URL)</li>
            <li><strong>العمود D:</strong> المستوى (Level)</li>
            <li><strong>العمود E:</strong> التصنيف (Category - e.g., lectures, matrials)</li>
            <li><strong>العمود F:</strong> اسم المحاضر (Instructor) - (مطلوب فقط للمحاضرات)</li>
          </ul>
        </li>
        <li>
          من القائمة العلوية، اذهب إلى <code className="bg-gray-700 px-2 py-1 rounded">File</code> (ملف) &gt; <code className="bg-gray-700 px-2 py-1 rounded">Share</code> (مشاركة) &gt; <code className="bg-gray-700 px-2 py-1 rounded">Publish to web</code> (النشر على الويب).
        </li>
        <li>
          في النافذة التي تظهر، اختر علامة التبويب <code className="bg-gray-700 px-2 py-1 rounded">Link</code> (رابط).
        </li>
        <li>
          في القائمة المنسدلة الأولى، تأكد من اختيار الشيت الصحيح الذي يحتوي على بياناتك.
        </li>
        <li>
          في القائمة المنسدلة الثانية، اختر <code className="bg-gray-700 px-2 py-1 rounded">Comma-separated values (.csv)</code>.
        </li>
        <li>
          اضغط على زر <code className="bg-green-600 px-2 py-1 rounded">Publish</code> (نشر) الأخضر.
        </li>
        <li>
          انسخ الرابط الذي يظهر لك.
        </li>
        <li>
          افتح ملف <code className="bg-gray-700 px-2 py-1 rounded">constants.ts</code> في مشروع الكود، وقم بلصق الرابط المنسوخ كقيمة للمتغير <code className="bg-gray-700 px-2 py-1 rounded">GOOGLE_SHEET_CSV_URL</code>.
        </li>
      </ol>
    </div>
  );
};

export default Instructions;
