import { useState } from 'react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from "@/hooks/useLanguage";

const RichTextDemo = () => {
  const { language, isRTL } = useLanguage();
  const [content, setContent] = useState('');

  const sampleUrdu = '<h2>اردو نیوز ہب کا خوش آمدید</h2><p>یہاں ایک جدید اردو نیوز پورٹل ہے جہاں آپ کو تازہ ترین خبریں، تجزیے، اور مضامین فراہم کرتا ہے۔ ہمارا مقصد آپ تک معتبر اور درست معلومات پہنچانا ہے۔</p><ul><li>تازہ ترین خبریں</li><li>سیاسی تجزیے</li><li>کھیل کی دنیا</li><li>ٹیکنالوجی</li></ul>';

  const sampleEnglish = '<h2>Welcome to Urdu News Hub</h2><p>This is a modern Urdu news portal where you can find the latest news, analysis, and articles. Our goal is to bring you authentic and accurate information.</p><ul><li>Latest News</li><li>Political Analysis</li><li>Sports World</li><li>Technology</li></ul>';

  const loadSample = () => {
    setContent(language === 'ur' ? sampleUrdu : sampleEnglish);
  };

  const clearContent = () => {
    setContent('');
  };

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            {language === 'ur' ? 'رچ ٹیکسٹ ایڈیٹر ڈیمو' : 'Rich Text Editor Demo'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={loadSample} variant="outline">
              {language === 'ur' ? 'نمونہ لوڈ کریں' : 'Load Sample'}
            </Button>
            <Button onClick={clearContent} variant="outline">
              {language === 'ur' ? 'صاف کریں' : 'Clear'}
            </Button>
          </div>
          
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder={language === 'ur' ? 'یہاں اپنا مواد لکھیں...' : 'Start writing your content here...'}
            className="min-h-[400px]"
          />

          {content && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ur' ? 'پیش نظارہ:' : 'Preview:'}
              </h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RichTextDemo;
