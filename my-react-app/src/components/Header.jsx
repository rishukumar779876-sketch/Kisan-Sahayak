import { useState, useEffect } from 'react';

const Header = ({ 
  title = "Kisan Sahayak", 
  subtitle = "Smart Farming Assistant",
  showBack = false,
  onBack,
  themeToggle = true,
  location = "मिठापुर, बिहार",
  gradient = "from-primary-700 via-primary-600 to-emerald-600"
}) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kisan-theme') === 'dark' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kisan-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r ${gradient} text-white px-4 py-3 shadow-lg`}>
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50">
            <span className="text-xl">🌾</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-white/80 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {location}
              </p>
            )}
          </div>
        </div>
        {themeToggle && (
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-lg"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        )}
      </div>
      {subtitle && !showBack && (
        <p className="text-xs text-white/80 text-center mt-1">{subtitle}</p>
      )}
    </header>
  );
};

export default Header;
