import { useState, useEffect } from 'react';
import { dashboardAPI, schemesAPI } from '../services/api';

const Dashboard = ({ onNavigate, language = 'en' }) => {
  const t = {
    hi: {
      weatherTitle: 'आज का मौसम',
      humidity: 'आर्द्रता',
      wind: 'हवा',
      tomorrow: 'कल',
      dayAfter: 'परसों',
      wednesday: 'बुधवार',
      thursday: 'गुरुवार',
      cropStatus: 'फसल स्थिति',
      sowing: 'बुवाई',
      growthStage: 'वृद्धि अवस्था',
      growthProgress: 'वृद्धि प्रगति',
      todayAdvice: 'आज की सलाह',
      alerts: '⚠️ महत्वपूर्ण अलर्ट',
      heavyRain: 'भारी बारिश की चेतावनी',
      protectCrop: 'फसल को सुरक्षित स्थान पर रखें।',
      pestRisk: '🐛 कीट जोखिम',
      pestAlert: 'गेहूं में एफिड कीट का खतरा बढ़ा है। नीम तेल छिड़काव करें।',
      governmentScheme: 'सरकारी योजना',
      checkEligibility: 'पात्रता जाँचें →',
      quickActions: '⚡ त्वरित कार्य',
      cropAdvice: 'फसल सलाह',
      askQuestion: 'प्रश्न पूछें',
      schemes: 'सरकारी योजनाएँ',
      mandiBhav: 'मंडी भाव',
      marketPrices: '📈 मंडी भाव',
      patnaMandi: 'Patna Mandi',
    },
    en: {
      weatherTitle: "Today's Weather",
      humidity: 'Humidity',
      wind: 'Wind',
      tomorrow: 'Tomorrow',
      dayAfter: 'Day After',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      cropStatus: 'Crop Status',
      sowing: 'Sowing',
      growthStage: 'Growth Stage',
      growthProgress: 'Growth Progress',
      todayAdvice: "Today's Advice",
      alerts: '⚠️ Important Alerts',
      heavyRain: 'Heavy Rain Warning',
      protectCrop: 'Keep crops in safe place.',
      pestRisk: '🐛 Pest Risk',
      pestAlert: 'Aphid risk in wheat. Apply neem oil.',
      governmentScheme: 'Government Scheme',
      checkEligibility: 'Check Eligibility →',
      quickActions: '⚡ Quick Actions',
      cropAdvice: 'Crop Advice',
      askQuestion: 'Ask Question',
      schemes: 'Schemes',
      mandiBhav: 'Market Prices',
      marketPrices: '📈 Market Prices',
      patnaMandi: 'Patna Mandi',
    }
  }[language];

  const [crops, setCrops] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, marketData, schemesData] = await Promise.all([
          dashboardAPI.getAll(),
          dashboardAPI.getMarket(),
          schemesAPI.getRecommended()
        ]);
        if (dashData.success) {
          setWeather(dashData.data.weather);
          setCrops(dashData.data.crops);
        }
        if (marketData.success) setMarketPrices(marketData.data);
        if (schemesData.success) setSchemes(schemesData.data.slice(0, 1));
      } catch (error) {
        console.log('Using fallback data:', error);
        setCrops([{ name: 'गेहूं (Wheat)', icon: '🌾', date: '15 Nov', area: '2.5 acres', stage: language==='hi'?'वृद्धि':'Growth', progress: 65 }]);
        setMarketPrices([{ name: 'Wheat', icon: '🌾', price: '₹2,240', change: '▲ +₹40', color: 'green' }]);
      }
    };
    const interval = setInterval(fetchData, 300000); // Refresh every 5 min
    fetchData(); // Initial load
    return () => clearInterval(interval);
  }, [language]);

  const defaultCrops = language === 'hi' ? [
    { name: 'गेहूं (Wheat)', icon: '🌾', date: '15 नवंबर', area: '2.5 एकड़', stage: 'वृद्धि अवस्था', progress: 65, advice: 'हल्की सिंचाई करें। नाइट्रोजन उर्वरक डालें।' },
    { name: 'धान (Paddy)', icon: '🌱', date: '20 जून', area: '1.5 एकड़', stage: 'कटाई', progress: 90, advice: 'कटाई का समय उपयुक्त है।' }
  ] : [
    { name: 'Wheat', icon: '🌾', date: '15 Nov', area: '2.5 acres', stage: 'Growth', progress: 65, advice: 'Apply light irrigation. Add nitrogen fertilizer.' },
    { name: 'Paddy', icon: '🌱', date: '20 Jun', area: '1.5 acres', stage: 'Harvest', progress: 90, advice: 'Time to harvest.' }
  ];

  const defaultMarket = language === 'hi' ? [
    { name: 'गेहूं', icon: '🌾', price: '₹2,240', change: '▲ +₹40', color: 'green' },
    { name: 'धान', icon: '🍚', price: '₹1,850', change: '▼ -₹20', color: 'blue' },
    { name: 'मक्का', icon: '🌽', price: '₹1,680', change: 'स्थिर', color: 'yellow' }
  ] : [
    { name: 'Wheat', icon: '🌾', price: '₹2,240', change: '▲ +₹40', color: 'green' },
    { name: 'Paddy', icon: '🍚', price: '₹1,850', change: '▼ -₹20', color: 'blue' },
    { name: 'Maize', icon: '🌽', price: '₹1,680', change: 'Stable', color: 'yellow' }
  ];

  return (
    <div className="px-3 space-y-4">
      <section className="fade-up bg-gradient-to-br from-sky-500 to-blue-600 text-white p-4 rounded-2xl shadow-card">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sky-100 text-sm font-medium">{t.weatherTitle}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold">32°C</span>
              <span className="text-lg">🌧️ {language==='hi'?'हल्की बारिश':'Light Rain'}</span>
            </div>
            <p className="text-sky-100 text-xs mt-1">💧 78% {t.humidity} | 🌬️ 12 km/h {t.wind}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-center min-w-[60px]">
            <p className="text-[10px] text-sky-100">{t.tomorrow}</p>
            <p className="font-bold">28°</p>
            <span className="text-xl">🌧️</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20">
          <div className="text-center"><p className="text-xs text-sky-100">{t.dayAfter}</p><p className="font-semibold text-sm">30°C</p><span className="text-lg">⛅</span></div>
          <div className="text-center"><p className="text-xs text-sky-100">{t.wednesday}</p><p className="font-semibold text-sm">33°C</p><span className="text-lg">☀️</span></div>
          <div className="text-center"><p className="text-xs text-sky-100">{t.thursday}</p><p className="font-semibold text-sm">29°C</p><span className="text-lg">🌧️</span></div>
        </div>
      </section>

      {(crops.length > 0 ? crops : defaultCrops).map((crop, idx) => (
        <section key={idx} className="fade-up bg-white p-4 rounded-2xl shadow-card border border-gray-100" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{crop.icon}</span>
              <div>
                <p className="font-semibold text-sm">{crop.name}</p>
                <p className="text-xs text-gray-500">{t.sowing}: {crop.date} | {crop.area}</p>
              </div>
            </div>
            <span className="bg-primary-100 text-primary-700 text-[10px] font-medium px-2 py-1 rounded-full">{crop.stage}</span>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1"><span>{t.growthProgress}</span><span className="font-medium">{crop.progress}%</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"><div className="bg-primary-500 h-full rounded-full" style={{ width: `${crop.progress}%` }}></div></div>
          </div>
          <div className="bg-primary-50 p-3 rounded-xl border border-primary-200">
            <p className="font-medium text-sm">💡 {t.todayAdvice}</p>
            <p className="text-sm text-gray-600 mt-1">{crop.advice || (language==='hi'?'हल्की सिंचाई करें।':'Apply light irrigation.')}</p>
          </div>
        </section>
      ))}

      <section className="fade-up space-y-3">
        <h2 className="font-bold text-sm flex items-center gap-1">{t.alerts}</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl">
          <p className="font-semibold text-sm text-red-800">🌧️ {t.heavyRain}</p>
          <p className="text-xs text-red-600 mt-1">{t.protectCrop}</p>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-xl">
          <p className="font-semibold text-sm text-orange-800">{t.pestRisk}</p>
          <p className="text-xs text-orange-600 mt-1">{t.pestAlert}</p>
        </div>
      </section>

      {schemes.map((scheme, idx) => (
        <section key={idx} className="fade-up bg-soil-50 p-4 rounded-2xl border border-soil-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-soil-500 rounded-xl flex items-center justify-center text-white text-xl">{scheme.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-soil-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">{scheme.tag}</span>
                <span className="text-xs text-soil-700">{t.governmentScheme}</span>
              </div>
              <h3 className="font-bold text-sm">{scheme.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{scheme.desc}</p>
              <button className="mt-2 bg-soil-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg">{t.checkEligibility}</button>
            </div>
          </div>
        </section>
      ))}

      <section className="fade-up">
        <h2 className="font-bold text-sm mb-3">{t.quickActions}</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate?.('chat')} className="action-card bg-primary-50 p-3 rounded-xl border border-primary-200 flex flex-col items-center gap-1">
            <span className="text-2xl">🌱</span><span className="text-sm font-medium">{t.cropAdvice}</span></button>
          <button onClick={() => onNavigate?.('chat')} className="action-card bg-sky-50 p-3 rounded-xl border border-sky-200 flex flex-col items-center gap-1">
            <span className="text-2xl">💬</span><span className="text-sm font-medium">{t.askQuestion}</span></button>
          <button onClick={() => onNavigate?.('schemes')} className="action-card bg-soil-50 p-3 rounded-xl border border-soil-200 flex flex-col items-center gap-1">
            <span className="text-2xl">🏛️</span><span className="text-sm font-medium">{t.schemes}</span></button>
          <button onClick={() => onNavigate?.('home')} className="action-card bg-red-50 p-3 rounded-xl border border-red-200 flex flex-col items-center gap-1">
            <span className="text-2xl">📊</span><span className="text-sm font-medium">{t.mandiBhav}</span></button>
        </div>
      </section>

      <section className="fade-up bg-white p-4 rounded-2xl shadow-card border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-sm">{t.marketPrices}</h2>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{t.patnaMandi} • 28 {language==='hi'?'अप्रैल':'Apr'}</span>
        </div>
        <div className="space-y-2">
          {(marketPrices.length > 0 ? marketPrices : defaultMarket).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2"><span className="text-lg">{item.icon}</span><span className="text-sm font-medium">{item.name}</span></div>
              <div className="text-right"><p className="font-bold text-green-700">{item.price}</p><p className={`text-[10px] ${item.color === 'green' ? 'text-green-600' : item.color === 'blue' ? 'text-blue-600' : 'text-gray-500'}`}>{item.change}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
