import React, { useState, useEffect } from "react";

/* -- Types -- */
type EducationScreen = "summary" | "streak" | "graph" | "learn" | "learn-content";

/* -- Configuration -- */
const feConfig = {
    zelifyScore: 91,
    stabilityIntelligence: 85,
    discipline: 75,
    streakDays: 14,
    streakStartDate: "02 Ene, 2026",
    maxStreak: 15,
    weeklyProgress: [true, true, true, true, true, false, false],
    goalProgress: { current: 14, target: 23 },
    activeRewards: [
        "Only & Sons 20% off",
        "Juan Valdez 2 in coffee",
        "Multicines Free Combo",
        "BK"
    ],
    increasingPercent: 90,
    spendingPercent: 75,
    savingsPercent: 39,
    weeklySummary: "Tu gasto está aumentando esta semana, lo que no te permite aumentar tus ahorros. Las categorías en las que estás gastando de más son comida y entretenimiento.",
    tips: [
        {
            id: "tip-1",
            title: "Cómo controlar el gasto excesivo en artículos no básicos",
            image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400"
        },
        {
            id: "tip-2",
            title: "Cómo aumentar tus ingresos",
            image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400"
        }
    ]
};

// Pyramid Carousel Data
const pyramidItems = [
    {
        id: 0,
        title: "Stability",
        subtitle: "Intelligence",
        score: 85,
        description: "Turning your spending data into clear consumer insights, enabling smarter decisions and more intelligent outcomes.",
        iconPath1: "M12 2L2 7l10 5 10-5-10-5z",
        iconPath2: "M2 17l10 5 10-5",
        iconPath3: "M2 12l10 5 10-5"
    },
    {
        id: 1,
        title: "Intelligence",
        subtitle: "Intelligence",
        score: 85,
        description: "Turning your spending data into clear consumer insights, enabling smarter decisions and more intelligent outcomes.",
        isBrainIcon: true
    },
    {
        id: 2,
        title: "Discipline",
        subtitle: "Discipline",
        score: 75,
        description: "Assesses your consistency in managing finances and following through with your financial goals.",
        iconPath1: "M22 11.08V12a10 10 0 1 1-5.93-9.14",
        iconPath2: "M22 4L12 14.01l-3-3" // approximated polyline
    }
];

export default function AlaizaEducation() {
    const [screen, setScreen] = useState<EducationScreen>("summary");
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
    const [selectedTip, setSelectedTip] = useState<string | null>(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState("1W");

    // Animation state for ring
    const [ringOffset, setRingOffset] = useState(0);

    const themeColor = "#004492";

    useEffect(() => {
        // Trigger ring animation on mount
        setTimeout(() => {
            const circumference = 2 * Math.PI * 92;
            const offset = circumference - (feConfig.zelifyScore / 100) * circumference;
            setRingOffset(offset);
        }, 300);
    }, []);

    // --- Components ---

    const ScoreRing = () => {
        const radius = 92;
        const circumference = 2 * Math.PI * radius;

        return (
            <div className="flex justify-center pt-8 pb-2 shrink-0">
                <div className="relative flex items-center justify-center w-[210px] h-[210px]">
                    <svg width="210" height="210" className="transform -rotate-90">
                        <defs>
                            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#004492" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>
                        {/* Background Circle */}
                        <circle cx="105" cy="105" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
                        {/* Progress Circle */}
                        <circle
                            cx="105"
                            cy="105"
                            r={radius}
                            fill="none"
                            stroke="url(#score-gradient)"
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={ringOffset === 0 ? circumference : ringOffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 -translate-y-4">
                        <div className="mb-1 h-7 w-20 relative flex items-center justify-center">
                            <img src="/images/zelify_logo.png" alt="Zelify" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="mb-0.5 flex items-baseline justify-center">
                            <span className="text-6xl font-bold leading-none tracking-tight text-[#004492]">{feConfig.zelifyScore}</span>
                            <span className="text-3xl font-bold leading-none text-[#004492]">%</span>
                        </div>
                        <div className="mb-2 text-xs font-light tracking-wide text-[#004492] opacity-80">
                            Your Zelify Score
                        </div>
                        <div className="h-1 w-20 overflow-hidden rounded-full bg-gray-200">
                            <div className="h-full rounded-full bg-[#10B981] w-[75%] transition-all duration-1000 ease-out"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const PyramidCarousel = () => {
        const itemsCount = 3;
        const activeCardHeight = 88;
        const inactiveCardHeight = 55;
        const overlapPercentage = 0.3;
        const visiblePart = Math.round(inactiveCardHeight * (1 - overlapPercentage));
        const overlapAmount = inactiveCardHeight - visiblePart;

        const containerHeight = itemsCount * 75;

        // Render card logic based on Astro JS logic
        const renderCard = (index: number) => {
            const item = pyramidItems[index];
            const isActive = activeCarouselIndex === index;
            const currentActive = activeCarouselIndex;

            let topOffset = 0;
            let centerY = (containerHeight - activeCardHeight) / 2;

            if (currentActive === 0) {
                centerY = (containerHeight - activeCardHeight) / 2 - 20;
            }

            if (isActive) {
                topOffset = centerY;
            } else if (index < currentActive) {
                const cardsAbove = currentActive - index;
                topOffset = centerY - visiblePart * cardsAbove;
            } else {
                const cardsBelow = index - currentActive;
                if (currentActive === 0) {
                    if (cardsBelow === 1) {
                        const visiblePart1to2 = Math.round(inactiveCardHeight * (1 - overlapPercentage));
                        const overlapAmount1to2 = inactiveCardHeight - visiblePart1to2;
                        topOffset = centerY + activeCardHeight - overlapAmount1to2;
                    } else if (cardsBelow === 2) {
                        // ... logic simplified for React render
                        const visiblePart1to2 = Math.round(inactiveCardHeight * (1 - overlapPercentage));
                        const overlapAmount1to2 = inactiveCardHeight - visiblePart1to2;
                        const secondTop = centerY + activeCardHeight - overlapAmount1to2;
                        const visiblePart2to3 = Math.round(inactiveCardHeight * (1 - overlapPercentage));
                        const overlapAmount2to3 = inactiveCardHeight - visiblePart2to3;
                        topOffset = secondTop + inactiveCardHeight - overlapAmount2to3;
                    }
                } else {
                    topOffset = centerY + activeCardHeight - overlapAmount * cardsBelow;
                }
            }

            // Z-Index Logic
            let zIndex = 10;
            if (isActive) {
                zIndex = 30;
            } else {
                if (currentActive === 0) {
                    zIndex = 20 - index;
                } else if (currentActive === 1) {
                    zIndex = index === 0 || index === 2 ? 15 : 30;
                } else if (currentActive === 2) {
                    zIndex = 20 + index;
                }
            }

            const cardStyle: React.CSSProperties = {
                top: `${topOffset}px`,
                height: isActive ? `${activeCardHeight}px` : `${inactiveCardHeight}px`,
                zIndex: zIndex,
                borderRadius: isActive ? '18px' : '12px',
                padding: isActive ? '11px' : '8px 8px 5px 8px',
                backgroundColor: isActive ? '#FFFFFF' : '#F3F4F6',
                border: '1px solid #E5E7EB',
                boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
                position: 'absolute',
                left: 0,
                right: 0,
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                overflow: 'hidden'
            };

            return (
                <div key={item.id} style={cardStyle} onClick={() => setActiveCarouselIndex(index)}>
                    {/* Icon */}
                    <div className="flex shrink-0 items-start justify-center transition-colors"
                        style={{
                            width: isActive ? '36px' : '28px',
                            height: isActive ? '36px' : '28px',
                            color: isActive ? '#004492' : '#6B7280',
                            paddingTop: isActive ? '1px' : '0px'
                        }}
                    >
                        {item.isBrainIcon ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ transform: isActive ? 'scale(0.8)' : 'scale(0.7)' }}>
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.69 3.32 1.81 4.48C5.5 14.5 4 16.14 4 18.22V20c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1.78c0-2.08-1.5-3.72-3.81-4.74C18.31 12.32 19 10.74 19 9c0-3.87-3.13-7-7-7z"></path>
                                <circle cx="9" cy="9" r="1.5"></circle>
                                <circle cx="15" cy="9" r="1.5"></circle>
                                <path d="M12 13.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isActive ? 'scale(0.8)' : 'scale(0.7)' }}>
                                {item.iconPath1 && <path d={item.iconPath1}></path>}
                                {item.iconPath2 && item.title === "Stability" ? (
                                    <>
                                        <path d="M2 17l10 5 10-5"></path>
                                        <path d="M2 12l10 5 10-5"></path>
                                    </>
                                ) : (
                                    item.iconPath2 && <path d="M22 4l-10 10.01l-3-3"></path> // Polyline replacement
                                )}
                            </svg>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        {isActive ? (
                            <div className="animate-fade-in">
                                <div className="mb-1 flex items-baseline gap-1.5">
                                    <h3 className="text-[11px] font-semibold leading-tight text-gray-900">{item.title}</h3>
                                    <span className="text-xs font-bold text-gray-900">{item.score}%</span>
                                </div>
                                <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${item.score}%` }}></div>
                                </div>
                                <p className="text-[9px] leading-snug text-gray-700 block">{item.description}</p>
                            </div>
                        ) : (
                            <div className="block">
                                <p className="text-xs font-medium leading-tight text-gray-700">{item.title}</p>
                                <p className="mt-0.5 text-[10px] text-gray-500">{item.subtitle} {item.score}%</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        return (
            <div className="relative w-full flex-1 mt-2 mx-4 max-w-[90%]" style={{ height: `${containerHeight}px` }}>
                {pyramidItems.map((_, i) => renderCard(i))}
            </div>
        );
    };

    // --- Screen Renders ---

    const renderSummary = () => (
        <div className="flex-1 flex flex-col items-center overflow-hidden">
            <ScoreRing />
            <PyramidCarousel />

            {/* Action Pills */}
            <div className="flex-shrink-0 w-full border-t border-gray-200 bg-white px-6 py-4 space-y-4 mt-auto">
                <div className="flex justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[{ key: "streak", label: "Streak" }, { key: "graph", label: "Graph" }, { key: "rewards", label: "Rewards" }, { key: "learn", label: "Learn" }].map((btn) => (
                        <button key={btn.key} onClick={() => setScreen(btn.key as EducationScreen)}
                            className="flex-1 min-w-[70px] h-10 flex items-center justify-center rounded-full text-[11px] font-semibold text-white transition-all active:scale-95 whitespace-nowrap px-3 shadow-sm hover:opacity-90"
                            style={{ background: `linear-gradient(to bottom, rgba(0, 68, 146, 0.95) 0%, #004492 50%, rgba(0, 51, 102, 0.95) 100%)` }}>
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Score System Button - Placeholder Action */}
                <button className="w-full bg-[#001529] hover:bg-[#002244] text-white font-medium py-3.5 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-[0.98]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-1 opacity-50">
                        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="text-sm">Score System</span>
                </button>
            </div>
        </div>
    );

    const renderStreak = () => {
        const progressPercent = (feConfig.goalProgress.current / feConfig.goalProgress.target) * 100;
        const remainingDays = feConfig.goalProgress.target - feConfig.goalProgress.current;
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        return (
            <div className="flex h-full flex-col bg-white overflow-y-auto min-h-0">
                <div className="flex-shrink-0 px-6 pt-4">
                    <button onClick={() => setScreen("summary")} className="mb-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">← back</button>
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{feConfig.streakDays} <span className="text-lg text-gray-600">days streak</span></h1>
                        <p className="text-sm text-gray-400">Streak Started: {feConfig.streakStartDate}</p>
                    </div>
                </div>
                <div className="flex-1 px-6 space-y-8 min-h-0 pb-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 ml-1">This Week</h3>
                        <div className="flex gap-2">
                            {days.map((day, index) => (
                                <div key={day} className="flex-1 flex flex-col gap-1 items-center">
                                    <div className={`w-full h-12 rounded-lg flex items-center justify-center text-xs font-semibold shadow-sm transition-all ${feConfig.weeklyProgress[index] ? "bg-[#10B981] text-white" : "bg-gray-100 text-gray-400"}`}>
                                        {day.charAt(0)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-3 px-1">
                            <span className="text-gray-700 font-medium">{remainingDays} days left</span>
                            <span className="text-gray-400 text-xs mt-0.5">To unlock reward</span>
                        </div>
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, ${themeColor}, #10B981)` }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGraph = () => (
        <div className="flex h-full flex-col bg-white overflow-y-auto min-h-0">
            <div className="flex-shrink-0 px-6 pt-4">
                <button onClick={() => setScreen("summary")} className="mb-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">← back</button>
                <div className="flex justify-between items-end mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Today</h1>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Spent</p>
                        <p className="text-xl font-bold text-gray-900">$142.50</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-6 space-y-6 min-h-0 pb-6">
                {/* Timeframe Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {["24H", "1W", "1M", "3M", "6M", "1Y", "All"].map((tf) => (
                        <button key={tf} onClick={() => setSelectedTimeframe(tf)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedTimeframe === tf ? "bg-[#004492] text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {tf}
                        </button>
                    ))}
                </div>

                {/* Graph Placeholder */}
                <div className="h-56 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center border border-blue-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Animated bars */}
                    <div className="flex items-end gap-3 h-full pb-8 px-8 w-full justify-between z-10">
                        {[40, 70, 30, 85, 50, 65, 45].map((h, i) => (
                            <div key={i} className="w-full bg-[#3B82F6] rounded-t-sm opacity-20 group-hover:opacity-100 transition-all duration-500" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>

                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold text-blue-800 shadow-sm border border-blue-100">
                        +12% vs last week
                    </div>
                </div>

                <div className="original-stats grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                        <div className="text-[10px] uppercase text-blue-400 font-bold mb-1">Increasing</div>
                        <div className="text-xl font-bold text-blue-900">{feConfig.increasingPercent}%</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-2xl text-center border border-red-100">
                        <div className="text-[10px] uppercase text-red-400 font-bold mb-1">Spending</div>
                        <div className="text-xl font-bold text-red-900">{feConfig.spendingPercent}%</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                        <div className="text-[10px] uppercase text-green-400 font-bold mb-1">Savings</div>
                        <div className="text-xl font-bold text-green-900">{feConfig.savingsPercent}%</div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Simple placeholder for other screens to save space as Summary/Streak/Graph covers diverse UI
    const renderLearn = () => (
        <div className="flex h-full flex-col bg-white">
            <div className="flex-shrink-0 px-6 pt-4">
                <button onClick={() => setScreen("summary")} className="mb-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">← back</button>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Learn center</h1>
            </div>
            <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-6">
                {feConfig.tips.map(tip => (
                    <div key={tip.id} className="relative h-40 rounded-2xl overflow-hidden shadow-md group cursor-pointer">
                        <img src={tip.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                            <span className="text-white font-bold text-sm leading-tight">{tip.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden font-sans text-gray-900">
            {screen === "summary" && renderSummary()}
            {screen === "streak" && renderStreak()}
            {screen === "graph" && renderGraph()}
            {/* Map 'rewards' button to learn for brevity or graph for now if no specific rewards design in astro file referenced (it wasn't fully detailed in main astro) */}
            {(screen === "learn" || screen === "rewards") && renderLearn()}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
}
