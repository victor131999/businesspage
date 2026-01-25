import { useState, useRef, useEffect } from "react";

/* -- Types -- */
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type PlanType = "free" | "premium";

/* -- Main Component -- */
export default function DiscountsCard() {
    // State
    const [step, setStep] = useState<Step>(1);
    const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [activePromoIndex, setActivePromoIndex] = useState(0);
    const [mapPointer, setMapPointer] = useState({ x: 50, y: 50 });
    const [businessName, setBusinessName] = useState("");
    const [businessId, setBusinessId] = useState("");

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

    // Plans data
    const plans = {
        free: {
            price: "$0",
            features: [
                "Hasta 3 promociones activas",
                "Análisis básico de descuentos",
                "Soporte por email",
            ],
        },
        premium: {
            price: "$29",
            features: [
                "Promociones ilimitadas",
                "Análisis avanzado",
                "Soporte prioritario",
                "API personalizada",
            ],
        },
    };

    const promoCount = 3;

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

    // Auto-advance step 10 to step 11
    useEffect(() => {
        if (step === 10) {
            startLoadingProgress();
            const timer = setTimeout(() => {
                setStep(11);
            }, 3050);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Demo flow
    const handlePlayDemo = async () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        abortDemo.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        // Reset to initial state
        setStep(1);
        setSelectedPlan("free");
        setLoadingProgress(0);
        setActivePromoIndex(0);
        setMapPointer({ x: 50, y: 50 });
        setBusinessName("");
        setBusinessId("");

        try {
            // Step 1: Plan Selection
            await wait(1500);
            setSelectedPlan("premium");
            await wait(1000);
            setStep(2);

            // Step 2: Basic Information
            await wait(1500);
            for (let i = 0; i <= "Mi Negocio".length; i++) {
                await wait(50);
                setBusinessName("Mi Negocio".slice(0, i));
            }
            await wait(500);
            for (let i = 0; i <= "1234567890".length; i++) {
                await wait(50);
                setBusinessId("1234567890".slice(0, i));
            }
            await wait(1000);
            setStep(3);

            // Step 3: Location Map
            await wait(2000);
            setStep(4);

            // Step 4: Address Details
            await wait(2000);
            setStep(5);

            // Step 5: Business Description
            await wait(2000);
            setStep(6);

            // Step 6: Category Detection
            await wait(2000);
            setStep(7);

            // Step 7: Create Promo Inputs
            await wait(2000);
            setStep(8);

            // Step 8: Promo Selection
            await wait(1500);
            setActivePromoIndex(1);
            await wait(1000);
            setActivePromoIndex(0);
            await wait(1000);
            setStep(9);

            // Step 9: Configure Promo
            await wait(2000);
            setStep(10);

            // Step 10: Launching (auto-advances to 11)
            await wait(3500);

            // Step 11: Success
            await wait(2000);

            window.dispatchEvent(new CustomEvent('zelify:demo-end'));
        } catch (error) {
            // Demo was aborted
        } finally {
            isRunningRef.current = false;
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
        window.addEventListener('zelify:play-demo:discounts', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:discounts', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:discounts', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:discounts', handleStopDemo);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, []);

    // Helper: Darken color
    const darkenColor = (hex: string, amount: number) => {
        const num = parseInt(hex.replace("#", ""), 16);
        const r = Math.max(0, ((num >> 16) & 0xFF) - amount);
        const g = Math.max(0, ((num >> 8) & 0xFF) - amount);
        const b = Math.max(0, (num & 0xFF) - amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Render Header
    const renderHeader = (showBack = false) => (
        <div className="pt-6 px-6 text-center shrink-0 relative flex items-center justify-center z-50">
            {showBack && (
                <button
                    onClick={() => setStep((prev) => Math.max(1, (prev - 1) as Step))}
                    className="absolute left-6 text-xs text-gray-500 hover:text-gray-700 flex items-center"
                >
                    ← Atrás
                </button>
            )}
            <div className="flex items-center justify-center">
                <img
                    src="/images/zelify_logo.png"
                    alt="Logo"
                    className="h-8 w-auto object-contain"
                />
            </div>
        </div>
    );

    // Render Continue Button
    const renderContinueButton = (onClick?: () => void) => {
        const darkThemeColor = darkenColor(themeColor, 30);
        const almostBlackColor = darkenColor(themeColor, 80);
        const blackColor = darkenColor(themeColor, 100);

        return (
            <button
                onClick={onClick || (() => setStep((prev) => Math.min(11, (prev + 1) as Step)))}
                className="group relative w-[80%] mx-auto text-white rounded-2xl py-3.5 text-sm flex items-center pl-6 shadow-lg overflow-hidden transition-all active:scale-[0.98] z-20"
                style={{
                    background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                    boxShadow: `0 4px 14px 0 ${themeColor}40`,
                }}
            >
                <span className="relative z-10 mr-0">Continuar</span>
                <span className="absolute right-6 z-10 transition-transform group-hover:translate-x-1">&gt;</span>
            </button>
        );
    };

    // Step 1: Plan Selection
    const renderStep1 = () => {
        const renderCard = (planKey: PlanType) => {
            const plan = plans[planKey];
            const isActive = selectedPlan === planKey;

            return (
                <div
                    onClick={() => !isActive && setSelectedPlan(planKey)}
                    className={`rounded-[2rem] transition-all duration-500 ease-in-out relative overflow-hidden flex flex-col items-center shrink-0 cursor-pointer ${
                        isActive
                            ? "w-[90%] h-[180px] border-[9px] border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] z-10 py-6"
                            : "w-[85%] h-[70px] z-0 justify-center"
                    }`}
                    style={{
                        background: isActive
                            ? gradientStyle
                            : "rgba(189, 185, 185, 0.3)",
                    }}
                >
                    {isActive ? (
                        <div className="w-full flex flex-col items-center px-4">
                            <h3 className="text-xs text-white mb-0">
                                {planKey === "free" ? "Gratis" : "Premium"}
                            </h3>
                            <div className="flex items-center justify-center gap-1 mb-5">
                                <span className="text-xl text-white">{plan.price}</span>
                                <span className="text-xs text-white/70">/mes</span>
                            </div>
                            <div className="space-y-1.5 text-center w-full">
                                {plan.features.slice(0, 4).map((feature, idx) => (
                                    <p key={idx} className="text-[9px] text-white/70 leading-tight">
                                        {feature}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <span className="text-white text-base tracking-wide">
                            {planKey === "free" ? "Gratis" : "Premium"}
                        </span>
                    )}
                </div>
            );
        };

        return (
            <div className="flex flex-col h-full bg-white relative overflow-hidden">
                <div className="absolute top-[165px] z-50 flex flex-col items-center justify-center w-full pointer-events-none">
                    <h2 className="text-2xl font-bold" style={{ color: themeColor }}>
                        Negocio
                    </h2>
                    <p className="text-gray-500 font-medium tracking-wide text-xs">
                        Elige un plan
                    </p>
                </div>

                <div className="relative w-40 h-40 flex items-center justify-center mt-8 mb-[-50px] shrink-0 z-0">
                    <img
                        src="/ANIMACION%201.gif"
                        alt="Animación"
                        className="w-full h-full object-contain opacity-80"
                    />
                </div>

                <div
                    className="relative z-10 flex-1 w-full overflow-hidden rounded-2xl p-5 backdrop-blur-sm flex flex-col mx-4"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.35)",
                    }}
                >
                    <div className="w-full flex-1 flex flex-col items-center justify-center -space-y-6 relative z-20">
                        {renderCard("free")}
                        {renderCard("premium")}
                    </div>

                    <div className="pt-4 shrink-0">
                        {renderContinueButton()}
                    </div>
                </div>
            </div>
        );
    };

    // Step 2: Basic Information
    const renderStep2 = () => (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {renderHeader(true)}

            <div className="flex-1 flex flex-col items-center pt-4 px-2 pb-12 z-10 min-h-0">
                <div className="relative w-32 h-32 flex items-center justify-center min-h-[50px] mb-4 mt-8 shrink z-20">
                    <img
                        src="/ANIMACION%201.gif"
                        alt="Animación"
                        className="w-full h-full object-contain opacity-80"
                    />
                </div>

                <div
                    className="relative z-10 flex-1 w-full overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col pt-6 min-h-0 mx-4"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.35)",
                    }}
                >
                    <div className="flex flex-col items-center justify-center text-center w-full mb-4">
                        <h2 className="text-2xl font-bold text-black mb-1">
                            Negocio
                        </h2>
                        <p className="text-gray-400 text-sm mb-4">
                            Completa los campos para continuar
                        </p>
                    </div>

                    <div className="w-full flex-1 flex flex-col bg-gray-50/50 p-6 rounded-2xl overflow-y-auto min-h-0">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[#003366] text-sm font-medium">
                                    Nombre del negocio
                                </label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="Ingresa el nombre"
                                    className="w-full p-3 rounded-xl bg-gray-200/80 border-none text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#003366]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[#003366] text-sm font-medium">
                                    ID del negocio
                                </label>
                                <input
                                    type="text"
                                    value={businessId}
                                    onChange={(e) => setBusinessId(e.target.value)}
                                    placeholder="Ingresa el ID"
                                    className="w-full p-3 rounded-xl bg-gray-200/80 border-none text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#003366]"
                                />
                            </div>
                        </div>

                        <div className="mt-auto pt-4 shrink-0">
                            {renderContinueButton()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 3: Location Map
    const renderStep3 = () => {
        return (
            <div className="flex flex-col h-full bg-white relative overflow-hidden">
                {renderHeader(true)}

                <div className="flex-1 px-4 pt-2 pb-6 flex items-center justify-center min-h-0">
                    <div
                        className="relative w-full h-[95%] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col items-center bg-[#1a2333]"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 100;
                            const y = ((e.clientY - rect.top) / rect.height) * 100;
                            setMapPointer({ x, y });
                        }}
                    >
                        {/* Map pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" width="100%" height="100%">
                                <pattern
                                    id="street-pattern"
                                    x="0"
                                    y="0"
                                    width="50"
                                    height="50"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <path
                                        d="M50 0 L50 50 M0 50 L50 50"
                                        stroke="white"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#street-pattern)" />
                            </svg>
                        </div>

                        {/* Pointer */}
                        <div
                            className="absolute z-20 transition-all duration-300"
                            style={{
                                left: `${mapPointer.x}%`,
                                top: `${mapPointer.y}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                    fill="#ef4444"
                                />
                                <circle cx="12" cy="10" r="3" fill="white" />
                            </svg>
                        </div>

                        {/* Continue button */}
                        <div className="absolute bottom-6 left-0 right-0 px-6 z-30">
                            {renderContinueButton()}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Step 4: Address Details
    const renderStep4 = () => (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {renderHeader(true)}

            <div className="flex-1 px-4 pt-2 pb-6 flex items-center justify-center min-h-0">
                <div className="relative w-full h-[95%] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[#1a2333]" />
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(to bottom, #000b1e 0%, ${themeColor} 100%)`,
                                opacity: 0.9,
                            }}
                        />
                    </div>

                    <div className="relative z-10 w-full h-full px-6 flex flex-col text-white pt-14 min-h-0">
                        <h2 className="text-sm font-normal mb-8 text-center text-white shrink-0 tracking-wide">
                            Detalles de dirección
                        </h2>

                        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
                            <div className="mb-6">
                                <label className="text-white/70 text-xs block mb-1">
                                    Teléfono
                                </label>
                                <div className="w-full bg-transparent border-b border-white/20 py-2 flex justify-between items-center">
                                    <span className="text-sm text-white font-medium">+52</span>
                                    <span className="text-[10px] text-white/50">▼</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className="text-white/70 text-xs block mb-2">
                                        Edificio
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Edificio"
                                        className="w-full bg-black/20 rounded-lg p-3 text-xs placeholder:text-white/30 text-white focus:ring-0 outline-none backdrop-blur-sm h-10"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/70 text-xs block mb-2">
                                        Piso
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Piso"
                                        className="w-full bg-black/20 rounded-lg p-3 text-xs placeholder:text-white/30 text-white focus:ring-0 outline-none backdrop-blur-sm h-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 shrink-0 pb-8 mt-auto">
                            <button
                                onClick={() => setStep(5)}
                                className="group relative w-full bg-white text-[#003366] rounded-xl py-3.5 font-bold text-sm shadow-lg hover:bg-gray-50 transition-all active:scale-[0.98] overflow-hidden"
                                style={{
                                    boxShadow: `0 4px 14px 0 ${themeColor}40`,
                                }}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 5: Business Description
    const renderStep5 = () => (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {renderHeader(true)}

            <div className="absolute top-10 left-0 right-0 flex justify-center z-0">
                <div className="w-64 h-64 flex items-center justify-center">
                    <img
                        src="/ANIMACION%201.gif"
                        alt="Animación"
                        className="w-full h-full object-contain opacity-80"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center px-6 z-20 pt-[220px] min-h-0">
                <h2 className="text-2xl font-bold text-[#003366] mb-1">
                    Descripción
                </h2>
                <p className="text-gray-400 text-xs text-center max-w-[200px] mb-6">
                    Describe tu negocio
                </p>
                <div className="w-full bg-gray-50 flex-1 p-6 rounded-2xl mb-4 flex flex-col shadow-sm min-h-0">
                    <label className="text-[#003366]/70 text-sm mb-2">
                        Descripción
                    </label>
                    <textarea
                        placeholder="Escribe aquí..."
                        className="flex-1 w-full bg-transparent border-none resize-none text-sm placeholder:text-gray-400 focus:ring-0 p-0 min-h-[100px]"
                    />
                    <div className="text-right text-xs text-[#0066cc]">0/180</div>
                </div>
            </div>

            <div className="px-6 pb-8 pt-2 shrink-0 z-30">
                {renderContinueButton()}
            </div>
        </div>
    );

    // Step 6: Category Detection
    const renderStep6 = () => (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {renderHeader(true)}

            <div className="absolute top-10 left-0 right-0 flex justify-center z-0">
                <div className="w-64 h-64 flex items-center justify-center">
                    <img
                        src="/ANIMACION%201.gif"
                        alt="Animación"
                        className="w-full h-full object-contain opacity-80"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 pt-[280px] min-h-0">
                <p className="text-gray-400 text-xs text-center mb-2">
                    Categoría detectada
                </p>
                <h2 className="text-3xl font-bold text-[#003366] mb-10">
                    Restaurante
                </h2>
                <div className="w-full space-y-3 mb-6">
                    <button
                        onClick={() => setStep(5)}
                        className="group relative w-[60%] mx-auto text-white rounded-2xl py-3.5 font-bold text-sm flex items-center justify-between px-6 shadow-lg overflow-hidden transition-all active:scale-[0.98]"
                        style={{
                            background: gradientStyle,
                            boxShadow: `0 4px 14px 0 ${themeColor}40`,
                        }}
                    >
                        <span className="flex-1 text-center">No, intentar de nuevo</span>
                        <span>&gt;</span>
                    </button>
                    <button
                        onClick={() => setStep(7)}
                        className="group relative w-[60%] mx-auto text-white rounded-2xl py-3.5 font-bold text-sm flex items-center justify-between px-6 shadow-lg overflow-hidden transition-all active:scale-[0.98]"
                        style={{
                            background: gradientStyle,
                            boxShadow: `0 4px 14px 0 ${themeColor}40`,
                        }}
                    >
                        <span className="flex-1 text-center">Sí, continuar</span>
                        <span>&gt;</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // Step 7: Create Promo Inputs
    const renderStep7 = () => (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {renderHeader(true)}

            <div className="absolute top-10 left-0 right-0 flex justify-center z-0">
                <div className="w-64 h-64 flex items-center justify-center">
                    <img
                        src="/ANIMACION%201.gif"
                        alt="Animación"
                        className="w-full h-full object-contain opacity-80"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center px-6 z-20 pt-[220px] min-h-0">
                <h2 className="text-2xl font-bold text-[#003366] mb-1">
                    Crear promoción
                </h2>
                <p className="text-gray-400 text-xs text-center mb-8">
                    Completa los campos
                </p>

                <div className="w-full space-y-4 flex-1 min-h-0 overflow-y-auto">
                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
                        <span className="text-[#004492] text-sm font-medium block">
                            Nombre del producto
                        </span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
                        <span className="text-[#004492] text-sm font-medium block">
                            Precio
                        </span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
                        <span className="text-[#004492] text-sm font-medium block">
                            Perfil del cliente
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-8 pt-2 shrink-0 z-30">
                {renderContinueButton()}
            </div>
        </div>
    );

    // Step 8: Promo Selection Stack
    const renderStep8 = () => {
        const getOffset = (index: number) => {
            let diff = index - activePromoIndex;
            if (diff > promoCount / 2) diff -= promoCount;
            if (diff < -promoCount / 2) diff += promoCount;
            return diff;
        };

        const renderStackCards = () => {
            const cards = [];
            for (let i = 0; i < promoCount; i++) {
                const offset = getOffset(i);
                if (Math.abs(offset) > 1) continue;

                const isActive = offset === 0;
                const translateY = offset * 65;
                const scale = isActive ? 1 : 0.85;
                const zIndex = isActive ? 20 : offset < 0 ? 11 : 10;
                const opacity = isActive ? 1 : 0.8;

                cards.push(
                    <div
                        key={i}
                        onClick={() => setActivePromoIndex(i)}
                        className={`absolute left-0 right-0 mx-auto transition-all duration-500 ease-out cursor-pointer flex flex-col justify-center ${
                            isActive
                                ? "w-[95%] h-[110px] rounded-[2rem] border-[6px] border-white shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                                : "w-[100%] h-[80px] rounded-[2rem]"
                        }`}
                        style={{
                            top: "50%",
                            transform: `translateY(calc(-50% + ${translateY}px)) scale(${scale})`,
                            zIndex: zIndex,
                            opacity: opacity,
                            background: isActive
                                ? gradientStyle
                                : "rgba(189, 185, 185, 0.3)",
                        }}
                    >
                        {isActive ? (
                            <div className="flex items-center px-4 gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#003366"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" />
                                    </svg>
                                </div>
                                <div className="flex flex-col text-white">
                                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-0.5">
                                        PROMO {i + 1}
                                    </span>
                                    <span className="text-[10px] text-blue-200">
                                        Descuento especial
                                    </span>
                                    <span className="text-sm font-bold leading-tight">
                                        ¡Aquí vamos!
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-white/60 font-bold text-xs tracking-widest uppercase">
                                    PROMO {i + 1}
                                </span>
                            </div>
                        )}
                    </div>
                );
            }
            return cards;
        };

        return (
            <div className="flex flex-col h-full bg-white relative overflow-hidden">
                {renderHeader(true)}

                <div className="flex-1 flex flex-col items-center relative z-10 min-h-0 pt-4">
                    <div className="relative w-64 h-64 flex items-center justify-center shrink min-h-[120px] -mb-16 z-0">
                        <img
                            src="/ANIMACION%201.gif"
                            alt="Animación"
                            className="w-full h-full object-contain opacity-80"
                        />
                    </div>

                    <div className="flex-1 w-full flex flex-col items-center justify-center z-20 px-6 pb-4 min-h-0">
                        <h2 className="text-2xl mb-0 text-[#003366] text-center mt-4">
                            <span className="font-light">Aquí</span>{" "}
                            <span className="font-bold">vamos</span>
                        </h2>
                        <p className="text-gray-400 text-xs text-center mb-6">
                            Selecciona una promoción
                        </p>

                        <div className="relative w-full flex-1 min-h-[220px] flex items-center justify-center">
                            {renderStackCards()}
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-8 pt-4 shrink-0 z-30">
                    {renderContinueButton()}
                </div>
            </div>
        );
    };

    // Step 9: Configure Promo
    const renderStep9 = () => (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {renderHeader(true)}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pt-2 pb-6 z-10 min-h-0">
                <div
                    className="w-full relative flex flex-col rounded-[2.5rem] px-5 py-8 overflow-hidden max-h-full"
                    style={{
                        backgroundColor: "#f8f9fc",
                    }}
                >
                    <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                        <div className="text-center mb-6 shrink-0">
                            <h2 className="text-xl text-[#003366] mb-1">
                                Configura{" "}
                                <span className="font-bold">promo</span>
                            </h2>
                            <p className="text-gray-400 text-[11px] leading-tight">
                                Define fechas y horarios
                            </p>
                        </div>

                        <div
                            className="w-full rounded-[1.5rem] p-5 flex items-center justify-center gap-4 mb-6 shadow-md relative overflow-hidden shrink-0"
                            style={{
                                background: gradientStyle,
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#003366"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" />
                                </svg>
                            </div>
                            <div className="flex flex-col text-white">
                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">
                                    PROMO 1
                                </span>
                                <span className="text-sm font-bold">¡Aquí vamos!</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-[#003366] text-xs font-medium block mb-2">
                                    Fecha de inicio
                                </label>
                                <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Seleccionar fecha</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="gray" strokeWidth="1.5">
                                        <path d="M1 1L5 5L9 1" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label className="text-[#003366] text-xs font-medium block mb-2">
                                    Fecha de fin
                                </label>
                                <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Seleccionar fecha</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="gray" strokeWidth="1.5">
                                        <path d="M1 1L5 5L9 1" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 pt-4">
                        <button
                            onClick={() => setStep(10)}
                            className="group relative w-full text-white rounded-2xl py-3.5 font-bold text-sm shadow-lg overflow-hidden transition-all active:scale-[0.98]"
                            style={{
                                background: gradientStyle,
                                boxShadow: `0 4px 14px 0 ${themeColor}40`,
                            }}
                        >
                            Lanzar promoción
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 10: Launching
    const renderStep10 = () => {
        const renderContent = (isOverlay: boolean) => (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center w-full">
                <h2 className={`text-2xl font-bold mb-2 ${isOverlay ? "text-white" : "text-[#003366]"}`}>
                    Lanzando promoción
                </h2>
                <p className={`text-xs ${isOverlay ? "text-white/80" : "text-gray-400"}`}>
                    Esto tomará unos segundos
                </p>
                <div className={`w-64 h-2 rounded-full mt-8 overflow-hidden ${isOverlay ? "bg-white/20" : "bg-gray-200"}`}>
                    {isOverlay && <div className="h-full w-full bg-white" />}
                </div>
            </div>
        );

        return (
            <div className="relative h-full w-full bg-white flex flex-col">
                {renderHeader(true)}
                <div className="flex-1 px-6 pb-6 pt-2 flex flex-col items-center justify-center min-h-0">
                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-xl bg-[#001a33]">
                        <div className="absolute inset-0 z-10">{renderContent(false)}</div>
                        <div
                            className="absolute inset-0 z-20 overflow-hidden"
                            style={{
                                clipPath: `inset(0 ${100 - loadingProgress}% 0 0)`,
                                transition: "clip-path 3s linear",
                            }}
                        >
                            <div
                                className="w-full h-full"
                                style={{
                                    background: gradientStyle,
                                }}
                            >
                                {renderContent(true)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Step 11: Success
    const renderStep11 = () => (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {renderHeader(true)}
            <div className="flex-1 px-6 pb-6 pt-2 flex flex-col items-center justify-center min-h-0">
                <div
                    className="w-full h-full rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center shadow-xl"
                    style={{
                        background: gradientStyle,
                    }}
                >
                    <div className="mb-6">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        ¡Promoción creada!
                    </h2>
                    <p className="text-gray-300 text-xs">
                        Tu promoción está activa
                    </p>
                </div>
            </div>
        </div>
    );

    // Render current step
    const renderCurrentStep = () => {
        switch (step) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            case 4:
                return renderStep4();
            case 5:
                return renderStep5();
            case 6:
                return renderStep6();
            case 7:
                return renderStep7();
            case 8:
                return renderStep8();
            case 9:
                return renderStep9();
            case 10:
                return renderStep10();
            case 11:
                return renderStep11();
            default:
                return renderStep1();
        }
    };

    return (
        <div className="flex h-full flex-col relative overflow-hidden bg-white">
            {renderCurrentStep()}
        </div>
    );
}
