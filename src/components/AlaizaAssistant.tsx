import React, { useState, useRef, useEffect } from 'react';

type MessageType = 'text' | 'options' | 'audio-message';

interface Option {
    label: string;
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

export const AlaizaAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationData, setAnimationData] = useState<any>(null);

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

    // Manejo de reproducción de audio secuencial
    useEffect(() => {
        // ... (lógica anterior si la hubiese)
    }, [messages]);

    const playAudio = (srcOrPlaylist: string | string[], onEnded?: () => void) => {
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
            // Mensaje inicial de saludo texto
            addBotMessage("Hola 👋, déjanos tu duda y con gusto te ayudamos.");

            // Iniciar experiencia de audio
            triggerWelcomeSequence();
        }
    };

    const triggerWelcomeSequence = () => {
        // 1. Audio Bienvenido
        playSoundMessage('/audios/01-Bienvenidos.wav', () => {
            // 2. Mostrar opciones al terminar
            showMainOptions();
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

    const handleOptionClick = (label: string, audioSrc: string, nextAction?: () => void) => {
        addUserMessage(label);
        playAudio(audioSrc, nextAction);
    };

    function showMainOptions() {
        addOptionsMessage([
            { label: 'Quiénes somos', id: 'quienes-somos', action: () => handleOptionClick('Quiénes somos', '/audios/02-Quienes somos.wav', showMainOptions) },
            { label: 'Quién es Alaiza', id: 'quien-es-alaiza', action: () => handleOptionClick('Quién es Alaiza', '/audios/03-Alaiza.wav', showMainOptions) },
            { label: 'Tour productos', id: 'tour-productos', action: () => handleTourClick() },
        ]);
    }

    function showTourOptions() {
        addOptionsMessage([
            { label: 'OAuth', id: 'oauth', action: () => handleOAuthClick() },
            { label: 'Identity', id: 'identity', action: () => handleIdentityClick() },
            { label: 'Cards', id: 'cards', action: () => handleCardsClick() },
        ]);
    }

    function showOAuthOptions() {
        addOptionsMessage([
            { label: 'Qué es OAuth', id: 'que-es-oauth', action: () => handleOptionClick('Qué es OAuth', '/audios/07-OauthQuees.wav', showOAuthDeepOptions) },
        ]);
    }

    function showOAuthDeepOptions() {
        addOptionsMessage([
            { label: 'Quiero más información de OAuth', id: 'oauth-deep', action: () => handleOauthDeepExplanationClick() },
            { label: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleOauthDeepExplanationClick(): void {
        addUserMessage('Quiero más información de OAuth');

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
            showOAuthDeepOptions();
        });
    }

    function handleBackToProducts() {
        addUserMessage('Quiero ver el resto de productos');
        showTourOptions();
    }

    function handleTourClick() {
        addUserMessage('Tour productos');
        playAudio('/audios/05-Servicios.wav', () => {
            showTourOptions();
        });
    }

    function handleOAuthClick() {
        addUserMessage('OAuth');
        // Chain 06 then 07 directly
        playAudio('/audios/06-AuthOauth.wav', () => {
            playAudio('/audios/07-OauthQuees.wav', () => {
                showOAuthDeepOptions();
            });
        });
    }

    function handleIdentityClick() {
        addUserMessage('Identity');
        playAudio('/audios/10-identidad.wav', () => {
            playAudio('/audios/11-queesidentidad.wav', () => {
                showIdentityDeepOptions();
            });
        });
    }

    function showIdentityDeepOptions() {
        addOptionsMessage([
            { label: 'Quiero más información de Identity', id: 'identity-deep', action: () => handleIdentityDeepExplanationClick() },
            { label: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleIdentityDeepExplanationClick() {
        addUserMessage('Quiero más información de Identity');

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
        addUserMessage('Cards');
        playAudio('/audios/14-cards.wav', () => {
            playAudio('/audios/15-quehacecards.wav', () => {
                showCardsDeepOptions();
            });
        });
    }

    function showCardsDeepOptions() {
        addOptionsMessage([
            { label: 'Quiero más información de Cards', id: 'cards-deep', action: () => handleCardsDeepExplanationClick() },
            { label: 'Quiero ver el resto de productos', id: 'back-products', action: () => handleBackToProducts() },
        ]);
    }

    function handleCardsDeepExplanationClick() {
        addUserMessage('Quiero más información de Cards');

        const audioPlaylist = [
            '/audios/36-cards.wav',
            '/audios/37-quehacecards.wav'
        ];

        playAudio(audioPlaylist, () => {
            showCardsDeepOptions();
        });
    }

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        addUserMessage(inputText);
        setInputText('');

        // Simular respuesta por defecto
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            addBotMessage("Estamos trabajando en una respuesta para tu solicitud.");
        }, 1000);
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
                <button
                    onClick={handleOpen}
                    className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 p-[10px]"
                    aria-label="Abrir asistente Alaiza"
                >
                    <img
                        src="/images/iconAlaiza.svg"
                        alt="Alaiza Icon"
                        className="w-16 h-16 drop-shadow-md"
                    />
                </button>
            ) : (
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
                                <h3 className="font-bold text-gray-800 text-lg">Alaiza</h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
                                        {isPlaying ? 'Hablando...' : 'En línea'}
                                    </p>
                                    {isPlaying && (
                                        <button
                                            onClick={handleSkip}
                                            className="text-[16px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full transition-colors border border-gray-200"
                                            title="Saltar audio"
                                        >
                                            Saltar
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

                                    {/* Option Buttons */}
                                    {msg.type === 'options' && (
                                        <div className="flex flex-col gap-2 mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                            {msg.options?.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={opt.action}
                                                    className="text-left px-4 py-3 bg-white border-2 border-[#eaecf0] hover:border-[#95FF0B] hover:bg-[#fafff0] text-gray-700 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-sm"
                                                >
                                                    {opt.label}
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
                                placeholder="Escribe tu duda..."
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
