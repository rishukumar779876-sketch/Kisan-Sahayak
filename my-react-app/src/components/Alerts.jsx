 import { useState, useEffect } from 'react';
import { alertsAPI } from '../services/api';

// Helper function to get fallback alerts based on language
const getFallbackAlerts = (lang) => {
  if (lang === 'en') {
    return [
      {
        id: 1,
        type: 'weather',
        icon: '🌧️',
        category: 'Weather',
        title: 'Rain next 2 days',
        description: 'Today 9 AM',
        suggestion: 'Avoid fertilizer. Fungal risk may increase.',
        color: 'blue',
      },
      {
        id: 2,
        type: 'pest',
        icon: '🐛',
        category: 'Pest Risk',
        title: 'Aphid attack in wheat',
        description: 'Yesterday 2 PM',
        suggestion: 'Apply neem oil 5ml/L water.',
        color: 'amber',
      },
    ];
  }
  // Hindi fallback
  return [
    {
      id: 1,
      type: 'weather',
      icon: '🌧️',
      category: 'मौसम',
      title: 'अगले 2 दिन बारिश',
      description: 'आज सुबह 9 बजे',
      suggestion: 'आज-कल खाद डालने से बचें। फफूंद रोग का खतरा बढ़ सकता है।',
      color: 'blue',
    },
    {
      id: 2,
      type: 'pest',
      icon: '🐛',
      category: 'कीट जोखिम',
      title: 'गेहूं में ए��िड कीट का हमला',
      description: 'कल दोपहर 2 बजे',
      suggestion: 'नीम आधारित दवा 5 ml/L पानी में मिलाकर छिड़काव करें।',
      color: 'amber',
    },
  ];
};

// Helper function to get priority alert text based on language
const getPriorityAlert = (lang) => {
  if (lang === 'en') {
    return {
      highRiskLabel: '🔴 HIGH RISK',
      title: 'Heavy Rain Tomorrow',
      desc: '60-80mm rainfall expected in next 24 hours. Crops may get damaged.',
      actionLabel: '✅ Do Immediately:',
      actions: ['Stop irrigation today', 'Cover applied fertilizers', 'Clear drains, prepare drainage'],
      listenBtn: '🔊 Listen',
      saveBtn: '📥 Save',
      speakText: 'Heavy rain expected tomorrow. Stop irrigation today. Cover applied fertilizers. Clear drains.',
    };
  }
  return {
    highRiskLabel: '🔴 उच्च जोखिम',
    title: 'कल भारी बारिश की संभावना',
    desc: 'अगले 24 घंटों में मिठापुर में 60-80 mm बारिश की आशंका। फसल खराब हो सकती है।',
    actionLabel: '✅ तुरंत करें:',
    actions: ['आज ही सिंचाई रोक दें', 'डाली गई उर्वरक को मिट्टी से ढकें', 'नालियाँ साफ करें, निकासी व्यवस्था तैयार रखें'],
    listenBtn: '🔊 सुनें',
    saveBtn: '📥 सेव करें',
    speakText: 'कल भारी बारिश की संभावना है। आज ही सिंचाई रोक दें। डाली गई उर्वरक को मिट्टी से ढकें। नालियाँ साफ करें।',
  };
};

const Alerts = ({ language = 'en' }) => {
  const t = {
    hi: {
      highRisk: '🔴 उच्च जोखिम',
      heavyRainAlert: 'कल भारी बारिश की संभावना',
      heavyRainDesc: 'अगले 24 घंटों में मिठापुर में 60-80 mm बारिश की आशंका। फसल खराब हो सकती है।',
      immediateAction: '✅ तुरंत करें:',
      actions: ['आज ही सिंचाई रोक दें', 'डाली गई उर्वरक को मिट्टी से ढकें', 'नालियाँ साफ करें, निकासी व्यवस्था तैयार रखें'],
      listenBtn: '🔊 सुनें', saveBtn: '📥 सेव करें',
      otherAlerts: '📋 अन्य सूचनाएँ', refresh: '🔄 रिफ्रेश',
      notificationSettings: '⚙️ सूचना सेटिंग्स',
      weatherAlert: 'मौसम अलर्ट', weatherAlertDesc: 'बारिश, आंधी, ओलावृष्टि',
      pestAlert: 'कीट रोग अलर्ट', pestAlertDesc: 'फसल विशेष जोखिम',
      schemeAlert: 'योजना अलर्ट', schemeAlertDesc: 'नई योजनाएँ, अंतिम तिथि',
      pastAlerts: '🕒 पिछले अलर्ट',
      history: [
        { date: 'कल', title: 'हल्की बारिश की संभावना थी', status: 'resolved' },
        { date: '3 दिन पहले', title: 'फफूंद रोग चेतावनी', status: 'noted' },
        { date: '1 हफ्ता पहले', title: 'गर्मी की लहर', status: 'ignored' },
      ],
      statusLabels: { resolved: '✓ टाला गया', noted: '⚠ ध्यान दिया', ignored: '✖ अनदेखा' },
      lastUpdated: '📡 अंतिम अपडेट: आज सुबह 8:30 बजे | स्रोत: IMD & कृषि विभाग, बिहार',
      suggestion: '✅ सुझाव:',
    },
    en: {
      highRisk: '🔴 HIGH RISK',
      heavyRainAlert: 'Heavy Rain Tomorrow',
      heavyRainDesc: '60-80mm rainfall expected in next 24 hours. Crops may get damaged.',
      immediateAction: '✅ Do Immediately:',
      actions: ['Stop irrigation today', 'Cover applied fertilizers', 'Clear drains, prepare drainage'],
      listenBtn: '🔊 Listen', saveBtn: '📥 Save',
      otherAlerts: '📋 Other Alerts', refresh: '🔄 Refresh',
      notificationSettings: '⚙️ Notification Settings',
      weatherAlert: 'Weather Alerts', weatherAlertDesc: 'Rain, Storm, Hail',
      pestAlert: 'Pest Alert', pestAlertDesc: 'Crop-specific risks',
      schemeAlert: 'Scheme Alerts', schemeAlertDesc: 'New schemes, deadlines',
      pastAlerts: '🕒 Past Alerts',
      history: [
        { date: 'Yesterday', title: 'Light rain expected', status: 'resolved' },
        { date: '3 days ago', title: 'Fungal disease warning', status: 'noted' },
        { date: '1 week ago', title: 'Heat wave', status: 'ignored' },
      ],
      statusLabels: { resolved: '✓ Resolved', noted: '⚠ Noted', ignored: '✖ Ignored' },
      lastUpdated: '📡 Last Updated: Today 8:30 AM | Source: IMD & Agri Dept, Bihar',
      suggestion: '✅ Suggestion:',
    }
  }[language];

const [settings, setSettings] = useState({
    weather: true,
    pest: true,
    scheme: false,
  });
  const [showHistory, setShowHistory] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get priority alert data based on language
  const priorityAlert = getPriorityAlert(language);
  // Get history based on language
  const history = language === 'en' 
    ? [
        { date: 'Yesterday', title: 'Light rain expected', status: 'resolved' },
        { date: '3 days ago', title: 'Fungal disease warning', status: 'noted' },
        { date: '1 week ago', title: 'Heat wave', status: 'ignored' },
      ]
    : [
        { date: 'कल', title: 'हल्की बारिश की संभावना थी', status: 'resolved' },
        { date: '3 दिन पहले', title: 'फफूंद रोग चेतावनी', status: 'noted' },
        { date: '1 हफ्ता पहले', title: 'गर्मी की लहर', status: 'ignored' },
      ];

  // Function to translate alert data from backend (Hindi) to current language
  const translateAlert = (alert) => {
    if (language === 'en') {
      // Translate Hindi backend data to English
      const translations = {
        'मौसम': 'Weather',
        'कीट जोखिम': 'Pest Risk',
        'योजना': 'Scheme',
        'अगले 2 दिन बारिश': 'Rain next 2 days',
        'गेहूं में एफिड कीट का हमला': 'Aphid attack in wheat',
        'आज सुबह 9 बजे': 'Today 9 AM',
        'कल दोपहर 2 बजे': 'Yesterday 2 PM',
        'आज-कल खाद डालने से बचें। फफूंद रोग का खतरा बढ़ सकता है।': 'Avoid fertilizer. Fungal risk may increase.',
        'नीम आधारित दवा 5 ml/L पानी में मिलाकर छिड़काव करें।': 'Apply neem oil 5ml/L water.',
        'गेहूं में एफिड कीट का हमला': 'Aphid attack in wheat'
      };
      return {
        ...alert,
        category: translations[alert.category] || alert.category,
        title: translations[alert.title] || alert.title,
        description: translations[alert.description] || alert.description,
        suggestion: translations[alert.suggestion] || alert.suggestion,
      };
    }
    return alert; // Already in Hindi
  };

  // Fetch and translate alerts
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertsAPI.getAll(true); // Get unread only
      
      if (response.success && response.data && response.data.length > 0) {
        // Translate backend data to current language
        const translatedAlerts = response.data.map(translateAlert);
        setAlerts(translatedAlerts);
      } else {
        // Use language-aware fallback
        setAlerts(getFallbackAlerts(language));
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      // Use language-aware fallback
      setAlerts(getFallbackAlerts(language));
    } finally {
      setLoading(false);
    }
  };

  // Fetch alerts when language changes
  useEffect(() => {
    fetchAlerts();
  }, [language]);

const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const refreshAlerts = () => {
    setTimeout(() => {
    }, 800);
  };

  return (
    <div className="px-3 space-y-4">
      {/* Priority Alert */}
      <section className="bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-2xl shadow-lg alert-pulse">
        <div className="flex items-start gap-3">
          <div className="text-3xl mt-1">🚨</div>
          <div className="flex-1">
            <p className="text-xs text-red-200 font-medium tracking-wide uppercase">{priorityAlert.highRiskLabel}</p>
            <h2 className="text-xl font-bold mt-1">{priorityAlert.title}</h2>
            <p className="text-red-100 text-sm mt-2 leading-relaxed">
              {priorityAlert.desc}
            </p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mt-4 border border-white/20">
              <p className="text-sm font-bold flex items-center gap-2">{priorityAlert.actionLabel}</p>
              <ul className="text-sm text-white/90 mt-2 space-y-1.5">
                {priorityAlert.actions.map((action, idx) => (
                  <li key={idx}>• {action}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => speakText(priorityAlert.speakText)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                {priorityAlert.listenBtn}
              </button>
              <button 
                className="flex-1 bg-white text-red-600 hover:bg-red-50 py-2.5 rounded-xl font-medium transition-colors active:scale-95"
              >
                {priorityAlert.saveBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Alert List */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">{t.otherAlerts}</h3>
          <button 
            onClick={refreshAlerts}
            className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            {t.refresh}
          </button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4"
              style={{ 
                borderLeftColor: 
                  alert.color === 'blue' ? '#3b82f6' : 
                  alert.color === 'amber' ? '#f59e0b' : 
                  alert.color === 'orange' ? '#f97316' : 
                  '#22c55e'
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ 
                      backgroundColor: alert.color === 'blue' ? '#dbeafe' : 
                        alert.color === 'amber' ? '#fef3c7' : 
                        alert.color === 'orange' ? '#ffedd5' : 
                        '#dcfce7',
                      color: alert.color === 'blue' ? '#1d4ed8' : 
                        alert.color === 'amber' ? '#b45309' : 
                        alert.color === 'orange' ? '#c2410c' : 
                        '#15803d'
                    }}
                  >
                    {alert.icon}
                  </div>
                  <div>
                    <span 
                      className="text-[10px] px-2 py-0.5 rounded font-medium"
                      style={{ 
                        backgroundColor: alert.color === 'blue' ? '#dbeafe' : 
                          alert.color === 'amber' ? '#fef3c7' : 
                          alert.color === 'orange' ? '#ffedd5' : 
                          '#dcfce7',
                        color: alert.color === 'blue' ? '#1d4ed8' : 
                          alert.color === 'amber' ? '#b45309' : 
                          alert.color === 'orange' ? '#c2410c' : 
                          '#15803d'
                      }}
                    >
                      {alert.icon} {alert.category}
                    </span>
                    <p className="font-semibold mt-1 text-sm">{alert.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{alert.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => speakText(alert.suggestion)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-lg transition-colors active:scale-90"
                >
                  🔊
                </button>
              </div>
              <div 
                className="p-3 rounded-lg mt-3 border"
                style={{ 
                  backgroundColor: alert.color === 'blue' ? '#eff6ff' : 
                    alert.color === 'amber' ? '#fffbeb' : 
                    alert.color === 'orange' ? '#fff7ed' : 
                    '#f0fdf4',
                  borderColor: alert.color === 'blue' ? '#bfdbfe' : 
                    alert.color === 'amber' ? '#fde68a' : 
                    alert.color === 'orange' ? '#fed7aa' : 
                    '#bbf7d0'
                }}
              >
<p 
                  className="text-xs font-medium"
                  style={{ 
                    color: alert.color === 'blue' ? '#1e40af' : 
                      alert.color === 'amber' ? '#92400e' : 
                      alert.color === 'orange' ? '#9a3412' : 
                      '#166534'
                  }}
                >
                  {t.suggestion} {alert.suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notification Settings */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">{t.notificationSettings}</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-base">🌧️</div>
              <div>
                <p className="text-sm font-medium">{t.weatherAlert}</p>
                <p className="text-xs text-gray-400">{t.weatherAlertDesc}</p>
              </div>
            </div>
            <div 
              className={`toggle ${settings.weather ? 'active' : ''}`}
              onClick={() => toggleSetting('weather')}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-base">🐛</div>
              <div>
                <p className="text-sm font-medium">{t.pestAlert}</p>
                <p className="text-xs text-gray-400">{t.pestAlertDesc}</p>
              </div>
            </div>
            <div 
              className={`toggle ${settings.pest ? 'active' : ''}`}
              onClick={() => toggleSetting('pest')}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-soil-100 dark:bg-soil-900/30 rounded-full flex items-center justify-center text-base">🏛️</div>
              <div>
                <p className="text-sm font-medium">{t.schemeAlert}</p>
                <p className="text-xs text-gray-400">{t.schemeAlertDesc}</p>
              </div>
            </div>
            <div 
              className={`toggle ${settings.scheme ? 'active' : ''}`}
              onClick={() => toggleSetting('scheme')}
            ></div>
          </div>
        </div>
      </section>

      {/* Alert History */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        >
          <h3 className="font-bold text-sm flex items-center gap-2">{t.pastAlerts}</h3>
          <svg 
            className={`w-5 h-5 transform transition-transform ${showHistory ? 'rotate(180deg)' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showHistory && (
          <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-3 text-sm">
            {history.map((item, idx) => (
              <div key={idx} className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{item.title}</span>
                <span 
                  className={`text-xs px-2 py-0.5 rounded ${
                    item.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                    item.status === 'noted' ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'
                  }`}
                >
                  {t.statusLabels[item.status]}
                </span>
              </div>
            ))}
            <p className="text-xs text-center text-gray-400 pt-2">
              {language === 'en' ? 'Past 30 days alerts will appear here' : 'पिछले 30 दिनों के अलर्ट यहाँ दिखेंगे'}
            </p>
          </div>
        )}
      </section>

      <p className="text-center text-xs text-gray-400 pb-4">
        {t.lastUpdated}
      </p>
    </div>
  );
};

export default Alerts;
