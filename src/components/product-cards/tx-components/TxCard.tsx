import { useState, useRef, useEffect } from "react";

/* -- Types -- */
type Screen = "amount" | "currency-selector" | "contacts" | "summary" | "processing" | "success";

interface Contact {
    id: string;
    name: string;
    alias: string;
    bank: string;
    initials: string;
}

/* -- Main Component -- */
export default function TxCard() {
    // State
    const [currentScreen, setCurrentScreen] = useState<Screen>("amount");
    const [amount, setAmount] = useState("0.00");
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [selectedContactData, setSelectedContactData] = useState<Contact | null>(null);
    const [hoveredContact, setHoveredContact] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isSliderComplete, setIsSliderComplete] = useState(false);
    const [slidePosition, setSlidePosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isTransactionDetailsExpanded, setIsTransactionDetailsExpanded] = useState(false);
    const [isRecentTransfersExpanded, setIsRecentTransfersExpanded] = useState(false);
    const [currency, setCurrency] = useState("MXN");

    // Theme
    const themeColor = "#004492";
    const darkThemeColor = "#002a5c";
    const almostBlackColor = "#001126";
    const blackColor = "#000000";

    // Helper: Convert hex to RGB
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : null;
    };

    const themeRgb = hexToRgb(themeColor) || "0, 68, 146";
    const darkThemeRgb = hexToRgb(darkThemeColor) || "0, 42, 92";
    const almostBlackRgb = hexToRgb(almostBlackColor) || "0, 17, 38";

    const gradientStyle = `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`;

    // Demo Refs
    const isRunningRef = useRef(false);
    const abortDemo = useRef(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // Contacts data
    const contacts: Contact[] = [
        { id: "1", name: "Valentina Duarte", alias: "@JP", bank: "Chase - USA", initials: "VD" },
        { id: "2", name: "Carlos Mendoza", alias: "@CM", bank: "BBVA - México", initials: "CM" },
        { id: "3", name: "Sofia Rodriguez", alias: "@SR", bank: "Santander - España", initials: "SR" },
        { id: "4", name: "Luis Hernandez", alias: "@LH", bank: "Bank of America - USA", initials: "LH" },
    ];

    // Constants
    const BLUR_INTENSITY = 20;
    const BACKGROUND_OPACITY = 85;
    const CARD_HEIGHT = 280;

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

    // Start loading progress
    const startLoadingProgress = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        setLoadingProgress(0);
        const duration = 3000;
        const interval = 30;
        const increment = 100 / (duration / interval);

        progressIntervalRef.current = setInterval(() => {
            setLoadingProgress((prev) => {
                const newProgress = prev + increment;
                if (newProgress >= 100) {
                    if (progressIntervalRef.current) {
                        clearInterval(progressIntervalRef.current);
                        progressIntervalRef.current = null;
                    }
                    return 100;
                }
                return newProgress;
            });
        }, interval);
    };

    // Slide handlers
    const handleSlideMove = (clientX: number) => {
        if (!trackRef.current || isSliderComplete) return;
        const rect = trackRef.current.getBoundingClientRect();
        const sliderWidth = sliderRef.current?.offsetWidth || 48;
        const maxPosition = rect.width - sliderWidth;
        const newPosition = Math.max(0, Math.min(clientX - rect.left, maxPosition));
        setSlidePosition(newPosition);
        if (newPosition >= maxPosition * 0.8 && !isSliderComplete) {
            setSlidePosition(maxPosition);
            setIsDragging(false);
            setIsSliderComplete(true);
            setTimeout(() => {
                setLoadingProgress(0);
                setCurrentScreen("processing");
                startLoadingProgress();
            }, 300);
        }
    };

    const handleSlideEnd = () => {
        setIsDragging(false);
        if (trackRef.current && sliderRef.current) {
            const trackWidth = trackRef.current.offsetWidth;
            const sliderWidth = sliderRef.current.offsetWidth;
            const maxPosition = trackWidth - sliderWidth;
            const threshold = maxPosition * 0.8;
            if (slidePosition < threshold) {
                setSlidePosition(0);
            }
        }
    };

    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e: MouseEvent) => {
                handleSlideMove(e.clientX);
            };
            const handleMouseUp = () => {
                handleSlideEnd();
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, slidePosition]);

    // Demo flow
    const handlePlayDemo = async () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        abortDemo.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        try {
            while (isRunningRef.current && !abortDemo.current) {
                // Reset to initial state
                setCurrentScreen("amount");
                setAmount("0.00");
                setSelectedContact(null);
                setSelectedContactData(null);
                setLoadingProgress(0);
                setIsSliderComplete(false);
                setSlidePosition(0);
                setIsDragging(false);
                setIsTransactionDetailsExpanded(false);
                setIsRecentTransfersExpanded(false);

                // 1. Amount screen
                await wait(1000);
                setAmount("500");
                await wait(1000);
                setAmount("500.00");
                await wait(1000);

                // 2. Navigate to contacts
                if (abortDemo.current) break;
                setCurrentScreen("currency-selector");
                await wait(1500);

                // 3. Select contact
                if (abortDemo.current) break;
                setSelectedContact("1");
                setSelectedContactData(contacts[0]);
                await wait(1000);

                // 4. Navigate to summary
                if (abortDemo.current) break;
                setCurrentScreen("summary");
                await wait(1500);

                // 5. Simulate slide
                for (let i = 0; i <= 100; i += 5) {
                    if (abortDemo.current) break;
                    await wait(30);
                    if (trackRef.current && sliderRef.current) {
                        const rect = trackRef.current.getBoundingClientRect();
                        const sliderWidth = sliderRef.current.offsetWidth;
                        const maxPosition = rect.width - sliderWidth;
                        setSlidePosition((maxPosition * i) / 100);
                    }
                }
                await wait(500);
                setIsSliderComplete(true);
                setCurrentScreen("processing");
                startLoadingProgress();
                await wait(3200);

                // 6. Navigate to success
                if (abortDemo.current) break;
                setCurrentScreen("success");
                await wait(3000); // Wait at end of loop
            }
        } catch (error) {
            // Demo was aborted
        } finally {
            isRunningRef.current = false;
            window.dispatchEvent(new CustomEvent('zelify:demo-end'));
        }
    };

    const handleStopDemo = () => {
        abortDemo.current = true;
        isRunningRef.current = false;
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        window.dispatchEvent(new CustomEvent('zelify:demo-end'));
    };

    // Event listeners
    useEffect(() => {
        window.addEventListener('zelify:play-demo:tx', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:tx', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:tx', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:tx', handleStopDemo);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, []);

    // Render Amount Screen
    const renderAmountScreen = () => {
        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                <div className="flex-1 flex flex-col overflow-y-auto" style={{ paddingBottom: isRecentTransfersExpanded ? '100%' : `${CARD_HEIGHT}px` }}>
                    {/* Header with logo */}
                    <div className="flex-shrink-0 px-6 pt-4 pb-2">
                        <div className="flex justify-center">
                            {/* <img
                                src="/images/zelify_logo.png"
                                alt="Logo"
                                className="h-8 w-auto object-contain"
                            /> */}
                        </div>
                    </div>

                    {/* GIF */}
                    <div className="px-6 pt-2 flex-shrink-0">
                        <img
                            src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                            alt="Animación"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 min-h-[20px]"></div>
                </div>

                {/* Card with blur at bottom */}
                <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-3xl flex flex-col transition-all duration-300 z-10"
                    style={{
                        height: isRecentTransfersExpanded ? '100%' : `${CARD_HEIGHT}px`,
                        backdropFilter: `blur(${BLUR_INTENSITY}px)`,
                        backgroundColor: `rgba(255, 255, 255, ${BACKGROUND_OPACITY / 100})`,
                    }}
                >
                    {!isRecentTransfersExpanded && (
                        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 min-h-0">
                            <div className="mb-4">
                                <h1 className="text-lg leading-tight">
                                    <span className="font-normal">Transferencias</span>{" "}
                                    <span className="font-bold">Internacionales</span>
                                </h1>
                            </div>

                            <p className="text-base text-black mb-1">
                                ¿Cuánto deseas transferir?
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                Selecciona la divisa según el país.
                            </p>

                            <label className="block text-sm font-medium text-black mb-2">
                                Monto
                            </label>

                            <div className="relative rounded-xl bg-gray-200 px-4 py-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={amount}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/[^0-9.]/g, '');
                                            const parts = value.split('.');
                                            if (parts.length > 2) {
                                                value = parts[0] + '.' + parts.slice(1).join('');
                                            }
                                            if (parts.length === 2 && parts[1].length > 2) {
                                                value = parts[0] + '.' + parts[1].substring(0, 2);
                                            }
                                            if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
                                                value = value.replace(/^0+/, '');
                                            }
                                            if (value === '' || value === '.') {
                                                setAmount('');
                                                return;
                                            }
                                            setAmount(value);
                                        }}
                                        onBlur={(e) => {
                                            let value = e.target.value;
                                            if (value === '' || value === '.') {
                                                setAmount('0.00');
                                            } else {
                                                const num = parseFloat(value);
                                                if (!isNaN(num)) {
                                                    setAmount(num.toFixed(2));
                                                } else {
                                                    setAmount('0.00');
                                                }
                                            }
                                        }}
                                        placeholder="0.00"
                                        className="text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none w-full max-w-[60%]"
                                    />
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="px-4 py-2 rounded-full text-white text-sm font-medium"
                                            style={{ background: gradientStyle }}
                                        >
                                            {currency}
                                        </div>
                                        <button
                                            onClick={() => setCurrentScreen("currency-selector")}
                                            className="flex items-center"
                                        >
                                            <svg
                                                className="w-5 h-5 text-gray-700"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render Currency Selector / Contacts Screen
    const renderCurrencySelectorScreen = () => {
        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                {/* GIF in background */}
                <div className="absolute inset-0 z-0 pt-2">
                    <img
                        src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                        alt="Animación"
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Content with blur */}
                <div className="flex-1 flex flex-col relative z-10 min-h-0">
                    <div className="flex-shrink-0 px-6 pt-4 pb-2 text-center">
                        <h1 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>
                            Contactos
                        </h1>
                        <p className="text-sm text-gray-600">
                            Selecciona el destinatario
                        </p>
                    </div>

                    <div
                        className="flex-1 rounded-3xl mx-6 mb-6 px-6 py-6 overflow-y-auto min-h-0"
                        style={{
                            backdropFilter: `blur(${BLUR_INTENSITY}px)`,
                            backgroundColor: `rgba(255, 255, 255, ${BACKGROUND_OPACITY / 100})`,
                        }}
                    >
                        <div className="space-y-2">
                            {contacts.map((contact) => {
                                const isSelected = selectedContact === contact.id;
                                const isHovered = hoveredContact === contact.id;
                                const shouldShowGradient = isSelected || isHovered;

                                return (
                                    <div
                                        key={contact.id}
                                        onClick={() => {
                                            setSelectedContact(contact.id);
                                            setSelectedContactData(contact);
                                            setCurrentScreen("summary");
                                        }}
                                        onMouseEnter={() => setHoveredContact(contact.id)}
                                        onMouseLeave={() => setHoveredContact(null)}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${shouldShowGradient ? "text-white" : "bg-gray-200"
                                            }`}
                                        style={shouldShowGradient ? { background: gradientStyle } : {}}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 ${shouldShowGradient ? "bg-white" : ""
                                                }`}
                                            style={shouldShowGradient ? {} : { background: gradientStyle }}
                                        >
                                            <span className={shouldShowGradient ? "text-gray-900" : "text-white"}>
                                                {contact.initials}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold text-sm truncate ${shouldShowGradient ? "text-white" : ""}`}
                                                style={!shouldShowGradient ? { color: themeColor } : {}}
                                            >
                                                {contact.name}
                                            </p>
                                            <p className={`text-xs truncate ${shouldShowGradient ? "text-white/90" : "text-gray-600"}`}>
                                                {contact.alias} - {contact.bank}
                                            </p>
                                        </div>
                                        <svg
                                            className="w-4 h-4 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            style={{ color: shouldShowGradient ? "white" : themeColor }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Summary Screen
    const renderSummaryScreen = () => {
        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                {/* GIF in background */}
                <div className="absolute inset-0 z-0 px-6 pt-2">
                    <img
                        src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                        alt="Animación"
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Content with blur */}
                <div className="flex-1 flex items-center justify-center px-6 py-6 z-10 relative">
                    <div
                        className="w-full rounded-3xl px-6 py-6"
                        style={{
                            backdropFilter: `blur(${BLUR_INTENSITY}px)`,
                            backgroundColor: `rgba(255, 255, 255, ${BACKGROUND_OPACITY / 100})`,
                        }}
                    >
                        <div className="text-center mb-6">
                            <h1 className="text-lg font-bold mb-2" style={{ color: themeColor }}>
                                Confirma la transferencia
                            </h1>
                            <p className="text-xs text-gray-600">
                                Revisa los detalles antes de enviar.
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Destinatario</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {selectedContactData?.name || ""}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Monto</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {parseFloat(amount || "0").toLocaleString("es-MX", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} {currency}
                                </p>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Envías</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {parseFloat(amount || "0").toLocaleString("es-MX", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })} {currency}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Tasa de cambio</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        1 {currency} = 0.0580 USD
                                    </p>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <p className="text-sm font-bold text-gray-900">Total</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        ${(parseFloat(amount || "0") * 0.0580).toLocaleString("es-MX", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })} USD
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Slider to confirm */}
                        <div
                            ref={trackRef}
                            className="group relative w-full h-14 rounded-full overflow-hidden select-none"
                            style={{
                                background: gradientStyle,
                                boxShadow: `0 4px 14px 0 ${themeColor}40`,
                            }}
                        >
                            <div
                                ref={sliderRef}
                                className="absolute left-0 top-0 h-full w-12 bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-20"
                                style={{
                                    transform: `translateX(${slidePosition}px)`,
                                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                    handleSlideMove(e.clientX);
                                }}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    style={{ color: themeColor }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            {!isSliderComplete && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <span className="text-white text-sm font-medium ml-14">
                                        Desliza para confirmar
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Processing Screen
    const renderProcessingScreen = () => {
        const isComplete = loadingProgress >= 100;

        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                <div
                    className="relative rounded-3xl flex flex-col items-center justify-center overflow-hidden mx-auto my-5"
                    style={{
                        width: 'calc(100% - 20px)',
                        height: 'calc(100% - 10px)',
                        boxSizing: 'border-box',
                        padding: '40px 20px',
                        position: 'relative',
                        backgroundColor: '#f3f4f6',
                    }}
                >
                    <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                            background: gradientStyle,
                            clipPath: (() => {
                                const progress = loadingProgress + 20;
                                let points = `0% 0%, `;
                                for (let i = 0; i <= 50; i++) {
                                    const y = (i / 50) * 100;
                                    const distanceFromCenter = Math.abs(y - 50) / 50;
                                    const delay = distanceFromCenter * 15;
                                    const adjustedProgress = Math.max(0, progress - delay);
                                    const wave = Math.sin((adjustedProgress / 100) * Math.PI * 5 + (y / 100) * Math.PI * 3) * 10;
                                    const x = adjustedProgress + (wave / 100) * 12;
                                    points += `${x}% ${y}%, `;
                                }
                                points += `0% 100%`;
                                return `polygon(${points})`;
                            })(),
                            transition: 'clip-path 0.05s linear',
                            maskImage: `linear-gradient(to right, 
                                rgba(0,0,0,1) 0%, 
                                rgba(0,0,0,1) ${Math.max(0, loadingProgress - 50)}%, 
                                rgba(0,0,0,0.9) ${Math.max(0, loadingProgress - 40)}%, 
                                rgba(0,0,0,0.6) ${Math.max(0, loadingProgress - 25)}%, 
                                rgba(0,0,0,0.3) ${Math.max(0, loadingProgress - 15)}%, 
                                rgba(0,0,0,0) ${loadingProgress}%, 
                                rgba(0,0,0,0) 100%
                            )`,
                            WebkitMaskImage: `linear-gradient(to right, 
                                rgba(0,0,0,1) 0%, 
                                rgba(0,0,0,1) ${Math.max(0, loadingProgress - 50)}%, 
                                rgba(0,0,0,0.9) ${Math.max(0, loadingProgress - 40)}%, 
                                rgba(0,0,0,0.6) ${Math.max(0, loadingProgress - 25)}%, 
                                rgba(0,0,0,0.3) ${Math.max(0, loadingProgress - 15)}%, 
                                rgba(0,0,0,0) ${loadingProgress}%, 
                                rgba(0,0,0,0) 100%
                            )`,
                        }}
                    />

                    {!isComplete && (
                        <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                            <h2 className="text-xl font-bold">
                                {"Procesando tu transacción".split('').map((char, index, array) => {
                                    const charProgress = (index / array.length) * 100;
                                    const isWhite = loadingProgress >= charProgress;
                                    return (
                                        <span
                                            key={index}
                                            style={{
                                                color: isWhite ? 'white' : almostBlackColor,
                                                transition: 'color 0.2s ease-out',
                                            }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    );
                                })}
                            </h2>
                            <p className="text-sm">
                                {"Esto podría tomar unos segundos".split('').map((char, index, array) => {
                                    const charProgress = (index / array.length) * 100;
                                    const isWhite = loadingProgress >= charProgress;
                                    return (
                                        <span
                                            key={index}
                                            style={{
                                                color: isWhite ? 'rgba(255, 255, 255, 0.9)' : '#666',
                                                transition: 'color 0.2s ease-out',
                                            }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    );
                                })}
                            </p>
                            <div className="w-full max-w-xs mt-2">
                                <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300 ease-out"
                                        style={{
                                            width: `${loadingProgress}%`,
                                            backgroundColor: 'white',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {isComplete && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                            <svg
                                className="h-24 w-24"
                                style={{ color: 'white' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                    style={{ transform: 'rotate(-2deg)' }}
                                />
                            </svg>
                            <h2 className="text-3xl font-bold leading-tight" style={{ color: 'white' }}>
                                Transferencia enviada
                            </h2>
                            <p className="text-base leading-relaxed" style={{ color: 'white', opacity: 0.9 }}>
                                Zelify notificó al destinatario
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render Success Screen
    const renderSuccessScreen = () => {
        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
                    <div
                        className="relative rounded-3xl flex flex-col items-center justify-center overflow-hidden mx-auto my-5 flex-1 min-h-0"
                        style={{
                            width: 'calc(100% - 20px)',
                            boxSizing: 'border-box',
                            padding: '40px 20px',
                            position: 'relative',
                            background: gradientStyle,
                        }}
                    >
                        <div className="flex flex-col items-center justify-center text-center space-y-6 relative z-10 flex-shrink-0">
                            <svg
                                className="h-24 w-24"
                                style={{ color: 'white' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                    style={{ transform: 'rotate(-2deg)' }}
                                />
                            </svg>
                            <h2 className="text-3xl font-bold leading-tight" style={{ color: 'white' }}>
                                Transferencia enviada
                            </h2>
                            <p className="text-base leading-relaxed" style={{ color: 'white', opacity: 0.9 }}>
                                Zelify notificó al destinatario
                            </p>
                        </div>

                        {/* Transaction details expandable */}
                        <div
                            className="absolute bottom-0 left-0 right-0 rounded-t-3xl transition-all duration-300 overflow-hidden z-20 flex flex-col"
                            style={{
                                height: isTransactionDetailsExpanded ? '100%' : '80px',
                                backgroundColor: isTransactionDetailsExpanded ? 'rgba(255, 255, 255, 1)' : 'transparent',
                            }}
                        >
                            {!isTransactionDetailsExpanded && (
                                <div className="w-full px-6 py-2 flex items-center justify-center -mt-2 flex-shrink-0">
                                    <button
                                        onClick={() => setIsTransactionDetailsExpanded(true)}
                                        className="px-12 py-4 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center gap-0"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-700"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                            Detalles de la transacción
                                        </span>
                                    </button>
                                </div>
                            )}

                            {isTransactionDetailsExpanded && (
                                <>
                                    <button
                                        onClick={() => setIsTransactionDetailsExpanded(false)}
                                        className="w-full px-6 py-2 flex items-center justify-center flex-shrink-0"
                                    >
                                        <svg
                                            className="w-4 h-4 text-gray-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="px-6 pb-6 overflow-y-auto min-h-0 flex-1">
                                        <div className="text-center mb-6">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                Detalles de la transacción
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Fecha/Hora</p>
                                                <p className="text-sm font-semibold text-gray-900">10/10/2025 / 12:26:04 PM</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Destinatario</p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {selectedContactData?.name || "Valeria Duarte"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Número de transacción</p>
                                                <p className="text-sm font-semibold text-gray-900">871607050</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Monto</p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {parseFloat(amount || "0").toLocaleString("es-MX", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })} {currency}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render current screen
    const renderScreenContent = () => {
        switch (currentScreen) {
            case "amount":
                return renderAmountScreen();
            case "currency-selector":
                return renderCurrencySelectorScreen();
            case "summary":
                return renderSummaryScreen();
            case "processing":
                return renderProcessingScreen();
            case "success":
                return renderSuccessScreen();
            default:
                return renderAmountScreen();
        }
    };

    return (
        <div className="flex h-full flex-col relative overflow-hidden bg-white">
            {renderScreenContent()}
        </div>
    );
}
