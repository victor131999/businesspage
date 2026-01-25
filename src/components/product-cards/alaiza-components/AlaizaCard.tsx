import { useState, useRef, useEffect } from "react";

/* -- Types -- */
type ModuleType = "chat" | "financial-education" | "behavior-analysis";
type FinancialEducationScreen = "summary" | "streak" | "graph" | "learn" | "learn-content";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot" | "system";
    timestamp: string;
}

interface Notification {
    id: string;
    categoryId: string;
    title: string;
    message: string;
    timestamp: string;
    badge?: number;
    color: string;
}

/* -- Main Component -- */
export default function AlaizaCard() {
    // Module Navigation
    const [currentModule, setCurrentModule] = useState<ModuleType>("chat");

    // Chat State
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "¡Hola! Soy Alaiza, tu asistente financiero inteligente. ¿En qué puedo ayudarte hoy?",
            sender: "bot",
            timestamp: formatTime(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [typingMessage, setTypingMessage] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);
    const [isTransferred, setIsTransferred] = useState(false);

    // Financial Education State
    const [feScreen, setFeScreen] = useState<FinancialEducationScreen>("summary");
    const [selectedTip, setSelectedTip] = useState<string | null>(null);
    const [activeMetricIndex, setActiveMetricIndex] = useState(1);
    const [selectedTimeframe, setSelectedTimeframe] = useState("1W");

    // Behavior Analysis State
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isRunningRef = useRef(false);
    const abortDemo = useRef(false);

    // Theme
    const themeColor = "#004492";

    // Config
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
                image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400"
            }
        ]
    };

    const baConfig = {
        cardHeight: 85,
        cardGap: 10,
        stackOffset: 12,
        stackScale: 0.05,
        stackVisibleCount: 3,
    };

    const sampleNotifications = [
        {
            title: "Gasto inusual detectado",
            message: "Has gastado $500 en restaurantes esta semana, un 40% más que tu promedio.",
            color: "#ef4444",
        },
        {
            title: "Patrón de ahorro positivo",
            message: "Has ahorrado consistentemente durante los últimos 7 días. ¡Sigue así!",
            color: "#10b981",
        },
        {
            title: "Recordatorio de pago",
            message: "Tu factura de servicios públicos vence en 2 días. ¿Quieres configurar el pago automático?",
            color: "#3b82f6",
        },
    ];

    // Helper: Format time
    function formatTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    const formatTime24 = () => {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    // Update time for BA
    useEffect(() => {
        if (currentModule === "behavior-analysis") {
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }
    }, [currentModule]);

    // Scroll to bottom for chat
    useEffect(() => {
        if (currentModule === "chat" && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages, isTyping, typingMessage, isTransferring, isTransferred, currentModule]);

    // Auto-add notifications for BA
    useEffect(() => {
        if (currentModule !== "behavior-analysis") return;

        const addNotification = () => {
            const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
            const nowLabel = formatTime24();

            const newNotif: Notification = {
                id: crypto.randomUUID(),
                categoryId: "default",
                title: randomNotif.title,
                message: randomNotif.message,
                timestamp: nowLabel,
                color: randomNotif.color,
            };

            setNotifications((prev) => [newNotif, ...prev]);
        };

        if (notifications.length === 0) {
            addNotification();
        }

        notificationIntervalRef.current = setInterval(() => {
            if (notifications.length < 5) {
                addNotification();
            }
        }, 5000);

        return () => {
            if (notificationIntervalRef.current) {
                clearInterval(notificationIntervalRef.current);
            }
        };
    }, [currentModule, notifications.length]);

    // ========== CHAT FUNCTIONS ==========
    const generateResponse = (userMessage: string): string => {
        const message = userMessage.toLowerCase().trim();
        if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
            return "¡Hola! Me alegra saludarte. ¿Cómo puedo ayudarte con tus finanzas hoy?";
        }
        if (message.includes('saldo') || (message.includes('dinero') && message.includes('tengo'))) {
            return "Tu saldo actual es de $1,250.00 MXN. ¿Te gustaría ver tus movimientos recientes?";
        }
        if (message.includes('transferir') || message.includes('transferencia')) {
            return "Para realizar una transferencia, puedes usar la opción 'Transferencias' en el menú principal. ¿Necesitas ayuda con algún paso específico?";
        }
        if (message.includes('pagar') || message.includes('pago')) {
            return "Puedes realizar pagos desde la sección 'Pagos' de la app. ¿Quieres pagar con tarjeta o transferencia?";
        }
        if (message.includes('tarjeta')) {
            if (message.includes('bloquear')) {
                return "Para bloquear tu tarjeta, ve a 'Tarjetas' > 'Gestionar' > 'Bloquear tarjeta'. ¿Quieres que te guíe paso a paso?";
            }
            return "Puedo ayudarte a gestionar tus tarjetas. ¿Qué necesitas hacer? (activar, bloquear, consultar límite, etc.)";
        }
        if (message.includes('movimiento') || message.includes('historial')) {
            return "Puedes ver tus movimientos en la sección 'Actividad' de la app. ¿Quieres filtrar por fecha o tipo de transacción?";
        }
        if (message.includes('ayuda') || message.includes('ayudar')) {
            return "Estoy aquí para ayudarte. Puedo ayudarte con consultas de saldo, transferencias, pagos, gestión de tarjetas y más. ¿Qué necesitas?";
        }
        if (message.includes('gracias') || message.includes('chao') || message.includes('adiós')) {
            return "¡De nada! Estoy aquí cuando me necesites. ¡Que tengas un excelente día!";
        }
        return "Entiendo tu consulta. ¿Podrías ser más específico? Puedo ayudarte con saldos, transferencias, pagos, tarjetas y más.";
    };

    const handleSendMessage = () => {
        if (!inputText.trim() || isTyping || isTransferring || isTransferred) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: "user",
            timestamp: formatTime(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const userInput = inputText.trim();
        setInputText("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "40px";
        }

        const userMessagesCount = messages.filter(m => m.sender === "user").length + 1;

        if (userMessagesCount >= 3) {
            setIsTyping(true);
            setIsTransferring(true);
            setTypingMessage("");

            setTimeout(() => {
                setIsTyping(false);
                setIsTransferring(false);
                setIsTransferred(true);
                const transferMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Tu conversación ha sido transferida a un agente humano. Pronto te atenderá.",
                    sender: "system",
                    timestamp: formatTime(),
                };
                setMessages((prev) => [...prev, transferMessage]);
            }, 2000);
            return;
        }

        setIsTyping(true);
        setTypingMessage("");
        const response = generateResponse(userInput);
        let currentIndex = 0;

        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        typingIntervalRef.current = setInterval(() => {
            if (currentIndex < response.length) {
                setTypingMessage(response.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                    typingIntervalRef.current = null;
                }
                setIsTyping(false);
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: response,
                    sender: "bot",
                    timestamp: formatTime(),
                };
                setMessages((prev) => [...prev, botMessage]);
                setTypingMessage("");
            }
        }, 30);
    };

    // ========== DEMO FLOW ==========
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

    const handlePlayDemo = async () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        abortDemo.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        // Reset all states
        setCurrentModule("chat");
        setMessages([{
            id: "1",
            text: "¡Hola! Soy Alaiza, tu asistente financiero inteligente. ¿En qué puedo ayudarte hoy?",
            sender: "bot",
            timestamp: formatTime(),
        }]);
        setInputText("");
        setIsTyping(false);
        setTypingMessage("");
        setIsTransferring(false);
        setIsTransferred(false);
        setFeScreen("summary");
        setSelectedTip(null);
        setActiveMetricIndex(1);
        setNotifications([]);
        setIsExpanded(false);

        try {
            // Chat demo
            await wait(2000);
            const msg1 = "Hola, ¿cuál es mi saldo?";
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                text: msg1,
                sender: "user",
                timestamp: formatTime(),
            }]);
            await wait(1000);
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                text: generateResponse(msg1),
                sender: "bot",
                timestamp: formatTime(),
            }]);
            await wait(2000);

            // Switch to Financial Education
            setCurrentModule("financial-education");
            await wait(2000);
            setFeScreen("streak");
            await wait(2000);
            setFeScreen("graph");
            await wait(2000);
            setFeScreen("learn");
            await wait(2000);
            setSelectedTip("tip-1");
            setFeScreen("learn-content");
            await wait(2000);
            setFeScreen("summary");
            await wait(2000);

            // Switch to Behavior Analysis
            setCurrentModule("behavior-analysis");
            await wait(2000);
            setIsExpanded(true);
            await wait(2000);
            setIsExpanded(false);
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
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
        if (notificationIntervalRef.current) {
            clearInterval(notificationIntervalRef.current);
            notificationIntervalRef.current = null;
        }
        window.dispatchEvent(new CustomEvent('zelify:demo-end'));
    };

    // Event listeners
    useEffect(() => {
        window.addEventListener('zelify:play-demo:alaiza', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:alaiza', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:alaiza', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:alaiza', handleStopDemo);
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
            if (notificationIntervalRef.current) {
                clearInterval(notificationIntervalRef.current);
            }
        };
    }, []);

    // ========== RENDER FUNCTIONS ==========

    // Render Module Selector
    const renderModuleSelector = () => {
        if (currentModule !== "chat") return null;

        return (
            <div className="absolute top-20 left-0 right-0 z-30 px-4">
                <div className="flex justify-center gap-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
                    <button
                        onClick={() => setCurrentModule("financial-education")}
                        className="px-4 py-2 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Educación
                    </button>
                    <button
                        onClick={() => setCurrentModule("behavior-analysis")}
                        className="px-4 py-2 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Análisis
                    </button>
                </div>
            </div>
        );
    };

    // Render Chat Module
    const renderChatModule = () => {
        const hasUserMessages = messages.some((m) => m.sender === "user");

        return (
            <>
                {/* Header */}
                <div className="relative mb-3 mt-8 flex flex-shrink-0 items-center justify-between px-5 z-10">
                    <button className="text-sm font-medium text-gray-500">
                        ← Atrás
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <img
                            src="/images/zelify_logo.png"
                            alt="Zelify Logo"
                            className="h-8 max-w-full object-contain"
                        />
                    </div>
                    <div className="w-12"></div>
                </div>

                {/* GIF Animation */}
                <div className="relative -mb-16 flex-shrink-0 z-0 flex justify-center">
                    <img
                        src="/ANIMACION%201.gif"
                        alt="Connecting Animation"
                        className="h-48 w-48 object-contain opacity-90"
                    />
                </div>

                {/* Chat Card */}
                <div
                    className="relative z-10 flex-1 overflow-hidden rounded-2xl p-5 backdrop-blur-sm mx-4 flex flex-col min-h-0 mb-20"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.35)",
                    }}
                >
                    {!hasUserMessages && (
                        <div className="mb-4 flex-shrink-0">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white flex items-center justify-center p-1.5">
                                    <img
                                        src="/images/iconAlaiza.svg"
                                        alt="Alaiza"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-dark">
                                        Alaiza
                                    </h2>
                                    <p className="text-sm text-[#8B5CF6]">
                                        AI Financial Assistant
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
                        <div className="space-y-4">
                            {messages.map((message, index) => {
                                if (message.sender === "system") {
                                    return (
                                        <div key={message.id} className="flex items-center justify-center py-4">
                                            <div className="flex flex-col items-center gap-2 rounded-lg bg-green-50 px-4 py-3 border border-green-200 max-w-[85%]">
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-sm font-medium text-green-700 text-center">
                                                        {message.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                if (message.sender === "bot" && index === 0 && !hasUserMessages) {
                                    return (
                                        <div key={message.id} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center p-1">
                                                <img src="/images/iconAlaiza.svg" alt="Alaiza" className="h-full w-full object-contain" />
                                            </div>
                                            <div className="flex-1 max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 shadow-sm">
                                                <p className="text-sm leading-relaxed text-dark">{message.text}</p>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={message.id} className={`flex items-start gap-2.5 ${message.sender === "user" ? "justify-end" : ""}`}>
                                        {message.sender === "bot" && (
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-primary/10 ring-2 ring-white">
                                                <img src="/images/iconAlaiza.svg" alt="Alaiza" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                        <div className={`flex-1 max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ${
                                            message.sender === "user" ? "rounded-tr-sm bg-primary text-right" : "rounded-tl-sm bg-gray-100"
                                        }`}>
                                            <p className={`text-sm leading-relaxed ${message.sender === "user" ? "text-white" : "text-dark"}`}>
                                                {message.text}
                                            </p>
                                            <p className={`mt-1 text-[10px] font-semibold ${message.sender === "user" ? "text-white opacity-90" : "text-gray-500"}`}>
                                                {message.timestamp}
                                            </p>
                                        </div>
                                        {message.sender === "user" && (
                                            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 ring-2 ring-white">
                                                    <img src="/images/user/user-03.png" alt="User" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white z-10"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {isTransferring && (
                                <div className="flex items-center justify-center py-4">
                                    <div className="flex flex-col items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 border border-blue-200">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            <p className="text-sm font-medium text-blue-700">Transfiriendo...</p>
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                                        </div>
                                        <p className="text-xs text-blue-600">Conectando con un agente humano</p>
                                    </div>
                                </div>
                            )}

                            {isTyping && typingMessage && !isTransferring && (
                                <div className="flex items-start gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-primary/10 ring-2 ring-white">
                                        <img src="/images/iconAlaiza.svg" alt="Alaiza" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 shadow-sm">
                                        <p className="text-sm text-dark leading-relaxed">
                                            {typingMessage}
                                            <span className="inline-block w-0.5 h-4 bg-dark ml-1 animate-pulse">|</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {isTyping && !typingMessage && !isTransferring && (
                                <div className="flex items-start gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-primary/10 ring-2 ring-white">
                                        <img src="/images/iconAlaiza.svg" alt="Alaiza" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 shadow-sm">
                                        <div className="flex items-center gap-1 py-1">
                                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                {/* Chat Input Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#113256] px-4 py-3 flex-shrink-0 mx-4 mb-4 rounded-t-2xl z-20">
                    <div className="flex items-center gap-2">
                        <button className="flex h-8 w-8 shrink-0 items-center justify-center text-white">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <div className="flex-1 relative h-10 flex items-center">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                placeholder={isTransferred ? "Tu conversación ha sido transferida a un agente humano" : "Escribe tu mensaje..."}
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    if (textareaRef.current) {
                                        textareaRef.current.style.height = "40px";
                                        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
                                    }
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                maxLength={500}
                                disabled={isTyping || isTransferring || isTransferred}
                                className="h-full w-full resize-none rounded-lg bg-white px-4 py-2 text-sm text-dark placeholder-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ maxHeight: "120px", fontSize: "14px", lineHeight: "1.5" }}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim() || isTyping || isTransferring || isTransferred}
                            className="group relative flex h-8 w-8 shrink-0 items-center justify-center text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded-lg"
                            style={{
                                backgroundColor: !inputText.trim() || isTyping || isTransferring || isTransferred ? '#9BA2AF' : themeColor,
                                boxShadow: !inputText.trim() || isTyping || isTransferring || isTransferred ? 'none' : `0 4px 14px 0 ${themeColor}40`,
                            }}
                        >
                            <svg className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </>
        );
    };

    // Render Financial Education Module
    const renderFinancialEducationModule = () => {
        const renderScoreRing = (score: number, size = 200) => {
            const radius = (size - 20) / 2;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (score / 100) * circumference;

            return (
                <div className="relative" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="transform -rotate-90">
                        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth="10" fill="none" />
                        <circle cx={size / 2} cy={size / 2} r={radius} stroke={themeColor} strokeWidth="10" fill="none"
                            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold" style={{ color: themeColor }}>{score}</span>
                        <span className="text-xs text-gray-500">Tu Zelify Score</span>
                    </div>
                </div>
            );
        };

        const renderMetricCard = (index: number, title: string, subtitle: string, percent: number, description: string, isActive: boolean) => {
            const yOffset = isActive ? -20 : 20;
            const scale = isActive ? 1 : 0.85;
            const zIndex = isActive ? 10 : 5 - Math.abs(index - activeMetricIndex);

            return (
                <div className="absolute left-0 right-0 mx-auto transition-all duration-500 cursor-pointer"
                    style={{ transform: `translateY(${yOffset}px) scale(${scale})`, zIndex, opacity: isActive ? 1 : 0.7 }}
                    onClick={() => setActiveMetricIndex(index)}>
                    <div className="rounded-2xl p-4 shadow-lg"
                        style={{ background: isActive ? `linear-gradient(135deg, ${themeColor} 0%, #002a5c 100%)` : "rgba(229, 231, 235, 0.8)" }}>
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className={`text-sm font-bold ${isActive ? "text-white" : "text-gray-700"}`}>{title}</h3>
                                <p className={`text-xs ${isActive ? "text-white/70" : "text-gray-500"}`}>{subtitle}</p>
                            </div>
                            <div className={`text-2xl font-bold ${isActive ? "text-white" : "text-gray-700"}`}>{percent}%</div>
                        </div>
                        {isActive && <p className="text-xs text-white/80 mt-2">{description}</p>}
                    </div>
                </div>
            );
        };

        const renderSummaryScreen = () => {
            const metrics = [
                { title: "Estabilidad", subtitle: "Confianza", percent: feConfig.stabilityIntelligence, description: "Convierte datos de gastos en decisiones inteligentes y resultados efectivos." },
                { title: "Inteligencia", subtitle: "Estrategia", percent: feConfig.stabilityIntelligence, description: "Transforma tus datos en insights claros para optimizar tu consumo." },
                { title: "Disciplina", subtitle: "Hábito", percent: feConfig.discipline, description: "Consistencia en la gestión y cumplimiento de tus objetivos financieros." },
            ];

            return (
                <div className="flex h-full flex-col bg-white">
                    <div className="flex-1 space-y-3 overflow-y-auto px-6 py-6 min-h-0">
                        <div className="flex justify-center pt-4 pb-0">{renderScoreRing(feConfig.zelifyScore)}</div>
                        <div className="relative h-[200px] mt-8">
                            {metrics.map((metric, index) => renderMetricCard(index, metric.title, metric.subtitle, metric.percent, metric.description, index === activeMetricIndex))}
                        </div>
                    </div>
                    <div className="flex-shrink-0 space-y-3 border-t border-gray-200 bg-white px-6 py-4">
                        <div className="flex justify-center gap-3">
                            {[{ key: "streak", label: "Racha", screen: "streak" }, { key: "graph", label: "Gráfico", screen: "graph" }, { key: "learn", label: "Aprender", screen: "learn" }].map((item) => (
                                <button key={item.key} onClick={() => setFeScreen(item.screen as FinancialEducationScreen)}
                                    className="h-10 min-w-[60px] rounded-full px-3 text-[10px] font-medium text-white transition-all active:scale-[0.98]"
                                    style={{ background: `linear-gradient(to bottom, rgba(0, 68, 146, 0.95) 0%, ${themeColor} 50%, rgba(0, 51, 102, 0.95) 100%)`, boxShadow: `0 4px 14px 0 ${themeColor}40` }}>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            );
        };

        const renderStreakScreen = () => {
            const progressPercent = (feConfig.goalProgress.current / feConfig.goalProgress.target) * 100;
            const remainingDays = feConfig.goalProgress.target - feConfig.goalProgress.current;
            const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

            return (
                <div className="flex h-full flex-col bg-white overflow-y-auto min-h-0">
                    <div className="flex-shrink-0 px-6 pt-4">
                        <button onClick={() => setFeScreen("summary")} className="mb-4 text-sm font-medium text-gray-400">← atrás</button>
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{feConfig.streakDays} <span className="text-lg">días de racha</span></h1>
                            <p className="text-sm text-gray-500">Racha Iniciada: {feConfig.streakStartDate}</p>
                        </div>
                    </div>
                    <div className="flex-1 px-6 space-y-6 min-h-0 overflow-y-auto">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Esta Semana</h3>
                            <div className="flex gap-2">
                                {days.map((day, index) => (
                                    <div key={day} className="flex-1">
                                        <div className={`h-12 rounded-lg flex items-center justify-center text-xs font-medium ${feConfig.weeklyProgress[index] ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                                            {day}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-700">{remainingDays} días más</span>
                                <span className="text-gray-500">Para desbloquear tu próxima recompensa</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%`, background: `linear-gradient(to right, ${themeColor}, #10B981)` }} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tus recompensas activas</h3>
                            <div className="space-y-2">
                                {feConfig.activeRewards.map((reward, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                                        <p className="text-sm font-medium text-gray-900">{reward}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const renderGraphScreen = () => {
            const timeframes = ["24H", "1W", "1M", "3M", "6M", "1Y", "All"];
            return (
                <div className="flex h-full flex-col bg-white overflow-y-auto min-h-0">
                    <div className="flex-shrink-0 px-6 pt-4">
                        <button onClick={() => setFeScreen("summary")} className="mb-4 text-sm font-medium text-gray-500">← atrás</button>
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Hoy</h1>
                    </div>
                    <div className="flex-1 px-6 space-y-6 min-h-0 overflow-y-auto">
                        <div className="flex gap-2 overflow-x-auto">
                            {timeframes.map((tf) => (
                                <button key={tf} onClick={() => setSelectedTimeframe(tf)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedTimeframe === tf ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
                                    style={{ background: selectedTimeframe === tf ? `linear-gradient(to right, ${themeColor}, #002a5c)` : undefined }}>
                                    {tf}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {["Todo", "Aumentando", "Gastos", "Ahorros"].map((filter) => (
                                <button key={filter} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600">{filter}</button>
                            ))}
                        </div>
                        <div className="h-64 bg-gradient-to-t from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-2">📊</div>
                                <p className="text-sm text-gray-500">Gráfico de progreso</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <div className="text-2xl font-bold text-blue-600">{feConfig.increasingPercent}%</div>
                                <div className="text-xs text-gray-600">Aumentando</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-xl">
                                <div className="text-2xl font-bold text-red-600">{feConfig.spendingPercent}%</div>
                                <div className="text-xs text-gray-600">Gastos</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <div className="text-2xl font-bold text-green-600">{feConfig.savingsPercent}%</div>
                                <div className="text-xs text-gray-600">Ahorros</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const renderLearnScreen = () => {
            return (
                <div className="flex h-full flex-col bg-white overflow-y-auto min-h-0">
                    <div className="flex-shrink-0 px-6 pt-4">
                        <button onClick={() => setFeScreen("summary")} className="mb-4 text-sm font-medium text-gray-500">← atrás</button>
                        <div className="mb-6 flex justify-center">
                            <img src="/images/zelify_logo.png" alt="Zelify logo" className="h-6 w-auto" />
                        </div>
                    </div>
                    <div className="flex-1 px-6 space-y-6 min-h-0 overflow-y-auto">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tu resumen semanal</h3>
                            <p className="text-sm text-gray-600">{feConfig.weeklySummary}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Nuestros consejos para ti</h3>
                            <div className="space-y-3">
                                {feConfig.tips.map((tip) => (
                                    <div key={tip.id} onClick={() => { setSelectedTip(tip.id); setFeScreen("learn-content"); }}
                                        className="relative h-48 rounded-2xl overflow-hidden cursor-pointer">
                                        <img src={tip.image} alt={tip.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h4 className="text-white font-semibold text-sm">{tip.title}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const renderLearnContentScreen = () => {
            const selectedTipData = feConfig.tips.find((tip) => tip.id === selectedTip) || feConfig.tips[0];
            return (
                <div className="relative flex h-full flex-col bg-white">
                    <div className="absolute inset-0">
                        <img src={selectedTipData.image} alt={selectedTipData.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                    <div className="relative z-10 flex h-full flex-col">
                        <div className="flex-shrink-0 px-6 pt-4">
                            <button onClick={() => { setFeScreen("learn"); setSelectedTip(null); }} className="text-sm font-medium text-white">← atrás</button>
                        </div>
                        <div className="flex-1" />
                        <div className="flex-shrink-0 px-6 pb-8">
                            <h1 className="text-2xl font-bold text-white drop-shadow-lg mb-2">{selectedTipData.title}</h1>
                            <div className="h-1 w-12 rounded-full bg-white/50" />
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex h-full flex-col bg-white relative">
                <div className="flex-shrink-0 px-6 pt-4">
                    <button onClick={() => setCurrentModule("chat")} className="mb-4 text-sm font-medium text-gray-500">← Atrás</button>
                </div>
                {feScreen === "summary" && renderSummaryScreen()}
                {feScreen === "streak" && renderStreakScreen()}
                {feScreen === "graph" && renderGraphScreen()}
                {feScreen === "learn" && renderLearnScreen()}
                {feScreen === "learn-content" && renderLearnContentScreen()}
            </div>
        );
    };

    // Render Behavior Analysis Module
    const renderBehaviorAnalysisModule = () => {
        const renderNotificationItem = (notif: Notification, index: number) => {
            let translateY = 0;
            let scale = 1;
            let opacity = 0.9;
            let zIndex = 50 - index;

            if (isExpanded) {
                translateY = -(index * (baConfig.cardHeight + baConfig.cardGap));
            } else {
                if (index < baConfig.stackVisibleCount) {
                    translateY = -(index * baConfig.stackOffset);
                    scale = 1 - (index * baConfig.stackScale);
                    opacity = 1 - (index * 0.15);
                } else {
                    translateY = -((baConfig.stackVisibleCount - 1) * baConfig.stackOffset);
                    scale = 1 - ((baConfig.stackVisibleCount - 1) * baConfig.stackScale);
                    opacity = 0;
                }
            }

            return (
                <div key={notif.id} className="absolute bottom-0 left-0 right-0 origin-bottom transition-all cursor-pointer"
                    style={{ zIndex, opacity, transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                        transition: isExpanded ? "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)" : "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)" }}
                    onClick={() => { if (!isExpanded && notifications.length > 1) setIsExpanded(true); }}>
                    <div className="relative overflow-hidden rounded-[22px] backdrop-blur-2xl transition-all mx-4"
                        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                            border: "1px solid rgba(255,255,255,0.25)", boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.05)", minHeight: baConfig.cardHeight }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
                        <div className="relative p-4">
                            <div className="flex items-start gap-3.5">
                                <div className="h-10 w-10 flex-shrink-0 rounded-[12px] flex items-center justify-center overflow-hidden backdrop-blur-md relative"
                                    style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)",
                                        border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                    <img src="/images/iconAlaiza.svg" className="h-7 w-7 object-contain drop-shadow-sm" alt="Notification Icon" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className="text-[14px] font-semibold text-white truncate pr-2 tracking-wide drop-shadow-sm">{notif.title}</h4>
                                        <span className="text-[12px] text-white/70 flex-shrink-0 font-medium tracking-tight">{notif.timestamp}</span>
                                    </div>
                                    <p className="text-[13px] text-white/90 leading-snug line-clamp-2 drop-shadow-sm font-light">{notif.message}</p>
                                </div>
                            </div>
                        </div>
                        {!isExpanded && index === 0 && notifications.length > 1 && (
                            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)] animate-pulse"></div>
                        )}
                    </div>
                </div>
            );
        };

        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop')`,
                            filter: 'brightness(0.95) contrast(1.1) saturate(1.05)' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
                    </div>
                </div>
                <div className="relative z-20 flex items-center justify-between px-6 pt-10 pb-2">
                    <div className="text-white text-xs font-semibold">9:41</div>
                    <div className="absolute left-1/2 top-3 -translate-x-1/2">
                        <div className="h-7 w-28 rounded-full bg-black flex items-center justify-center">
                            <div className="h-1 w-16 rounded-full bg-gray-900/50"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                        <svg className="h-3 w-4" fill="currentColor" viewBox="0 0 20 12">
                            <path d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-2h2v6H7V4zm3-1h2v7h-2V3z" />
                        </svg>
                        <div className="h-2.5 w-6 rounded-sm border border-white/50 p-[1px]">
                            <div className="h-full w-full rounded-[1px] bg-white"></div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 mt-12 text-center text-white">
                    <div className="text-7xl font-light drop-shadow-md">{formatTime24()}</div>
                    <div className="mt-1 text-lg font-medium drop-shadow-md opacity-90">
                        {currentTime.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex flex-col justify-end px-4 pb-12"
                    onClick={(e) => { if (isExpanded) { e.stopPropagation(); setIsExpanded(false); } }}>
                    <div className="relative w-full overflow-y-auto" style={{ height: isExpanded ? 'auto' : '150px', maxHeight: '60%' }}>
                        <div className="relative w-full" style={{ height: isExpanded ? `${Math.max(120, notifications.length * (baConfig.cardHeight + baConfig.cardGap))}px` : '120px' }}>
                            {notifications.map((notif, index) => {
                                if (!isExpanded && index > 5) return null;
                                return renderNotificationItem(notif, index);
                            })}
                        </div>
                        {notifications.length === 0 && (
                            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center opacity-70">
                                <div className="text-white text-sm text-center font-medium drop-shadow-md px-8">Las notificaciones aparecerán aquí</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30">
                    <div className="h-1.5 w-32 rounded-full bg-white/50 backdrop-blur-md"></div>
                </div>
                <div className="absolute top-4 left-4 z-30">
                    <button onClick={() => setCurrentModule("chat")} className="text-white text-sm font-medium drop-shadow-md">← Atrás</button>
                </div>
            </div>
        );
    };

    // Main Render
    return (
        <div className="flex h-full flex-col overflow-hidden bg-white relative">
            {renderModuleSelector()}
            {currentModule === "chat" && renderChatModule()}
            {currentModule === "financial-education" && renderFinancialEducationModule()}
            {currentModule === "behavior-analysis" && renderBehaviorAnalysisModule()}
        </div>
    );
}
