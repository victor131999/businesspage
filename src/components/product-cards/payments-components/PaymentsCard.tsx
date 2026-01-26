import { useState, useRef, useEffect } from "react";

/* -- Types -- */
type ModuleType = "qr" | "custom-keys" | "servicios-basicos";
type QRScreen = "home" | "show-qr" | "scan-qr" | "confirm" | "processing" | "success";
type CustomKeysScreen = "dashboard" | "selection" | "confirm" | "processing" | "success";
type ServiciosScreen = "screen1" | "screen2" | "screen3" | "screen4" | "screen5";

interface Contact {
    id: string;
    name: string;
    initials: string;
    image?: string;
}

/* -- Main Component -- */
export default function PaymentsCard() {
    // Module Navigation
    const [currentModule, setCurrentModule] = useState<ModuleType>("qr");

    // QR State
    const [qrScreen, setQrScreen] = useState<QRScreen>("home");
    const [qrLoadingProgress, setQrLoadingProgress] = useState(0);

    // Custom Keys State
    const [ckScreen, setCkScreen] = useState<CustomKeysScreen>("dashboard");
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [ckLoadingProgress, setCkLoadingProgress] = useState(0);

    // Servicios Básicos State
    const [sbScreen, setSbScreen] = useState<ServiciosScreen>("screen1");
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Refs
    const qrProgressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const ckProgressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isRunningRef = useRef(false);
    const abortDemo = useRef(false);

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

    // Helper: Darken color
    const darkenColor = (hex: string, amount: number) => {
        const num = parseInt(hex.replace("#", ""), 16);
        const r = Math.max(0, ((num >> 16) & 0xFF) - amount);
        const g = Math.max(0, ((num >> 8) & 0xFF) - amount);
        const b = Math.max(0, (num & 0xFF) - amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    const gradientStyle = `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`;

    // Contacts data
    const contacts: Contact[] = [
        { id: "cs", name: "Carlos Santander", initials: "CS", image: "/images/team/team-02.png" },
        { id: "ar", name: "Ana Ruiz", initials: "AR", image: "/images/team/team-08.png" },
        { id: "sv", name: "Sofia Vargas", initials: "SV", image: "/images/user/user-02.png" },
        { id: "mc", name: "Miguel Castro", initials: "MC", image: "/images/team/team-04.png" },
    ];

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

    // Start QR loading progress
    const startQrLoadingProgress = () => {
        if (qrProgressIntervalRef.current) {
            clearInterval(qrProgressIntervalRef.current);
        }
        setQrLoadingProgress(0);
        const duration = 3000;
        const interval = 30;
        const increment = 100 / (duration / interval);

        qrProgressIntervalRef.current = setInterval(() => {
            setQrLoadingProgress((prev) => {
                const newProgress = prev + increment;
                if (newProgress >= 100) {
                    if (qrProgressIntervalRef.current) {
                        clearInterval(qrProgressIntervalRef.current);
                        qrProgressIntervalRef.current = null;
                    }
                    return 100;
                }
                return newProgress;
            });
        }, interval);
    };

    // Start Custom Keys loading progress
    const startCkLoadingProgress = () => {
        if (ckProgressIntervalRef.current) {
            clearInterval(ckProgressIntervalRef.current);
        }
        setCkLoadingProgress(0);
        const duration = 3000;
        const interval = 30;
        const increment = 100 / (duration / interval);

        ckProgressIntervalRef.current = setInterval(() => {
            setCkLoadingProgress((prev) => {
                const newProgress = prev + increment;
                if (newProgress >= 100) {
                    if (ckProgressIntervalRef.current) {
                        clearInterval(ckProgressIntervalRef.current);
                        ckProgressIntervalRef.current = null;
                    }
                    return 100;
                }
                return newProgress;
            });
        }, interval);
    };

    // Auto-advance QR processing to success
    useEffect(() => {
        if (currentModule === "qr" && qrScreen === "processing" && qrLoadingProgress >= 100) {
            const timer = setTimeout(() => {
                setQrScreen("success");
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentModule, qrScreen, qrLoadingProgress]);

    // Auto-advance Custom Keys processing to success
    useEffect(() => {
        if (currentModule === "custom-keys" && ckScreen === "processing" && ckLoadingProgress >= 100) {
            const timer = setTimeout(() => {
                setCkScreen("success");
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentModule, ckScreen, ckLoadingProgress]);

    // Demo flow
    const handlePlayDemo = async () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        abortDemo.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        try {
            while (isRunningRef.current && !abortDemo.current) {
                // Reset all states
                setCurrentModule("qr");
                setQrScreen("home");
                setQrLoadingProgress(0);
                setCkScreen("dashboard");
                setSelectedContact(null);
                setCkLoadingProgress(0);
                setSbScreen("screen1");
                setSelectedProvider(null);
                setSearchQuery("");

                // QR Module Demo
                await wait(2000);
                setQrScreen("scan-qr");
                await wait(2000);
                setQrScreen("confirm");
                await wait(2000);
                setQrScreen("processing");
                startQrLoadingProgress();
                await wait(3500);
                setQrScreen("success");
                await wait(2000);

                // Custom Keys Module Demo
                if (abortDemo.current) break;
                setCurrentModule("custom-keys");
                await wait(2000);
                setSelectedContact("cs");
                setCkScreen("selection");
                await wait(2000);
                setCkScreen("confirm");
                await wait(2000);
                setCkScreen("processing");
                startCkLoadingProgress();
                await wait(3500);
                setCkScreen("success");
                await wait(2000);

                // Servicios Básicos Module Demo
                if (abortDemo.current) break;
                setCurrentModule("servicios-basicos");
                await wait(2000);
                setSbScreen("screen2");
                await wait(2000);
                setSbScreen("screen1");
                await wait(3000); // Wait at the end of loop
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
        if (qrProgressIntervalRef.current) {
            clearInterval(qrProgressIntervalRef.current);
            qrProgressIntervalRef.current = null;
        }
        if (ckProgressIntervalRef.current) {
            clearInterval(ckProgressIntervalRef.current);
            ckProgressIntervalRef.current = null;
        }
        window.dispatchEvent(new CustomEvent('zelify:demo-end'));
    };

    // Event listeners
    useEffect(() => {
        window.addEventListener('zelify:play-demo:payments', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:payments', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:payments', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:payments', handleStopDemo);
            if (qrProgressIntervalRef.current) {
                clearInterval(qrProgressIntervalRef.current);
            }
            if (ckProgressIntervalRef.current) {
                clearInterval(ckProgressIntervalRef.current);
            }
        };
    }, []);

    // ========== RENDER FUNCTIONS ==========

    // Render Module Selector - Solo en la pantalla home de QR
    const renderModuleSelector = () => {
        if (currentModule !== "qr" || qrScreen !== "home") return null;

        return (
            <div className="absolute top-20 left-0 right-0 z-30 px-4">
                <div className="flex justify-center gap-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
                    <button
                        onClick={() => {
                            setCurrentModule("custom-keys");
                            setCkScreen("dashboard");
                        }}
                        className="px-4 py-2 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Claves
                    </button>
                    <button
                        onClick={() => {
                            setCurrentModule("servicios-basicos");
                            setSbScreen("screen1");
                        }}
                        className="px-4 py-2 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Servicios
                    </button>
                </div>
            </div>
        );
    };

    // ========== QR MODULE ==========
    const renderQRModule = () => {
        // QR Home Screen - Solo muestra opciones de navegación
        const renderQRHome = () => {
            return (
                <div className="relative flex h-full flex-col px-5 py-3">
                    <div className="flex-shrink-0 mb-3 flex justify-center">
                        <img src="/images/zelify_logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                    </div>

                    <div className="relative -mb-16 z-0 flex justify-center">
                        <img
                            src="/ANIMACION%201.gif"
                            alt="Animation"
                            className="h-48 w-48 object-contain opacity-90"
                        />
                    </div>

                    <div
                        className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}
                    >
                        <div className="text-center mb-3">
                            <h1 className="text-lg font-bold" style={{ color: themeColor }}>Pago con QR</h1>
                            <p className="text-[10px] text-gray-500 mt-0.5">Elige una opción</p>
                        </div>

                        <div className="flex flex-col gap-3 flex-1 justify-center">
                            <button
                                onClick={() => setQrScreen("show-qr")}
                                className="group relative w-full rounded-xl py-4 text-sm font-semibold transition-all border overflow-hidden active:scale-[0.98] text-white"
                                style={{
                                    background: gradientStyle,
                                    borderColor: themeColor,
                                    boxShadow: `0 4px 14px 0 ${themeColor}40`,
                                }}
                            >
                                Mostrar QR
                            </button>
                            <button
                                onClick={() => setQrScreen("scan-qr")}
                                className="group relative w-full rounded-xl py-4 text-sm font-semibold transition-all border overflow-hidden active:scale-[0.98] text-white"
                                style={{
                                    background: gradientStyle,
                                    borderColor: themeColor,
                                    boxShadow: `0 4px 14px 0 ${themeColor}40`,
                                }}
                            >
                                Escanear QR
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        // Show QR Screen - Pantalla separada para mostrar QR
        const renderShowQR = () => {
            return (
                <div className="relative flex h-full flex-col px-5 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={() => setQrScreen("home")}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition"
                        >
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <img src="/images/zelify_logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                        <div className="w-8"></div>
                    </div>

                    <div className="relative -mb-16 z-0 flex justify-center">
                        <img
                            src="/ANIMACION%201.gif"
                            alt="Animation"
                            className="h-48 w-48 object-contain opacity-90"
                        />
                    </div>

                    <div
                        className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}
                    >
                        <div className="text-center mb-3">
                            <h1 className="text-lg font-bold" style={{ color: themeColor }}>Mostrar QR</h1>
                            <p className="text-[10px] text-gray-500 mt-0.5">Comparte tu código QR para recibir pagos</p>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            <div className="rounded-lg bg-white p-3 shadow-lg">
                                <img src="/images/imgqr.png" alt="QR Code" className="h-32 w-32 object-contain" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="flex-1 rounded-xl py-2.5 text-xs font-semibold text-white" style={{ background: gradientStyle }}>
                                Compartir QR
                            </button>
                            <button className="flex-1 rounded-xl py-2.5 text-xs font-semibold text-white" style={{ background: gradientStyle }}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        // Scan QR Screen - Pantalla separada para escanear QR
        const renderScanQR = () => {
            return (
                <div className="relative flex h-full flex-col px-5 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={() => setQrScreen("home")}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition"
                        >
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <img src="/images/zelify_logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                        <div className="w-8"></div>
                    </div>

                    <div className="relative -mb-16 z-0 flex justify-center">
                        <img
                            src="/ANIMACION%201.gif"
                            alt="Animation"
                            className="h-48 w-48 object-contain opacity-90"
                        />
                    </div>

                    <div
                        className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}
                    >
                        <div className="text-center mb-3">
                            <h1 className="text-lg font-bold" style={{ color: themeColor }}>Escanear QR</h1>
                            <p className="text-[10px] text-gray-500 mt-0.5">Mantén el código QR dentro del marco</p>
                        </div>

                        <div className="flex-1 relative overflow-hidden rounded-xl bg-white">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative h-40 w-40">
                                    <img src="/images/imgqr.png" alt="QR Code" className="h-full w-full object-contain p-1" />
                                    <div className="absolute inset-0 rounded-2xl">
                                        <div className="absolute top-0 left-0 h-10 w-10 border-l-[3px] border-t-[3px] border-gray-400 rounded-tl-2xl"></div>
                                        <div className="absolute top-0 right-0 h-10 w-10 border-r-[3px] border-t-[3px] border-gray-400 rounded-tr-2xl"></div>
                                        <div className="absolute bottom-0 left-0 h-10 w-10 border-b-[3px] border-l-[3px] border-gray-400 rounded-bl-2xl"></div>
                                        <div className="absolute bottom-0 right-0 h-10 w-10 border-b-[3px] border-r-[3px] border-gray-400 rounded-br-2xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setQrScreen("confirm")}
                            className="mt-3 w-full rounded-xl py-2.5 text-xs font-semibold text-white"
                            style={{ background: gradientStyle }}
                        >
                            Simular escaneo
                        </button>
                    </div>
                </div>
            );
        };

        // QR Confirm Screen
        const renderQRConfirm = () => {
            return (
                <div className="relative flex h-full flex-col px-5 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <button onClick={() => setQrScreen("home")} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition">
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <img src="/images/zelify_logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                        <button onClick={() => setQrScreen("home")} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative -mb-16 z-0 flex justify-center">
                        <img src="/ANIMACION%201.gif" alt="Animation" className="h-48 w-48 object-contain opacity-90" />
                    </div>

                    <div className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col -mx-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}>
                        <div className="mb-2">
                            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Destinatario</p>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#E8EBF0' }}>
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden bg-primary">
                                        <img src="/images/team/team-03.png" alt="Recipient" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-900">Banco Nacional</p>
                                        <p className="text-[9px] text-gray-500">BTA Ahorros</p>
                                    </div>
                                    <p className="text-[10px] text-gray-500">****1234</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Cuenta origen</p>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#E8EBF0' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">CTA Ahorros</p>
                                        <p className="text-[9px] text-gray-500">****4576</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-gray-400 uppercase">Disponible</p>
                                        <p className="text-xs font-bold text-gray-900">$12,500.00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Monto</p>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#E8EBF0' }}>
                                <div className="flex items-center justify-center py-1">
                                    <p className="text-xl font-bold text-gray-900">10,000.00 MXN</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto max-w-[180px] mx-auto w-full">
                            <button
                                onClick={() => {
                                    setQrScreen("processing");
                                    startQrLoadingProgress();
                                }}
                                className="group relative w-full h-12 rounded-full overflow-hidden transition-all active:scale-[0.98]"
                                style={{ background: gradientStyle, boxShadow: `0 4px 14px 0 ${themeColor}40` }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <span className="text-white/60 text-xs font-medium pl-10">Desliza para confirmar</span>
                                </div>
                                <div className="absolute top-1 left-1 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center z-20">
                                    <svg className="h-4 w-4" style={{ color: themeColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        // QR Processing Screen
        const renderQRProcessing = () => {
            const isComplete = qrLoadingProgress >= 100;
            const progress = qrLoadingProgress + 20;
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

            return (
                <div className="flex h-full flex-col relative overflow-hidden bg-white">
                    <div className="relative rounded-3xl flex flex-col items-center justify-center overflow-hidden mx-auto my-5" style={{ width: 'calc(100% - 20px)', height: 'calc(100% - 100px)', padding: '40px 20px', backgroundColor: '#f3f4f6' }}>
                        <div className="absolute inset-0 rounded-3xl" style={{
                            background: gradientStyle,
                            clipPath: `polygon(${points})`,
                            transition: 'clip-path 0.05s linear',
                        }} />
                        {isComplete ? (
                            <div className="flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                                <svg className="h-24 w-24" style={{ color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" style={{ transform: 'rotate(-2deg)' }} />
                                </svg>
                                <h2 className="text-3xl font-bold leading-tight text-white">Pago Exitoso</h2>
                                <p className="text-base leading-relaxed text-white/90">Enviado a Banco Nacional</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                                <h2 className="text-xl font-bold">
                                    {"Procesando pago".split('').map((char, index, array) => {
                                        const charProgress = (index / array.length) * 100;
                                        const isWhite = qrLoadingProgress >= charProgress;
                                        return <span key={index} style={{ color: isWhite ? 'white' : almostBlackColor, transition: 'color 0.2s ease-out' }}>{char === ' ' ? '\u00A0' : char}</span>;
                                    })}
                                </h2>
                                <p className="text-sm">
                                    {"Espera por favor".split('').map((char, index, array) => {
                                        const charProgress = (index / array.length) * 100;
                                        const isWhite = qrLoadingProgress >= charProgress;
                                        return <span key={index} style={{ color: isWhite ? 'rgba(255, 255, 255, 0.9)' : '#666', transition: 'color 0.2s ease-out' }}>{char === ' ' ? '\u00A0' : char}</span>;
                                    })}
                                </p>
                                <div className="w-full max-w-xs mt-2">
                                    <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-300 ease-out bg-white" style={{ width: `${qrLoadingProgress}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        // QR Success Screen
        const renderQRSuccess = () => {
            return (
                <div className="flex h-full flex-col relative overflow-hidden bg-white">
                    <div className="relative rounded-3xl flex flex-col items-center justify-center mx-auto my-5" style={{ width: 'calc(100% - 20px)', height: 'calc(100% - 100px)', padding: '40px 20px', background: gradientStyle }}>
                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                            <svg className="h-24 w-24" style={{ color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" style={{ transform: 'rotate(-2deg)' }} />
                            </svg>
                            <h2 className="text-3xl font-bold leading-tight text-white">Pago Exitoso</h2>
                            <p className="text-base leading-relaxed text-white/90">Enviado a Banco Nacional</p>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                {qrScreen === "home" && renderQRHome()}
                {qrScreen === "show-qr" && renderShowQR()}
                {qrScreen === "scan-qr" && renderScanQR()}
                {qrScreen === "confirm" && renderQRConfirm()}
                {qrScreen === "processing" && renderQRProcessing()}
                {qrScreen === "success" && renderQRSuccess()}
            </div>
        );
    };

    // ========== CUSTOM KEYS MODULE ==========
    const renderCustomKeysModule = () => {
        // Dashboard Screen
        const renderCKDashboard = () => {
            return (
                <div className="relative flex h-full flex-col px-5 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={() => {
                                setCurrentModule("qr");
                                setQrScreen("home");
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition"
                        >
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <img src="/images/zelify_logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                        <div className="w-8"></div>
                    </div>

                    <div className="relative -mb-16 z-0 flex justify-center">
                        <img src="/ANIMACION%201.gif" alt="Animation" className="h-48 w-48 object-contain opacity-90" />
                    </div>

                    <div className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col" style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}>
                        <div className="text-center mb-3">
                            <h1 className="text-lg font-bold" style={{ color: themeColor }}>Pagar con Clave</h1>
                            <p className="text-[10px] text-gray-500 mt-0.5">Selecciona un contacto</p>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {contacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => {
                                        setSelectedContact(contact.id);
                                        setCkScreen("selection");
                                    }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden ${selectedContact === contact.id ? 'ring-4 ring-primary' : 'bg-gray-200'}`}>
                                        {contact.image ? (
                                            <img src={contact.image} alt={contact.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold" style={{ color: themeColor }}>{contact.initials}</span>
                                        )}
                                    </div>
                                    <span className="text-[9px] text-gray-700 text-center max-w-[45px] truncate">{contact.name.split(" ")[0]}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCkScreen("selection")}
                            className="w-full rounded-xl py-2.5 text-xs font-semibold text-white" style={{ background: gradientStyle }}
                        >
                            Pagar a Clave Personalizada
                        </button>
                    </div>
                </div>
            );
        };

        // Selection Screen
        const renderCKSelection = () => {
            const selectedContactData = contacts.find(c => c.id === selectedContact);
            return (
                <div className="flex flex-col h-full px-5 py-3">
                    <div className="flex-shrink-0 mb-3 flex justify-center">
                        <img src="/images/zelify_logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                    </div>

                    <div className="relative -mb-16 z-0 flex justify-center">
                        <img src="/ANIMACION%201.gif" alt="Animation" className="h-48 w-48 object-contain opacity-90" />
                    </div>

                    <div className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col" style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}>
                        <button onClick={() => { setCkScreen("dashboard"); setSelectedContact(null); }} className="self-start flex items-center text-gray-400 hover:text-gray-600 transition text-xs mb-3">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="ml-1">Atrás</span>
                        </button>

                        {selectedContactData && (
                            <div className="text-center mb-4">
                                <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden bg-primary">
                                    <img src={selectedContactData.image || ""} alt={selectedContactData.name} className="h-full w-full object-cover" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ color: themeColor }}>{selectedContactData.name}</h2>
                            </div>
                        )}

                        <div className="space-y-3 flex-1">
                            <div className="rounded-lg bg-gray-100 p-4">
                                <label className="text-xs font-medium text-gray-700 mb-2 block">Clave personalizada</label>
                                <input type="text" placeholder="Ingresa la clave" className="w-full rounded-lg bg-white px-3 py-2 text-sm border border-gray-200" />
                            </div>
                        </div>

                        <button
                            onClick={() => setCkScreen("confirm")}
                            className="mt-auto w-full rounded-xl py-2.5 text-xs font-semibold text-white" style={{ background: gradientStyle }}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            );
        };

        // Confirm Screen
        const renderCKConfirm = () => {
            return (
                <div className="flex flex-col h-full px-5 py-3">
                    <div className="flex-shrink-0 mb-3 flex justify-center">
                        <img src="/images/zelify_logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                    </div>

                    <div className="relative -mb-16 z-0 flex justify-center">
                        <img src="/ANIMACION%201.gif" alt="Animation" className="h-48 w-48 object-contain opacity-90" />
                    </div>

                    <div className="relative z-10 flex-1 overflow-hidden rounded-2xl p-4 backdrop-blur-sm flex flex-col" style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}>
                        <button onClick={() => setCkScreen(selectedContact ? "selection" : "dashboard")} className="self-start flex items-center text-gray-400 hover:text-gray-600 transition text-xs mb-3">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="ml-1">Atrás</span>
                        </button>

                        <div className="text-center mb-4">
                            <h1 className="text-base font-bold" style={{ color: themeColor }}>Confirmar Pago</h1>
                            <p className="text-[9px] text-gray-500 mt-0.5">Revisa los detalles</p>
                        </div>

                        <div className="space-y-3 flex-1">
                            <div className="rounded-lg bg-gray-100 p-3">
                                <p className="text-[9px] text-gray-400 uppercase mb-1">Destinatario</p>
                                <p className="text-xs font-bold text-gray-900">Carlos Santander</p>
                            </div>
                            <div className="rounded-lg bg-gray-100 p-3">
                                <p className="text-[9px] text-gray-400 uppercase mb-1">Monto</p>
                                <p className="text-xl font-bold text-gray-900">$1,000.00 MXN</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setCkScreen("processing");
                                startCkLoadingProgress();
                            }}
                            className="mt-auto w-full rounded-xl py-2.5 text-xs font-semibold text-white" style={{ background: gradientStyle }}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            );
        };

        // Processing Screen
        const renderCKProcessing = () => {
            const isComplete = ckLoadingProgress >= 100;
            const progress = ckLoadingProgress + 20;
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

            return (
                <div className="flex h-full flex-col relative overflow-hidden bg-white">
                    <div className="relative rounded-3xl flex flex-col items-center justify-center overflow-hidden mx-auto my-5" style={{ width: 'calc(100% - 20px)', height: 'calc(100% - 100px)', padding: '40px 20px', backgroundColor: '#f3f4f6' }}>
                        <div className="absolute inset-0 rounded-3xl" style={{ background: gradientStyle, clipPath: `polygon(${points})`, transition: 'clip-path 0.05s linear' }} />
                        {isComplete ? (
                            <div className="flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                                <svg className="h-24 w-24" style={{ color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" style={{ transform: 'rotate(-2deg)' }} />
                                </svg>
                                <h2 className="text-3xl font-bold leading-tight text-white">Pago Exitoso</h2>
                                <p className="text-base leading-relaxed text-white/90">Tu pago ha sido procesado</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                                <h2 className="text-xl font-bold">
                                    {"Procesando pago".split('').map((char, index, array) => {
                                        const charProgress = (index / array.length) * 100;
                                        const isWhite = ckLoadingProgress >= charProgress;
                                        return <span key={index} style={{ color: isWhite ? 'white' : almostBlackColor, transition: 'color 0.2s ease-out' }}>{char === ' ' ? '\u00A0' : char}</span>;
                                    })}
                                </h2>
                                <p className="text-sm">
                                    {"Espera por favor".split('').map((char, index, array) => {
                                        const charProgress = (index / array.length) * 100;
                                        const isWhite = ckLoadingProgress >= charProgress;
                                        return <span key={index} style={{ color: isWhite ? 'rgba(255, 255, 255, 0.9)' : '#666', transition: 'color 0.2s ease-out' }}>{char === ' ' ? '\u00A0' : char}</span>;
                                    })}
                                </p>
                                <div className="w-full max-w-xs mt-2">
                                    <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-300 ease-out bg-white" style={{ width: `${ckLoadingProgress}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        // Success Screen
        const renderCKSuccess = () => {
            return (
                <div className="flex h-full flex-col relative overflow-hidden bg-white">
                    <div className="relative rounded-3xl flex flex-col items-center justify-center mx-auto my-5" style={{ width: 'calc(100% - 20px)', height: 'calc(100% - 100px)', padding: '40px 20px', background: gradientStyle }}>
                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                            <svg className="h-24 w-24" style={{ color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" style={{ transform: 'rotate(-2deg)' }} />
                            </svg>
                            <h2 className="text-3xl font-bold leading-tight text-white">Pago Exitoso</h2>
                            <p className="text-base leading-relaxed text-white/90">Tu pago ha sido procesado</p>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                {ckScreen === "dashboard" && renderCKDashboard()}
                {ckScreen === "selection" && renderCKSelection()}
                {ckScreen === "confirm" && renderCKConfirm()}
                {ckScreen === "processing" && renderCKProcessing()}
                {ckScreen === "success" && renderCKSuccess()}
            </div>
        );
    };

    // ========== SERVICIOS BÁSICOS MODULE ==========
    const renderServiciosBasicosModule = () => {
        // Screen 1
        const renderSBScreen1 = () => {
            return (
                <div className="relative h-full w-full">
                    <div className="absolute top-0 left-0 right-0 h-1/2 z-0 px-4 overflow-hidden flex items-center justify-center pt-4">
                        <img src="/ANIMACION%201.gif" alt="Animation" className="w-[140%] h-auto object-contain" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col" style={{ height: '65%', borderRadius: '24px 24px 0 0', backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                        <div className="flex-1 flex flex-col px-4 pt-4 pb-4 overflow-y-auto">
                            <div className="flex items-center justify-between mb-2">
                                <button
                                    onClick={() => {
                                        setCurrentModule("qr");
                                        setQrScreen("home");
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition"
                                >
                                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="flex-1"></div>
                                <div className="w-8"></div>
                            </div>
                            <h1 className="text-xl font-bold mb-1 text-center" style={{ color: themeColor }}>Pago de Servicios</h1>
                            <p className="text-xs text-gray-600 text-center mb-3">Busca tu proveedor</p>

                            <div className="relative mb-3">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar proveedor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg bg-gray-100 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2" style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                                />
                            </div>

                            <div className="flex gap-3 mb-4 overflow-x-auto pb-2 px-1">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedProvider(`provider-${i}`);
                                            setSbScreen("screen2");
                                        }}
                                        className="flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-md border-2" style={{ borderColor: themeColor + '40' }}>
                                            <span className="text-lg font-bold" style={{ color: themeColor }}>P{i}</span>
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">Proveedor {i}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 relative flex flex-col items-center">
                                {["Popular", "Favoritos", "Telecom", "Electricidad"].map((cat, index) => {
                                    const isActive = index === 0;
                                    return (
                                        <button
                                            key={cat}
                                            className="relative w-full cursor-pointer flex items-center justify-center transition-all duration-500 mb-[-20px]"
                                            style={{
                                                borderRadius: '20px',
                                                zIndex: 50 - index,
                                                height: isActive ? '60px' : '55px',
                                                padding: isActive ? '20px 24px' : '16px 24px',
                                                backgroundColor: isActive ? undefined : '#E5E7EB',
                                                color: isActive ? 'white' : '#1F2937',
                                                border: '5px solid #FFFFFF',
                                                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                                background: isActive ? gradientStyle : undefined,
                                            }}
                                        >
                                            <span className={`font-medium text-center ${isActive ? 'text-sm font-semibold' : 'text-xs font-medium'}`} style={{ whiteSpace: 'nowrap', color: isActive ? 'white' : '#1F2937' }}>
                                                {cat}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        // Screen 2
        const renderSBScreen2 = () => {
            return (
                <div className="relative h-full w-full">
                    <div className="absolute top-0 left-0 right-0 h-1/2 z-0 px-4 overflow-hidden flex items-center justify-center pt-4">
                        <img src="/ANIMACION%201.gif" alt="Animation" className="w-[140%] h-auto object-contain" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col" style={{ height: '65%', borderRadius: '24px 24px 0 0', backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                        <div className="flex-1 flex flex-col px-4 pt-6 pb-4 overflow-y-auto">
                            <button onClick={() => { setSbScreen("screen1"); setSelectedProvider(null); }} className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="text-sm font-medium">Atrás</span>
                            </button>

                            <h1 className="text-2xl font-bold mb-8 text-center" style={{ color: themeColor }}>Proveedor Seleccionado</h1>

                            <div className="space-y-3">
                                <button className="w-full rounded-lg bg-gray-100 p-4 text-left transition hover:bg-gray-200">
                                    <div className="font-semibold text-gray-900 mb-1">Mi Número de Teléfono</div>
                                    <div className="text-xs text-gray-600">Usa tu número registrado</div>
                                </button>
                                <button className="w-full rounded-lg bg-gray-100 p-4 text-left transition hover:bg-gray-200">
                                    <div className="font-semibold text-gray-900 mb-1">Ingresar Número</div>
                                    <div className="text-xs text-gray-600">Ingresa el número asociado</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                {sbScreen === "screen1" && renderSBScreen1()}
                {sbScreen === "screen2" && renderSBScreen2()}
                {sbScreen === "screen3" && <div className="flex items-center justify-center h-full"><p className="text-gray-500">Screen 3</p></div>}
                {sbScreen === "screen4" && <div className="flex items-center justify-center h-full"><p className="text-gray-500">Screen 4</p></div>}
                {sbScreen === "screen5" && <div className="flex items-center justify-center h-full"><p className="text-gray-500">Screen 5</p></div>}
            </div>
        );
    };

    // Main Render
    return (
        <div className="flex h-full flex-col overflow-hidden bg-white relative">
            {renderModuleSelector()}
            {currentModule === "qr" && renderQRModule()}
            {currentModule === "custom-keys" && renderCustomKeysModule()}
            {currentModule === "servicios-basicos" && renderServiciosBasicosModule()}
        </div>
    );
}
