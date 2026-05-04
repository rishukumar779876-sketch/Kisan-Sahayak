import { useState, useEffect } from 'react';
import { schemesAPI } from '../services/api';

// Category mapping for English to Hindi (for API queries)
// The backend stores categories in Hindi, so we need to map English to Hindi for queries
const categoryMapEnToHi = {
  'Assistance': 'सहायता',
  'Insurance': 'बीमा',
  'Equipment': 'उपकरण'
};

const categoryMapHiToEn = {
  'सहायता': 'Assistance',
  'बीमा': 'Insurance',
  'उपकरण': 'Equipment'
};

// Get category in current language
const getCategoryLabel = (category, language) => {
  if (language === 'en') {
    return categoryMapHiToEn[category] || category;
  }
  return category;
};

// Convert filter to backend-compatible Hindi category
const getBackendCategory = (filter, language) => {
  if (language === 'en') {
    // Map English filter to Hindi for backend
    return categoryMapEnToHi[filter] || null;
  }
  // In Hindi mode, use filter directly (already Hindi)
  return filter;
};

// Default schemes data - always available (with both Hindi and English versions)
const defaultSchemesHi = [
  // सहायता (Financial Assistance)
  { id: 1, title: 'PM-KISAN', icon: '💰', category: 'सहायता', benefit: '₹6,000/वर्ष', description: 'प्रति वर्ष सीधे खाते में। छोटे और सीमांत किसानों के लिए प्रत्यक्ष लाभ हस्तांतरण।', eligibility: '2 एकड़ तक की जमीन, आधार कार्ड, बैंक खाता', documents: 'आधार कार्ड, बैंक पासबुक, जमीन के कागज़', deadline: '15 मई 2025' },
  { id: 2, title: 'किसान क्रेडिट कार्ड', icon: '💳', category: 'सहायता', benefit: '4% ब्याज पर ऋण', description: 'खेती के लिए आसान ऋण। ब्याज दर में छूट।', eligibility: 'सभी पंजीकृत किसान', documents: 'आधार, बैंक खाता', deadline: '31 दिसंबर 2024' },
  { id: 3, title: 'MSP सुरक्षा', icon: '🏭', category: 'सहायता', benefit: 'न्यूनतम समर्थन मूल्य', description: 'गेहूं, धान, मक्का के लिए न्यूनतम समर्थन मूल्य की गारंटी।', eligibility: 'सभी पंजीकृत किसान', documents: 'पंजीकरण प्रमाण पत्र', deadline: 'फसल बिक्री के अनुसार' },
  { id: 4, title: 'जैविक खेती योजना', icon: '🌱', category: 'सहायता', benefit: 'प्रशिक्षण + सर्टिफिकेशन', description: 'जैविक खेती के लिए प्रशिक्षण और प्रमाणन। अधिक दाम पर बिक्री।', eligibility: 'नई और मौजूदा किसान', documents: 'पहचान पत्र, खेत के कागज़', deadline: '31 मार्च 2025' },
  { id: 5, title: 'किसान पेंशन योजना', icon: '👴', category: 'सहायता', benefit: '₹3,000/माह', description: '60 वर्ष से ऊपर के किसानों को मासिक पेंशन।', eligibility: '60+ वर्ष के किसान', documents: 'आधार, आय प्रमाण', deadline: 'कोई अंतिम तिथि नहीं' },
  { id: 6, title: 'कृषि ऋण माफी', icon: '🆓', category: 'सहायता', benefit: 'ऋण मुक्ति', description: 'दिवालिया किसानों का ऋण माफ। नई शुरुआत।', eligibility: 'वित्तीय रूप से कमजोर किसान', documents: 'आधार, बैंक स्टेटमेंट', deadline: '31 मार्च 2025' },
  { id: 7, title: 'प्रधानमंत्री फसल बीमा', icon: '🌾', category: 'सहायता', benefit: '₹5 लाख कवर', description: 'प्राकृतिक आपदाओं से फसल सुरक्षा। प्रीमियम केवल 2%।', eligibility: 'सभी किसान', documents: 'आधार, बैंक खाता', deadline: '30 जून 2025' },
  // बीमा (Insurance)
  { id: 11, title: 'फसल बीमा योजना', icon: '🌾', category: 'बीमा', benefit: 'प्रीमियम में 90% सब्सिडी', description: 'प्राकृतिक आपदाओं से फसल को सुरक्षा। किसानों के लिए सस्ता बीमा।', eligibility: 'सभी किसान जिनकी जमीन 5 एकड़ से कम हो', documents: 'आधार, बैंक खाता, खेत के कागज़', deadline: '30 जून 2024' },
  { id: 12, title: 'पशु बीमा योजना', icon: '🐄', category: 'बीमा', benefit: '₹50,000/पशु', description: 'पशुओं की मृत्यु पर मुआवजा। पशुपालकों के लिए।', eligibility: 'डेयरी किसान', documents: 'आधार, पशु पंजीकरण', deadline: '31 दिसंबर 2024' },
  { id: 13, title: 'मृत्यु बीमा', icon: '😇', category: 'बीमा', benefit: '₹2 लाख', description: 'किसान की मृत्यु पर परिवार को राशि।', eligibility: '18-50 वर्ष के किसान', documents: 'आधार, स्वास्थ्य प्रमाण', deadline: '30 सितंबर 2024' },
  { id: 14, title: 'फसल ऋण बीमा', icon: '🏦', category: 'बीमा', benefit: 'ऋण मुक्ति', description: 'फसल नष्ट होने पर ऋण माफ।', eligibility: 'फसल ऋण धारक किसान', documents: 'आधार, ऋण दस्तावेज़', deadline: '30 नवंबर 2024' },
  { id: 15, title: 'दुर्घटना बीमा', icon: '🚑', category: 'बीमा', benefit: '₹1 लाख', description: 'दुर्घटना में मृत्यु पर मुआवजा।', eligibility: 'सभी किसान', documents: 'आधार', deadline: '31 मार्च 2024' },
  // उपकरण (Equipment)
  { id: 21, title: 'कृषि उपकरण सब्सिडी', icon: '🚜', category: 'उपकरण', benefit: '50% तक छूट', description: 'ट्रैक्टर, हैरो, थ्रेशर खरीदने पर सब्सिडी। आधुनिक खेती के लिए सहायता।', eligibility: 'छोटे किसान जिनके पास 2-10 एकड़ जमीन', documents: 'आधार, बैंक खाता, आय प्रमाण', deadline: '31 दिसंबर 2024' },
  { id: 22, title: 'सिंचाई सब्सिडी', icon: '💧', category: 'उपकरण', benefit: 'ड्रिप इरीगेशन पर 50% छूट', description: 'ड्रिप और स्प्रिंकलर सिंचाई प्रणाली पर सब्सिडी। पानी की बचत के लिए।', eligibility: 'सभी किसान जो सिंचाई सुविधा चाहते हैं', documents: 'आधार, बैंक खाता, खे��� का नक्शा', deadline: 'कोई अंतिम तिथि नहीं' },
  { id: 23, title: 'सोलर पंप योजना', icon: '☀️', category: 'उपकरण', benefit: '75% सब्सिडी', description: 'सोलर वाटर पंप खरीदने पर। नि:शुल्क बिजली।', eligibility: '5 एकड़ से कम जमीन वाले किसान', documents: 'आधार, बैंक, खेत नक्शा', deadline: '30 नवंबर 2024' },
  { id: 24, title: 'ट्रैक्टर वितरण', icon: '🚜', category: 'उपकरण', benefit: '₹2 लाख तक अनुदान', description: 'छोटे ट्रैक्टर खरीदने पर अनुदान।', eligibility: 'छोटे किसान', documents: 'आधार, जाति प्रमाण', deadline: '31 दिसंबर 2024' },
  { id: 25, title: 'ग्राइंड मिल सब्सिडी', icon: '⚙️', category: 'उपकरण', benefit: '40% सब्सिडी', description: 'अनाज प्रोसेसिंग के लिए ग्राइंड मिल।', eligibility: '5 एकड़+ जमीन वाले', documents: 'आधार, आय प्रमाण', deadline: '30 जून 2024' },
  { id: 26, title: 'कोल्ड स्टोर सब्सिडी', icon: '❄️', category: 'उपकरण', benefit: '₹5 लाख तक', description: 'सब्जी और फल स्टोर करने के लिए कोल्ड स्टोर।', eligibility: '3 एकड़+ किसान समूह', documents: 'पंजीकरण, जमीन के कागज़', deadline: '31 मार्च 2024' },
  { id: 27, title: 'ड्रोन सब्सिडी', icon: '🚁', category: 'उपकरण', benefit: '₹1 लाख अनुदान', description: 'ड्रोन से छिड़काव। आधुनिक तकनीक।', eligibility: '10 एकड़+ किसान', documents: 'आधार, कृषि प्रमाण', deadline: '30 सितंबर 2024' },
  { id: 28, title: 'पावर टिलर सब्सिडी', icon: '🦾', category: 'उपकरण', benefit: '₹50,000 तक', description: 'पावर टिलर खरीदने पर अनुदान। छोटी जमीन के लिए।', eligibility: '2 एकड़ से कम जमीन', documents: 'आधार, बैंक खाता', deadline: '30 जून 2024' },
  { id: 29, title: 'हार्वेस्टर कम्बाइन', icon: '🌾', category: 'उपकरण', benefit: '₹3 लाख अनुदान', description: 'कम्बाइन हार्वेस्टर खरीदने पर। बड़ी फसल के लिए।', eligibility: '10 एकड़+ किसान', documents: 'आधार, कृषि प्रमाण', deadline: '31 दिसंबर 2024' },
];

// English default schemes
const defaultSchemesEn = [
  { id: 1, title: 'PM-KISAN', icon: '💰', category: 'Assistance', benefit: '₹6,000/year', description: 'Direct annual payment to farmers. For small and marginal farmers.', eligibility: 'Up to 2 acres land, Aadhaar, Bank account', documents: 'Aadhaar, Bank passbook, Land papers', deadline: '15 May 2025' },
  { id: 2, title: 'Kisan Credit Card', icon: '💳', category: 'Assistance', benefit: '4% Interest Loan', description: 'Easy loan for farming. Interest subsidy available.', eligibility: 'All registered farmers', documents: 'Aadhaar, Bank account', deadline: '31 Dec 2024' },
  { id: 3, title: 'MSP Protection', icon: '🏭', category: 'Assistance', benefit: 'Minimum Support Price', description: 'Guaranteed MSP for wheat, paddy, maize.', eligibility: 'All registered farmers', documents: 'Registration certificate', deadline: 'As per crop sale' },
  { id: 4, title: 'Organic Farming Scheme', icon: '🌱', category: 'Assistance', benefit: 'Training + Certification', description: 'Training and certification for organic farming. Higher prices.', eligibility: 'New and existing farmers', documents: 'ID, Farm papers', deadline: '31 March 2025' },
  { id: 5, title: 'Farmer Pension Scheme', icon: '👴', category: 'Assistance', benefit: '₹3,000/month', description: 'Monthly pension for farmers above 60 years.', eligibility: 'Farmers 60+ years', documents: 'Aadhaar, Income certificate', deadline: 'No deadline' },
  { id: 6, title: 'Agri Loan Waiver', icon: '🆓', category: 'Assistance', benefit: 'Loan Waiver', description: 'Waiver for bankrupt farmers. Fresh start.', eligibility: 'Financially weak farmers', documents: 'Aadhaar, Bank statement', deadline: '31 March 2025' },
  { id: 7, title: 'PM Crop Insurance', icon: '🌾', category: 'Assistance', benefit: '₹5 Lakh Cover', description: 'Crop protection from natural disasters. Premium only 2%.', eligibility: 'All farmers', documents: 'Aadhaar, Bank account', deadline: '30 June 2025' },
  { id: 11, title: 'Crop Insurance Scheme', icon: '🌾', category: 'Insurance', benefit: '90% Premium Subsidy', description: 'Crop protection from natural disasters. Affordable insurance.', eligibility: 'All farmers with less than 5 acres', documents: 'Aadhaar, Bank account, Farm papers', deadline: '30 June 2024' },
  { id: 12, title: 'Animal Insurance', icon: '🐄', category: 'Insurance', benefit: '₹50,000/Animal', description: 'Compensation on animal death. For dairy farmers.', eligibility: 'Dairy farmers', documents: 'Aadhaar, Animal registration', deadline: '31 Dec 2024' },
  { id: 13, title: 'Life Insurance', icon: '😇', category: 'Insurance', benefit: '₹2 Lakh', description: 'Family payment on farmer death.', eligibility: 'Farmers 18-50 years', documents: 'Aadhaar, Health certificate', deadline: '30 Sep 2024' },
  { id: 14, title: 'Crop Loan Insurance', icon: '🏦', category: 'Insurance', benefit: 'Loan Waive', description: 'Loan waiver if crop is destroyed.', eligibility: 'Crop loan holders', documents: 'Aadhaar, Loan documents', deadline: '30 Nov 2024' },
  { id: 15, title: 'Accident Insurance', icon: '🚑', category: 'Insurance', benefit: '₹1 Lakh', description: 'Compensation on accident death.', eligibility: 'All farmers', documents: 'Aadhaar', deadline: '31 March 2024' },
  { id: 21, title: 'Agri Equipment Subsidy', icon: '🚜', category: 'Equipment', benefit: 'Up to 50% Discount', description: 'Subsidy on tractor, harrow, thresher. Modern farming.', eligibility: 'Small farmers with 2-10 acres', documents: 'Aadhaar, Bank account, Income proof', deadline: '31 Dec 2024' },
  { id: 22, title: 'Irrigation Subsidy', icon: '💧', category: 'Equipment', benefit: '50% on Drip Irrigation', description: 'Subsidy on drip and sprinkler irrigation. Water saving.', eligibility: 'All farmers needing irrigation', documents: 'Aadhaar, Bank account, Farm map', deadline: 'No deadline' },
  { id: 23, title: 'Solar Pump Scheme', icon: '☀️', category: 'Equipment', benefit: '75% Subsidy', description: 'On solar water pump. Free electricity.', eligibility: 'Farmers with less than 5 acres', documents: 'Aadhaar, Bank, Farm map', deadline: '30 Nov 2024' },
  { id: 24, title: 'Tractor Distribution', icon: '🚜', category: 'Equipment', benefit: 'Up to ₹2 Lakh Grant', description: 'Grant for small tractors.', eligibility: 'Small farmers', documents: 'Aadhaar, Caste certificate', deadline: '31 Dec 2024' },
  { id: 25, title: 'Grind Mill Subsidy', icon: '⚙️', category: 'Equipment', benefit: '40% Subsidy', description: 'Grind mill for grain processing.', eligibility: '5+ acres farmers', documents: 'Aadhaar, Income proof', deadline: '30 June 2024' },
  { id: 26, title: 'Cold Store Subsidy', icon: '❄️', category: 'Equipment', benefit: 'Up to ₹5 Lakh', description: 'Cold store for vegetables and fruits.', eligibility: '3+ acres farmer groups', documents: 'Registration, Land papers', deadline: '31 March 2024' },
  { id: 27, title: 'Drone Subsidy', icon: '🚁', category: 'Equipment', benefit: '₹1 Lakh Grant', description: 'Drone spraying. Modern technology.', eligibility: '10+ acres farmers', documents: 'Aadhaar, Agri certificate', deadline: '30 Sep 2024' },
  { id: 28, title: 'Power Tiller Subsidy', icon: '🦾', category: 'Equipment', benefit: 'Up to ₹50,000', description: 'Grant for power tiller. For small land.', eligibility: 'Less than 2 acres', documents: 'Aadhaar, Bank account', deadline: '30 June 2024' },
  { id: 29, title: 'Harvester Combine', icon: '🌾', category: 'Equipment', benefit: '₹3 Lakh Grant', description: 'Harvester combine for large crops.', eligibility: '10+ acres farmers', documents: 'Aadhaar, Agri certificate', deadline: '31 Dec 2024' },
];

// Get schemes based on language
const getSchemesByLanguage = (lang) => {
  if (lang === 'en') return defaultSchemesEn;
  return defaultSchemesHi;
};

const Schemes = ({ language = 'en' }) => {
  const t = {
    hi: {
      searchPlaceholder: '🔍 योजना खोजें... (जैसे: PM-KISAN, बीमा)',
      filterAll: 'सभी', filterAssistance: 'सहायता', filterInsurance: 'बीमा', filterEquipment: 'उपकरण',
      noSchemeFound: 'कोई योजना नहीं मिली। कृपया खोज बदलें।',
      eligibility: 'पात्रता', details: 'विस्तार', benefit: 'लाभ', description: 'विवरण',
      documents: 'जरूरी दस्तावेज़', deadline: 'अंतिम तिथि', applyNow: 'अभी आवेदन करें 📝',
      categoryLabels: { 'सहायता': '💰 सहायता', 'बीमा': '🌾 बीमा', 'उपकरण': '🚜 उपकरण' }
    },
    en: {
      searchPlaceholder: '🔍 Search schemes... (e.g., PM-KISAN, Insurance)',
      filterAll: 'All', filterAssistance: 'Assistance', filterInsurance: 'Insurance', filterEquipment: 'Equipment',
      noSchemeFound: 'No schemes found. Try different search.',
      eligibility: 'Eligibility', details: 'Details', benefit: 'Benefit', description: 'Description',
      documents: 'Required Documents', deadline: 'Deadline', applyNow: 'Apply Now 📝',
      categoryLabels: { 'सहायता': '💰 Assistance', 'बीमा': '🌾 Insurance', 'उपकरण': '🚜 Equipment' }
    }
  }[language];

const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(language === 'hi' ? 'सभी' : 'All');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemes, setSchemes] = useState(getSchemesByLanguage(language));
  const [loading, setLoading] = useState(false);

  const filters = language === 'hi' 
    ? ['सभी', 'सहायता', 'बीमा', 'उपकरण']
    : ['All', 'Assistance', 'Insurance', 'Equipment'];

  // Reset filter when language changes
  useEffect(() => {
    setActiveFilter(language === 'hi' ? 'सभी' : 'All');
    setSearchQuery('');
    setSchemes(getSchemesByLanguage(language));
  }, [language]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        
        // Convert filter to backend category (Hindi) if needed
        let backendCategory = null;
        if (activeFilter !== 'सभी' && activeFilter !== 'All') {
          backendCategory = getBackendCategory(activeFilter, language);
        }
        
        const response = await schemesAPI.getAll(backendCategory, searchQuery || null);
        
        if (response.success && response.data && response.data.length > 0) {
          setSchemes(response.data);
        } else {
          setSchemes(getSchemesByLanguage(language));
        }
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
        setSchemes(getSchemesByLanguage(language));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchemes();
  }, [activeFilter, searchQuery, language]);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Check both Hindi and English categories
    const allFilter = language === 'hi' ? 'सभी' : 'All';
    const matchesFilter = activeFilter === allFilter || 
      scheme.category === activeFilter ||
      (language === 'hi' && scheme.category === activeFilter) ||
      (language === 'en' && getCategoryLabel(scheme.category, language) === activeFilter);
    return matchesSearch && matchesFilter;
  });

  const getSchemeById = (id) => schemes.find(s => s.id === id);

return (
    <div className="px-3 space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-400 outline-none shadow-sm text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 chip-scroll pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`filter-chip px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all ${
              activeFilter === filter
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {filter === (language === 'hi' ? 'सभी' : 'All') ? filter : 
              filter === (language === 'hi' ? 'सहायता' : 'Assistance') ? t.categoryLabels['सहायता'] : 
              filter === (language === 'hi' ? 'बीमा' : 'Insurance') ? t.categoryLabels['बीमा'] : 
              filter === (language === 'hi' ? 'उपकरण' : 'Equipment') ? t.categoryLabels['उपकरण'] : filter}
          </button>
        ))}
      </div>

      {/* Scheme List */}
      <div className="space-y-3">
        {filteredSchemes.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">{t.noSchemeFound}</p>
        ) : (
          filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme.id)}
              className="scheme-card cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{scheme.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{scheme.title}</h3>
                  <span className="inline-block text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded mt-1">
                    {t.categoryLabels[scheme.category]}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{scheme.description}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 py-2 rounded-lg text-xs font-medium">
                  ✅ {t.eligibility}
                </button>
                <button className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 py-2 rounded-lg text-xs font-medium">
                  📖 {t.details}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Overlay */}
      {selectedScheme && (
        <div className="overlay-view active">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
            <button 
              onClick={() => setSelectedScheme(null)}
              className="p-2 text-lg"
            >
              ⬅️
            </button>
            <h2 className="font-bold text-base">{getSchemeById(selectedScheme)?.title}</h2>
            <div className="w-5"></div>
          </div>
          <div className="p-4 space-y-4">
            {(() => {
              const scheme = getSchemeById(selectedScheme);
              return (
                <>
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800">
                    <p className="text-xs text-gray-500 uppercase">💰 {t.benefit}</p>
                    <p className="text-lg font-bold text-primary-700 dark:text-primary-300">{scheme?.benefit}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm mb-2">📝 {t.description}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{scheme?.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm mb-2">✅ {t.eligibility}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{scheme?.eligibility}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm mb-2">📄 {t.documents}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{scheme?.documents}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm mb-2">⏰ {t.deadline}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{scheme?.deadline}</p>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all">
                    {t.applyNow}
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes;
