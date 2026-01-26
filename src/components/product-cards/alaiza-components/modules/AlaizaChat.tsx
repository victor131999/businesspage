import React, { useState, useRef, useEffect } from "react";

/* -- Types -- */
interface Message {
    id: string;
    text: string;
    sender: "user" | "bot" | "system";
    timestamp: string;
}

interface AlaizaChatProps {
    onBack: () => void; // Although in the main card this might not be used if it's the default view, keeping it for consistency or if we want to allow going "back" to a main menu if it existed.
    // Actually, checking design: Main Alaiza Card has a module selector.
    // The "Back" button in the Astro file goes to... nowhere specific, it just says "< back".
    // In our React implementation, the top nav switches modules.
    // We'll accept standard props.
}

export default function AlaizaChat() {
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
    const [showIntro, setShowIntro] = useState(true);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Theme
    const themeColor = "#004492";

    // Helper: Format time
    function formatTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    // Scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages, isTyping, typingMessage, isTransferring, isTransferred]);

    // Response Generation Logic
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

        // Hide intro on first message
        if (showIntro) setShowIntro(false);

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

        // Simulate Human Transfer after 3 messages (Demo Flow)
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

        // Standard Bot Reply
        setIsTyping(true);
        setTypingMessage("");
        const response = generateResponse(userInput);
        let currentIndex = 0;

        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        // Typewriter effect
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

    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {/* Header */}
            <div className="relative mb-3 mt-8 flex flex-shrink-0 items-center justify-between px-5 z-10">
                <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
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

            {/* GIF Animation - Background Layer */}
            <div className="absolute top-12 left-0 right-0 flex justify-center z-0 pointer-events-none">
                <img
                    src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                    alt="Connecting Animation"
                    className="h-48 w-48 object-contain opacity-90 mix-blend-multiply"
                />
            </div>

            {/* Main Content Area - Glassmorphism Card */}
            <div
                className="relative z-10 flex-1 flex flex-col overflow-hidden rounded-t-2xl backdrop-blur-sm mx-0 mb-0 mt-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.45)",
                }}
            >
                {/* Intro Header (Disappears on interaction) */}
                {showIntro && !messages.some(m => m.sender === 'user') && (
                    <div className="mb-4 flex-shrink-0 px-5 pt-8 fade-out-transition">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center p-2 shadow-sm border border-gray-100">
                                <img
                                    src="/images/iconAlaiza.svg"
                                    alt="Alaiza"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-gray-900">Alaiza</h2>
                                <p className="text-sm text-[#8B5CF6] font-medium">AI Financial Assistant</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto min-h-0 flex flex-col px-5 pb-4 pt-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => {
                            // System Message
                            if (message.sender === "system") {
                                return (
                                    <div key={message.id} className="flex items-center justify-center py-4">
                                        <div className="flex flex-col items-center gap-2 rounded-lg bg-green-50 px-4 py-3 border border-green-200 max-w-[90%] shadow-sm">
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

                            // Bot Message (First one special styling if intro visible? No, consistency with Astro)
                            if (message.sender === "bot") {
                                return (
                                    <div key={message.id} className="flex items-start gap-3 animate-fade-in-up">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white ring-1 ring-gray-100 shadow-sm mt-1">
                                            <img src="/images/iconAlaiza.svg" alt="Alaiza" className="h-5 w-5 object-contain" />
                                        </div>
                                        <div className="flex-1 max-w-[85%] rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-sm border border-gray-100">
                                            <p className="text-sm leading-relaxed text-gray-800">{message.text}</p>
                                            <p className="mt-1 text-[10px] font-semibold text-gray-400">{message.timestamp}</p>
                                        </div>
                                    </div>
                                );
                            }

                            // User Message
                            return (
                                <div key={message.id} className="flex items-start gap-2.5 justify-end animate-fade-in-up">
                                    <div className="flex-1 max-w-[85%] rounded-2xl rounded-tr-none bg-[#004492] text-right px-4 py-3 shadow-sm">
                                        <p className="text-sm leading-relaxed text-white">{message.text}</p>
                                        <p className="mt-1 text-[10px] font-semibold text-white/80">{message.timestamp}</p>
                                    </div>
                                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center mt-1">
                                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 ring-2 ring-white shadow-sm">
                                            <img src="/images/user/user-03.png" alt="User" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white z-10"></div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Transferring Loading State */}
                        {isTransferring && (
                            <div className="flex items-center justify-center py-4">
                                <div className="flex flex-col items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 border border-blue-200 shadow-sm">
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

                        {/* Typing Indicator (Text) */}
                        {isTyping && typingMessage && !isTransferring && (
                            <div className="flex items-start gap-3 animate-fade-in-up">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white ring-1 ring-gray-100 shadow-sm mt-1">
                                    <img src="/images/iconAlaiza.svg" alt="Alaiza" className="h-5 w-5 object-contain" />
                                </div>
                                <div className="flex-1 max-w-[85%] rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-sm border border-gray-100">
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        {typingMessage}
                                        <span className="inline-block w-0.5 h-4 bg-gray-800 ml-1 animate-pulse align-middle"></span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Typing Indicator (Dots) */}
                        {isTyping && !typingMessage && !isTransferring && (
                            <div className="flex items-start gap-3 animate-fade-in-up">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white ring-1 ring-gray-100 shadow-sm mt-1">
                                    <img src="/images/iconAlaiza.svg" alt="Alaiza" className="h-5 w-5 object-contain" />
                                </div>
                                <div className="flex-1 max-w-[20%] rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-1.5 py-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* Chat Input Footer */}
            <div className="bg-[#113256] px-4 py-3 pb-6 flex-shrink-0 z-20 shadow-[-2px_-4px_10px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-2">
                    {/* Emoji/Attach Button */}
                    <button className="flex h-10 w-10 shrink-0 items-center justify-center text-white/70 hover:text-white transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>

                    {/* Input Area */}
                    <div className="flex-1 relative h-10 flex items-center">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            placeholder={isTransferred ? "Tu conversación ha sido transferida..." : "Escribe tu mensaje..."}
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                if (textareaRef.current) {
                                    textareaRef.current.style.height = "auto";
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
                            className="w-full resize-none rounded-xl bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004492]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                maxHeight: "120px",
                                minHeight: "40px",
                                lineHeight: "1.4"
                            }}
                        />
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isTyping || isTransferring || isTransferred}
                        className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: !inputText.trim() || isTyping || isTransferring || isTransferred
                                ? 'rgba(255,255,255,0.1)'
                                : '#3B82F6', // Lighter blue for better visibility on dark bg
                        }}
                    >
                        <svg className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
            </div>

            <style>{`
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
