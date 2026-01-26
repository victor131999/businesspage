import React, { useState, useRef, useEffect } from "react";

/* -- Types -- */
type ActionId = "number" | "wallet" | "freeze" | "security" | "more" | "lock";

/* -- Main Component -- */
export default function CardsCard() {
    // State
    const [activeAction, setActiveAction] = useState<ActionId>("number");
    const [isExpanded, setIsExpanded] = useState(false);
    const [cvv, setCvv] = useState('123');
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentCard, setCurrentCard] = useState(1); // 1 o 2 para card1.svg o card2.svg

    // Theme
    const themeColor = "#004492";
    const darkThemeColor = "#002a5c";
    const almostBlackColor = "#001126";
    const blackColor = "#000000";

    // Demo Refs
    const isRunningRef = useRef(false);
    const abortDemo = useRef(false);
    const cvvIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Actions configuration
    const actions: Array<{ id: ActionId; label: string; icon: React.ReactElement }> = [
        {
            id: "number",
            label: "Número",
            icon: (
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            )
        },
        {
            id: "wallet",
            label: "Billetera",
            icon: (
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                </svg>
            )
        },
        {
            id: "freeze",
            label: "Congelar",
            icon: (
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            )
        },
        {
            id: "security",
            label: "Seguridad",
            icon: (
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            )
        },
        {
            id: "more",
            label: "Más",
            icon: (
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                </svg>
            )
        },
        {
            id: "lock",
            label: "Bloquear",
            icon: (
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            )
        },
    ];

    // CVV Timer
    useEffect(() => {
        const generateCVV = () => {
            return Math.floor(100 + Math.random() * 900).toString();
        };

        setCvv(generateCVV());

        cvvIntervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setCvv(generateCVV());
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (cvvIntervalRef.current) {
                clearInterval(cvvIntervalRef.current);
            }
        };
    }, []);

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

    // Demo flow
    const handlePlayDemo = async () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        abortDemo.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        try {
            while (isRunningRef.current && !abortDemo.current) {
                // Reset to initial state
                setActiveAction("number");
                setIsExpanded(false);
                setCurrentCard(1);

                // 1. Show number action
                await wait(1500);
                setIsExpanded(true);
                await wait(2000);

                // 2. Switch to wallet
                if (abortDemo.current) break;
                setActiveAction("wallet");
                await wait(2000);

                // 3. Switch to freeze
                if (abortDemo.current) break;
                setActiveAction("freeze");
                await wait(2000);

                // 4. Switch to security
                if (abortDemo.current) break;
                setActiveAction("security");
                await wait(2000);

                // 5. Switch to more
                if (abortDemo.current) break;
                setActiveAction("more");
                await wait(2000);

                // 6. Switch to lock
                if (abortDemo.current) break;
                setActiveAction("lock");
                await wait(2000);

                // 7. Change card
                if (abortDemo.current) break;
                setCurrentCard(2);
                await wait(1500);
                setActiveAction("number");
                setIsExpanded(true);
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
        window.dispatchEvent(new CustomEvent('zelify:demo-end'));
    };

    // Event listeners
    useEffect(() => {
        window.addEventListener('zelify:play-demo:cards', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:cards', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:cards', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:cards', handleStopDemo);
        };
    }, []);

    // Get CVV color
    const getCVVColor = () => {
        const percentage = timeLeft / 30;
        if (percentage > 0.5) return '#22c55e';
        if (percentage > 0.25) return '#eab308';
        return '#ef4444';
    };

    // Render Horizontal Actions
    const renderHorizontalActions = () => {
        const CARD_HEIGHT = 60;
        const CARD_MIN_WIDTH = 60;
        const CARD_ACTIVE_WIDTH = 95;
        const CARD_BORDER_RADIUS = 20;
        const CARD_BORDER_WIDTH = 6;
        const OVERLAP_DISTANCE = 20;
        const ACTIVE_SCALE = 1.1;
        const BASE_Z_INDEX = 50;

        return (
            <div className="relative flex items-center justify-center px-5 py-10" style={{ isolation: "isolate" }}>
                {actions.map((action, index) => {
                    const isActive = activeAction === action.id;
                    const distanceFromActive = Math.abs(
                        actions.findIndex(a => a.id === activeAction) - index
                    );
                    const zIndex = BASE_Z_INDEX - distanceFromActive;

                    return (
                        <div
                            key={action.id}
                            className="relative cursor-pointer transition-all duration-400"
                            onClick={() => setActiveAction(action.id)}
                            style={{
                                zIndex: zIndex,
                                marginLeft: index === 0 ? "0px" : `-${OVERLAP_DISTANCE}px`,
                                height: `${CARD_HEIGHT}px`,
                                width: isActive ? `${CARD_ACTIVE_WIDTH}px` : `${CARD_MIN_WIDTH}px`,
                                borderRadius: `${CARD_BORDER_RADIUS}px`,
                                border: `${CARD_BORDER_WIDTH}px solid white`,
                                backgroundColor: isActive ? themeColor : "#E5E7EB",
                                color: isActive ? "white" : "#9CA3AF",
                                transform: isActive ? `scale(${ACTIVE_SCALE})` : "scale(1)",
                                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                // boxShadow: isActive
                                //     ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                //     : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div
                                className="flex items-center justify-center h-full"
                                style={{
                                    gap: isActive ? "4px" : "0px",
                                    paddingLeft: isActive ? "12px" : "0px",
                                    paddingRight: isActive ? "12px" : "0px",
                                }}
                            >
                                <div style={{ flexShrink: 0 }}>
                                    {action.icon}
                                </div>
                                {isActive && (
                                    <span className="text-[10px] font-semibold whitespace-nowrap">
                                        {action.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Render Action Content
    const renderActionContent = () => {
        switch (activeAction) {
            case "number":
                const percentage = (timeLeft / 30) * 100;
                const circumference = 2 * Math.PI * 20;
                const strokeDashoffset = circumference - (percentage / 100) * circumference;

                return (
                    <div className="w-full space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Número de tarjeta</span>
                                <span className="text-sm font-semibold text-gray-900">**** **** **** 1234</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Fecha de expiración</span>
                                <span className="text-sm font-semibold text-gray-900">12/25</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-500 pt-2">CVV</span>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="relative flex items-center justify-center">
                                        <svg className="transform -rotate-90" width="60" height="60">
                                            <circle
                                                cx="30"
                                                cy="30"
                                                r="20"
                                                stroke="#e5e7eb"
                                                strokeWidth="3"
                                                fill="none"
                                            />
                                            <circle
                                                cx="30"
                                                cy="30"
                                                r="20"
                                                stroke={getCVVColor()}
                                                strokeWidth="3"
                                                fill="none"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-linear"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span
                                                className="text-lg font-bold font-mono transition-colors duration-300"
                                                style={{ color: getCVVColor() }}
                                            >
                                                {cvv}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-right max-w-[200px]">
                                        Este CVV se actualiza cada 30 segundos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "wallet":
                return (
                    <div className="w-full space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Gastado hoy</span>
                                <span className="text-sm font-semibold text-gray-900">$450.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Límite diario</span>
                                <span className="text-sm font-semibold text-gray-900">$1,000.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Disponible</span>
                                <span className="text-sm font-semibold text-gray-900">$550.00</span>
                            </div>
                        </div>
                    </div>
                );

            case "freeze":
                return (
                    <div className="w-full space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Estado</span>
                                <span className="text-sm font-semibold text-gray-900">Activa</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Última congelación</span>
                                <span className="text-sm font-semibold text-gray-900">Nunca</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Puede congelar</span>
                                <span className="text-sm font-semibold text-gray-900">Sí</span>
                            </div>
                        </div>
                    </div>
                );

            case "security":
                return (
                    <div className="w-full space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Verificación 2FA</span>
                                <span className="text-sm font-semibold text-gray-900">Activada</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Notificaciones</span>
                                <span className="text-sm font-semibold text-gray-900">Activadas</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Último acceso</span>
                                <span className="text-sm font-semibold text-gray-900">Hace 2 horas</span>
                            </div>
                        </div>
                    </div>
                );

            case "more":
                return (
                    <div className="w-full space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Configuración</span>
                                <span className="text-sm font-semibold text-gray-900">Disponible</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Historial</span>
                                <span className="text-sm font-semibold text-gray-900">Ver todo</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Soporte</span>
                                <span className="text-sm font-semibold text-gray-900">Contactar</span>
                            </div>
                        </div>
                    </div>
                );

            case "lock":
                return (
                    <div className="w-full space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Estado actual</span>
                                <span className="text-sm font-semibold text-gray-900">Desbloqueada</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Al bloquear tu tarjeta, se desactivarán todas las transacciones hasta que la desbloquees nuevamente.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex h-full flex-col relative overflow-hidden bg-white">
            <div className="flex-1 flex flex-col overflow-y-auto" style={{ paddingBottom: isExpanded ? "280px" : "80px" }}>
                {/* Header */}
                <div className="flex-shrink-0 px-6 pt-4 pb-2">
                    <div className="flex justify-center">
                        <img
                            src="/images/zelify_logo.png"
                            alt="Logo"
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                </div>

                {/* Card SVG */}
                <div className="flex-shrink-0 px-6 py-4 flex justify-center">
                    <div className="relative w-full max-w-[280px]">
                        <img
                            src={currentCard === 1 ? "/images/card1.svg" : "/images/card2.svg"}
                            alt="Card"
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                {/* Horizontal Actions */}
                <div className="flex-shrink-0">
                    {renderHorizontalActions()}
                </div>

                {/* Card Info */}
                <div className="flex-shrink-0 px-6 py-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Tipo de tarjeta</span>
                        <span className="text-sm font-medium text-gray-900">Crédito virtual</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Cuenta</span>
                        <span className="text-sm font-medium text-gray-900">Crédito</span>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1 min-h-[20px]"></div>
            </div>

            {/* Collapsible Card - Fixed at bottom but within container */}
            <div
                className="absolute bottom-0 left-0 right-0 border-t border-gray-200/50 rounded-t-3xl shadow-lg transition-all duration-300 z-10 backdrop-blur-md"
                style={{
                    height: isExpanded ? "280px" : "80px",
                    backgroundColor: isExpanded ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 1)",
                }}
            >
                <div className="h-full flex flex-col">
                    {/* Header with toggle */}
                    <div
                        className="flex items-center justify-between px-6 py-4 cursor-pointer flex-shrink-0"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <h3 className="text-lg font-bold text-gray-900">
                            {activeAction === "number" && "Detalle de tarjeta"}
                            {activeAction === "wallet" && "Detalle de consumo diario"}
                            {activeAction === "freeze" && "Estado de congelación"}
                            {activeAction === "security" && "Configuración de seguridad"}
                            {activeAction === "more" && "Más opciones"}
                            {activeAction === "lock" && "Bloquear tarjeta"}
                        </h3>
                        <svg
                            className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Content */}
                    {isExpanded && (
                        <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0">
                            {renderActionContent()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
