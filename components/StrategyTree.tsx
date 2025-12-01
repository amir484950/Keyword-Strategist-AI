import React, { useState } from 'react';
import { KeywordAnalysis, SearchIntent } from '../types';

interface StrategyTreeProps {
    data: KeywordAnalysis[];
    topic: string;
}

const intentMap: Record<string, string> = {
    [SearchIntent.INFORMATIONAL]: 'اطلاعاتی',
    [SearchIntent.TRANSACTIONAL]: 'تراکنشی',
    [SearchIntent.COMMERCIAL]: 'تجاری',
    [SearchIntent.NAVIGATIONAL]: 'ناوبری',
};

const Node: React.FC<{ 
    label: string; 
    subLabel?: string;
    color: string; 
    children?: React.ReactNode; 
    depth: number;
    defaultOpen?: boolean;
}> = ({ label, subLabel, color, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const hasChildren = !!children;

    return (
        <div className="flex flex-col items-center animate-scale-in">
            <div className="relative z-10">
                <button
                    onClick={() => hasChildren && setIsOpen(!isOpen)}
                    className={`
                        flex flex-col items-center justify-center px-4 py-3 rounded-xl shadow-md border-2 transition-all duration-300
                        ${hasChildren ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : 'cursor-default'}
                        ${color}
                    `}
                >
                    <span className="font-bold text-gray-800 text-sm md:text-base whitespace-nowrap">{label}</span>
                    {subLabel && <span className="text-xs text-gray-600 mt-1">{subLabel}</span>}
                    {hasChildren && (
                        <div className="mt-1 transition-transform duration-300 transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                           <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    )}
                </button>
            </div>

            <div 
                className={`
                    flex flex-col items-center overflow-hidden transition-all duration-500 ease-in-out
                    ${isOpen && hasChildren ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'}
                `}
            >
                <div className="h-6 w-0.5 bg-gray-300"></div>
                <div className="flex flex-row items-start gap-4 md:gap-8 pt-4 border-t-2 border-gray-300 relative">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const StrategyTree: React.FC<StrategyTreeProps> = ({ data, topic }) => {
    // Group by Intent for the visualization
    const grouped = data.reduce((acc, curr) => {
        if (!acc[curr.intent]) acc[curr.intent] = [];
        acc[curr.intent].push(curr);
        return acc;
    }, {} as Record<SearchIntent, KeywordAnalysis[]>);

    return (
        <div className="w-full overflow-x-auto p-8 bg-white rounded-3xl shadow-inner border border-brand-100 min-h-[500px] flex justify-center">
            <Node 
                label={topic} 
                subLabel="موضوع اصلی" 
                color="bg-brand-100 border-brand-300" 
                depth={0} 
                defaultOpen={true}
            >
                {(Object.entries(grouped) as [string, KeywordAnalysis[]][]).map(([intent, keywords]) => (
                    <div key={intent} className="flex flex-col items-center">
                         <div className="h-4 w-0.5 bg-gray-300 absolute -top-4"></div>
                        <Node 
                            label={intentMap[intent] || intent} 
                            color="bg-blue-50 border-blue-200" 
                            depth={1}
                            defaultOpen={true}
                        >
                            {keywords.map((kw, idx) => (
                                <div key={idx} className="flex flex-col items-center px-2">
                                     <div className="h-4 w-0.5 bg-gray-300 absolute -top-4"></div>
                                    <Node 
                                        label={kw.keyword} 
                                        subLabel={`ترافیک: ${kw.searchVolume === 'High' ? 'زیاد' : kw.searchVolume === 'Medium' ? 'متوسط' : 'کم'}`}
                                        color="bg-white border-gray-200" 
                                        depth={2}
                                    />
                                </div>
                            ))}
                        </Node>
                    </div>
                ))}
            </Node>
        </div>
    );
};