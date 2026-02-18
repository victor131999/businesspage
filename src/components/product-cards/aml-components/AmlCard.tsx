import { useState, useEffect, useRef } from "react";
import { AML_TRANSLATIONS } from "./aml-translations";

/* -- Main Component -- */
export default function AmlCard({ isDemoEnabled = true }: { isDemoEnabled?: boolean }) {
    const [lang, setLang] = useState<keyof typeof AML_TRANSLATIONS>(() => {
        if (typeof window === "undefined") return "es";
        const raw =
            (window as any).__uiLanguage ||
            (() => {
                try {
                    return localStorage.getItem("ui-language");
                } catch {
                    return null;
                }
            })() ||
            "ES";
        return String(raw).toUpperCase() === "EN" ? "en" : "es";
    });

    useEffect(() => {
        const handleLanguageChange = (event: Event) => {
            const customEvent = event as CustomEvent<{ language?: string }>;
            const next = customEvent.detail?.language;
            setLang(next && next.toUpperCase() === "EN" ? "en" : "es");
        };

        window.addEventListener("ui:languagechange", handleLanguageChange);
        return () => window.removeEventListener("ui:languagechange", handleLanguageChange);
    }, []);

    const t = AML_TRANSLATIONS[lang];

    // State
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Refs
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isRunningRef = useRef(false);

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

    // Progress calculations
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);
    const perimeterProgressRadius = 110;
    const perimeterCircumference = 2 * Math.PI * perimeterProgressRadius;
    const perimeterOffset = perimeterCircumference * (1 - normalizedProgress / 100);

    const stage = progress < 33 ? "internal" : progress < 66 ? "national" : "global";

    // Start progress simulation
    const startProgress = async () => {
        while (isRunningRef.current) {
            setProgress(0);

            const duration = 5000;
            const interval = 50;
            const steps = duration / interval;
            const increment = 100 / steps;

            for (let i = 0; i < steps; i++) {
                if (!isRunningRef.current) return;
                await new Promise(resolve => setTimeout(resolve, interval));
                setProgress(prev => Math.min(prev + increment, 100));
            }

            setProgress(100);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before restart loop
        }
    };

    // Stop progress simulation
    const stopProgress = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        setIsRunning(false);
        isRunningRef.current = false;
    };

    // Reset and start animation
    const handlePlayDemo = () => {
        // Si ya está corriendo o la demo está desactivada, no hacer nada
        if (!isDemoEnabled || isRunningRef.current) return;

        // Detener cualquier animación anterior
        stopProgress();

        // Reiniciar desde el principio
        setProgress(0);

        // Pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
            isRunningRef.current = true;
            setIsRunning(true);
            window.dispatchEvent(new CustomEvent('zelify:demo-start'));
            startProgress();
        }, 50);
    };

    // Stop animation
    const handleStopDemo = () => {
        stopProgress();
        window.dispatchEvent(new CustomEvent('zelify:demo-end'));
    };

    // Event listeners for play/stop
    useEffect(() => {
        window.addEventListener('zelify:play-demo:aml', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:aml', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:aml', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:aml', handleStopDemo);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [isDemoEnabled]);

    return (
        <div className="flex h-full flex-col relative overflow-hidden bg-white" style={{ paddingBottom: '100px', paddingLeft: '10px', paddingRight: '10px' }}>
            {/* Header - Solo logo */}
            <div className="relative mb-3 flex items-center justify-between px-6 pt-6 z-20">
                <div className="w-full"></div>
                {/* <img
                    src="/images/zelify_logo.png"
                    alt="Logo"
                    className="h-8 absolute left-1/2 -translate-x-1/2 object-contain drop-shadow-sm"
                /> */}
                <div className="w-full"></div>
            </div>

            {/* Contenedor con Gradiente */}
            <div
                className="relative mx-auto w-full max-w-sm rounded-3xl px-6 py-8 flex-1 flex flex-col"
                style={{
                    background: `linear-gradient(to top, 
                        rgba(0, 0, 0, 1) 0%, 
                        rgba(${almostBlackRgb}, 1) 10%, 
                        rgba(${darkThemeRgb}, 1) 20%, 
                        rgba(${themeRgb}, 0.8) 30%, 
                        rgba(${themeRgb}, 0.4) 40%, 
                        transparent 50%, 
                        transparent 100%)`,
                    minHeight: '100%',
                }}
            >
                {/* Título */}
                <div className="text-center mb-6 mt-0">
                    <h2 className="text-xl font-bold leading-tight" style={{ color: themeColor }}>
                        {t.scanningFace}
                    </h2>
                </div>

                {/* Círculo de Carga */}
                <div className="relative flex-1 flex items-center justify-center">
                    <div className="relative h-64 w-64 flex items-center justify-center">
                        {/* Capas Decorativas SVG */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320" style={{ animation: 'faceIdRotateAndRipple 8s ease-in-out infinite', transformOrigin: '50% 50%' }}>
                            <circle cx="160" cy="160" r="140" fill="none" stroke={themeColor} strokeWidth="2" strokeOpacity="0.5" strokeDasharray="4 8" style={{ animation: 'faceIdDashRotate 3s linear infinite' }} />
                            <circle cx="160" cy="160" r="150" fill="none" stroke={themeColor} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 6" style={{ animation: 'faceIdDashRotate 4s linear infinite reverse' }} />
                        </svg>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320" style={{ animation: 'faceIdRotateAndRipple2 12s ease-in-out infinite', transformOrigin: '50% 50%' }}>
                            <circle cx="160" cy="160" r="145" fill="none" stroke={themeColor} strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="5 10" style={{ animation: 'faceIdDashRotate 5s linear infinite' }} />
                            <circle cx="160" cy="160" r="130" fill="none" stroke={themeColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 4" style={{ animation: 'faceIdDashRotate 2.5s linear infinite reverse' }} />
                        </svg>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320" style={{ animation: 'faceIdRotateAndRipple3 10s ease-in-out infinite', transformOrigin: '50% 50%' }}>
                            <circle cx="160" cy="160" r="135" fill="none" stroke={themeColor} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6 12" style={{ animation: 'faceIdDashRotate 6s linear infinite' }} />
                        </svg>

                        {/* Video (Círculo Principal) */}
                        <div className="relative h-52 w-52 rounded-full shadow-2xl bg-gray-900 z-10 overflow-hidden">
                            {/* Indicador Progreso Circular */}
                            <svg className="absolute inset-0 z-20 h-full w-full pointer-events-none" viewBox="0 0 256 256">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r={perimeterProgressRadius}
                                    fill="none"
                                    stroke={themeColor}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={perimeterCircumference}
                                    strokeDashoffset={perimeterOffset}
                                    transform="rotate(-90 128 128)"
                                    style={{ transition: 'stroke-dashoffset 0.2s ease-out' }}
                                />
                            </svg>

                            {/* Video de Verificación Facial */}
                            <video
                                src="https://flowchart-diagrams-zelify.s3.us-east-1.amazonaws.com/videos/faceverification.mp4"
                                autoPlay
                                playsInline
                                muted
                                loop
                                className="w-full h-full object-cover"
                                style={{ display: 'block', position: 'relative', zIndex: 1, backgroundColor: '#000' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Sección Inferior */}
                <div className="flex flex-col mt-auto" style={{ paddingBottom: '16px' }}>
                    <div className="text-center mb-4">
                        <p className="text-sm text-white mb-1">{t.progressTitle}</p>
                        <p className="text-base font-bold text-white">{t.stages[stage]}</p>
                    </div>

                    {/* Barra de Progreso Horizontal */}
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#4B5563' }}>
                        <div
                            className="h-full rounded-full transition-all duration-100 ease-out"
                            style={{
                                width: `${normalizedProgress}%`,
                                backgroundColor: '#FFFFFF',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Estilos CSS para animaciones */}
            <style>{`
                @keyframes faceIdRotateAndRipple {
                    0% { transform: rotate(0deg) scale(0.95); opacity: 0.4; }
                    25% { transform: rotate(90deg) scale(1.1); opacity: 0.6; }
                    50% { transform: rotate(180deg) scale(1.15); opacity: 0.7; }
                    75% { transform: rotate(270deg) scale(1.1); opacity: 0.6; }
                    100% { transform: rotate(360deg) scale(0.95); opacity: 0.4; }
                }
                @keyframes faceIdRotateAndRipple2 {
                    0% { transform: rotate(0deg) scale(0.9); opacity: 0.3; }
                    33% { transform: rotate(120deg) scale(1.05); opacity: 0.5; }
                    66% { transform: rotate(240deg) scale(1.1); opacity: 0.6; }
                    100% { transform: rotate(360deg) scale(0.9); opacity: 0.3; }
                }
                @keyframes faceIdRotateAndRipple3 {
                    0% { transform: rotate(0deg) scale(1); opacity: 0.2; }
                    50% { transform: rotate(180deg) scale(1.2); opacity: 0.4; }
                    100% { transform: rotate(360deg) scale(1); opacity: 0.2; }
                }
                @keyframes faceIdDashRotate {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 40; }
                }
            `}</style>
        </div>
    );
}
