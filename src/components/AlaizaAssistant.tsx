import React, { useState, useRef, useEffect } from 'react';

type MessageType = 'text' | 'options' | 'audio-message';

interface Option {
    label: string;
    labelKey?: string; // Key para traducion
    action: () => void;
    id: string;
}

interface Message {
    id: string;
    sender: 'bot' | 'user';
    type: MessageType;
    text?: string; // Para mensajes de texto
    options?: Option[]; // Para mensajes con botones
    audioSrc?: string; // Para mensajes que reproducen audio
    played?: boolean; // Para trackear si el audio ya se reprodujo
}

import Lottie from 'lottie-react';

import { ALAIZA_CONTEXT } from "../config/alaiza-context";
import { ALAIZA_TRANSLATIONS } from "../config/alaiza-translations";

export const AlaizaAssistant = () => {
    const linkChat = "https://mailing-production.up.railway.app/ai/process-question";
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationData, setAnimationData] = useState<any>(null);
    const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');
    const langRef = useRef<'es' | 'en'>('es'); // Ref for closures
    const isWelcomeSequenceRunning = useRef(false); // Prevent duplicate welcome sequences

    const t = ALAIZA_TRANSLATIONS[currentLang]; // Access current translations

    // Referencia al elemento de audio actual
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // Referencia al final del chat para scroll automático
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Cargar animación
    useEffect(() => {
        fetch('/gift/voice wave.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Error loading voice wave animation:", err));
    }, []);

    // Scroll al fondo cuando cambian los mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen, isTyping]);

    // Manejo de reproducción de audio
    useEffect(() => {
    }, [messages]);

    // Esc para cerrar
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Listener de cambio de idioma
    useEffect(() => {
        const handleLanguageChange = (e: any) => {
            if (e.detail && e.detail.language) {
                const newLang = e.detail.language.toLowerCase() === 'en' ? 'en' : 'es';
                const langChanged = newLang !== currentLang;

                setCurrentLang(newLang);
                langRef.current = newLang;

                // Si el idioma cambió, reiniciar estado
                if (langChanged) {
                    // Stop any playing audio
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }

                    setIsTyping(false);
                    setIsPlaying(false);
                    setMessages([]);

                    // Si el chatbot está abierto, cerrarlo
                    if (isOpen) {
                        setIsOpen(false);
                    }
                }
            }
        };

        // Check initial lang
        const storedLang = localStorage.getItem("ui-language");
        if (storedLang) {
            const initLang = storedLang.toLowerCase() === 'en' ? 'en' : 'es';
            setCurrentLang(initLang);
            langRef.current = initLang;
        }

        window.addEventListener('ui:languagechange', handleLanguageChange);
        return () => window.removeEventListener('ui:languagechange', handleLanguageChange);
    }, [isOpen, currentLang]);

    const playAudio = (srcOrPlaylist: string | string[], onEnded?: () => void) => {
        // Skip audio playback if language is English
        if (langRef.current === 'en') {
            if (onEnded) onEnded();
            return;
        }

        if (audioRef.current) {
            const playlist = Array.isArray(srcOrPlaylist) ? srcOrPlaylist : [srcOrPlaylist];
            let currentIndex = 0;

            const playNext = () => {
                if (currentIndex >= playlist.length) {
                    setIsPlaying(false);
                    if (onEnded) onEnded();
                    return;
                }

                if (audioRef.current) {
                    audioRef.current.src = playlist[currentIndex];
                    setIsPlaying(true);

                    const handleEnded = () => {
                        audioRef.current?.removeEventListener('ended', handleEnded);
                        currentIndex++;
                        playNext();
                    };

                    audioRef.current.addEventListener('ended', handleEnded);

                    audioRef.current.play().catch(e => {
                        console.error("Error playing audio:", e);
                        setIsPlaying(false);
                        // If one fails, try next or stop? Let's stop to be safe
                    });
                }
            };

            playNext();
        }
    };

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'user',
            type: 'text',
            text
        }]);
    };

    const addBotMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'bot',
            type: 'text',
            text
        }]);
    };

    const handleOpen = () => {
        setIsOpen(true);
        if (messages.length === 0) {
            // Mensaje inicial
            addBotMessage(t.welcomeMessage);

            // Iniciar experiencia de audio
            triggerWelcomeSequence();
        }
    };

    const triggerWelcomeSequence = () => {
        // Prevenir llamadas duplicadas
        if (isWelcomeSequenceRunning.current) return;

        isWelcomeSequenceRunning.current = true;

        // 1. Audio Bienvenido
        playSoundMessage('/audios/01-Bienvenidos.wav', () => {
            // 2. Mostrar opciones al terminar
            showMainOptions();
            isWelcomeSequenceRunning.current = false;
        });
    };

    // Helper to add options
    const addOptionsMessage = (options: Option[]) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'bot',
            type: 'options',
            options: options
        }]);
    };

    const playSoundMessage = (src: string, onEndedOrNext?: () => void) => {
        playAudio(src, onEndedOrNext);
    };

    const handleOptionClick = (labelKey: string, audioSrc: string, nextAction?: () => void) => {
        const text = ALAIZA_TRANSLATIONS[langRef.current].options[labelKey as keyof typeof t.options] || labelKey;
        addUserMessage(text);
        playAudio(audioSrc, nextAction);
    };

    function showMainOptions() {
        const t = ALAIZA_TRANSLATIONS[langRef.current];
        addOptionsMessage([
            { label: t.options['Quiénes somos'], labelKey: 'Quiénes somos', id: 'quienes-somos', action: () => handleOptionClick('Quiénes somos', '/audios/02-Quienes somos.wav', showMainOptions) },
            { label: t.options['Quién es Alaiza'], labelKey: 'Quién es Alaiza', id: 'quien-es-alaiza', action: () => handleOptionClick('Quién es Alaiza', '/audios/03-Alaiza.wav', showMainOptions) },
            { label: t.options['Tour productos'], labelKey: 'Tour productos', id: 'tour-productos', action: () => handleTourClick() },
        ]);
    }

    function showTourOptions() {
        const t = ALAIZA_TRANSLATIONS[currentLang];
        addOptionsMessage([
            { label: t.options['Auth'], labelKey: 'Auth', id: 'auth', action: () => handleAuthClick() },
            { label: t.options['Identity'], labelKey: 'Identity', id: 'identity', action: () => handleIdentityClick() },
            { label: t.options['AML'], labelKey: 'AML', id: 'aml', action: () => handleAMLClick() },
            { label: t.options['Connect'], labelKey: 'Connect', id: 'connect', action: () => handleConnectClick() },
            { label: t.options['TX'], labelKey: 'TX', id: 'tx', action: () => handleTXClick() },
            { label: t.options['Cards'], labelKey: 'Cards', id: 'cards', action: () => handleCardsClick() },
            { label: t.options['Pagos y transferencias'], labelKey: 'Pagos y transferencias', id: 'payments', action: () => handlePaymentsClick() },
            { label: t.options['Descuentos y cupones'], labelKey: 'Descuentos y cupones', id: 'discounts', action: () => handleDiscountsClick() },
            { label: t.options['Alaiza'], labelKey: 'Alaiza', id: 'alaiza-product', action: () => handleAlaizaProductClick() },
        ]);
    }

    function showAuthOptions() {
        const t = ALAIZA_TRANSLATIONS[currentLang];
        addOptionsMessage([
            { label: t.options['Qué es Auth'], labelKey: 'Qué es Auth', id: 'que-es-auth', action: () => handleOptionClick('Qué es Auth', '/audios/07-OauthQuees.wav', showAuthDeepOptions) },
        ]);
    }

    function showAuthDeepOptions() {
        const t = ALAIZA_TRANSLATIONS[currentLang];
        addOptionsMessage([
            { label: t.options['Quiero más información de Auth'], labelKey: 'Quiero más información de Auth', id: 'auth-deep', action: () => handleAuthDeepExplanationClick() },
            { label: t.options['Quiero ver el resto de productos'], labelKey: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleAuthDeepExplanationClick(): void {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Quiero más información de Auth']);

        const audioPlaylist = [
            '/audios/22-comenzarauth.wav',
            '/audios/23-quehacerconauth.wav',
            '/audios/24-visualizarpantallasweb.wav',
            '/audios/25-personalizacionmarca.wav',
            '/audios/26-personalizacionregistros.wav',
            '/audios/27-validarcorreocodigotemporal.wav',
            '/audios/28-geolocalizacionparadispositivo.wav'
        ];

        playAudio(audioPlaylist, () => {
            showAuthDeepOptions();
        });
    }

    function handleBackToProducts() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Quiero ver el resto de productos']);
        showTourOptions();
    }

    function handleTourClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Tour productos']);
        playAudio('/audios/05-Servicios.wav', () => {
            showTourOptions();
        });
    }

    function handleAuthClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Auth']);
        // Chain 06 then 07 directly
        playAudio('/audios/06-AuthOauth.wav', () => {
            playAudio('/audios/07-OauthQuees.wav', () => {
                showAuthDeepOptions();
            });
        });
    }

    function handleIdentityClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Identity']);
        playAudio('/audios/10-identidad.wav', () => {
            playAudio('/audios/11-queesidentidad.wav', () => {
                showIdentityDeepOptions();
            });
        });
    }

    function showIdentityDeepOptions() {
        const t = ALAIZA_TRANSLATIONS[currentLang];
        addOptionsMessage([
            { label: t.options['Quiero más información de Identity'], labelKey: 'Quiero más información de Identity', id: 'identity-deep', action: () => handleIdentityDeepExplanationClick() },
            { label: t.options['Quiero ver el resto de productos'], labelKey: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleIdentityDeepExplanationClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Quiero más información de Identity']);

        // Playlist inferida para Identity basada en los archivos disponibles
        const audioPlaylist = [
            '/audios/32-IDENTITY.wav',
            '/audios/33-quehaceIdentity.wav',
            '/audios/34-comofuncionapregunta.wav',
            '/audios/35-pruebavidaidentity.wav'
        ];

        playAudio(audioPlaylist, () => {
            showIdentityDeepOptions();
        });
    }

    function handleCardsClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Cards']);
        playAudio('/audios/14-cards.wav', () => {
            playAudio('/audios/15-quehacecards.wav', () => {
                showCardsDeepOptions();
            });
        });
    }

    function showCardsDeepOptions() {
        const t = ALAIZA_TRANSLATIONS[currentLang];
        addOptionsMessage([
            { label: t.options['Quiero más información de Cards'], labelKey: 'Quiero más información de Cards', id: 'cards-deep', action: () => handleCardsDeepExplanationClick() },
            { label: t.options['Quiero ver el resto de productos'], labelKey: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleCardsDeepExplanationClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Quiero más información de Cards']);

        const audioPlaylist = [
            '/audios/38-cards.wav',
            '/audios/39-quehacecards.wav'
        ];

        playAudio(audioPlaylist, () => {
            showCardsDeepOptions();
        });
    }

    function handleTXClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['TX']);
        playAudio('/audios/18-TX.wav', () => {
            playAudio('/audios/17-quehaceTX.wav', () => {
                showTXDeepOptions();
            });
        });
    }

    function showTXDeepOptions() {
        const t = ALAIZA_TRANSLATIONS[currentLang];
        addOptionsMessage([
            { label: t.options['Quiero más información de TX'], labelKey: 'Quiero más información de TX', id: 'tx-deep', action: () => handleTXDeepExplanationClick() },
            { label: t.options['Quiero ver el resto de productos'], labelKey: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleTXDeepExplanationClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Quiero más información de TX']);

        const audioPlaylist = [
            '/audios/42-quehacetx.wav'
        ];

        playAudio(audioPlaylist, () => {
            showTXDeepOptions();
        });
    }

    function handleConnectClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Connect']);
        playAudio('/audios/13-connect.wav', () => {
            playAudio('/audios/12-quehacevinculacion.wav', () => {
                showConnectDeepOptions();
            });
        });
    }

    function showConnectDeepOptions() {
        const t = ALAIZA_TRANSLATIONS[currentLang];
        addOptionsMessage([
            { label: t.options['Quiero más información de Connect'], labelKey: 'Quiero más información de Connect', id: 'connect-deep', action: () => handleConnectDeepExplanationClick() },
            { label: t.options['Quiero ver el resto de productos'], labelKey: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleConnectDeepExplanationClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Quiero más información de Connect']);

        const audioPlaylist = [
            '/audios/36-connect.wav',
            '/audios/37-quehaceconnect.wav'
        ];

        playAudio(audioPlaylist, () => {
            showConnectDeepOptions();
        });
    }

    function handleAMLClick() {
        addUserMessage('AML');
        playAudio('/audios/08-AML.wav', () => {
            playAudio('/audios/09-queesAML.wav', () => {
                showAMLDeepOptions();
            });
        });
    }

    function showAMLDeepOptions() {
        addOptionsMessage([
            { label: 'Quiero más información de AML', id: 'aml-deep', action: () => handleAMLDeepExplanationClick() },
            { label: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleAMLDeepExplanationClick() {
        addUserMessage('Quiero más información de AML');

        const audioPlaylist = [
            '/audios/30-productoAML.wav',
            '/audios/31-quehaceAML.wav'
        ];

        playAudio(audioPlaylist, () => {
            showAMLDeepOptions();
        });
    }

    function handleDiscountsClick() {
        addUserMessage('Descuentos y cupones');
        playAudio('/audios/21-descuentosycupones.wav', () => {
            showDiscountsDeepOptions();
        });
    }

    function showDiscountsDeepOptions() {
        addOptionsMessage([
            { label: 'Quiero más información de Descuentos', id: 'discounts-deep', action: () => handleDiscountsDeepExplanationClick() },
            { label: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleDiscountsDeepExplanationClick() {
        addUserMessage('Quiero más información de Descuentos');

        const audioPlaylist = [
            '/audios/44-cuponesydescuentos.wav',
            '/audios/45-quehacecuponesydescuentos.wav'
        ];

        playAudio(audioPlaylist, () => {
            showDiscountsDeepOptions();
        });
    }

    function handlePaymentsClick() {
        addUserMessage('Pagos y transferencias');
        playAudio('/audios/16-pagostransfLocales.wav', () => {
            showPaymentsDeepOptions();
        });
    }

    function showPaymentsDeepOptions() {
        addOptionsMessage([
            { label: 'Quiero más información de Pagos', id: 'payments-deep', action: () => handlePaymentsDeepExplanationClick() },
            { label: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handlePaymentsDeepExplanationClick() {
        addUserMessage('Quiero más información de Pagos');

        const audioPlaylist = [
            '/audios/40-paymentsandtransfers.wav',
            '/audios/41-quehacepaymentstransfers.wav'
        ];

        playAudio(audioPlaylist, () => {
            showPaymentsDeepOptions();
        });
    }

    function handleAlaizaProductClick() {
        addUserMessage(ALAIZA_TRANSLATIONS[langRef.current].options['Alaiza']);

        const audioPlaylist = [
            '/audios/43-alaiza2.wav',
            '/audios/46-vendemasconzelify.wav'
        ];
        playAudio(audioPlaylist, () => {
            showTourOptions();
        });
    }

    const handleInputSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userQuestion = inputText;
        addUserMessage(userQuestion);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch(linkChat, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: userQuestion,
                    context: ALAIZA_CONTEXT
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.answer || data.message || "Lo siento, no pude procesar la respuesta.";

            setIsTyping(false);
            addBotMessage(aiText);

        } catch (error) {
            console.error("Error fetching AI response:", error);
            setIsTyping(false);
            const t = ALAIZA_TRANSLATIONS[currentLang]; // Get current message
            addBotMessage(t.errorMessage);
        }
    };

    const handleSkip = () => {
        if (audioRef.current && isPlaying) {
            audioRef.current.pause();
            audioRef.current.dispatchEvent(new Event('ended'));
        }
    };

    return (
        <>
            <audio ref={audioRef} className="hidden" />

            {!isOpen ? (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                    <div className="relative bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl rounded-tr-sm shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{t.helperText}</p>
                    </div>
                    <button
                        onClick={handleOpen}
                        className="rounded-full hover:scale-105 transition-transform duration-200"
                        aria-label="Abrir asistente Alaiza"
                    >
                        <img
                            src="/images/iconAlaiza.svg"
                            alt="Alaiza Icon"
                            className="w-16 h-16 drop-shadow-md"
                        />
                    </button>
                </div>
            ) : ( /*chat*/
                <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center">
                                {isPlaying && animationData ? (
                                    <div className="w-full h-full scale-[2.5]">
                                        <Lottie animationData={animationData} loop={true} />
                                    </div>
                                ) : (
                                    <img src="/images/iconAlaiza.svg" alt="Alaiza" className="w-full h-full object-contain" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{t.headerTitle}</h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
                                        {isPlaying ? t.statusTalking : t.statusOnline}
                                    </p>
                                    {isPlaying && (
                                        <button
                                            onClick={handleSkip}
                                            className="text-[16px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full transition-colors border border-gray-200"
                                            title="Saltar audio"
                                        >
                                            {t.skipButton}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] ${msg.type === 'options' ? 'w-full' : ''}`}>

                                    {/* Text Messages */}
                                    {msg.type === 'text' && (
                                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-[#18181b] text-white rounded-tr-none'
                                            : 'bg-[#f4f4f5] text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    )}

                                    {/* Option Buttons - Only show in Spanish */}
                                    {msg.type === 'options' && currentLang === 'es' && (
                                        <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                            {msg.options?.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={opt.action}
                                                    className={`text-left px-3 py-2.5 bg-white border-2 border-[#eaecf0] hover:border-[#95FF0B] hover:bg-[#fafff0] text-gray-700 rounded-xl text-xs font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-sm break-words flex items-center min-h-[50px]
                                                    ${msg.options?.length === 1 || (msg.options?.length && msg.options.length % 2 !== 0 && msg.options[msg.options.length - 1].id === opt.id) ? 'col-span-2' : ''}`}
                                                >
                                                    {opt.labelKey ? t.options[opt.labelKey as keyof typeof t.options] || opt.label : opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-[#f4f4f5] p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleInputSubmit} className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={t.inputPlaceholder}
                                className="w-full bg-[#cdcfd5] text-gray-800 placeholder-gray-500 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#95FF0B] transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="absolute right-2 p-2 bg-[#18181b] text-white rounded-full hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
