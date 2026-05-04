import { useState, useRef, useEffect } from 'react';
import { chatAPI, dashboardAPI } from '../services/api';

const Chat = ({ language = 'en' }) => {
  const t = {
    hi: {
      welcome: 'नमस्ते 👋 मैं आपका किसान सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?',
      now: 'अभी',
      inputPlaceholder: 'अपना सवाल लिखें...',
      weatherTitle: 'आज का मौसम',
      humidity: 'आर्द्रता',
      wind: 'हवा',
      tomorrow: 'कल',
      dayAfter: 'परसों',
      wednesday: 'बुधवार',
      thursday: 'गुरुवार',
      heavyRainAlert: 'भारी बारिश की चेतावनी',
      heavyRainMsg: 'कल दोपहर 2-6 बजे तक भारी वर्षा। फसलों को सुरक्षित रखें।',
      newScheme: 'नई सरकारी योजना',
      pmKisan: 'PM-KISAN की 15वीं किश्त जारी। अंतिम तिथि: 15 मई',
      quickCropAdvice: '🌾 फसल सलाह',
      quickWeather: '🌦️ मौसम',
      quickSchemes: '💰 योजनाएँ',
      tip: '💡 टिप: फसल की तस्वीर भेजकर बीमारी का पता लगाएं',
      botName: 'Kisan Sahayak',
      error: 'क्षमा करें! कुछ तकनीकी समस्या है। कृपया पुनः प्रयास करें।'
    },
    en: {
      welcome: 'Namaste 👋 I am your Kisan Sahayak. How can I help you?',
      now: 'Now',
      inputPlaceholder: 'Ask your question...',
      weatherTitle: "Today's Weather",
      humidity: 'Humidity',
      wind: 'Wind',
      tomorrow: 'Tomorrow',
      dayAfter: 'Day After',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      heavyRainAlert: 'Heavy Rain Warning',
      heavyRainMsg: 'Heavy rainfall tomorrow 2-6 PM. Keep crops safe.',
      newScheme: 'New Government Scheme',
      pmKisan: 'PM-KISAN 15th installment released. Last date: May 15',
      quickCropAdvice: '🌾 Crop Advice',
      quickWeather: '🌦️ Weather',
      quickSchemes: '💰 Schemes',
      tip: '💡 Tip: Send crop photo to detect disease',
      botName: 'Kisan Sahayak',
      error: 'Sorry! Technical error. Please try again.'
    }
  }[language];

  const [messages, setMessages] = useState([{ id: 1, type: 'bot', text: t.welcome, time: t.now }]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const chatBoxRef = useRef(null);

  const quickSuggestions = [t.quickCropAdvice, t.quickWeather, t.quickSchemes];

  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages([{ id: 1, type: 'bot', text: t.welcome, time: t.now }]);
  }, [language]);

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;
    const userMsg = { id: Date.now(), type: 'user', text: inputText.trim(), image: selectedImage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText.trim();
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);
    try {
      const response = await chatAPI.sendMessage({ message: currentInput, language });
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: response.data.message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: t.error, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }
  };

  return (
    <div className="px-3 space-y-4">
      <section className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-4 rounded-2xl shadow-card">
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
            <p className="text-[10px] text-sky-100">{t.tomorrow}</p><p className="font-bold">28°</p><span className="text-xl">🌧️</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20">
          <div className="text-center"><p className="text-xs text-sky-100">{t.dayAfter}</p><p className="font-semibold text-sm">30°C</p><span className="text-lg">⛅</span></div>
          <div className="text-center"><p className="text-xs text-sky-100">{t.wednesday}</p><p className="font-semibold text-sm">33°C</p><span className="text-lg">☀️</span></div>
          <div className="text-center"><p className="text-xs text-sky-100">{t.thursday}</p><p className="font-semibold text-sm">29°C</p><span className="text-lg">🌧️</span></div>
        </div>
      </section>

      <div className="space-y-3">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-4 rounded-2xl shadow-lg flex items-start gap-3">
          <div className="text-2xl mt-0.5">⚠️</div>
          <div className="flex-1"><p className="font-semibold">{t.heavyRainAlert}</p><p className="text-red-100 text-sm mt-1">{t.heavyRainMsg}</p></div>
        </div>
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg flex items-start gap-3">
          <div className="text-2xl mt-0.5">💡</div>
          <div className="flex-1"><p className="font-semibold">{t.newScheme}</p><p className="text-sky-100 text-sm mt-1">{t.pmKisan}</p></div>
        </div>
      </div>

      <div ref={chatBoxRef} className="space-y-4 min-h-[40vh] max-h-[50vh] overflow-y-auto pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-enter flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%]">
              {msg.type === 'bot' ? (
                <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm shadow-card border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">KS</div>
                    <div><p className="font-medium text-gray-800">{t.botName}</p><p className="text-gray-600 mt-1 leading-relaxed font-devanagari" dangerouslySetInnerHTML={{ __html: msg.text }}></p></div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-5 py-4 rounded-2xl rounded-tr-sm shadow-card">
                  {msg.text && <p className="leading-relaxed font-devanagari">{msg.text}</p>}
                  {msg.image && <div className="mt-2"><img src={msg.image} className="image-preview max-w-full rounded-xl" alt="Attached" /></div>}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2 ml-2">{msg.time}</p>
            </div>
          </div>
        ))}
        {isTyping && <div className="flex justify-start"><div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm shadow-card border border-gray-100"><div className="flex gap-1"><div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div></div></div></div>}
      </div>

      <div className="flex flex-wrap gap-2">
        {quickSuggestions.map((suggestion, idx) => (<button key={idx} onClick={() => { setInputText(suggestion); setTimeout(sendMessage, 100); }} className="quick-suggestion text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100">{suggestion}</button>))}
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-3 z-40">
        {selectedImage && <div className="relative inline-block mb-2"><img src={selectedImage} className="image-preview" alt="Preview" /><button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">×</button></div>}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 flex items-center gap-2">
          <label className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer"><input type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setSelectedImage(ev.target.result); reader.readAsDataURL(file); } }} /><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></label>
          <button onClick={() => { setIsVoiceActive(!isVoiceActive); if (!isVoiceActive) setTimeout(() => { setInputText(language==='hi'?'गेहूं की फसल में पीले पत्ते क्यों आ रहे हैं?':'Why are wheat leaves turning yellow?'); setIsVoiceActive(false); }, 2500); }} className="p-3 rounded-xl hover:bg-gray-100 relative"><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>{isVoiceActive && <div className="voice-wave absolute -top-8 left-1/2 -translate-x-1/2"><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div></div>}</button>
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder={t.inputPlaceholder} className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm px-2 py-2 font-devanagari" />
          <button onClick={sendMessage} className="bg-gradient-to-r from-primary-600 to-emerald-600 text-white p-3 rounded-xl shadow-lg hover:scale-105 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 pb-20">{t.tip}</p>
    </div>
  );
};

export default Chat;
