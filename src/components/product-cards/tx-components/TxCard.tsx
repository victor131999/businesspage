"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInternationalTransfersTranslations } from "./use-international-transfers-translations";
import { useCTAButtonAnimations } from "@/hooks/use-cta-button-animations";

import { LanguageProvider, useLanguage } from "@/contexts/language-context";

/* -- SlideToConfirm Component -- */
interface SlideToConfirmProps {
    onConfirm: () => void;
    gradientStyle: string;
    label: string;
    isComplete?: boolean;
    onComplete?: () => void;
}

function SlideToConfirm({ onConfirm, gradientStyle, label, isComplete = false, onComplete }: SlideToConfirmProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [slidePosition, setSlidePosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // Default theme color fallback
    const themeColor = "#3C50E0";

    useCTAButtonAnimations(themeColor);

    const handleMove = useCallback((clientX: number) => {
        if (!trackRef.current || isComplete) return;

        const rect = trackRef.current.getBoundingClientRect();
        const sliderWidth = sliderRef.current?.offsetWidth || 48;
        const maxPosition = rect.width - sliderWidth;
        const newPosition = Math.max(0, Math.min(clientX - rect.left, maxPosition));
        setSlidePosition(newPosition);

        // 80% threshold to confirm
        if (newPosition >= maxPosition * 0.8 && !isComplete) {
            setSlidePosition(maxPosition);
            setIsDragging(false);
            onComplete?.();
            setTimeout(() => {
                onConfirm();
            }, 300);
        }
    }, [onConfirm, onComplete, isComplete]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        handleMove(e.clientX);
    }, [handleMove]);

    const handleMouseMoveEvent = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        handleMove(e.clientX);
    }, [isDragging, handleMove]);

    const handleMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        if (trackRef.current && sliderRef.current) {
            const trackWidth = trackRef.current.offsetWidth;
            const sliderWidth = sliderRef.current.offsetWidth;
            const maxPosition = trackWidth - sliderWidth;
            const threshold = maxPosition * 0.8;

            if (slidePosition >= threshold) {
                onConfirm();
            }
            if (slidePosition < threshold) {
                setSlidePosition(0);
            }
        }
    }, [isDragging, slidePosition, onConfirm]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMoveEvent);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchmove", handleMouseMoveEvent as any);
            document.addEventListener("touchend", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMoveEvent);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("touchmove", handleMouseMoveEvent as any);
                document.removeEventListener("touchend", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMoveEvent, handleMouseUp]);

    // Demo hook to control slider externally
    useEffect(() => {
        const handleDemoSlide = (e: CustomEvent) => {
            const progress = e.detail.progress; // 0 to 1
            if (trackRef.current && sliderRef.current && !isComplete) {
                const rect = trackRef.current.getBoundingClientRect();
                const sliderWidth = sliderRef.current.offsetWidth;
                const maxPosition = rect.width - sliderWidth;
                setSlidePosition(maxPosition * progress);
            }
        };

        window.addEventListener('zelify:demo-slide', handleDemoSlide as EventListener);
        return () => window.removeEventListener('zelify:demo-slide', handleDemoSlide as EventListener);
    }, [isComplete]);

    return (
        <div
            ref={trackRef}
            className="group relative w-full h-14 rounded-full overflow-hidden select-none"
            style={{
                background: gradientStyle,
                boxShadow: `0 4px 14px 0 ${themeColor}40`,
                animation: 'cta-pulse-glow 2s ease-in-out infinite, cta-button-pulse 2.5s ease-in-out infinite',
            }}
        >
            <span className="absolute inset-0 rounded-full opacity-60 blur-md -z-10" style={{ background: themeColor, animation: 'cta-pulse-ring 2s ease-in-out infinite' }}></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -z-10" style={{ animation: 'cta-shine-sweep 2.5s linear infinite' }}></span>
            <span className="absolute inset-0 rounded-full -z-10" style={{ background: `radial-gradient(circle at center, ${themeColor}20 0%, transparent 70%)`, animation: 'cta-glow-pulse 2s ease-in-out infinite' }}></span>

            <div
                ref={sliderRef}
                className="absolute left-0 top-0 h-full w-12 bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-20"
                style={{
                    transform: `translateX(${slidePosition}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                    const touch = e.touches[0];
                    if (touch) handleMove(touch.clientX);
                }}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: themeColor, animation: 'cta-bounce-arrow 1.2s ease-in-out infinite' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            {!isComplete && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <span className="text-white text-sm font-medium ml-14" style={{ animation: 'cta-glow-pulse 2s ease-in-out infinite' }}>
                        {label}
                    </span>
                </div>
            )}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>
        </div>
    );
}

/* -- Main Component -- */
function TxCardContent({ isDemoEnabled = true }: { isDemoEnabled?: boolean }) {
    // Hooks
    const translations = useInternationalTransfersTranslations();
    const { language } = useLanguage();

    // State
    const [currentScreen, setCurrentScreen] = useState<"amount" | "currency-selector" | "contacts" | "summary" | "processing" | "success">("amount");
    const [amount, setAmount] = useState("0.00");
    const [currency, setCurrency] = useState("MXN");
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [selectedContactData, setSelectedContactData] = useState<any | null>(null);
    const [hoveredContact, setHoveredContact] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isSliderComplete, setIsSliderComplete] = useState(false);
    const [isTransactionDetailsExpanded, setIsTransactionDetailsExpanded] = useState(false);
    const [isRecentTransfersExpanded, setIsRecentTransfersExpanded] = useState(false);

    // Theme Colors
    const themeColor = "#004492"; // Default Blue
    const darkThemeColor = "#002a5c";
    const almostBlackColor = "#001126";
    const blackColor = "#000000";
    const gradientStyle = `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`;
    const darkenedTitleColor = "#003b80";

    // Demo Refs
    const isRunningRef = useRef(false);
    const abortDemo = useRef(false);

    // Config constants
    const BLUR_INTENSITY = 4;
    const BACKGROUND_OPACITY = 5;
    const CARD_HEIGHT = 420;
    const TRANSACTION_DETAILS_HEIGHT_COLLAPSED = 60;
    const TRANSACTION_DETAILS_OPACITY_EXPANDED = 100;

    // Contacts Data
    const contacts = [
        { id: "1", name: "Valentina Duarte", alias: "@JP", bank: "Chase - USA", initials: "VD" },
        { id: "2", name: "Carlos Mendoza", alias: "@CM", bank: "BBVA - México", initials: "CM" },
        { id: "3", name: "Sofia Rodriguez", alias: "@SR", bank: "Santander - España", initials: "SR" },
        { id: "4", name: "Luis Hernandez", alias: "@LH", bank: "Bank of America - USA", initials: "LH" },
        { id: "5", name: "Ana Martinez", alias: "@AM", bank: "HSBC - UK", initials: "AM" },
        { id: "6", name: "Diego Fernandez", alias: "@DF", bank: "Banco de Chile", initials: "DF" },
    ];

    const recentTransfers = [
        { id: "1", name: "Lucía Gómez", date: "12-10-2025", amount: 1250.00, status: "completed" },
        { id: "2", name: "Mateo Rivas", date: "11-10-2025", amount: 850.00, status: "pending" },
        { id: "3", name: "Lucía Gómez", date: "12-10-2025", amount: 1250.00, status: "completed" },
    ];

    const numberLocale = language === "en" ? "en-US" : "es-MX";
    const formatAmount = (val: number) =>
        new Intl.NumberFormat(numberLocale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val);

    // Helper: Wait
    const wait = (ms: number) => new Promise<void>((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            if (abortDemo.current) {
                reject(new Error("Demo aborted"));
                return;
            }
            if (Date.now() - start >= ms) {
                resolve();
            } else {
                requestAnimationFrame(check);
            }
        };
        requestAnimationFrame(check);
    });

    // Handle Processing Progress
    useEffect(() => {
        if (currentScreen === "processing") {
            setLoadingProgress(0);
            const interval = setInterval(() => {
                setLoadingProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setCurrentScreen("success"), 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 60);
            return () => clearInterval(interval);
        }
    }, [currentScreen]);

    // DEMO LOGIC
    const handlePlayDemo = async () => {
        if (!isDemoEnabled || isRunningRef.current) return;
        isRunningRef.current = true;
        abortDemo.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        try {
            while (isRunningRef.current && !abortDemo.current) {
                // Reset State
                setCurrentScreen("amount");
                setAmount("0.00");
                setSelectedContact(null);
                setSelectedContactData(null);
                setIsSliderComplete(false);
                setIsTransactionDetailsExpanded(false);
                setIsRecentTransfersExpanded(false);

                await wait(1000);

                // 1. Type Amount
                setAmount("500");
                await wait(500);
                setAmount("500.00");
                await wait(1500);

                // 2. Select Contact (User clicks "Contacts" or "next")
                // Simulate navigation to Contacts directly for demo purposes
                if (abortDemo.current) break;
                setCurrentScreen("currency-selector"); // Note: In original code "currency-selector" renders the contacts list for some reason, keeping logic consistent
                await wait(1500);

                // 3. Select a specific contact
                if (abortDemo.current) break;
                const demoContact = contacts[0];
                setSelectedContact(demoContact.id);
                // Simulate hover effect
                setHoveredContact(demoContact.id);
                await wait(800);
                if (abortDemo.current) break;

                setSelectedContactData(demoContact);
                setCurrentScreen("summary");
                setHoveredContact(null);
                await wait(1500);

                if (abortDemo.current) break;

                // 4. Slide to Confirm
                // We dispatch event to the internal slider component to animate it
                for (let i = 0; i <= 1; i += 0.05) {
                    if (abortDemo.current) break;
                    window.dispatchEvent(new CustomEvent('zelify:demo-slide', { detail: { progress: i } }));
                    await wait(50);
                }
                if (abortDemo.current) break;
                setIsSliderComplete(true);
                await wait(300);

                // 5. Processing triggers automatically in useEffect when isSliderComplete calls onConfirm
                // But we manually set it here to be safe/explicit or wait for the callback
                setCurrentScreen("processing");

                // Wait for processing to finish (approx 3s)
                await wait(3500);

                // 6. Success Screen
                if (abortDemo.current) break;
                // Wait on success screen
                await wait(4000);
            }
        } catch (e) {
            // Aborted
        } finally {
            isRunningRef.current = false;
        }
    };

    const handleStopDemo = () => {
        abortDemo.current = true;
        isRunningRef.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-end'));
    };

    useEffect(() => {
        window.addEventListener('zelify:play-demo:tx', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:tx', handleStopDemo);
        return () => {
            window.removeEventListener('zelify:play-demo:tx', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:tx', handleStopDemo);
        };
    }, [isDemoEnabled]);


    // RENDER SCREENS
    const renderContent = () => {
        return (
            <div className="relative flex h-full flex-col bg-white overflow-hidden">
                {/* Header with Back Button & Logo */}
                <div className="relative flex items-center px-6 pt-4 pb-2 z-30">
                    {currentScreen !== "amount" && currentScreen !== "processing" && currentScreen !== "success" && (
                        <button
                            onClick={() => {
                                if (currentScreen === "contacts" || currentScreen === "currency-selector") setCurrentScreen("amount");
                                else if (currentScreen === "summary") { setCurrentScreen("currency-selector"); setIsSliderComplete(false); }
                            }}
                            className="flex items-center text-sm font-medium text-slate-900 -ml-2 z-30 relative"
                        >
                            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>{translations.preview.header.back}</span>
                        </button>
                    )}
                </div>

                <div className="relative -mb-12 flex-shrink-0 z-0 flex justify-center mt-8">
                    <img
                        src="https://flowchart-diagrams-zelify.s3.us-east-1.amazonaws.com/background_videos/animation1.gif"
                        alt="Identity Animation"
                        className="h-44 w-44 object-contain opacity-90 mix-blend-multiply"
                    />
                </div>

                {/*SCREEN: AMOUNT*/}
                {currentScreen === "amount" && (
                    <div
                        className="absolute bottom-0 left-0 right-0 rounded-t-3xl flex flex-col transition-all duration-300 z-10"
                        style={{
                            height: isRecentTransfersExpanded ? '100%' : `${CARD_HEIGHT}px`,
                            backdropFilter: `blur(${BLUR_INTENSITY}px)`,
                            backgroundColor: isRecentTransfersExpanded ? `rgba(255, 255, 255, 1)` : `rgba(255, 255, 255, ${BACKGROUND_OPACITY / 100})`,
                        }}
                    >
                        {!isRecentTransfersExpanded && (
                            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
                                <div className="mb-4">
                                    <h1 className="text-lg leading-tight whitespace-nowrap" style={{ color: darkenedTitleColor }}>
                                        <span className="font-normal">{translations.preview.header.titleRegular}</span>{" "}
                                        <span className="font-bold">{translations.preview.header.titleBold}</span>
                                    </h1>
                                </div>
                                <p className="text-base text-black mb-1">{translations.preview.amount.title}</p>
                                <p className="text-sm text-slate-600 mb-4">{translations.preview.amount.subtitle}</p>

                                <label className="block text-sm font-medium text-black mb-2">{translations.preview.amount.amountLabel}</label>

                                <div className="relative rounded-xl bg-gray-200 px-4 py-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={amount}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/[^0-9.]/g, '');
                                                if (val.split('.').length > 2) val = val.replace(/\.+$/, "");
                                                setAmount(val);
                                            }}
                                            onBlur={() => { if (!amount || amount === '.') setAmount("0.00"); else setAmount(parseFloat(amount).toFixed(2)); }}
                                            placeholder="0.00"
                                            className="text-2xl font-semibold text-slate-900 bg-transparent border-none outline-none w-full max-w-[60%]"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="px-4 py-2 rounded-full text-white text-sm font-medium" style={{ background: gradientStyle }}>{currency}</div>
                                            <button onClick={() => setCurrentScreen("currency-selector")} className="flex items-center">
                                                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* HISTORY EXPANSION LOGIC not implemented yet
                        {isRecentTransfersExpanded && (
                            <div className="flex-1 flex flex-col h-full bg-white">
                                <div className="flex-shrink-0 flex flex-col items-center justify-center px-6 pt-6 pb-4">
                                    <button onClick={() => setIsRecentTransfersExpanded(false)} className="flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <p className="text-xs text-slate-500 text-center mb-1">Historial</p>
                                    <h2 className="text-lg font-bold text-center" style={{ color: themeColor }}>{translations.preview.amount.historyTitle}</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto px-6 pb-4">
                                    <div className="space-y-3">
                                        {recentTransfers.map((tx) => (
                                            <div key={tx.id} className="rounded-xl bg-gray-100 px-4 py-3 flex items-center justify-between">
                                                <div><p className="text-sm font-semibold text-slate-900">{tx.name}</p><p className="text-xs text-slate-500 mt-0.5">{tx.date}</p></div>
                                                <div className="text-right"><p className="text-sm font-semibold text-slate-900">-{formatAmount(tx.amount)}</p><p className="text-xs text-slate-500 mt-0.5 capitalize">{tx.status}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )} */}

                        {!isRecentTransfersExpanded && (
                            <div className="flex-shrink-0" >
                                <div className="w-full px-6 py-3 flex items-end justify-center">
                                    <button onClick={() => setIsRecentTransfersExpanded(true)} className="w-[70%] max-w-[220px] rounded-t-2xl rounded-b-none text-white shadow-md flex flex-col items-center justify-center gap-0" style={{ background: gradientStyle }}>
                                        <svg className="w-5 h-5 text-white mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                        <span className="text-xs font-medium pb-2">{translations.preview.amount.historyTitle}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/*SCREEN: RECIPIENTS (Called currency-selector in logic)*/}
                {currentScreen === "currency-selector" && (
                    <div className="absolute inset-0 flex flex-col justify-start px-6 pt-16 pb-6 z-10">
                        <div className="px-6 text-center mb-4 z-20">
                            <h1 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>{translations.preview.recipients.tag}</h1>
                            <p className="text-sm text-slate-600">{translations.preview.recipients.title}</p>
                        </div>
                        <div className="w-full flex-1 rounded-3xl px-6 py-6 overflow-y-auto" style={{ backdropFilter: `blur(${BLUR_INTENSITY}px)`, backgroundColor: `rgba(255, 255, 255, ${BACKGROUND_OPACITY / 100})` }}>
                            <div className="space-y-2">
                                {contacts.map((contact) => {
                                    const isSelected = selectedContact === contact.id;
                                    const isHovered = hoveredContact === contact.id;
                                    const shouldShowGradient = isSelected || isHovered;
                                    return (
                                        <div
                                            key={contact.id}
                                            onClick={() => { setSelectedContact(contact.id); setSelectedContactData(contact); setCurrentScreen("summary"); }}
                                            onMouseEnter={() => setHoveredContact(contact.id)}
                                            onMouseLeave={() => setHoveredContact(null)}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${shouldShowGradient ? "text-white" : "bg-slate-200"}`}
                                            style={shouldShowGradient ? { background: gradientStyle } : {}}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 ${shouldShowGradient ? "bg-white" : ""}`} style={shouldShowGradient ? {} : { background: gradientStyle }}>
                                                <span className={shouldShowGradient ? "text-slate-900" : "text-white"}>{contact.initials}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold text-sm truncate ${shouldShowGradient ? "text-white" : ""}`} style={!shouldShowGradient ? { color: themeColor } : {}}>{contact.name}</p>
                                                <p className={`text-xs truncate ${shouldShowGradient ? "text-white/90" : "text-slate-600"}`}>{contact.alias} - {contact.bank}</p>
                                            </div>
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: shouldShowGradient ? "white" : themeColor }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/*SCREEN: SUMMARY*/}
                {currentScreen === "summary" && (
                    <div className="flex-1 flex items-center justify-center px-6 py-6 z-10 relative">
                        <div className="w-full rounded-3xl px-6 py-6" style={{ backdropFilter: `blur(${BLUR_INTENSITY}px)`, backgroundColor: `rgba(255, 255, 255, ${BACKGROUND_OPACITY / 100})` }}>
                            <div className="text-center mb-6">
                                <h1 className="text-lg font-bold mb-2 whitespace-nowrap" style={{ color: themeColor }}>{translations.preview.summary.title}</h1>
                                <p className="text-xs text-slate-600 whitespace-nowrap">{translations.preview.summary.subtitle}</p>
                            </div>
                            <div className="space-y-4 mb-6">
                                <div><p className="text-xs text-slate-500 mb-1">{translations.preview.summary.recipientLabel}</p><p className="text-base font-semibold text-slate-900">{selectedContactData?.name || ""}</p></div>
                                <div><p className="text-xs text-slate-500 mb-1">{translations.preview.summary.amountLabel}</p><p className="text-2xl font-bold text-slate-900">{parseFloat(amount || "0").toLocaleString(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</p></div>
                                <div className="space-y-2 pt-4 border-t border-slate-200">
                                    <div className="flex justify-between items-center"><p className="text-sm text-slate-500">{translations.preview.summary.youSend}</p><p className="text-sm font-semibold text-slate-900">{parseFloat(amount).toLocaleString(numberLocale, { minimumFractionDigits: 2 })} {currency}</p></div>
                                    <div className="flex justify-between items-center"><p className="text-sm text-slate-500">{translations.preview.summary.exchangeRate}</p><p className="text-sm font-semibold text-slate-900">1 {currency} = 0.0580 USD</p></div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-200"><p className="text-sm font-bold text-slate-900">{translations.preview.success.total}</p><p className="text-sm font-bold text-slate-900">${(parseFloat(amount) * 0.0580).toLocaleString(numberLocale, { minimumFractionDigits: 2 })} USD</p></div>
                                </div>
                            </div>
                            <SlideToConfirm
                                onConfirm={() => { setLoadingProgress(0); setCurrentScreen("processing"); }}
                                onComplete={() => setIsSliderComplete(true)}
                                gradientStyle={gradientStyle}
                                label={translations.preview.summary.slideToConfirm}
                                isComplete={isSliderComplete}
                            />
                        </div>
                    </div>
                )}

                {/*SCREEN: PROCESSING SUCCESS*/}
                {(currentScreen === "processing" || currentScreen === "success") && (

                    <div
                        className="relative rounded-3xl flex flex-col items-center justify-center overflow-hidden z-20"
                        style={{
                            marginTop: '20px',
                            marginLeft: '10px',
                            marginRight: '10px',
                            marginBottom: '80px',
                            width: 'calc(100% - 20px)',
                            height: 'calc(100% - 10px)',
                            boxSizing: 'border-box',
                            padding: '40px 20px',
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: '#f3f4f6',
                        }}
                    >
                        {/* 1. LAYER BOTTOM (Gray BG, Blue Text) - Only distinct in 'processing' phase */}
                        {currentScreen === "processing" && (
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <h2 className="text-xl font-bold">{translations.preview.processing.title}</h2>
                                <p className="text-sm opacity-90 text-[#3C50E0]">{translations.preview.processing.subtitle}</p>
                                <div className="w-64 bg-gray-300 rounded-full h-2 overflow-hidden mt-4">
                                    <div className="h-full bg-[#3C50E0] transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
                                </div>
                            </div>
                        )}


                        {/* 2. LAYER TOP (Blue BG #004492, White Text) - Expands via clip-path */}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white overflow-hidden transition-all duration-75"
                            style={{
                                background: 'linear-gradient(90deg, #004492 0%, #000000 100%)',
                                maskImage: currentScreen === "success" ? 'none' : `linear-gradient(to right, 
                                    rgba(0,0,0,1) 0%, 
                                    rgba(0,0,0,1) ${Math.max(0, loadingProgress - 20)}%, 
                                    rgba(0,0,0,0.9) ${Math.max(0, loadingProgress - 15)}%, 
                                    rgba(0,0,0,0.6) ${Math.max(0, loadingProgress - 10)}%, 
                                    rgba(0,0,0,0.3) ${Math.max(0, loadingProgress - 5)}%, 
                                    rgba(0,0,0,0) ${loadingProgress}%, 
                                    rgba(0,0,0,0) 100%
                                )`,
                                WebkitMaskImage: currentScreen === "success" ? 'none' : `linear-gradient(to right, 
                                    rgba(0,0,0,1) 0%, 
                                    rgba(0,0,0,1) ${Math.max(0, loadingProgress - 20)}%, 
                                    rgba(0,0,0,0.9) ${Math.max(0, loadingProgress - 15)}%, 
                                    rgba(0,0,0,0.6) ${Math.max(0, loadingProgress - 10)}%, 
                                    rgba(0,0,0,0.3) ${Math.max(0, loadingProgress - 5)}%, 
                                    rgba(0,0,0,0) ${loadingProgress}%, 
                                    rgba(0,0,0,0) 100%
                                )`,
                            }}
                        >
                            {/* CONTENT IN WHITE LAYER */}
                            {currentScreen === "processing" && (
                                <div className="flex flex-col items-center justify-center text-center space-y-4 min-w-[300px]">
                                    <h2 className="text-xl font-bold">{translations.preview.processing.title}</h2>
                                    <p className="text-sm opacity-90">{translations.preview.processing.subtitle}</p>
                                    <div className="w-64 bg-white/30 rounded-full h-2 overflow-hidden mt-4">
                                        <div className="h-full bg-white transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
                                    </div>
                                </div>
                            )}

                            {currentScreen === "success" && (
                                <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                                    <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" style={{ transform: 'rotate(-2deg)' }} />
                                    </svg>
                                    <h2 className="text-3xl font-bold leading-tight">{translations.preview.success.title}</h2>
                                    <p className="text-base opacity-90">{translations.preview.success.subtitle}</p>
                                </div>
                            )}

                            {/* TRANSACTION DETAILS (SUCCESS ONLY) */}
                            {currentScreen === "success" && (
                                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden z-30 transition-all duration-300 text-white" style={{ maxHeight: isTransactionDetailsExpanded ? '80%' : '60px', bottom: '20px' }}>
                                    {!isTransactionDetailsExpanded && (
                                        <button onClick={() => setIsTransactionDetailsExpanded(true)} className="w-full h-full flex items-center justify-center py-4 font-semibold gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                            {translations.preview.success.transactionDetails}
                                        </button>
                                    )}
                                    {isTransactionDetailsExpanded && (
                                        <div className="p-6 bg-white text-slate-900 h-full overflow-y-auto">
                                            <button onClick={() => setIsTransactionDetailsExpanded(false)} className="w-full flex justify-center mb-4"><svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                                            <h3 className="text-center font-bold mb-6">{translations.preview.success.transactionDetails}</h3>
                                            <div className="space-y-4 text-sm">
                                                <div><p className="text-slate-500 text-xs">{translations.preview.success.recipient}</p><p className="font-semibold">{selectedContactData?.name}</p></div>
                                                <div><p className="text-slate-500 text-xs">{translations.preview.success.amount}</p><p className="font-semibold">$100.00 USD</p></div>
                                                <div><p className="text-slate-500 text-xs">{translations.preview.success.total}</p><p className="font-bold">$110.00 USD</p></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 3. EDGE GLOW EFFECT */}
                        {currentScreen === "processing" && (
                            <div
                                className="absolute top-0 bottom-0 w-16 bg-white blur-lg z-30 pointer-events-none transition-all duration-75"
                                style={{
                                    left: `${loadingProgress}%`,
                                    transform: 'translateX(-50%)',
                                    opacity: 0.8
                                }}
                            />
                        )}
                    </div>
                )
                }
            </div >
        );
    };

    return renderContent();
}

export default function TxCard(props: { isDemoEnabled?: boolean }) {
    return (
        <LanguageProvider>
            <TxCardContent {...props} />
        </LanguageProvider>
    );
}
