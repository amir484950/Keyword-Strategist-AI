import React, { useState, useCallback } from 'react';
import { generateKeywordStrategy } from './services/geminiService';
import { StrategyResult } from './types';
import { StrategyTree } from './components/StrategyTree';
import { DataTable } from './components/DataTable';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('table');

  // Advanced Options State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [negativeKeywords, setNegativeKeywords] = useState('');
  const [strategyType, setStrategyType] = useState<'BROAD' | 'NICHE'>('BROAD');

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateKeywordStrategy(topic, {
        negativeKeywords: negativeKeywords.trim(),
        strategyType
      });
      setResult(data);
    } catch (err: any) {
        console.error(err);
        setError(err.message || "مشکلی پیش آمد. لطفا کلید API خود را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  }, [topic, negativeKeywords, strategyType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white text-gray-800 font-persian p-4 md:p-6 pb-20" dir="rtl">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 md:mb-12 text-center pt-6 md:pt-10 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-700 to-brand-500 mb-4 tracking-tight">
          استراتژیست کلمات کلیدی
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          تحقیق کلمات کلیدی هوشمند بر اساس هدف جستجو، حجم ترافیک و تحلیل رقبا.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full">
        
        {/* Input Section - Centered and Compact */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10 border border-brand-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col gap-6">
              
              {/* Top Row: Input & Button */}
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-grow w-full">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2 mr-1">
                    موضوع اصلی یا حوزه کاری خود را وارد کنید
                  </label>
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="مثال: دیجیتال مارکتینگ، قهوه ارگانیک، برنامه نویسی وب"
                    className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                  />
                </div>
                
                <div className="flex flex-col gap-3 w-full md:w-auto mt-1 md:mt-7">
                    <button
                      onClick={handleGenerate}
                      disabled={loading || !topic}
                      className={`
                        w-full md:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-all transform whitespace-nowrap
                        ${loading || !topic ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-1 hover:shadow-brand-300/50'}
                      `}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          در حال فکر کردن...
                        </span>
                      ) : 'تولید استراتژی'}
                    </button>
                    
                    {result && !loading && (
                        <button
                            onClick={handleGenerate}
                            className="w-full text-center text-sm text-gray-400 hover:text-brand-600 font-medium transition-colors flex items-center justify-center gap-1 py-1"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            تولید مجدد
                        </button>
                    )}
                </div>
              </div>

              {/* Advanced Toggle */}
              <div className="border-t border-gray-100 pt-4">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 transition-colors"
                >
                  <svg className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  تنظیمات پیشرفته (کلمات منفی و نوع استراتژی)
                </button>

                {/* Collapsible Advanced Section */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAdvanced ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Negative Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                         کلمات منفی (حذف کلمات نامرتبط):
                      </label>
                      <input 
                        type="text" 
                        value={negativeKeywords}
                        onChange={(e) => setNegativeKeywords(e.target.value)}
                        placeholder="مثال: رایگان، ارزان، دست دوم (با کاما جدا کنید)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm transition-all"
                      />
                      <p className="text-xs text-gray-400 mt-1">کلماتی که نمی‌خواهید در نتایج باشند.</p>
                    </div>

                    {/* Strategy Focus */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع استراتژی و تمرکز:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setStrategyType('BROAD')}
                          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${strategyType === 'BROAD' ? 'bg-white border-brand-500 text-brand-700 shadow-sm ring-2 ring-brand-100' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
                        >
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                           عمومی و پرجستجو
                        </button>
                        <button
                          onClick={() => setStrategyType('NICHE')}
                          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${strategyType === 'NICHE' ? 'bg-white border-brand-500 text-brand-700 shadow-sm ring-2 ring-brand-100' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                           تخصصی و نیچ
                        </button>
                      </div>
                       <p className="text-xs text-gray-400 mt-1">
                        {strategyType === 'BROAD' ? 'مناسب برای آگاهی از برند و ترافیک بالا.' : 'مناسب برای نرخ تبدیل بالا و رقابت کمتر.'}
                       </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center animate-fade-in-up">
                 <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section - Expanded Width */}
        {result && (
          <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-4">
              <div className="text-right w-full">
                <h2 className="text-3xl font-bold text-gray-800">استراتژی: {result.topic}</h2>
                <p className="text-gray-500 mt-1">{result.summary}</p>
              </div>
              
              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                 <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white shadow text-brand-700' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                    جدول داده‌ها
                 </button>
                 <button
                    onClick={() => setViewMode('tree')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'tree' ? 'bg-white shadow text-brand-700' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                    نقشه درختی
                 </button>
              </div>
            </div>

            {viewMode === 'tree' ? (
                <div className="relative">
                    <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-2 rounded-lg border text-xs text-gray-500">
                        برای باز/بسته کردن روی آیتم‌ها کلیک کنید
                    </div>
                    <StrategyTree data={result.keywords} topic={result.topic} />
                </div>
            ) : (
                <DataTable data={result.keywords} />
            )}

            {/* Methodology Explainer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                {[
                    { title: "ترافیک ورودی", desc: "حجم جستجوی بالا (تقاضا)", color: "bg-green-50 border-green-200 text-green-800" },
                    { title: "ارزش تجاری", desc: "ارتباط تخصصی با بیزینس", color: "bg-blue-50 border-blue-200 text-blue-800" },
                    { title: "نیاز کاربر", desc: "تشخیص هدف جستجو (Intent)", color: "bg-purple-50 border-purple-200 text-purple-800" },
                    { title: "پتانسیل ROI", desc: "تحلیل رقابت و سختی کلمه", color: "bg-orange-50 border-orange-200 text-orange-800" },
                ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-sm opacity-80">{item.desc}</p>
                    </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;