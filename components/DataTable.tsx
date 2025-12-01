import React, { useState } from 'react';
import { KeywordAnalysis, Level, SearchIntent } from '../types';

interface DataTableProps {
    data: KeywordAnalysis[];
}

const levelMap: Record<string, string> = {
    [Level.HIGH]: 'زیاد',
    [Level.MEDIUM]: 'متوسط',
    [Level.LOW]: 'کم',
};

const intentMap: Record<string, string> = {
    [SearchIntent.INFORMATIONAL]: 'اطلاعاتی',
    [SearchIntent.TRANSACTIONAL]: 'تراکنشی (خرید)',
    [SearchIntent.COMMERCIAL]: 'تجاری',
    [SearchIntent.NAVIGATIONAL]: 'ناوبری',
};

// Tooltip Content Definitions
const TOOLTIP_CONTENT = {
    volume: (
        <div className="text-right">
            <p className="font-bold mb-1 text-brand-200">حجم جستجو (Search Volume)</p>
            <p className="mb-2 text-gray-300">نشان‌دهنده میانگین تعداد دفعاتی است که کاربران این کلمه را جستجو می‌کنند.</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li><strong className="text-white">زیاد:</strong> ترافیک ورودی بالا (فرصت عالی)</li>
                <li><strong className="text-white">متوسط:</strong> ترافیک نرمال و خوب</li>
                <li><strong className="text-white">کم:</strong> جستجوی محدود (معمولاً کلمات طولانی/خاص)</li>
            </ul>
        </div>
    ),
    commercial: (
        <div className="text-right">
            <p className="font-bold mb-1 text-brand-200">ارزش تجاری (Commercial Value)</p>
            <p className="mb-2 text-gray-300">پتانسیل این کلمه برای تبدیل کاربر به مشتری و ایجاد سود برای کسب‌وکارتان.</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li><strong className="text-white">زیاد:</strong> احتمال خرید بسیار بالا</li>
                <li><strong className="text-white">متوسط:</strong> کاربر در حال تحقیق برای خرید</li>
                <li><strong className="text-white">کم:</strong> کاربر فقط دنبال اطلاعات رایگان است</li>
            </ul>
        </div>
    ),
    competition: (
        <div className="text-right">
            <p className="font-bold mb-2 text-brand-200 border-b border-gray-700 pb-2 text-base">تحلیل سطح رقابت (Competition)</p>
            <p className="mb-3 text-gray-300 text-sm leading-relaxed">
                این شاخص دشواری کسب رتبه در صفحه اول گوگل را نشان می‌دهد. انتخاب استراتژیک بر اساس وضعیت سایت شما:
            </p>
            <div className="space-y-3">
                <div className="bg-gray-800/50 p-2 rounded-lg border border-red-900/30">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <p className="text-red-300 font-bold text-sm">زیاد (High)</p>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        <span className="text-gray-200 font-semibold">سایت‌های جدید:</span> بسیار دشوار. نیازمند اعتبار دامنه بالا و هزینه زیاد.
                        <br/>
                        <span className="text-gray-200 font-semibold">سایت‌های قدیمی:</span> مناسب برای حفظ قدرت برند.
                    </p>
                </div>

                <div className="bg-gray-800/50 p-2 rounded-lg border border-yellow-900/30">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <p className="text-yellow-300 font-bold text-sm">متوسط (Medium)</p>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        برای سایت‌های در حال رشد قابل دستیابی است. نیاز به محتوای جامع (مانند مقالات ۱۰ هزار کلمه‌ای) دارد.
                    </p>
                </div>

                <div className="bg-gray-800/50 p-2 rounded-lg border border-green-900/30">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <p className="text-green-300 font-bold text-sm">کم (Low)</p>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        <span className="text-green-300 font-semibold">فرصت طلایی:</span> بهترین نقطه شروع برای سایت‌های تازه‌تأسیس جهت جذب سریع ترافیک اولیه.
                    </p>
                </div>
            </div>
        </div>
    ),
    difficulty: (
        <div className="text-right">
            <p className="font-bold mb-1 text-brand-200">امتیاز سختی (Difficulty Score)</p>
            <p className="mb-2 text-gray-300">تخمین عددی (۰ تا ۱۰۰) از سختی رتبه‌گیری.</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li><strong className="text-green-400">۰-۴۰:</strong> آسان (فرصت مناسب)</li>
                <li><strong className="text-yellow-400">۴۱-۷۰:</strong> متوسط (نیازمند تلاش)</li>
                <li><strong className="text-red-400">۷۱-۱۰۰:</strong> سخت (بسیار رقابتی)</li>
            </ul>
        </div>
    )
};

const Tooltip: React.FC<{ content: React.ReactNode; children: React.ReactNode }> = ({ content, children }) => {
    return (
        <div className="group relative flex items-center justify-center">
            {children}
            <div className="absolute bottom-full mb-3 w-80 p-4 bg-gray-900 text-white text-xs leading-relaxed rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none transform translate-y-2 group-hover:translate-y-0 border border-gray-700">
                {content}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
};

const LevelBadge: React.FC<{ level: Level, type: 'volume' | 'commercial' | 'competition' }> = ({ level, type }) => {
    let colorClass = '';
    
    // Logic based on the mind map:
    // Volume: High is good (Green)
    // Commercial: High is good (Green)
    // Competition: Low is good (Green), High is bad (Red)
    
    const isPositive = 
        (type === 'competition' && level === Level.LOW) ||
        (type !== 'competition' && level === Level.HIGH);
    
    const isNeutral = level === Level.MEDIUM;

    if (isPositive) colorClass = 'bg-brand-100 text-brand-800 border-brand-200';
    else if (isNeutral) colorClass = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    else colorClass = 'bg-red-50 text-red-800 border-red-200';

    return (
        <Tooltip content={TOOLTIP_CONTENT[type]}>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} cursor-help`}>
                {levelMap[level] || level}
            </span>
        </Tooltip>
    );
};

const IntentBadge: React.FC<{ intent: SearchIntent }> = ({ intent }) => {
    const colors: Record<SearchIntent, string> = {
        [SearchIntent.INFORMATIONAL]: 'bg-blue-100 text-blue-800',
        [SearchIntent.TRANSACTIONAL]: 'bg-purple-100 text-purple-800',
        [SearchIntent.COMMERCIAL]: 'bg-emerald-100 text-emerald-800',
        [SearchIntent.NAVIGATIONAL]: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${colors[intent]}`}>
            {intentMap[intent] || intent}
        </span>
    );
};

const ScoreBar: React.FC<{ score: number }> = ({ score }) => {
    let colorClass = 'bg-green-500';
    if (score > 40) colorClass = 'bg-yellow-500';
    if (score > 70) colorClass = 'bg-red-500';

    return (
        <div className="flex items-center gap-3 w-full max-w-[120px] mx-auto">
            <span className="text-xs font-bold w-6 text-left text-gray-600">{score}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`} 
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
};

const KeywordDetailModal: React.FC<{ isOpen: boolean; onClose: () => void; data: KeywordAnalysis | null }> = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300">
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in relative flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-50 to-white p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h3 className="text-2xl font-bold text-gray-800">{data.keyword}</h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                {/* Scrollable Body */}
                <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Google SERP Preview - NEW FEATURE */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">پیشنهاد هوش مصنوعی</span>
                            <span className="text-sm font-medium text-gray-500">نحوه نمایش در نتایج گوگل (SERP)</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 font-sans text-right">
                             <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-500">W</div>
                                <div className="text-xs text-gray-800">www.yoursite.com › blog › post</div>
                             </div>
                             <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1 truncate">
                                {data.suggestedTitle || `بهترین راهنمای ${data.keyword} - آموزش کامل`}
                             </h4>
                             <p className="text-sm text-gray-600 line-clamp-2">
                                {data.rationale.substring(0, 150)}... در این مقاله یاد می‌گیرید که چگونه با استفاده از {data.keyword} به نتایج دلخواه برسید. کلیک کنید.
                             </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="text-sm text-gray-600 font-bold">فرمت محتوای پیشنهادی:</span>
                             <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm border border-gray-200">
                                {data.contentFormat || 'مقاله جامع (Blog Post)'}
                             </span>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full"></div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col justify-center">
                             <span className="block text-sm font-medium text-gray-500 mb-2">هدف جستجو (Intent)</span>
                             <div className="flex justify-start">
                                <IntentBadge intent={data.intent} />
                             </div>
                        </div>
                        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex flex-col justify-center">
                             <span className="block text-sm font-medium text-orange-800 mb-2">نمره سختی (KD)</span>
                             <div className="w-full">
                                <ScoreBar score={data.difficultyIndex || 0} />
                             </div>
                        </div>
                         <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                             <span className="text-sm font-medium text-gray-500">حجم جستجو</span>
                             <LevelBadge level={data.searchVolume} type="volume" />
                        </div>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                             <span className="text-sm font-medium text-gray-500">ارزش تجاری</span>
                             <LevelBadge level={data.commercialValue} type="commercial" />
                        </div>
                         <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                             <span className="text-sm font-medium text-gray-500">سطح رقابت</span>
                             <LevelBadge level={data.competition} type="competition" />
                        </div>
                    </div>

                    {/* Rationale */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            تحلیل استراتژیک
                        </h4>
                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-gray-700 leading-8 text-justify">
                            {data.rationale}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-8 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm"
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordAnalysis | null>(null);
    const [competitionFilter, setCompetitionFilter] = useState<Level | 'ALL'>('ALL');
    const [volumeFilter, setVolumeFilter] = useState<Level | 'ALL'>('ALL');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

    const filteredData = data.filter(item => {
        const matchesCompetition = competitionFilter === 'ALL' || item.competition === competitionFilter;
        const matchesVolume = volumeFilter === 'ALL' || item.searchVolume === volumeFilter;
        return matchesCompetition && matchesVolume;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortDirection) return 0;
        return sortDirection === 'asc' 
            ? a.keyword.localeCompare(b.keyword, 'fa') 
            : b.keyword.localeCompare(a.keyword, 'fa');
    });

    const toggleSort = () => {
        if (sortDirection === 'asc') setSortDirection('desc');
        else if (sortDirection === 'desc') setSortDirection('asc');
        else setSortDirection('asc');
    };

    const resetFilters = () => {
        setCompetitionFilter('ALL');
        setVolumeFilter('ALL');
        setSortDirection(null);
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row justify-between items-center mt-8 mb-4 gap-4 px-1">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-700">نتایج تحقیق کلمات کلیدی</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{sortedData.length}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Volume Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label htmlFor="volume-filter" className="text-sm font-medium text-gray-600 whitespace-nowrap">فیلتر حجم:</label>
                        <div className="relative w-full sm:w-auto">
                            <select
                                id="volume-filter"
                                value={volumeFilter}
                                onChange={(e) => setVolumeFilter(e.target.value as Level | 'ALL')}
                                className="w-full sm:w-40 appearance-none bg-white border border-gray-300 text-gray-700 py-2 pr-4 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm shadow-sm transition-all hover:border-brand-400 cursor-pointer"
                            >
                                <option value="ALL">همه</option>
                                <option value={Level.HIGH}>زیاد (ترافیک بالا)</option>
                                <option value={Level.MEDIUM}>متوسط</option>
                                <option value={Level.LOW}>کم</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Competition Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label htmlFor="competition-filter" className="text-sm font-medium text-gray-600 whitespace-nowrap">فیلتر رقابت:</label>
                        <div className="relative w-full sm:w-auto">
                            <select
                                id="competition-filter"
                                value={competitionFilter}
                                onChange={(e) => setCompetitionFilter(e.target.value as Level | 'ALL')}
                                className="w-full sm:w-48 appearance-none bg-white border border-gray-300 text-gray-700 py-2 pr-4 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm shadow-sm transition-all hover:border-brand-400 cursor-pointer"
                            >
                                <option value="ALL">همه سطوح</option>
                                <option value={Level.LOW}>کم (فرصت عالی)</option>
                                <option value={Level.MEDIUM}>متوسط</option>
                                <option value={Level.HIGH}>زیاد (سخت)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
                {sortedData.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <p>هیچ کلمه کلیدی با این فیلترها یافت نشد.</p>
                        <button 
                            onClick={resetFilters}
                            className="mt-4 text-brand-600 font-medium hover:text-brand-700 underline text-sm"
                        >
                            حذف فیلترها
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-40 lg:pb-0"> {/* Added padding bottom to allow tooltip overflow in mobile scrolling */}
                        <table className="min-w-full divide-y divide-gray-200 text-right border-separate border-spacing-0">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                        onClick={toggleSort}
                                    >
                                        <div className="flex items-center gap-1">
                                            کلمه کلیدی
                                            {sortDirection === 'asc' && (
                                                <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                            )}
                                            {sortDirection === 'desc' && (
                                                <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            )}
                                            {!sortDirection && (
                                                <svg className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">هدف جستجو (Intent)</th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-help group">
                                        <Tooltip content={TOOLTIP_CONTENT.volume}>
                                            <div className="flex items-center justify-center gap-1 border-b border-dashed border-gray-400 inline-block pb-0.5">
                                                حجم جستجو
                                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </Tooltip>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-help group">
                                        <Tooltip content={TOOLTIP_CONTENT.commercial}>
                                            <div className="flex items-center justify-center gap-1 border-b border-dashed border-gray-400 inline-block pb-0.5">
                                                ارزش تجاری
                                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </Tooltip>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-help group">
                                        <Tooltip content={TOOLTIP_CONTENT.competition}>
                                            <div className="flex items-center justify-center gap-1 border-b border-dashed border-gray-400 inline-block pb-0.5">
                                                سطح رقابت
                                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </Tooltip>
                                    </th>
                                    {/* Enhanced Difficulty Header */}
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-orange-700 bg-orange-50/50 uppercase tracking-wider border-x border-b border-orange-100 cursor-help group">
                                        <Tooltip content={TOOLTIP_CONTENT.difficulty}>
                                            <div className="flex items-center justify-center gap-1 border-b border-dashed border-orange-300 inline-block pb-0.5">
                                                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                امتیاز سختی
                                            </div>
                                        </Tooltip>
                                    </th>
                                    {/* Content Format Header */}
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                        فرمت محتوا
                                    </th>
                                    {/* Content Strategy Header */}
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3 border-b border-gray-200">
                                        استراتژی محتوا (Title)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedData.map((item, idx) => (
                                    <tr 
                                        key={idx} 
                                        onClick={() => setSelectedKeyword(item)}
                                        className="hover:bg-brand-50/50 cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 group-hover:text-brand-700 border-b border-gray-200">{item.keyword}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                            <IntentBadge intent={item.intent} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center border-b border-gray-200">
                                            <LevelBadge level={item.searchVolume} type="volume" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center border-b border-gray-200">
                                            <LevelBadge level={item.commercialValue} type="commercial" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center border-b border-gray-200">
                                            <LevelBadge level={item.competition} type="competition" />
                                        </td>
                                        {/* Enhanced Difficulty Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center bg-orange-50/20 border-x border-b border-orange-100/60">
                                            <ScoreBar score={item.difficultyIndex || 0} />
                                        </td>
                                        {/* Content Format Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right border-b border-gray-200">
                                            <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg border border-gray-200">
                                                {item.contentFormat}
                                            </span>
                                        </td>
                                        {/* Interactive Content Strategy Cell */}
                                        <td className="px-6 py-4 text-sm border-b border-gray-200">
                                            <div className="flex flex-col gap-1 max-w-xs">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedKeyword(item); }}
                                                    className="text-right text-blue-600 hover:text-blue-800 hover:underline font-medium leading-snug"
                                                >
                                                    {item.suggestedTitle || item.keyword}
                                                </button>
                                                <span className="text-xs text-gray-400 truncate">{item.rationale}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <KeywordDetailModal 
                isOpen={!!selectedKeyword} 
                onClose={() => setSelectedKeyword(null)} 
                data={selectedKeyword} 
            />
        </>
    );
};