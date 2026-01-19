export interface Video {
  id: string;
  title: { ur: string; en: string; ps?: string };
  description: { ur: string; en: string; ps?: string };
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  date: string;
  category: string;
}

export interface Article {
  id: string;
  title: { ur: string; en: string; ps?: string };
  excerpt: { ur: string; en: string; ps?: string };
  content: { ur: string; en: string; ps?: string };
  author: { ur: string; en: string; ps?: string };
  date: string;
  readTime: { ur: string; en: string; ps?: string };
  category: string;
  image: string;
  featured?: boolean;
  video?: Video;
}

export interface Category {
  id: string;
  name: { ur: string; en: string; ps?: string };
  description: { ur: string; en: string; ps?: string };
  articleCount: number;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "politics",
    name: {
      ur: "سیاست",
      en: "Politics",
      ps: "سیاست"
    },
    description: {
      ur: "تازہ ترین سیاسی خبریں اور تجزیے",
      en: "Latest political news and analysis",
      ps: "تازه سياسي خبرونه او تحليلونه"
    },
    articleCount: 45,
    icon: "Building2",
  },
  {
    id: "sports",
    name: {
      ur: "کھیل",
      en: "Sports",
      ps: "لوبې"
    },
    description: {
      ur: "کھیلوں کی دنیا سے تازہ ترین اپڈیٹس",
      en: "Latest updates from the world of sports",
      ps: "د لوبو نړۍ څخه تازه اپډيټسونه"
    },
    articleCount: 32,
    icon: "Trophy",
  },
  {
    id: "technology",
    name: {
      ur: "ٹیکنالوجی",
      en: "Technology",
      ps: "ټيکنالوژي"
    },
    description: {
      ur: "جدید ٹیکنالوجی اور سائنس کی خبریں",
      en: "Modern technology and science news",
      ps: "عصري ټيکنالوژي او ساينس خبرونه"
    },
    articleCount: 28,
    icon: "Cpu",
  },
  {
    id: "entertainment",
    name: {
      ur: "تفریح",
      en: "Entertainment",
      ps: "تفرحي"
    },
    description: {
      ur: "فلم، میوزک اور تفریح کی خبریں",
      en: "Film, music and entertainment news",
      ps: "فلم، موسيقي او تفرح خبرونه"
    },
    articleCount: 38,
    icon: "Film",
  },
  {
    id: "business",
    name: {
      ur: "کاروبار",
      en: "Business",
      ps: "سوداګري"
    },
    description: {
      ur: "معیشت اور کاروباری خبریں",
      en: "Economy and business news",
      ps: "اقتصاد او سوداګريز خبرونه"
    },
    articleCount: 25,
    icon: "TrendingUp",
  },
  {
    id: "health",
    name: {
      ur: "صحت",
      en: "Health",
      ps: "روغتيا"
    },
    description: {
      ur: "صحت اور طب کی معلومات",
      en: "Health and medical information",
      ps: "روغتيا او طبي معلومات"
    },
    articleCount: 20,
    icon: "Heart",
  },
];

export const articles: Article[] = [
  {
    id: "1",
    title: { 
      ur: "پاکستان میں نئی ٹیکنالوجی کا انقلاب", 
      en: "Technology Revolution in Pakistan",
      ps: "د پاکستان کې نوی ټیکنالوژي انقلاب"
    },
    excerpt: { 
      ur: "پاکستان میں آئی ٹی سیکٹر تیزی سے ترقی کر رہا ہے اور نئے سٹارٹ اپس ملکی معیشت میں اہم کردار ادا کر رہے ہیں۔", 
      en: "Pakistan's IT sector is rapidly growing and new startups are playing an important role in national economy.",
      ps: "د پاکستان آی ټي سکټر په چټکيا سره وده کوي او نوي سټارټ اپس په ملي اقتصاد کې مهم رول لوبوي."
    },
    content: {
      ur: "پاکستان میں آئی ٹی سیکٹر تیزی سے ترقی کر رہا ہے اور نئے سٹارٹ اپس ملکی معیشت میں اہم کردار ادا کر رہے ہیں۔ گزشتہ چند سالوں میں پاکستانی ٹیکنالوجی کمپنیوں نے بین الاقوامی سطح پر اپنی شناخت بنائی ہے۔\n\nنئی حکومتی پالیسیوں کے تحت آئی ٹی ایکسپورٹس میں نمایاں اضافہ ہوا ہے۔ فری لانسنگ کے شعبے میں پاکستان دنیا کے سرفہرست ممالک میں شامل ہے۔\n\nماہرین کا کہنا ہے کہ اگر یہ رفتار جاری رہی تو آنے والے برسوں میں پاکستان خطے کا آئی ٹی ہب بن سکتا ہے۔",
      en: "Pakistan's IT sector is rapidly growing and new startups are playing an important role in national economy. In recent years, Pakistani technology companies have made their mark internationally.\n\nUnder new government policies, IT exports have increased significantly. Pakistan is among top countries in freelancing sector.\n\nExperts say that if this pace continues, Pakistan can become the region's IT hub in the coming years.",
      ps: "د پاکستان آی ټي سکټر په چټکيا سره وده کوي او نوي سټارټ اپس په ملي اقتصاد کې مهم رول لوبوي. په تېرو کلونو کې د پاکستان ټيکنالوژي شرکتونو نړيواله کچه خپل پېژندګه جوړه کړې ده.\n\nد نوو حکومتي پاليسي لاندې آی ټي صادراتو کې مهم زیاتوالی راغلئی دی. د آزاد کار په ساحه کې پاکستان د نړۍ د مخکښو هېوادو په کتار کې دی.\n\nپوهان وايي چې که دا چټکتيا پاتې راشي نو راتلونکو کلونو کې پاکستان کېدای شي سيمه د آی ټي مرکز وګرځي."
    },
    author: { 
      ur: "احمد علی", 
      en: "Ahmed Ali",
      ps: "احمد علي"
    },
    date: "2024-01-15",
    readTime: { 
      ur: "5 منٹ", 
      en: "5 min",
      ps: "5 دقيقې"
    },
    category: "technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    featured: true,
  },
  {
    id: "2",
    title: { 
      ur: "قومی کرکٹ ٹیم کی شاندار کارکردگی", 
      en: "National Cricket Team's Brilliant Performance" 
    },
    excerpt: { 
      ur: "پاکستان کرکٹ ٹیم نے حالیہ سیریز میں شاندار کارکردگی دکھاتے ہوئے فتح حاصل کی۔", 
      en: "Pakistan cricket team achieved victory with brilliant performance in recent series.",
      ps: "د پاکستان کرکټ ټيم په تېره سريز کې برياليا کارکردگي وښوده او بريا ترلاسه کړه."
    },
    content: {
      ur: "پاکستان کرکٹ ٹیم نے حالیہ سیریز میں شاندار کارکردگی دکھاتے ہوئے فتح حاصل کی۔ کپتان کی زیر قیادت ٹیم نے بہترین کھیل کا مظاہرہ کیا۔\n\nباؤلرز نے مخالف ٹیم کو کم سکور پر روکا جبکہ بلے بازوں نے آسانی سے ہدف حاصل کر لیا۔ یہ جیت پاکستان کی ICC رینکنگ کے لیے اہم ہے۔",
      en: "Pakistan cricket team achieved victory with brilliant performance in recent series. Under the captain's leadership, the team showed excellent performance.\n\nBowlers restricted the opposing team to low score while batsmen easily chased the target. This victory is important for Pakistan's ICC ranking.",
      ps: "د پاکستان کرکټ ټيم په تېره سريز کې برياليا کارکردگي وښوده او بريا ترلاسه کړه. د کپتان مشرۍ لاندې ټيم خپل ښه لوب کښود.\n\nبولرزانو د مخالف ټيم کم سکور په بند کړه پداس حال کې بټر مينډرانو اسانه هدف ترلاسه کړه. دا بريا د پاکستان لپاره د ICC رنګينګ په اړه مهمه ده."
    },
    author: { 
      ur: "فاطمہ زہرا", 
      en: "Fatima Zahra",
      ps: "فاطمہ زهرا"
    },
    date: "2024-01-14",
    readTime: { 
      ur: "4 منٹ", 
      en: "4 min",
      ps: "4 دقيقې"
    },
    category: "sports",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
    featured: true,
  },
  {
    id: "3",
    title: { 
      ur: "نئے بجٹ کا اعلان", 
      en: "New Budget Announcement" 
    },
    excerpt: { 
      ur: "حکومت نے نئے مالی سال کا بجٹ پیش کر دیا جس میں عوام کے لیے کئی ریلیف پیکجز شامل ہیں۔", 
      en: "Government has presented the new fiscal year's budget which includes several relief packages for the public." 
    },
    content: {
      ur: "حکومت نے نئے مالی سال کا بجٹ پیش کر دیا جس میں عوام کے لیے کئی ریلیف پیکجز شامل ہیں۔ تعلیم اور صحت کے شعبوں کے لیے خصوصی فنڈز مختص کیے گئے ہیں۔\n\nوزیر خزانہ نے بجٹ تقریر میں کہا کہ یہ بجٹ عوام دوست ہے اور اس سے مہنگائی میں کمی آئے گی۔",
      en: "Government has presented the new fiscal year's budget which includes several relief packages for the public. Special funds have been allocated for education and health sectors.\n\nFinance Minister said in budget speech that this budget is public-friendly and will help reduce inflation."
    },
    author: { 
      ur: "محمد حسن", 
      en: "Muhammad Hassan" 
    },
    date: "2024-01-13",
    readTime: { 
      ur: "6 منٹ", 
      en: "6 min" 
    },
    category: "politics",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    featured: true,
  },
  {
    id: "4",
    title: { 
      ur: "فلم انڈسٹری میں نئی فلموں کا اعلان", 
      en: "New Films Announced in Film Industry",
      ps: "د فلم صنعت کې نوي فلمو اعلان"
    },
    excerpt: { 
      ur: "پاکستانی فلم انڈسٹری میں اس سال کئی بڑی فلمیں ریلیز ہونے والی ہیں۔", 
      en: "Several big films are set to release in Pakistani film industry this year.",
      ps: "د پاکستان فلم صنعت کې د کال ځينې لويې فلمې خپرېدونکې دي."
    },
    content: {
      ur: "پاکستانی فلم انڈسٹری میں اس سال کئی بڑی فلمیں ریلیز ہونے والی ہیں۔ معروف پروڈیوسرز اور ڈائریکٹرز نے اپنے نئے پروجیکٹس کا اعلان کیا ہے۔\n\nنئی فلمیں مختلف زمرہ جات میں بنائی جا رہی ہیں جن میں ڈراما، ایکشن اور کامیڈی شامل ہیں۔",
      en: "Several big films are set to release in Pakistani film industry this year. Famous producers and directors have announced their new projects.\n\nNew films are being made in different genres including drama, action, and comedy.",
      ps: "د پاکستان فلم صنعت کې د کال ځينې لويې فلمې خپرېدونکې دي. د مشهور پروډیوسرو او ډایرکټرونو خپل نوي پروژې اعلان کړي دي.\n\nنوي فلمې په بېلابېلو ګروپونو کې جوړېدونکي دي چې پکې ډرامه، اکشن او کامیډي شامل دي."
    },
    author: { 
      ur: "عائشہ خان", 
      en: "Aisha Khan",
      ps: "عايشه خان"
    },
    date: "2024-01-12",
    readTime: { 
      ur: "5 منٹ", 
      en: "5 min",
      ps: "5 دقيقې"
    },
    category: "entertainment",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
    featured: true,
  },
  {
    id: "5",
    title: { 
      ur: "اسٹاک مارکیٹ میں تیزی", 
      en: "Stock Market Surge",
      ps: "د سټاک مارکیټ کې چټکتيا"
    },
    excerpt: { 
      ur: "پاکستان اسٹاک ایکسچینج میں تاریخی اضافہ ریکارڈ کیا گیا۔", 
      en: "Historic increase recorded in Pakistan Stock Exchange.",
      ps: "په پاکستان سټاک ایکسچینج کې تاريخي زيښوالی ثبت شوى."
    },
    content: {
      ur: "پاکستان اسٹاک ایکسچینج میں تاریخی اضافہ ریکارڈ کیا گیا۔ سرمایہ کاروں کا اعتماد بحال ہو رہا ہے اور غیر ملکی سرمایہ کاری بھی بڑھ رہی ہے۔\n\nماہرین کا کہنا ہے کہ یہ مثبت رجحان آنے والے مہینوں میں جاری رہے گا۔",
      en: "Historic increase recorded in Pakistan Stock Exchange. Investors' confidence is restoring and foreign investment is also increasing.\n\nExperts say this positive trend will continue in coming months.",
      ps: "په پاکستان سټاک ایکسچینج کې تاريخي زيښوالی ثبت شوى. د پانګوالو باور بېرته خپلږي او بهرنی پانګونه هم لویېږي.\n\nپوهان وايي چې دا مثبت رجحان راتلونکو مياشتو کې به دوام ولري."
    },
    author: { 
      ur: "عمران احمد", 
      en: "Imran Ahmed",
      ps: "عمران احمد"
    },
    date: "2024-01-11",
    readTime: { 
      ur: "4 منٹ", 
      en: "4 min",
      ps: "4 دقيقې"
    },
    category: "business",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    featured: true,
  },
  {
    id: "6",
    title: { 
      ur: "نئی صحت پالیسی کا اعلان", 
      en: "New Health Policy Announcement",
      ps: "د نوې روغتيا تګلارې اعلان"
    },
    excerpt: { 
      ur: "حکومت نے صحت کے شعبے میں بڑی تبدیلیوں کا اعلان کیا ہے۔", 
      en: "Government has announced major changes in health sector.",
      ps: "حکومت د روغتيا په ساحه کې لوي بدلونونه اعلان کړي دي."
    },
    content: {
      ur: "حکومت نے صحت کے شعبے میں بڑی تبدیلیوں کا اعلان کیا ہے۔ مفت علاج کی سہولیات ہر شہری کو فراہم کی جائیں گی۔\n\nنئے ہسپتالوں کی تعمیر شروع ہو گئی ہے اور موجودہ ہسپتالوں کو جدید آلات سے لیس کیا جا رہا ہے۔",
      en: "Government has announced major changes in health sector. Free treatment facilities will be provided to every citizen.\n\nConstruction of new hospitals has started and existing hospitals are being equipped with modern equipment.",
      ps: "حکومت د روغتيا په ساحه کې لوي بدلونونه اعلان کړي دي. وړيا درملدنه facilities به هر ښار ته وړاندې کړل شي.\n\nنوو روغتياونو جوړول پيل شوي او شته روغتياونو عصري وسایل سره سمبال کيږي."
    },
    author: { 
      ur: "ڈاکٹر سارہ", 
      en: "Dr. Sara",
      ps: "ډاکټر ساره"
    },
    date: "2024-01-10",
    readTime: { 
      ur: "6 منٹ", 
      en: "6 min",
      ps: "6 دقيقې"
    },
    category: "health",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    featured: true,
  },
  {
    id: "7",
    title: { 
      ur: "آرٹیفیشل انٹیلیجنس کا بڑھتا استعمال", 
      en: "Growing Use of Artificial Intelligence",
      ps: "د مصنوعي ځيرکيا د لویېدونک کارونه"
    },
    excerpt: { 
      ur: "پاکستان میں AI ٹیکنالوجی کا استعمال تیزی سے بڑھ رہا ہے۔", 
      en: "Use of AI technology is rapidly growing in Pakistan.",
      ps: "په پاکستان کې د AI ټيکنالوژي کارونه په چټکيا سره لویېږي."
    },
    content: {
      ur: "پاکستان میں AI ٹیکنالوجی کا استعمال تیزی سے بڑھ رہا ہے۔ کئی کمپنیاں اپنے کاموں میں مصنوعی ذہانت کا استعمال کر رہی ہیں۔\n\nیونیورسٹیوں میں AI کے کورسز شروع ہو گئے ہیں اور طلباء میں اس شعبے میں دلچسپی بڑھ رہی ہے۔",
      en: "Use of AI technology is rapidly growing in Pakistan. Several companies are using artificial intelligence in their work.\n\nAI courses have started in universities and students are showing increasing interest in this field.",
      ps: "په پاکستان کې د AI ټيکنالوژي کارونه په چټکيا سره لویېږي. ځينې شرکتونو خپل کارونو کې مصنوعي ځيرکيا کاروي.\n\nپه پوهنتونو کې AI کورسونه پيل شوي او زده کونکو په دې ساحه کې لويه لېوالۍ ښودلې."
    },
    author: { 
      ur: "سعد رضا", 
      en: "Saad Raza",
      ps: "سعد رضا"
    },
    date: "2024-01-09",
    readTime: { 
      ur: "6 منٹ", 
      en: "6 min",
      ps: "6 دقيقې"
    },
    category: "technology",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    featured: false,
  },
  {
    id: "8",
    title: { 
      ur: "ہاکی ٹیم کی واپسی", 
      en: "Hockey Team's Return",
      ps: "د هاکي ټيم بېرته ستنه"
    },
    excerpt: { 
      ur: "پاکستان ہاکی ٹیم نے طویل عرصے بعد بین الاقوامی مقابلے میں شرکت کی۔", 
      en: "Pakistan hockey team participated in international tournament after a long time.",
      ps: "د پاکستان هاکي ټيم له اوږدې موده وروسته نړيوالو سيالونو کې برخه واخيسته."
    },
    content: {
      ur: "پاکستان ہاکی ٹیم نے طویل عرصے بعد بین الاقوامی مقابلے میں شرکت کی۔ ٹیم نے شاندار کھیل دکھایا اور سیمی فائنل تک رسائی حاصل کی۔\n\nپاکستان ہاکی فیڈریشن نے نوجوان کھلاڑیوں کی تربیت پر خصوصی توجہ دی ہے۔",
      en: "Pakistan hockey team participated in international tournament after a long time. Team showed brilliant performance and reached the semi-finals.\n\nPakistan Hockey Federation has given special attention to training young players.",
      ps: "د پاکستان هاکي ټيم له اوږدې موده وروسته نړيوالو سيالونو کې برخه واخيسته. ټيم خپل بريالى لوب وښود او نيمه فاينل پورته کړا.\n\nد پاکستان هاکي فدراسيون د نويان لوبغاړو د روزنې په ځانګړه پاملرنه کړې ده."
    },
    author: { 
      ur: "کامران یوسف", 
      en: "Kamran Yousuf",
      ps: "کامران يوسف"
    },
    date: "2024-01-08",
    readTime: { 
      ur: "5 منٹ", 
      en: "5 min",
      ps: "5 دقيقې"
    },
    category: "sports",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951ce09e?w=800",
    featured: false,
  },
];

export const getArticleById = (id: string): Article | undefined => {
  return articles.find((article) => article.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((category) => category.id === id);
};

export const getArticlesByCategory = (categoryId: string): Article[] => {
  return articles.filter((article) => article.category === categoryId);
};

export const videos: Video[] = [
  {
    id: "v1",
    title: { 
      ur: "پاکستان میں نئی ٹیکنالوجی کا انقلاب", 
      en: "Technology Revolution in Pakistan",
      ps: "د پاکستان کې نوی ټیکنالوژي انقلاب"
    },
    description: { 
      ur: "پاکستان میں آئی ٹی سیکٹر تیزی سے ترقی کر رہا ہے اور نئے سٹارٹ اپس ملکی معیشت میں اہم کردار ادا کر رہے ہیں۔", 
      en: "Pakistan's IT sector is rapidly growing and new startups are playing an important role in the national economy.",
      ps: "د پاکستان آی ټي سکټر په چټکيا سره وده کوي او نوي سټارټ اپس په ملي اقتصاد کې مهم رول لوبوي."
    },
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "5:42",
    views: 15420,
    date: "2024-01-15",
    category: "technology"
  },
  {
    id: "v2",
    title: { 
      ur: "قومی کرکٹ ٹیم کی شاندار کارکردگی", 
      en: "National Cricket Team's Brilliant Performance",
      ps: "د پاکستان کرکټ ټيم برياليا کارکردگي"
    },
    description: { 
      ur: "پاکستان کرکٹ ٹیم نے حالیہ سیریز میں شاندار کارکردگی دکھاتے ہوئے فتح حاصل کی۔", 
      en: "Pakistan cricket team achieved victory with brilliant performance in recent series.",
      ps: "د پاکستان کرکټ ټيم په تېره سريز کې برياليا کارکردگي وښوده او بريا ترلاسه کړه."
    },
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "3:28",
    views: 28950,
    date: "2024-01-14",
    category: "sports"
  },
  {
    id: "v3",
    title: { 
      ur: "نئے بجٹ کا اعلان - مکمل تحلیل", 
      en: "New Budget Announcement - Complete Analysis",
      ps: "د نوې بودجې اعلان - بشپړه تحليل"
    },
    description: { 
      ur: "حکومت نے نئے مالی سال کا بجٹ پیش کر دیا جس میں عوام کے لیے کئی ریلیف پیکجز شامل ہیں۔", 
      en: "Government has presented the new fiscal year's budget which includes several relief packages for the public.",
      ps: "حکومت د نوې مالي کال لپاره بوديجه وړاندې کړې چې پکې د عواد لپاره ځينې رليف پیکيجونه شامل دي."
    },
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "8:15",
    views: 32100,
    date: "2024-01-13",
    category: "politics"
  }
];

export const getVideosByCategory = (categoryId: string): Video[] => {
  return videos.filter((video) => video.category === categoryId);
};

export const getFeaturedVideos = (): Video[] => {
  return videos.slice(0, 3);
};

export const getVideoById = (id: string): Video | undefined => {
  return videos.find((video) => video.id === id);
};

export const getFeaturedArticles = (): Article[] => {
  return articles.filter((article) => article.featured);
}