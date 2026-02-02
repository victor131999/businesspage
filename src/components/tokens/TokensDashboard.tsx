"use client";
import { useState, useEffect, useRef } from "react";

type Language = 'en' | 'es';

type PanelTranslations = {
    title: string;
    tokenConsumption: string;
    totalTokens: string;
    tokensUsed: string;
    tokensRemaining: string;
    byUser: string;
    byService: string;
    activeServices: string;
    logs: string;
    time: string;
    user: string;
    service: string;
    tokens: string;
    status: string;
    success: string;
    error: string;
    viewAll: string;
    noLogs: string;
    noServices: string;
};

const translations: Record<Language, PanelTranslations> = {
    en: {
        title: "Panel",
        tokenConsumption: "Token Consumption",
        totalTokens: "Total Tokens",
        tokensUsed: "Tokens Used",
        tokensRemaining: "Tokens Remaining",
        byUser: "By User",
        byService: "By Service",
        activeServices: "Active Services",
        logs: "Logs",
        time: "Time",
        user: "User",
        service: "Service",
        tokens: "Tokens",
        status: "Status",
        success: "Success",
        error: "Error",
        viewAll: "View All",
        noLogs: "No logs available",
        noServices: "No active services",
    },
    es: {
        title: "Panel",
        tokenConsumption: "Consumo de Tokens",
        totalTokens: "Total de Tokens",
        tokensUsed: "Tokens Usados",
        tokensRemaining: "Tokens Restantes",
        byUser: "Por Usuario",
        byService: "Por Servicio",
        activeServices: "Servicios Activos",
        logs: "Registros",
        time: "Hora",
        user: "Usuario",
        service: "Servicio",
        tokens: "Tokens",
        status: "Estado",
        success: "Éxito",
        error: "Error",
        viewAll: "Ver Todos",
        noLogs: "No hay registros disponibles",
        noServices: "No hay servicios activos",
    },
};

// Función para generar timestamps realistas
const generateRecentTime = (minutesAgo: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - minutesAgo);
    return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

// Mock data - En producción esto vendría de una API
const mockTokenData = {
    total: 5000000,
    used: 3247850,
    remaining: 1752150,
    byUser: [
        { user: "maria.gonzalez@empresa.com", tokens: 1245800, percentage: 38.4 },
        { user: "carlos.rodriguez@empresa.com", tokens: 892450, percentage: 27.5 },
        { user: "ana.martinez@empresa.com", tokens: 567320, percentage: 17.5 },
        { user: "juan.perez@empresa.com", tokens: 342180, percentage: 10.5 },
        { user: "laura.sanchez@empresa.com", tokens: 201100, percentage: 6.2 },
    ],
    byService: [
        { service: "Auth", tokens: 1245800, percentage: 38.4 },
        { service: "Identity", tokens: 987650, percentage: 30.4 },
        { service: "AML", tokens: 456780, percentage: 14.1 },
        { service: "Connect", tokens: 324560, percentage: 10.0 },
        { service: "Cards", tokens: 211060, percentage: 6.5 },
        { service: "Transfers", tokens: 45000, percentage: 1.4 },
    ],
};

const mockLogs = [
    { id: 1, time: generateRecentTime(2), user: "maria.gonzalez@empresa.com", service: "Auth", tokens: 2450, status: "success" },
    { id: 2, time: generateRecentTime(5), user: "carlos.rodriguez@empresa.com", service: "Identity", tokens: 1890, status: "success" },
    { id: 3, time: generateRecentTime(8), user: "ana.martinez@empresa.com", service: "AML", tokens: 3200, status: "success" },
    { id: 4, time: generateRecentTime(12), user: "juan.perez@empresa.com", service: "Connect", tokens: 1250, status: "error" },
    { id: 5, time: generateRecentTime(15), user: "laura.sanchez@empresa.com", service: "Cards", tokens: 980, status: "success" },
    { id: 6, time: generateRecentTime(18), user: "maria.gonzalez@empresa.com", service: "Auth", tokens: 2100, status: "success" },
    { id: 7, time: generateRecentTime(22), user: "carlos.rodriguez@empresa.com", service: "Identity", tokens: 3450, status: "success" },
    { id: 8, time: generateRecentTime(25), user: "ana.martinez@empresa.com", service: "Transfers", tokens: 560, status: "success" },
    { id: 9, time: generateRecentTime(28), user: "juan.perez@empresa.com", service: "AML", tokens: 1780, status: "error" },
    { id: 10, time: generateRecentTime(32), user: "laura.sanchez@empresa.com", service: "Connect", tokens: 2340, status: "success" },
];

const mockActiveServices = [
    { id: 1, name: "Auth", status: "active", requests: 12458, tokens: 1245800 },
    { id: 2, name: "Identity", status: "active", requests: 9876, tokens: 987650 },
    { id: 3, name: "AML", status: "active", requests: 4567, tokens: 456780 },
    { id: 4, name: "Connect", status: "active", requests: 3245, tokens: 324560 },
    { id: 5, name: "Cards", status: "active", requests: 2110, tokens: 211060 },
    { id: 6, name: "Transfers", status: "active", requests: 450, tokens: 45000 },
];

// Hook para animar números. Si duration === 0, muestra target al instante (para reset a cero).
const useAnimatedNumber = (target: number, duration: number = 2000, delay: number = 0) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (duration <= 0) {
            setCurrent(target);
            return;
        }
        const timer = setTimeout(() => {
            const startTime = Date.now();
            const startValue = current;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(startValue + (target - startValue) * easeOut);

                setCurrent(value);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setCurrent(target);
                }
            };

            animate();
        }, delay);

        return () => clearTimeout(timer);
    }, [target, duration, delay]);

    return current;
};

const FILL_DURATION_MS = 14000; // ~14 seconds to fill all bars (consumption animation)

export default function TokensDashboard() {
    const t = translations['es'];
    const [isVisible, setIsVisible] = useState(false);

    // Play/pause: auto-play al cargar. Si pausas, se para; si vuelves a Play, empieza desde cero.
    const [isPlaying, setIsPlaying] = useState(true);
    const [cyclePhase, setCyclePhase] = useState(0); // 0 to 1 (progress of filling)
    const [isDraining, setIsDraining] = useState(false); // Visual mode when near full (kept for UI styling)
    const startTimeRef = useRef(Date.now());

    const [tokenData, setTokenData] = useState(mockTokenData);
    const [liveLogs, setLiveLogs] = useState(mockLogs.slice(0, 7));

    // Sincronizar estado inicial con el botón (auto-play = mostrar icono pause)
    useEffect(() => {
        window.dispatchEvent(new CustomEvent("tokens:state", { detail: { isPlaying: true } }));
    }, []);

    // Listen for play/pause from parent (index.astro button). Play = empezar desde cero.
    useEffect(() => {
        const onPlay = () => {
            startTimeRef.current = Date.now();
            setCyclePhase(0);
            setIsDraining(false);
            setIsPlaying(true);
            window.dispatchEvent(new CustomEvent("tokens:state", { detail: { isPlaying: true } }));
        };
        const onPause = () => {
            setIsPlaying(false);
            window.dispatchEvent(new CustomEvent("tokens:state", { detail: { isPlaying: false } }));
        };
        window.addEventListener("tokens:play", onPlay);
        window.addEventListener("tokens:pause", onPause);
        return () => {
            window.removeEventListener("tokens:play", onPlay);
            window.removeEventListener("tokens:pause", onPause);
        };
    }, []);

    // Cycle Engine: solo corre cuando isPlaying. Al dar Play, esperamos 1 frame pintando todo en 0, luego arrancamos.
    useEffect(() => {
        if (!isPlaying) return;

        let frameId: number;
        const startLoop = () => {
            startTimeRef.current = Date.now(); // Reiniciar crono aquí para que el primer frame sea progreso 0
            const animate = () => {
                const elapsed = Date.now() - startTimeRef.current;
                const progress = Math.min(elapsed / FILL_DURATION_MS, 1);

                setCyclePhase(progress);
                if (progress >= 0.95) setIsDraining(true);

                if (progress >= 1) {
                    setIsPlaying(false);
                    setCyclePhase(0);
                    setIsDraining(false);
                    window.dispatchEvent(new CustomEvent("tokens:state", { detail: { isPlaying: false } }));
                    return;
                }
                frameId = requestAnimationFrame(animate);
            };
            frameId = requestAnimationFrame(animate);
        };
        // Un frame de retraso para pintar cyclePhase=0 (todos los valores en cero) antes de arrancar el loop
        frameId = requestAnimationFrame(startLoop);
        return () => cancelAnimationFrame(frameId);
    }, [isPlaying]);

    // Apply phase to data
    useEffect(() => {
        // Base values (max capacity)
        const MAX_TOTAL = 10000000; // 10M capacity

        // Varying growth curves for realism
        // We use the cyclePhase (0-1) to determine how "full" things are.
        // Add some noise so they don't move perfectly in sync

        const time = Date.now();
        const smoothNoise = Math.floor(20000 * (0.5 + 0.5 * Math.sin(time / 1200))); // Subtle, smooth noise
        // Escalar ruido por cyclePhase para que al reinicio (cyclePhase=0) todo sea 0 y coherente con Por Usuario / Por Servicio
        const currentTotalUsed = Math.floor(MAX_TOTAL * 0.9 * cyclePhase) + Math.floor(smoothNoise * cyclePhase);

        // Update users: cada item tiene su "maxTokens" (valor al 100%) para que todas las barras puedan llenarse
        const newByUser = mockTokenData.byUser.map((u, i) => {
            const curve = Math.pow(cyclePhase, 1 + (i * 0.1));
            const wobble = 0.96 + 0.04 * Math.sin(time / 1400 + i);
            const maxTokens = Math.max(1, Math.floor((u.tokens * 2.3) * 1 * 1)); // valor cuando cyclePhase = 1
            return {
                ...u,
                tokens: Math.max(0, Math.floor((u.tokens * 2.3) * curve * wobble)),
                maxTokens
            };
        }).sort((a, b) => b.tokens - a.tokens);

        // Update services: igual, maxTokens por item para que todas las barras lleguen al 100%
        const newByService = mockTokenData.byService.map((s, i) => {
            const curve = Math.pow(cyclePhase, 1 + (i * 0.05));
            const wobble = 0.96 + 0.04 * Math.sin(time / 1500 + i);
            const maxTokens = Math.max(1, Math.floor((s.tokens * 2.3) * 1 * 1));
            return {
                ...s,
                tokens: Math.max(0, Math.floor((s.tokens * 2.3) * curve * wobble)),
                maxTokens
            };
        }).sort((a, b) => b.tokens - a.tokens);

        setTokenData(prev => ({
            ...prev,
            total: MAX_TOTAL,
            used: currentTotalUsed,
            remaining: MAX_TOTAL - currentTotalUsed,
            byUser: newByUser,
            byService: newByService
        }));

    }, [cyclePhase]);


    // Logs Ticker (Separate interval) - only when animation is playing and filling
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPlaying || cyclePhase < 0.05) return;
            // Only add logs when there is activity (filling phase or high cyclePhase)
            if (cyclePhase > 0.1) {
                const now = new Date();
                const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                const randomUser = mockTokenData.byUser[Math.floor(Math.random() * mockTokenData.byUser.length)].user;
                const randomService = mockTokenData.byService[Math.floor(Math.random() * mockTokenData.byService.length)].service;
                const isSuccess = Math.random() > 0.05; // Mostly success

                const newLog = {
                    id: Date.now(),
                    time: timeString,
                    user: randomUser,
                    service: randomService,
                    tokens: Math.floor(Math.random() * 800 * cyclePhase) + 10, // More tokens when busier
                    status: isSuccess ? "success" : "error"
                };

                setLiveLogs(prev => [newLog, ...prev].slice(0, 8));
            }
        }, 600);
        return () => clearInterval(interval);
    }, [cyclePhase, isPlaying]);


    // Animated numbers: al reset (used/remaining en cero/total) duración 0 para ver cero al instante
    const animatedTotal = useAnimatedNumber(tokenData.total, 580);
    const animatedUsed = useAnimatedNumber(tokenData.used, tokenData.used === 0 ? 0 : 580);
    const animatedRemaining = useAnimatedNumber(tokenData.remaining, tokenData.remaining === tokenData.total ? 0 : 580);

    const usagePercentage = (tokenData.used / tokenData.total) * 100;

    // Interpola entre dos colores hex; t en [0,1]. Suavizado con ease para transición suave.
    const lerpHex = (hex1: string, hex2: string, t: number): string => {
        const smooth = (x: number) => x * x * (3 - 2 * x); // smoothstep
        const s = smooth(Math.max(0, Math.min(1, t)));
        const r1 = parseInt(hex1.slice(1, 3), 16), g1 = parseInt(hex1.slice(3, 5), 16), b1 = parseInt(hex1.slice(5, 7), 16);
        const r2 = parseInt(hex2.slice(1, 3), 16), g2 = parseInt(hex2.slice(3, 5), 16), b2 = parseInt(hex2.slice(5, 7), 16);
        const r = Math.round(r1 + (r2 - r1) * s);
        const g = Math.round(g1 + (g2 - g1) * s);
        const b = Math.round(b1 + (b2 - b1) * s);
        return `rgb(${r},${g},${b})`;
    };

    // Color de la barra según porcentaje: azul oscuro (inicio) → azul claro (~50%) → verde (100%), todo suave.
    const getBarColor = (percent: number): string => {
        const p = Math.min(100, Math.max(0, percent)) / 100;
        if (p <= 0.5) return lerpHex("#000223", "#004196", p * 2); // 0% → 50%: oscuro → azul claro
        return lerpHex("#004196", "#6AFF00", (p - 0.5) * 2);         // 50% → 100%: azul claro → verde
    };

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="tokens-dashboard space-y-4 p-4 h-full w-full flex flex-col">

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Available / Total */}
                <div
                    className="card-animate rounded-lg border border-[#D6DBE2] bg-white p-4  relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <svg className="w-8 h-8 text-[#004196]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="mb-2 text-xs font-medium text-[#004196] uppercase tracking-wider">
                        {t.totalTokens}
                    </div>
                    <div className="text-xl font-bold text-[#000223] tabular-nums tracking-tight">
                        {animatedTotal.toLocaleString()}
                    </div>
                    {/* Progress Line for visual flair */}
                    <div className="absolute bottom-0 left-0 h-1 bg-[#D6DBE2] w-full">
                        <div className="h-full bg-[#004196]/20 transition-all duration-200" style={{ width: '100%' }}></div>
                    </div>
                </div>

                {/* Used (Live Pulse) */}
                <div
                    className={`card-animate rounded-lg border bg-white p-4  relative overflow-hidden transition-colors duration-500 ${isDraining ? 'border-[#004196]/40 bg-[#004196]/5' : 'border-[#D6DBE2] bg-[#D6DBE2]/25'}`}
                >
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <div className={`${isDraining ? 'animate-pulse' : 'animate-spin-slow'}`}>
                            <svg className={`w-8 h-8 ${isDraining ? 'text-[#004196]' : 'text-[#000223]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className={`mb-2 text-xs font-medium uppercase tracking-wider flex items-center justify-between ${isDraining ? 'text-[#004196]' : 'text-[#000223]'}`}>
                        {t.tokensUsed}
                        <span className="flex h-2 w-2 relative">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${isDraining ? 'bg-[#004196]/60' : 'bg-[#000223]/40'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isDraining ? 'bg-[#004196]' : 'bg-[#000223]'}`}></span>
                        </span>
                    </div>
                    <div className="text-2xl font-black text-[#000223] tabular-nums tracking-tight">
                        {animatedUsed.toLocaleString()}
                    </div>
                    {/* Capacity bar */}
                    <div className="mt-2 w-full h-1.5 bg-[#D6DBE2] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-[width,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{ width: `${Math.min(usagePercentage, 100)}%`, backgroundColor: getBarColor(usagePercentage) }}
                        ></div>
                    </div>
                </div>

                {/* Remaining */}
                <div
                    className="card-animate rounded-lg border border-[#D6DBE2] bg-white p-4 "
                >
                    <div className="mb-2 text-xs font-medium text-[#004196] uppercase tracking-wider">
                        {t.tokensRemaining}
                    </div>
                    <div className="text-xl font-bold text-[#000223] tabular-nums tracking-tight">
                        {animatedRemaining.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Middle Section: Live Bars */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Users Bar Chart */}
                <div className="rounded-lg border border-[#D6DBE2] bg-white p-4 ">
                    <h3 className="mb-3 text-xs font-bold text-[#004196] uppercase tracking-wider flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        {t.byUser}
                    </h3>
                    <div className="space-y-2">
                        {tokenData.byUser.slice(0, 5).map((item, index) => (
                            <div key={item.user} className="w-full">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium truncate text-[#000223] w-24">{item.user.split('@')[0]}</span>
                                    <span className="font-mono text-[#004196]">{item.tokens.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#D6DBE2] rounded-full overflow-hidden">
                                    {(() => {
                                        const maxT = (item as { maxTokens?: number }).maxTokens ?? tokenData.byUser[0]?.tokens ?? 1;
                                        const percent = Math.min((item.tokens / maxT) * 100, 100);
                                        return (
                                            <div
                                                className="h-full rounded-full transition-[width,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                                style={{ width: `${percent}%`, backgroundColor: getBarColor(percent) }}
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Services Bar Chart */}
                <div className="rounded-lg border border-[#D6DBE2] bg-white p-4 ">
                    <h3 className="mb-3 text-xs font-bold text-[#004196] uppercase tracking-wider flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        {t.byService}
                    </h3>
                    <div className="space-y-2">
                        {tokenData.byService.slice(0, 5).map((item, index) => (
                            <div key={item.service} className="w-full">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-[#000223]">{item.service}</span>
                                    <span className="font-mono text-[#004196]">{item.tokens.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#D6DBE2] rounded-full overflow-hidden">
                                    {(() => {
                                        const maxT = (item as { maxTokens?: number }).maxTokens ?? tokenData.byService[0]?.tokens ?? 1;
                                        const percent = Math.min((item.tokens / maxT) * 100, 100);
                                        return (
                                            <div
                                                className="h-full rounded-full transition-[width,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                                style={{ width: `${percent}%`, backgroundColor: getBarColor(percent) }}
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Live Logs Section (New Ticker) */}
            <div className="flex-1 min-h-0 rounded-lg border border-[#D6DBE2] bg-[#D6DBE2]/35 p-4  flex flex-col">
                <h3 className="mb-2 text-xs font-bold text-[#004196] uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <svg className={`w-4 h-4 animate-pulse ${isDraining ? 'text-[#004196]' : 'text-[#6AFF00]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Live Traffic
                    </span>
                    <span className="font-mono text-[10px] bg-white px-1 rounded text-[#000223]">
                        {isDraining ? 'DRAINING BUFFER' : 'PROCESSING REQUESTS'}
                    </span>
                </h3>

                <div className="overflow-hidden relative flex-1">
                    <div className="absolute inset-0 space-y-2">
                        {liveLogs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between text-xs p-2 bg-white rounded border border-[#D6DBE2]  animate-in slide-in-from-top-2 fade-in duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-[#004196] text-[10px]">{log.time}</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-[#6AFF00]' : 'bg-[#004196]'}`}></span>
                                    <span className="font-medium text-[#000223]">{log.service}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[#004196] max-w-[120px] truncate hidden sm:block">{log.user}</span>
                                    <span className="font-mono font-semibold text-[#000223]">+{log.tokens} tkns</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Gradient Fade at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#D6DBE2]/60 to-transparent pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
}
