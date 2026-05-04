import { useState, useEffect } from 'react';

const BottomNav = ({ activeTab = 'home', onTabChange, getTabLabel, language = 'en' }) => {
  const defaultTabs = [
    { id: 'home', icon: '🏠' },
    { id: 'chat', icon: '💬' },
    { id: 'schemes', icon: '🏛️' },
    { id: 'alerts', icon: '⚠️' },
    { id: 'profile', icon: '👤' }
  ];

  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);
  };

  const getLabel = (tabId) => {
    if (getTabLabel) return getTabLabel(tabId);
    return { hi: { home: 'होम', chat: 'चैट', schemes: 'योजनाएँ', alerts: 'अलर्ट्स', profile: 'प्रोफ़ाइल' }, en: { home: 'Home', chat: 'Chat', schemes: 'Schemes', alerts: 'Alerts', profile: 'Profile' } }[language]?.[tabId] || tabId;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-bottom px-2 py-2 shadow-lg">
      <div className="flex justify-around max-w-lg mx-auto">
        {defaultTabs.map((tab) => (
          <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex flex-col items-center p-2 transition-colors relative ${currentTab === tab.id ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'}`}>
            <span className="text-xl relative">
              {tab.icon}
              {tab.id === 'alerts' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">2</span>}
            </span>
            <span className="text-[10px] mt-0.5">{getLabel(tab.id)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
