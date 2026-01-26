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
            const startValue = 0;

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
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Números animados con delays escalonados
    const animatedTotal = useAnimatedNumber(mockTokenData.total, 2000, 200);
    const animatedUsed = useAnimatedNumber(mockTokenData.used, 2000, 400);
    const animatedRemaining = useAnimatedNumber(mockTokenData.remaining, 2000, 600);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Trigger visibility animation
        setIsVisible(true);
    }, []);

    const usagePercentage = (mockTokenData.used / mockTokenData.total) * 100;

    return (
        <div className="tokens-dashboard space-y-4 p-4 h-full w-full">
            {/* Token Consumption Overview - 3 Tarjetas Superiores */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Tarjeta 1: Total Tokens */}
                <div 
                    className="card-animate rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {t.totalTokens}
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                        {animatedTotal.toLocaleString()}
                    </div>
                </div>
                {/* Tarjeta 2: Tokens Usados */}
                <div 
                    className="card-animate rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    style={{ animationDelay: '0.2s' }}
                >
                    <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {t.tokensUsed}
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                        {animatedUsed.toLocaleString()}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {usagePercentage.toFixed(1)}% {t.tokensUsed.toLowerCase()}
                    </div>
                </div>
                {/* Tarjeta 3: Tokens Restantes */}
                <div 
                    className="card-animate rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    style={{ animationDelay: '0.3s' }}
                >
                    <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {t.tokensRemaining}
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                        {animatedRemaining.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Sección de Barras de Progreso - 2 Columnas */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Consumo por Usuario - Barras AZULES */}
                <div 
                    className="card-animate rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    style={{ animationDelay: '0.4s' }}
                >
                    <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                        {t.tokenConsumption} - {t.byUser}
                    </h3>
                    <div className="space-y-3">
                        {mockTokenData.byUser.map((item, index) => (
                            <div 
                                key={index}
                                className="bar-item"
                                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                                        {item.user}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                        {item.tokens.toLocaleString()} ({item.percentage}%)
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="bar-progress h-full rounded-full"
                                        style={{
                                            width: isVisible ? `${item.percentage}%` : '0%',
                                            backgroundColor: "#004492", // 🔵 AZUL
                                            transition: `width 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.6 + index * 0.1}s`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Consumo por Servicio - Barras VERDES */}
                <div 
                    className="card-animate rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    style={{ animationDelay: '0.5s' }}
                >
                    <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                        {t.tokenConsumption} - {t.byService}
                    </h3>
                    <div className="space-y-3">
                        {mockTokenData.byService.map((item, index) => (
                            <div 
                                key={index}
                                className="bar-item"
                                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.service}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.tokens.toLocaleString()} ({item.percentage}%)
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="bar-progress h-full rounded-full"
                                        style={{
                                            width: isVisible ? `${item.percentage}%` : '0%',
                                            backgroundColor: "#10B981", // 🟢 VERDE
                                            transition: `width 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.7 + index * 0.1}s`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
