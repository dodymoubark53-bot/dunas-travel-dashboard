import React, { createContext, useContext, useState, useEffect } from 'react';
import { DASHBOARD_TRANSLATIONS } from '../i18n/dashboardTranslations';

// The 8 Destinations List Definition
export const DESTINATIONS_LIST = [
  { id: 'egypt', nameAr: 'مصر', nameEn: 'Egypt', flag: '🇪🇬', icon: 'pyramid', color: 'from-amber-500/20 to-amber-600/10' },
  { id: 'turkey', nameAr: 'تركيا', nameEn: 'Turkey', flag: '🇹🇷', icon: 'mosque', color: 'from-red-500/20 to-red-600/10' },
  { id: 'jordan', nameAr: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴', icon: 'canyon', color: 'from-emerald-500/20 to-emerald-600/10' },
  { id: 'morocco', nameAr: 'المغرب', nameEn: 'Morocco', flag: '🇲🇦', icon: 'arch', color: 'from-rose-500/20 to-rose-600/10' },
  { id: 'greece', nameAr: 'اليونان', nameEn: 'Greece', flag: '🇬🇷', icon: 'temple', color: 'from-blue-500/20 to-blue-600/10' },
  { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', flag: '🇦🇪', icon: 'skyline', color: 'from-yellow-500/20 to-yellow-600/10' },
  { id: 'tunisia', nameAr: 'تونس', nameEn: 'Tunisia', flag: '🇹🇳', icon: 'desert', color: 'from-orange-500/20 to-orange-600/10' },
  { id: 'holyland', nameAr: 'الأرض المقدسة', nameEn: 'Holy Land', flag: '🕊️', icon: 'church', color: 'from-purple-500/20 to-purple-600/10' },
];

const initialAdminProfile = {
  name: 'Attia Yamany',
  email: 'attia@dunastravel.com',
  phone: '+20 100 123 4567',
  role: 'المدير العام (Super Admin)',
  avatar: 'https://res.cloudinary.com/tibx70zb/image/upload/v1787135165/ef80aed2-87a9-410f-a561-9dd5e04370b3_xffzmg.jpg',
  language: 'ar',
  timezone: 'Africa/Cairo (GMT+3)',
  bio: 'المدير العام المسؤول عن منظومة Dunas Travel وإدارة الرحلات والباكدجز والحجوزات.',
  twoFactor: true,
  emailNotifications: true,
  systemAlerts: true
};

const initialCompanies = [
  {
    id: 'COMP-101',
    name: 'CVC Viagens Brasil',
    taxId: 'BR-98745612/0001',
    tier: 'VIP',
    country: 'Brasil 🇧🇷',
    representative: 'Rodrigo Mendes',
    email: 'b2b@cvc.com.br',
    phone: '+55 11 3003-9000',
    creditLimit: 50000,
    status: 'ACTIVE',
    createdAt: '2026-01-10'
  },
  {
    id: 'COMP-102',
    name: 'Viajes El Corte Inglés',
    taxId: 'ES-A28012345',
    tier: 'PLATINUM',
    country: 'España 🇪🇸',
    representative: 'María Fernández',
    email: 'grupos@elcorteingles.es',
    phone: '+34 91 418 8800',
    creditLimit: 35000,
    status: 'ACTIVE',
    createdAt: '2026-02-15'
  }
];

const initialAgents = [
  {
    id: 'AGT-501',
    name: 'Carlos Eduardo Santos',
    companyId: 'COMP-101',
    companyName: 'CVC Viagens Brasil',
    email: 'carlos.santos@cvc.com.br',
    phone: '+55 11 99887-1122',
    commissionRate: 12,
    walletBalance: 4250,
    status: 'ACTIVE',
    createdAt: '2026-03-01'
  },
  {
    id: 'AGT-502',
    name: 'Elena Rodríguez',
    companyId: 'COMP-102',
    companyName: 'Viajes El Corte Inglés',
    email: 'elena.rodriguez@elcorteingles.es',
    phone: '+34 612 345 678',
    commissionRate: 10,
    walletBalance: 2800,
    status: 'ACTIVE',
    createdAt: '2026-03-12'
  }
];

const initialCommissions = [
  {
    id: 'COMM-8001',
    bookingId: 'DUNAS-BK-1001',
    agentId: 'AGT-501',
    agentName: 'Carlos Eduardo Santos',
    companyName: 'CVC Viagens Brasil',
    bookingAmount: 2670,
    rate: 12,
    earnedAmount: 320.40,
    status: 'APPROVED',
    payoutDate: '2026-08-30'
  }
];

const initialWallets = [
  {
    id: 'WLT-301',
    agentId: 'AGT-501',
    agentName: 'Carlos Eduardo Santos',
    companyName: 'CVC Viagens Brasil',
    balance: 4250,
    totalDeposited: 15000,
    totalWithdrawn: 10750,
    status: 'ACTIVE',
    lastUpdated: '2026-08-18'
  },
  {
    id: 'WLT-302',
    agentId: 'AGT-502',
    agentName: 'Elena Rodríguez',
    companyName: 'Viajes El Corte Inglés',
    balance: 2800,
    totalDeposited: 9500,
    totalWithdrawn: 6700,
    status: 'ACTIVE',
    lastUpdated: '2026-08-17'
  }
];

const initialPhotos = [
  { id: 'p-1', src: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783023886/3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg', title: 'الأهرامات العظيمة بالجيزة', dest: 'egypt', tag: 'Photo' },
  { id: 'p-2', src: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783023877/2ec72126-709b-4c8d-8f7b-a592d212cc3b_czpoig.jpg', title: 'كروز النيل الفاخر', dest: 'egypt', tag: 'Photo' }
];

const initialVideos = [
  {
    id: 'v-1',
    publicId: 'Despu%C3%A9s_de_una_intensa_jornada_en_Bogot%C3%A1__en_Dunas_Travel_compartimos_una_cena_exclusiva_con_nuestros_partners_estrat%C3%A9gicos._480P_SD_sv2pei',
    title: 'Dinner with Partners in Bogotá',
    description: 'An exclusive dinner event celebrating our strategic partnerships after a successful day in Colombia.',
    dest: 'colombia',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
  }
];

const initialBookings = [
  {
    id: 'DUNAS-BK-1001',
    customerName: 'Fernando Silva',
    customerEmail: 'fernando.silva@gmail.com',
    customerPhone: '+55 11 98765-4321',
    customerCountry: 'Brasil 🇧🇷',
    tripTitle: 'Cairo Express & Pyramids',
    tripId: 'eg-001',
    destination: 'egypt',
    travelDate: '2026-09-10',
    guests: { adults: 2, children: 1 },
    totalAmount: 2670,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
    specialRequests: 'نطلب غرفة مطلة على الأهرامات ومرشد يتحدث البرتغالية.',
    createdAt: '2026-08-15'
  }
];

const initialEgyptPackages = [
  {
    id: 'egypt-pkg-1',
    slug: 'classic-program',
    title: 'Classic Program (البرنامج الكلاسيكي)',
    destination: 'egypt',
    category: 'classic',
    duration: '8 Days / 7 Nights',
    price: 1250,
    rating: 4.9,
    popular: true,
    image: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg',
    description: 'Experience the timeless beauty of Egypt with our signature classic itinerary covering Giza, Cairo & Nile Cruise.',
    translations: {
      ar: { title: 'البرنامج الكلاسيكي لمصر (8 أيام)', overview: 'رحلة كلاسيكية فاخرة تشمل الأهرامات والقاهرة وكروز النيل بالأقصر وأسوان.' },
      en: { title: 'Egypt Classic Program (8 Days)', overview: 'Timeless classic itinerary covering Giza Pyramids, Cairo & Nile Cruise between Luxor & Aswan.' },
      es: { title: 'Programa Clásico de Egipto (8 Días)', overview: 'Itinerario clásico inolvidable por las Pirámides de Guiza, El Cairo y Crucero por el Nilo.' },
      pt: { title: 'Programa Clássico do Egito (8 Dias)', overview: 'Roteiro clássico abrangendo as Pirâmides de Gizé, Cairo e Cruzeiro pelo Rio Nilo.' },
      it: { title: 'Programma Classico Egitto (8 Giorni)', overview: 'Itinerario classico che copre le Piramidi di Giza, Il Cairo e Crociera sul Nilo.' }
    }
  }
];

const initialTrips = [
  {
    id: 'eg-001',
    slug: 'cairo-express-4d',
    title: 'Cairo Express & Pyramids',
    destination: 'egypt',
    duration: '4 Days / 3 Nights',
    price: 890,
    rating: 4.8,
    reviewCount: 312,
    popular: true,
    views: 1420,
    inquiries: 120,
    images: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'],
    translations: {
      ar: { title: 'رحلة القاهرة السريعة والأهرامات', overview: 'برنامج مكثف لمدة 4 أيام يغطي أهرامات الجيزة، أبو الهول، والمتحف المصري الكبير.' },
      en: { title: 'Cairo Express & Pyramids Tour', overview: 'Intensive 4-day itinerary covering Giza Pyramids, Great Sphinx, and the Grand Egyptian Museum.' },
      es: { title: 'Tour Cairo Exprés y Pirámides', overview: 'Itinerario intensivo de 4 días por las Pirámides de Guiza, Gran Esfinge y Gran Museo Egipcio.' },
      pt: { title: 'Tour Cairo Expresso e Pirâmides', overview: 'Roteiro intensivo de 4 dias cobrindo as Pirâmides de Gizé, Grande Esfinge e Grande Museu Egípcio.' },
      it: { title: 'Tour Cairo Express e Piramidi', overview: 'Itinerario intensivo di 4 giorni che copre le Piramidi di Giza, la Grande Sfinge e il Grande Museo Egizio.' }
    }
  }
];

const initialHotels = [
  {
    id: 'hotel-cairo-1',
    name: 'Steigenberger Hotel El Tahrir',
    destination: 'egypt',
    city: 'Cairo',
    stars: 5,
    rating: 4.8,
    pricePerNight: 180,
    status: 'ACTIVE',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'يقع فندق شتايجنبرجر التحرير في قلب وسط القاهرة على بُعد خطوات من المتحف المصري وميدان التحرير، ويتميز بأعلى معايير الضيافة الألمانية والإطلالات الخلابة على النيل والمدينة.',
    address: 'ميدان التحرير، وسط البلد، القاهرة، مصر',
    mapUrl: 'https://maps.google.com/?q=Steigenberger+Hotel+El+Tahrir',
    phone: '+20 2 25750000',
    email: 'reservations.eltahrir@steigenberger.com',
    website: 'https://www.hrewards.com/en/steigenberger-hotel-el-tahrir-cairo',
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'roomService', 'nileView', 'airportShuttle', 'parking', 'ac'],
    roomTypes: [
      { id: 'r1', name: 'Superior City View Room', price: 180, mealPlan: 'Bed & Breakfast', maxOccupancy: 2 },
      { id: 'r2', name: 'Deluxe Nile View Room', price: 230, mealPlan: 'Bed & Breakfast', maxOccupancy: 2 },
      { id: 'r3', name: 'Junior Executive Suite', price: 390, mealPlan: 'Half Board', maxOccupancy: 3 }
    ],
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'إلغاء مجاني حتى 48 ساعة قبل موعد الوصول.',
      childPolicy: 'الأطفال أقل من 6 سنوات مجاناً شامل الإفطار.'
    },
    translations: {
      ar: { name: 'فندق شتايجنبرجر التحرير بالقاهرة', description: 'فندق 5 نجوم فاخر في قلب القاهرة بالقرب من المتحف المصري.' },
      en: { name: 'Steigenberger Hotel El Tahrir Cairo', description: 'Luxury 5-star hotel in the heart of Downtown Cairo near the Egyptian Museum.' },
      es: { name: 'Hotel Steigenberger El Tahrir El Cairo', description: 'Hotel de lujo de 5 estrellas en el corazón de El Cairo.' },
      pt: { name: 'Hotel Steigenberger El Tahrir Cairo', description: 'Hotel de luxo 5 estrelas no centro do Cairo.' },
      it: { name: 'Hotel Steigenberger El Tahrir Il Cairo', description: 'Hotel di lusso a 5 stelle nel cuore del Cairo.' }
    }
  },
  {
    id: 'hotel-sharm-1',
    name: 'Rixos Premium Sharm El Sheikh',
    destination: 'egypt',
    city: 'Sharm El Sheikh',
    stars: 5,
    rating: 4.9,
    pricePerNight: 320,
    status: 'VIP',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'منتجع ريكسوس بريميوم خليج نبق، تجربة إقامة فاخرة بنظام Ultra All-Inclusive وشواطئ خاصة ومستويات رفاهية استثنائية.',
    address: 'خليج نبق، شرم الشيخ، جنوب سيناء، مصر',
    mapUrl: 'https://maps.google.com/?q=Rixos+Premium+Sharm+El+Sheikh',
    phone: '+20 69 3710210',
    email: 'sharm@rixos.com',
    website: 'https://www.rixos.com',
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'roomService', 'seaView', 'beachfront', 'aquaPark', 'allInclusive'],
    roomTypes: [
      { id: 'r10', name: 'Deluxe Sea View Room', price: 320, mealPlan: 'Ultra All Inclusive', maxOccupancy: 2 },
      { id: 'r11', name: 'Junior Suite with Private Pool', price: 550, mealPlan: 'Ultra All Inclusive', maxOccupancy: 3 }
    ],
    policies: {
      checkIn: '15:00',
      checkOut: '12:00',
      cancellation: 'إلغاء مجاني قبل 7 أيام من الوصول.',
      childPolicy: 'مرحباً بالعائلات والأطفال لجميع الأعمار.'
    },
    translations: {
      ar: { name: 'منتجع ريكسوس بريميوم شرم الشيخ', description: 'منتجع فاخر على شاطئ البحر الأحمر بنظام ألترا شامل الجميع.' },
      en: { name: 'Rixos Premium Sharm El Sheikh Resort', description: 'Luxury beachfront resort offering ultra all-inclusive service.' }
    }
  }
];

const initialTransportation = [
  {
    id: 'tr-bus-1',
    name: 'Luxury Tour Bus Golden',
    category: 'bus',
    seats: 50,
    rating: 5.0,
    image: '/imgs/transportation/bus1.jpeg',
    features: ['تكييف كامل', 'واي فاي مجاني', 'سائق محترف', 'شاشات عرض']
  }
];

const initialReviews = [
  {
    id: 'rev-1',
    tripId: 'eg-001',
    tripTitle: 'Cairo Express & Pyramids',
    author: 'Carlos Eduardo',
    country: 'Brazil',
    rating: 5,
    date: '2026-07-15',
    comment: 'Experiência inesquecível! Nosso guia falou português perfeitamente e a organização foi impecável.'
  }
];

const initialSiteContent = {
  heroTitle: 'اكتشف سحر مصر والشرق الأوسط مع Dunas Travel',
  heroSubtitle: 'تجربة رحلات فاخرة، تنظيم متكامل، ومرافقة خاصة باللغة الإسبانية والبرتغالية بأعلى مستويات الخدمة.',
  tagline: 'رحلات بريميوم وخدمات VIP متكاملة',
  ctaText: 'استكشف برامجنا الفاخرة',
  aboutTitle: 'عن شركة دناس ترافيل Dunas Travel',
  aboutStory: 'نحن وكالة سياحة وسفر رائدة متخصصة في تنظيم أفضل الرحلات السياحية والبرامج الثقافية والترفيهية للزوار من أمريكا اللاتينية وأوروبا والعالم العربي.',
  statTrips: '500+',
  statTravelers: '25,000+',
  statYears: '15+',
  statSatisfaction: '99%',
  contactPhone: '+20 100 123 4567',
  contactEmail: 'info@dunastravel.com',
  contactAddress: 'القاهرة، مصر - فرع وسط البلد',
  facebook: 'https://facebook.com/dunastravel',
  instagram: 'https://instagram.com/dunastravel',
  youtube: 'https://youtube.com/dunastravel'
};

const initialBlogs = [
  {
    id: 'blog-1',
    title: 'أفضل 10 نصائح لزيارة الأهرامات والمتحف المصري الكبير 2026',
    slug: 'top-10-tips-pyramids-grand-museum',
    category: 'دليل السفر',
    author: 'Attia Yamany',
    date: '2026-08-10',
    image: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783023886/3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg',
    excerpt: 'استعد لرحلة لا تُنسى في القاهرة مع أفضل النصائح لحجز المرشد المتحدث بلغتك وأفضل أوقات الزيارة.',
    content: 'تفاصيل الدليل الشامل لزيارة الجيزة والمتحف الكبير وتجربة الكروز النيلي...'
  },
  {
    id: 'blog-2',
    title: 'لماذا تعتبر الرحلات النيلية بين الأقصر وأسوان أفضل تجربة سياحية؟',
    slug: 'why-nile-cruise-luxor-aswan',
    category: 'رحلات نيلية',
    author: 'Dunas Editorial',
    date: '2026-08-01',
    image: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783023877/2ec72126-709b-4c8d-8f7b-a592d212cc3b_czpoig.jpg',
    excerpt: 'استكشف المعابد الفرعونية القديمة على ضفاف النيل مع خدمات الخمس نجوم والضيافة الاستثنائية.',
    content: 'المعابد والأسرار الفرعونية في معبد الكرنك، الأقصر، وفيلة...'
  }
];

const initialFaqs = [
  {
    id: 'faq-1',
    question: 'هل توفرون مرشدين يتحدثون اللغة الإسبانية والبرتغالية؟',
    answer: 'نعم بالتأكيد! جميع مرشدينا السياحيين مؤهلون ويتحدثون الإسبانية والبرتغالية بطلاقة فائقة لضمان أفضل تجربة تفاعلية.',
    category: 'الخدمات والمرشدين'
  },
  {
    id: 'faq-2',
    question: 'كيف يمكن حجز رحلة أو برنامج سياحي مع Dunas Travel؟',
    answer: 'يمكنك الحجز مباشرة عبر موقعنا أو التواصل مع فريق خدمة العملاء عبر الواتساب والبريد الإلكتروني لتأكيد الحجز فوراً.',
    category: 'الحجوزات والتعاملات'
  }
];

const initialCommunications = [
  {
    id: 'comm-101',
    customerName: 'Roberto Silva',
    email: 'roberto.silva@gmail.com',
    phone: '+55 11 98765-4321',
    country: 'Brazil 🇧🇷',
    subject: 'استفسار عن حجز برنامج Cairo & Nile Cruise لـ 4 أفراد',
    message: 'Hola! Queremos reservar un paquete de 8 días en Egipto para noviembre con guía en portugués. ¿Tienen disponibilidad?',
    source: 'Website Contact Form',
    status: 'Unread',
    date: '2026-08-19 12:30',
    assignedTo: 'فريق خدمة المبيعات'
  },
  {
    id: 'comm-102',
    customerName: 'Maria Fernandez',
    email: 'maria.f@hotmail.es',
    phone: '+34 612 345 678',
    country: 'Spain 🇪🇸',
    subject: 'طلب تخصيص رحلة خاصة إلى الأردن والبتراء',
    message: 'Buenas tardes. Me gustaría solicitar una cotización personalizada para visitar Petra y Wadi Rum en octubre.',
    source: 'WhatsApp',
    status: 'In Progress',
    date: '2026-08-18 16:45',
    assignedTo: 'Attia Yamany'
  },
  {
    id: 'comm-103',
    customerName: 'Juan Pablo Ramos',
    email: 'jp.ramos@turismo.com',
    phone: '+57 300 123 4567',
    country: 'Colombia 🇨🇴',
    subject: 'تأكيد دفعة حجز رحلة عائلية إلى تركيا',
    message: 'Estimados, adjunto el comprobante de transferencia para el paquete de Estambul y Capadocia.',
    source: 'Email Direct',
    status: 'Resolved',
    date: '2026-08-17 09:15',
    assignedTo: 'قسم الحسابات'
  }
];

const initialNotifications = [
  {
    id: 'notif-1',
    title: 'تنبيه حجز جديد! (Booking #BK-2026-89)',
    message: 'قام العميل Carlos Eduardo بحجز برنامج Cairo Express & Nile Cruise بقيمة $2,450.',
    type: 'Booking',
    targetAudience: 'Admins & Agents',
    status: 'Unread',
    date: '2026-08-19 14:10',
    icon: 'Calendar'
  },
  {
    id: 'notif-2',
    title: 'إطلاق عروض الشتاء 2026 لقاصدي الأهرامات والأقصر',
    message: 'تم إرسال إشعار ترويجي بخصم 15% لجميع المسافرين المسجلين في القائمة البريدية.',
    type: 'Offer',
    targetAudience: 'All Travelers',
    status: 'Read',
    date: '2026-08-19 10:00',
    icon: 'Sparkles'
  },
  {
    id: 'notif-3',
    title: 'طلب انضمام وكالة سياحية جديدة (Latam Tours Brazil)',
    message: 'تقدمت وكالة Latam Tours بطلب تسجيل كعميل B2B مخصص مع نسبة عمولة 12%.',
    type: 'B2B',
    targetAudience: 'Super Admin',
    status: 'Read',
    date: '2026-08-18 18:30',
    icon: 'Building'
  }
];

const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [dashboardLang, setDashboardLang] = useState(() => {
    return localStorage.getItem('dunas_dashboard_lang') || 'ar';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('dunas_dashboard_theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_profile_v3');
    return saved ? JSON.parse(saved) : initialAdminProfile;
  });

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_companies_v1');
    return saved ? JSON.parse(saved) : initialCompanies;
  });

  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_agents_v1');
    return saved ? JSON.parse(saved) : initialAgents;
  });

  const [commissions, setCommissions] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_commissions_v1');
    return saved ? JSON.parse(saved) : initialCommissions;
  });

  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_wallets_v1');
    return saved ? JSON.parse(saved) : initialWallets;
  });

  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_photos_v1');
    return saved ? JSON.parse(saved) : initialPhotos;
  });

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_videos_v1');
    return saved ? JSON.parse(saved) : initialVideos;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_bookings_v3');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_trips_v2');
    return saved ? JSON.parse(saved) : initialTrips;
  });

  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_packages_v2');
    return saved ? JSON.parse(saved) : initialEgyptPackages;
  });

  const [hotels, setHotels] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_hotels_v2');
    return saved ? JSON.parse(saved) : initialHotels;
  });

  const [transportation, setTransportation] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_transport_v2');
    return saved ? JSON.parse(saved) : initialTransportation;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_reviews_v2');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [siteContent, setSiteContent] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_site_content_v1');
    return saved ? JSON.parse(saved) : initialSiteContent;
  });

  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_blogs_v1');
    return saved ? JSON.parse(saved) : initialBlogs;
  });

  const [faqs, setFaqs] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_faqs_v1');
    return saved ? JSON.parse(saved) : initialFaqs;
  });

  const [communications, setCommunications] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_communications_v1');
    return saved ? JSON.parse(saved) : initialCommunications;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('dunas_admin_notifications_v1');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  useEffect(() => { localStorage.setItem('dunas_dashboard_lang', dashboardLang); }, [dashboardLang]);
  useEffect(() => {
    localStorage.setItem('dunas_dashboard_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);
  useEffect(() => { localStorage.setItem('dunas_admin_profile_v3', JSON.stringify(adminProfile)); }, [adminProfile]);
  useEffect(() => { localStorage.setItem('dunas_admin_companies_v1', JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem('dunas_admin_agents_v1', JSON.stringify(agents)); }, [agents]);
  useEffect(() => { localStorage.setItem('dunas_admin_commissions_v1', JSON.stringify(commissions)); }, [commissions]);
  useEffect(() => { localStorage.setItem('dunas_admin_wallets_v1', JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem('dunas_admin_photos_v1', JSON.stringify(photos)); }, [photos]);
  useEffect(() => { localStorage.setItem('dunas_admin_videos_v1', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('dunas_admin_bookings_v3', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('dunas_admin_trips_v2', JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem('dunas_admin_packages_v2', JSON.stringify(packages)); }, [packages]);
  useEffect(() => { localStorage.setItem('dunas_admin_hotels_v2', JSON.stringify(hotels)); }, [hotels]);
  useEffect(() => { localStorage.setItem('dunas_admin_transport_v2', JSON.stringify(transportation)); }, [transportation]);
  useEffect(() => { localStorage.setItem('dunas_admin_reviews_v2', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('dunas_admin_site_content_v1', JSON.stringify(siteContent)); }, [siteContent]);
  useEffect(() => { localStorage.setItem('dunas_admin_blogs_v1', JSON.stringify(blogs)); }, [blogs]);
  useEffect(() => { localStorage.setItem('dunas_admin_faqs_v1', JSON.stringify(faqs)); }, [faqs]);
  useEffect(() => { localStorage.setItem('dunas_admin_communications_v1', JSON.stringify(communications)); }, [communications]);
  useEffect(() => { localStorage.setItem('dunas_admin_notifications_v1', JSON.stringify(notifications)); }, [notifications]);

  // Translation Helper Function
  const t = (key: string) => {
    const translationsObj = DASHBOARD_TRANSLATIONS as Record<string, Record<string, string>>;
    const langDict = translationsObj[dashboardLang] || translationsObj['ar'];
    return langDict?.[key] || translationsObj['ar']?.[key] || key;
  };

  const updateProfile = (fields: any) => setAdminProfile((prev: any) => ({ ...prev, ...fields }));

  // --- B2B COMPANIES CRUD ---
  const addCompany = (item: any) => setCompanies((prev: any[]) => [{ ...item, id: item.id || `COMP-${Math.floor(100 + Math.random() * 900)}` }, ...prev]);
  const updateCompany = (id: string, fields: any) => setCompanies((prev: any[]) => prev.map((c: any) => c.id === id ? { ...c, ...fields } : c));
  const deleteCompany = (id: string) => setCompanies((prev: any[]) => prev.filter((c: any) => c.id !== id));

  // --- B2B AGENTS CRUD ---
  const addAgent = (item: any) => setAgents((prev: any[]) => [{ ...item, id: item.id || `AGT-${Math.floor(500 + Math.random() * 900)}` }, ...prev]);
  const updateAgent = (id: string, fields: any) => setAgents((prev: any[]) => prev.map((a: any) => a.id === id ? { ...a, ...fields } : a));
  const deleteAgent = (id: string) => setAgents((prev: any[]) => prev.filter((a: any) => a.id !== id));

  // --- COMMISSIONS CRUD ---
  const addCommission = (item: any) => setCommissions((prev: any[]) => [{ ...item, id: item.id || `COMM-${Math.floor(8000 + Math.random() * 1000)}` }, ...prev]);
  const updateCommission = (id: string, fields: any) => setCommissions((prev: any[]) => prev.map((c: any) => c.id === id ? { ...c, ...fields } : c));
  const deleteCommission = (id: string) => setCommissions((prev: any[]) => prev.filter((c: any) => c.id !== id));

  // --- WALLETS CRUD ---
  const addWallet = (item: any) => setWallets((prev: any[]) => [{ ...item, id: item.id || `WLT-${Math.floor(300 + Math.random() * 900)}` }, ...prev]);
  const updateWallet = (id: string, fields: any) => setWallets((prev: any[]) => prev.map((w: any) => w.id === id ? { ...w, ...fields } : w));
  const deleteWallet = (id: string) => setWallets((prev: any[]) => prev.filter((w: any) => w.id !== id));

  // --- PHOTOS & VIDEOS CRUD ---
  const addPhoto = (item: any) => setPhotos((prev: any[]) => [{ ...item, id: item.id || `p-${Date.now()}` }, ...prev]);
  const updatePhoto = (id: string, fields: any) => setPhotos((prev: any[]) => prev.map((p: any) => p.id === id ? { ...p, ...fields } : p));
  const deletePhoto = (id: string) => setPhotos((prev: any[]) => prev.filter((p: any) => p.id !== id));

  const addVideo = (item: any) => setVideos((prev: any[]) => [{ ...item, id: item.id || `v-${Date.now()}` }, ...prev]);
  const updateVideo = (id: string, fields: any) => setVideos((prev: any[]) => prev.map((v: any) => v.id === id ? { ...v, ...fields } : v));
  const deleteVideo = (id: string) => setVideos((prev: any[]) => prev.filter((v: any) => v.id !== id));

  // --- BOOKINGS CRUD ---
  const addBooking = (item: any) => {
    const newBooking = {
      ...item,
      id: item.id || `DUNAS-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBookings((prev: any[]) => [newBooking, ...prev]);
  };
  const updateBooking = (id: string, fields: any) => setBookings((prev: any[]) => prev.map((b: any) => b.id === id ? { ...b, ...fields } : b));
  const deleteBooking = (id: string) => setBookings((prev: any[]) => prev.filter((b: any) => b.id !== id));

  // --- TRIPS CRUD & TRANSLATIONS ---
  const addTrip = (item: any) => setTrips((prev: any[]) => [{ ...item, id: item.id || `trip-${Date.now()}` }, ...prev]);
  const updateTrip = (id: string, fields: any) => setTrips((prev: any[]) => prev.map((t: any) => t.id === id ? { ...t, ...fields } : t));
  const deleteTrip = (id: string) => setTrips((prev: any[]) => prev.filter((t: any) => t.id !== id));

  const updateTripTranslation = (tripId: string, langKey: string, translationObj: any) => {
    setTrips((prev: any[]) => prev.map((trip: any) => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        translations: { ...(trip.translations || {}), [langKey]: translationObj }
      };
    }));
  };

  const deleteTripTranslation = (tripId: string, langKey: string) => {
    setTrips((prev: any[]) => prev.map((trip: any) => {
      if (trip.id !== tripId) return trip;
      const nextTranslations = { ...(trip.translations || {}) };
      delete nextTranslations[langKey];
      return { ...trip, translations: nextTranslations };
    }));
  };

  // --- PACKAGES CRUD ---
  const addPackage = (item: any) => setPackages((prev: any[]) => [{ ...item, id: item.id || `pkg-${Date.now()}` }, ...prev]);
  const updatePackage = (id: string, fields: any) => setPackages((prev: any[]) => prev.map((p: any) => p.id === id ? { ...p, ...fields } : p));
  const deletePackage = (id: string) => setPackages((prev: any[]) => prev.filter((p: any) => p.id !== id));

  // --- HOTELS CRUD ---
  const addHotel = (item: any) => setHotels((prev: any[]) => [{ ...item, id: item.id || `hotel-${Date.now()}` }, ...prev]);
  const updateHotel = (id: string, fields: any) => setHotels((prev: any[]) => prev.map((h: any) => h.id === id ? { ...h, ...fields } : h));
  const deleteHotel = (id: string) => setHotels((prev: any[]) => prev.filter((h: any) => h.id !== id));

  // --- TRANSPORTATION CRUD ---
  const addTransport = (item: any) => setTransportation((prev: any[]) => [{ ...item, id: item.id || `tr-${Date.now()}` }, ...prev]);
  const updateTransport = (id: string, fields: any) => setTransportation((prev: any[]) => prev.map((t: any) => t.id === id ? { ...t, ...fields } : t));
  const deleteTransport = (id: string) => setTransportation((prev: any[]) => prev.filter((t: any) => t.id !== id));

  // --- REVIEWS CRUD ---
  const addReview = (item: any) => setReviews((prev: any[]) => [{ ...item, id: item.id || `rev-${Date.now()}` }, ...prev]);
  const updateReview = (id: string, fields: any) => setReviews((prev: any[]) => prev.map((r: any) => r.id === id ? { ...r, ...fields } : r));
  const deleteReview = (id: string) => setReviews((prev: any[]) => prev.filter((r: any) => r.id !== id));

  // --- CONTENT & BLOGS & FAQS CRUD ---
  const updateSiteContent = (fields: any) => setSiteContent((prev: any) => ({ ...prev, ...fields }));
  const addBlog = (item: any) => setBlogs((prev: any[]) => [{ ...item, id: item.id || `blog-${Date.now()}` }, ...prev]);
  const updateBlog = (id: string, fields: any) => setBlogs((prev: any[]) => prev.map((b: any) => b.id === id ? { ...b, ...fields } : b));
  const deleteBlog = (id: string) => setBlogs((prev: any[]) => prev.filter((b: any) => b.id !== id));

  const addFaq = (item: any) => setFaqs((prev: any[]) => [{ ...item, id: item.id || `faq-${Date.now()}` }, ...prev]);
  const updateFaq = (id: string, fields: any) => setFaqs((prev: any[]) => prev.map((f: any) => f.id === id ? { ...f, ...fields } : f));
  const deleteFaq = (id: string) => setFaqs((prev: any[]) => prev.filter((f: any) => f.id !== id));

  // --- COMMUNICATIONS & NOTIFICATIONS CRUD ---
  const addCommunication = (item: any) => setCommunications((prev: any[]) => [{ ...item, id: item.id || `comm-${Date.now()}`, date: new Date().toLocaleString() }, ...prev]);
  const updateCommunication = (id: string, fields: any) => setCommunications((prev: any[]) => prev.map((c: any) => c.id === id ? { ...c, ...fields } : c));
  const deleteCommunication = (id: string) => setCommunications((prev: any[]) => prev.filter((c: any) => c.id !== id));

  const addNotification = (item: any) => setNotifications((prev: any[]) => [{ ...item, id: item.id || `notif-${Date.now()}`, date: new Date().toLocaleString(), status: 'Unread' }, ...prev]);
  const markNotificationAsRead = (id: string) => setNotifications((prev: any[]) => prev.map((n: any) => n.id === id ? { ...n, status: 'Read' } : n));
  const markAllNotificationsAsRead = () => setNotifications((prev: any[]) => prev.map((n: any) => ({ ...n, status: 'Read' })));
  const deleteNotification = (id: string) => setNotifications((prev: any[]) => prev.filter((n: any) => n.id !== id));

  const getPopularTrips = () => {
    return [...trips].sort((a: any, b: any) => {
      const scoreA = (a.reviewCount || 0) * 3 + (a.rating || 5) * 20 + (a.popular ? 50 : 0);
      const scoreB = (b.reviewCount || 0) * 3 + (b.rating || 5) * 20 + (b.popular ? 50 : 0);
      return scoreB - scoreA;
    });
  };

  return (
    <DataContext.Provider value={{
      dashboardLang, setDashboardLang, t,
      theme, setTheme, toggleTheme,
      adminProfile, updateProfile,
      companies, addCompany, updateCompany, deleteCompany,
      agents, addAgent, updateAgent, deleteAgent,
      commissions, addCommission, updateCommission, deleteCommission,
      wallets, addWallet, updateWallet, deleteWallet,
      photos, addPhoto, updatePhoto, deletePhoto,
      videos, addVideo, updateVideo, deleteVideo,
      bookings, addBooking, updateBooking, deleteBooking,
      trips, packages, hotels, transportation, reviews,
      addTrip, updateTrip, deleteTrip,
      updateTripTranslation, deleteTripTranslation,
      addPackage, updatePackage, deletePackage,
      addHotel, updateHotel, deleteHotel,
      addTransport, updateTransport, deleteTransport,
      addReview, updateReview, deleteReview,
      siteContent, updateSiteContent,
      blogs, addBlog, updateBlog, deleteBlog,
      faqs, addFaq, updateFaq, deleteFaq,
      communications, addCommunication, updateCommunication, deleteCommunication,
      notifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification,
      getPopularTrips
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
