import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';

const Profile = ({ language = 'en', onLanguageChange }) => {
  const t = {
    hi: {
      name: 'राम प्रसाद यादव',
      phone: '+91 98765 43210',
      location: 'मिठापुर, बिहार',
      editProfile: 'प्रोफ़ाइल संपादित करें ✏️',
      accountInfo: '📋 खाता जानकारी',
      aadhaar: 'आधार नंबर',
      bank: 'बैंक खाता',
      email: 'ईमेल',
      myCrops: '🌾 मेरी फसलें',
      addCrop: '+ जोड़ें',
      settings: '⚙️ सेटिंग्स',
      languageLabel: 'भाषा',
      notifications: 'सूचनाएं',
      alerts: 'चालू',
      locationSvc: 'स्थान',
      on: 'चालू',
      off: 'बंद',
      schemeStatus: '🏛️ योजना स्थिति',
      pmKisan: 'PM-KISAN',
      active: 'सक्रिय',
      pending: 'लंबित',
      cropInsurance: 'प्रधानमंत्री फसल बीमा',
      logout: 'खाता से बाहर निकलें',
      selectLang: '🌐 भाषा चुनें',
    },
    en: {
      name: 'Ram Prasad Yadav',
      phone: '+91 98765 43210',
      location: 'Mithapur, Bihar',
      editProfile: 'Edit Profile ✏️',
      accountInfo: '📋 Account Info',
      aadhaar: 'Aadhaar Number',
      bank: 'Bank Account',
      email: 'Email',
      myCrops: '🌾 My Crops',
      addCrop: '+ Add',
      settings: '⚙️ Settings',
      languageLabel: 'Language',
      notifications: 'Notifications',
      alerts: 'On',
      locationSvc: 'Location',
      on: 'On',
      off: 'Off',
      schemeStatus: '🏛️ Scheme Status',
      pmKisan: 'PM-KISAN',
      active: 'Active',
      pending: 'Pending',
      cropInsurance: 'PM Crop Insurance',
      logout: 'Logout',
      selectLang: '🌐 Select Language',
    }
  }[language];

  const [user, setUser] = useState({
    name: t.name,
    phone: t.phone,
    email: 'ramprasad@example.com',
    location: t.location,
    aadhaar: 'XXXX XXXX XXXX 1234',
    bankAccount: 'XXXX XXXX XXXX 5678',
    lang: language === 'hi' ? 'हिंदी' : 'English',
  });
  const [crops, setCrops] = useState([
    { name: 'गेहूं', icon: '🌾', area: '2.5 एकड़', season: 'रबी 2024' },
    { name: 'धान', icon: '🌱', area: '1.5 एकड़', season: 'खरीफ 2024' },
  ]);
  const [currentLang, setCurrentLang] = useState(language);

  useEffect(() => {
    setCurrentLang(language);
    setUser(prev => ({ ...prev, lang: language === 'hi' ? 'हिंदी' : 'English' }));
  }, [language]);

  const handleLanguageBtn = () => {
    const newLang = currentLang === 'hi' ? 'en' : 'hi';
    setCurrentLang(newLang);
    setUser(prev => ({ ...prev, lang: newLang === 'hi' ? 'हिंदी' : 'English' }));
    onLanguageChange?.(newLang);
  };

  return (
    <div className="px-3 space-y-4">
      {/* Profile Header */}
      <section className="fade-up bg-gradient-to-br from-primary-500 to-emerald-600 text-white p-6 rounded-2xl shadow-card text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto">
            <span className="text-4xl">👨‍🌾</span>
          </div>
          <span className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs border-2 border-white">✓</span>
        </div>
        <h2 className="font-bold text-xl mt-3">{user.name}</h2>
        <p className="text-white/80 text-sm">{user.phone}</p>
        <p className="text-white/70 text-xs mt-1 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          {user.location}
        </p>
        <button className="mt-3 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors">{t.editProfile}</button>
      </section>

      {/* Account Info */}
      <section className="fade-up bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-card border border-gray-100">
        <h3 className="font-bold text-sm mb-3">{t.accountInfo}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">{t.aadhaar}</span>
            <span className="font-medium text-sm">{user.aadhaar}</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">{t.bank}</span>
            <span className="font-medium text-sm">{user.bankAccount}</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">{t.email}</span>
            <span className="font-medium text-sm">{user.email}</span>
          </div>
        </div>
      </section>

      {/* My Crops */}
      <section className="fade-up bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-card border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm">{t.myCrops}</h3>
          <button className="text-primary-600 text-xs font-medium">{t.addCrop}</button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {crops.map((crop, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">{crop.icon}</span>
                <div>
                  <p className="font-medium text-sm">{crop.name}</p>
                  <p className="text-xs text-gray-500">{crop.area} | {crop.season}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Settings - Language Toggle */}
      <section className="fade-up bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-card border border-gray-100">
        <h3 className="font-bold text-sm mb-3">{t.settings}</h3>
        <div className="space-y-2">
          <button onClick={handleLanguageBtn} className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌐</span>
              <span className="text-sm font-medium">{t.languageLabel}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{user.lang}</span>
          </button>
        </div>
      </section>

      {/* Scheme Status */}
      <section className="fade-up bg-soil-50 p-4 rounded-2xl border border-soil-300">
        <h3 className="font-bold text-sm mb-3">{t.schemeStatus}</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-green-100 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="text-sm font-medium">{t.pmKisan}</span>
            </div>
            <span className="text-xs text-green-700 font-medium">{t.active}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-orange-100 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-lg">⏳</span>
              <span className="text-sm font-medium">{t.cropInsurance}</span>
            </div>
            <span className="text-xs text-orange-700 font-medium">{t.pending}</span>
          </div>
        </div>
      </section>

      {/* Logout */}
      <section className="fade-up pb-20">
        <button className="w-full bg-red-50 text-red-600 p-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v-1a1 1 0 00-1-1h-1a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H7a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H7" /></svg>
          {t.logout}
        </button>
      </section>
    </div>
  );
};

export default Profile;
