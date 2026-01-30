"use client";
import { useState, useEffect } from "react";

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

// Hook para animar números
const useAnimatedNumber = (target: number, duration: number = 2000, delay: number = 0) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
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

export default function TokensDashboard() {
    const t = translations['es'];
    const [isVisible, setIsVisible] = useState(false);

    // Config for cycle
    const CYCLE_DURATION = 18000; // 18 seconds full cycle

    // State for dynamic data
    const [tokenData, setTokenData] = useState(mockTokenData);
    const [liveLogs, setLiveLogs] = useState(mockLogs.slice(0, 7));
    const [cyclePhase, setCyclePhase] = useState(0); // 0 to 1 (progress of filling)
    const [isDraining, setIsDraining] = useState(false); // Mode

    // Cycle Engine
    useEffect(() => {
        let startTime = Date.now();
        let frameId: number;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;

            // Calculate phase based on time
            // We want: 0 -> 1 (Filling) over X seconds, then Fast Drain 1 -> 0

            if (!isDraining) {
                // Filling Phase
                let progress = elapsed / (CYCLE_DURATION * 0.82); // 82% of time is filling
                if (progress >= 1) {
                    progress = 1;
                    setIsDraining(true);
                    startTime = Date.now(); // Reset time for drain phase
                }
                setCyclePhase(progress);
            } else {
                // Draining Phase (Faster)
                let progress = 1 - (elapsed / (CYCLE_DURATION * 0.18)); // 18% of time is draining
                if (progress <= 0.15) { // Never go below 15% to avoid visual flash
                    progress = 0.15;
                    setIsDraining(false);
                    startTime = Date.now(); // Reset for fill phase
                }
                setCyclePhase(progress);
            }

            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [isDraining]);

    // Apply phase to data
    useEffect(() => {
        // Base values (max capacity)
        const MAX_TOTAL = 10000000; // 10M capacity

        // Varying growth curves for realism
        // We use the cyclePhase (0-1) to determine how "full" things are.
        // Add some noise so they don't move perfectly in sync

        const time = Date.now();
        const smoothNoise = Math.floor(20000 * (0.5 + 0.5 * Math.sin(time / 1200))); // Subtle, smooth noise
        const currentTotalUsed = Math.floor(MAX_TOTAL * 0.9 * cyclePhase) + smoothNoise; // Up to 90% full + subtle noise

        // Update users
        const newByUser = mockTokenData.byUser.map((u, i) => {
            // Each user has a slightly different curve
            const curve = Math.pow(cyclePhase, 1 + (i * 0.1)); // Different exponential growth
            const wobble = 0.96 + 0.04 * Math.sin(time / 1400 + i);
            return {
                ...u,
                tokens: Math.max(0, Math.floor((u.tokens * 2.3) * curve * wobble)) // Scale up existing mock as base
            };
        }).sort((a, b) => b.tokens - a.tokens);

        // Update services
        const newByService = mockTokenData.byService.map((s, i) => {
            const curve = Math.pow(cyclePhase, 1 + (i * 0.05));
            const wobble = 0.96 + 0.04 * Math.sin(time / 1500 + i);
            return {
                ...s,
                tokens: Math.max(0, Math.floor((s.tokens * 2.3) * curve * wobble))
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


    // Logs Ticker (Separate interval)
    useEffect(() => {
        const interval = setInterval(() => {
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
    }, [cyclePhase]);


    // Animated numbers hooks
    // Use a very short duration because the state updates are frequent (animation frame driven)
    const animatedTotal = useAnimatedNumber(tokenData.total, 580);
    const animatedUsed = useAnimatedNumber(tokenData.used, 580);
    const animatedRemaining = useAnimatedNumber(tokenData.remaining, 580);

    const usagePercentage = (tokenData.used / tokenData.total) * 100;

    const getFillClass = (percent: number) => {
        if (percent >= 85) return "bg-[#6AFF00]";
        if (percent >= 60) return "bg-[#004196]";
        return "bg-[#000223]";
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
                            className={`h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDraining ? 'bg-[#004196]' : 'bg-[#000223]'}`}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
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
                                        const percent = Math.min((item.tokens / (tokenData.byUser[0].tokens || 1)) * 100, 100);
                                        return (
                                            <div
                                                className={`h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getFillClass(percent)}`}
                                                style={{ width: `${percent}%` }}
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
                                        const percent = Math.min((item.tokens / (tokenData.byService[0].tokens || 1)) * 100, 100);
                                        return (
                                            <div
                                                className={`h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getFillClass(percent)}`}
                                                style={{ width: `${percent}%` }}
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
