import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import Schemes from './components/Schemes';
import Alerts from './components/Alerts';
import Profile from './components/Profile';

import './App.css';

// Translations object
const translations = {
  hi: {
    appTitle: "Kisan Sahayak",
    appSubtitle: "स्मार्ट खेती सहायक",
    home: "होम",
    chat: "चैट",
    schemesTitle: "🏛 सरकारी योजनाएँ",
    alertsTitle: "⚠️ अलर्ट्स",
    profileTitle: "👤 प्रोफ़ाइल",
    plantuml: "📊 PlantUML कोड",
    profileLocation: "📍 मिठापुर, बिहार • ऑटो-डिटेक्टेड",
    alertsLocation: "मिठापुर, बिहार • 4 सक्रिय अलर्ट",
    location: "मिठापुर, बिहार",
  },
  en: {
    appTitle: "Kisan Sahayak",
    appSubtitle: "Smart Farming Assistant",
    home: "Home",
    chat: "Chat",
    schemesTitle: "🏛 Government Schemes",
    alertsTitle: "⚠️ Alerts",
    profileTitle: "👤 Profile",
    plantuml: "📊 PlantUML Code",
    profileLocation: "📍 Mithapur, Bihar • Auto-detected",
    alertsLocation: "Mithapur, Bihar • 4 Active Alerts",
    location: "Mithapur, Bihar",
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('kisan-lang') || 'en');
  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('kisan-lang', language);
  }, [language]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kisan-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === 'hi' ? 'en' : 'hi');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': 
        return <Dashboard onNavigate={setActiveTab} language={language} />;
      case 'chat': 
        return <Chat language={language} />;
      case 'schemes': 
        return <Schemes language={language} />;
      case 'alerts': 
        return <Alerts language={language} />;
      case 'profile': 
        return <Profile language={language} onLanguageChange={toggleLanguage} />;
      default: 
        return <Dashboard onNavigate={setActiveTab} language={language} />;
    }
  };

  const getHeaderProps = () => {
    const common = { 
      showBack: false,
      themeToggle: true,
      onThemeToggle: toggleTheme,
    };
    switch (activeTab) {
      case 'home':
        return { ...common, title: t.appTitle, subtitle: t.appSubtitle, location: t.location, gradient: "from-primary-700 via-primary-600 to-emerald-600" };
      case 'chat':
        return { ...common, title: t.appTitle, subtitle: t.appSubtitle, location: t.location, gradient: "from-primary-700 via-primary-600 to-emerald-600" };
      case 'schemes':
        return { ...common, title: t.schemesTitle, subtitle: null, location: t.location, gradient: "from-primary-600 to-primary-700" };
      case 'alerts':
        return { ...common, title: t.alertsTitle, subtitle: null, location: t.alertsLocation, gradient: "from-red-600 to-orange-600" };
      case 'profile':
        return { ...common, title: t.profileTitle, subtitle: null, location: t.profileLocation, gradient: "from-primary-700 via-primary-600 to-emerald-600" };
      default:
        return { ...common, title: t.appTitle, subtitle: t.appSubtitle, location: t.location, gradient: "from-primary-700 via-primary-600 to-emerald-600" };
    }
  };

  const getTabLabel = (tabId) => {
    const labels = {
      hi: { home: 'होम', chat: 'चैट', schemes: 'योजनाएँ', alerts: 'अलर्ट्स', profile: 'प्रोफ़ाइल' },
      en: { home: 'Home', chat: 'Chat', schemes: 'Schemes', alerts: 'Alerts', profile: 'Profile' }
    };
    return labels[language][tabId] || labels[language].home;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 theme-transition">
      <Header {...getHeaderProps()} onBack={() => setActiveTab('home')} themeToggle={true} />
      <main className="flex-1 main-content overflow-y-auto">{renderContent()}</main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} getTabLabel={getTabLabel} language={language} />
    </div>
  );
}

export default App;
