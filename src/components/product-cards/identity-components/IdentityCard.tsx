import { useState, useRef, useEffect } from "react";
import { FaIdCard, FaPassport, FaCar, FaCamera, FaCheck, FaImage, FaVideo } from "react-icons/fa";
import { MdDriveEta } from "react-icons/md";

/* -- Types -- */
type Country = "ecuador" | "mexico" | "colombia";
type DocumentType = "drivers_license" | "id_card" | "passport";
type LivenessType = "photo" | "video" | "selfie_photo" | "selfie_video";
type ScreenStep = "welcome" | "document_selection" | "document_capture" | "liveness_check" | "result";

/* -- Icons (Inline) -- */
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m4 6 4 4 4-4" />
        </svg>
    );
}

/* -- Translations / Constants -- */
const PREVIEW_TEXTS = {
    welcome: {
        subtitle: "Verificación rápida y segura",
        startButton: "Comenzar verificación",
        checklist: [
            { title: "Prepara tu documento", description: "Cédula, pasaporte o licencia" },
            { title: "Busca buena luz", description: "Evita sombras y reflejos" },
            { title: "Selfie simple", description: "Sigue las instrucciones" },
        ],
    },
    documentSelection: {
        title: "Selecciona tu documento",
        subtitle: "Elige el tipo de documento que deseas usar para la verificación",
        descriptions: {
            drivers_license: "Licencia de conducir",
            id_card: "Cédula de identidad",
            passport: "Pasaporte vigente",
        },
    },
    documentCapture: {
        titlePrefix: "Captura tu",
        fallbackTitle: "documento",
        instructions: {
            front: "Coloca la parte frontal de tu documento en el marco",
            back: "Gira tu documento y captura la parte posterior",
        },
        overlayTitle: {
            front: "Frente del documento",
            back: "Reverso del documento",
        },
        overlayHint: "Asegúrate de que el documento esté bien iluminado y completo en la imagen",
    },
    liveness: {
        title: "Prueba de vida",
        subtitle: "Validaremos que eres una persona real",
        scanning: {
            startingCamera: "Rostro ",
        },
    },
};

const DOCUMENT_NAMES: Record<Country, Record<DocumentType, string>> = {
    ecuador: { drivers_license: "Licencia de conducir", id_card: "Cédula de identidad", passport: "Pasaporte" },
    mexico: { drivers_license: "Licencia", id_card: "INE / IFE", passport: "Pasaporte" },
    colombia: { drivers_license: "Licencia", id_card: "Cédula", passport: "Pasaporte" },
};

/* -- Main Component -- */
export default function IdentityCard({ isDemoEnabled = true }: { isDemoEnabled?: boolean }) {
    // State
    const [currentScreen, setCurrentScreen] = useState<ScreenStep>("welcome");
    const [activeWelcomeCard, setActiveWelcomeCard] = useState(0);
    const [activeDocumentCard, setActiveDocumentCard] = useState<number | null>(0);
    const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>("id_card");
    const [captureStep, setCaptureStep] = useState<"front" | "back">("front");
    const [isCapturing, setIsCapturing] = useState(false);
    const [frontCaptured, setFrontCaptured] = useState(false);
    const [backCaptured, setBackCaptured] = useState(false);
    const [isFaceIdScanning, setIsFaceIdScanning] = useState(false);
    const [faceIdProgress, setFaceIdProgress] = useState(0);
    const [selectedLivenessType, setSelectedLivenessType] = useState<LivenessType | null>(null);
    const [activeLivenessCard, setActiveLivenessCard] = useState<number | null>(null);
    const [verificationResult, setVerificationResult] = useState<"approved" | "rejected">("approved");

    // Theme
    const themeColor = "#004492";
    const darkThemeColor = "#002a5c";
    const almostBlackColor = "#001126";
    const blackColor = "#000000";
    const country: Country = "ecuador"; // Default for demo

    // Video Ref for Liveness
    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-Play Refs
    const isRunningRef = useRef(false);
    const abortDemo = useRef(false);

    // -- Helper: Wait --
    const wait = (ms: number) => new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            if (abortDemo.current) reject(new Error("Demo aborted"));
            else if (Date.now() - start >= ms) resolve(true);
            else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
    });

    // -- Event Listeners for Demo --
    useEffect(() => {
        const handlePlayDemo = async () => {
            if (!isDemoEnabled || isRunningRef.current) return;
            isRunningRef.current = true;
            abortDemo.current = false;
            window.dispatchEvent(new CustomEvent('zelify:demo-start'));

            try {
                while (!abortDemo.current) {
                    // 1. Reset State
                    setCurrentScreen("welcome");
                    setActiveWelcomeCard(0);
                    setActiveDocumentCard(0);
                    setSelectedDocumentType("id_card");
                    setCaptureStep("front");
                    setFrontCaptured(false);
                    setBackCaptured(false);
                    setIsFaceIdScanning(false);
                    setFaceIdProgress(0);
                    setSelectedLivenessType(null);
                    setActiveLivenessCard(null);
                    setVerificationResult("approved");

                    // 2. Welcome Screen Interactions
                    await wait(1000);
                    setActiveWelcomeCard(1);
                    await wait(800);
                    setActiveWelcomeCard(2);
                    await wait(800);

                    // Click Start
                    await wait(500);
                    setCurrentScreen("document_selection");

                    // 3. Document Selection
                    await wait(1000);
                    setActiveDocumentCard(0);
                    setSelectedDocumentType("drivers_license");
                    await wait(800);
                    setActiveDocumentCard(1);
                    setSelectedDocumentType("id_card");
                    await wait(800);
                    setActiveDocumentCard(2);
                    setSelectedDocumentType("passport");
                    await wait(800);
                    setActiveDocumentCard(1);
                    setSelectedDocumentType("id_card");
                    await wait(500);
                    setCurrentScreen("document_capture");

                    // 4. Document Capture (Front)
                    await wait(1500);
                    setIsCapturing(true);
                    await wait(300);
                    setIsCapturing(false);
                    setFrontCaptured(true);
                    await wait(500);
                    setCaptureStep("back");

                    // 5. Document Capture (Back)
                    await wait(1500);
                    setIsCapturing(true);
                    await wait(300);
                    setIsCapturing(false);
                    setBackCaptured(true);
                    await wait(1000);
                    setCurrentScreen("liveness_check");

                    // 6. Liveness Check
                    await wait(1000);
                    setActiveLivenessCard(0);
                    setSelectedLivenessType("selfie_photo");
                    await wait(800);
                    setActiveLivenessCard(1);
                    setSelectedLivenessType("selfie_video");
                    await wait(800);
                    setActiveLivenessCard(0);
                    setSelectedLivenessType("selfie_photo");
                    await wait(500);
                    setIsFaceIdScanning(true);

                    // Animate Scan Progress
                    const scanDuration = 4000;
                    const steps = 40;
                    for (let i = 0; i <= steps; i++) {
                        await wait(scanDuration / steps);
                        setFaceIdProgress((i / steps) * 100);
                    }

                    await wait(500);
                    setVerificationResult(Math.random() > 0.3 ? "approved" : "rejected");
                    setCurrentScreen("result");

                    await wait(3000); // Wait at the end of loop
                }

            } catch (e) {
                console.log("Identity Demo Stopped/Aborted");
            } finally {
                isRunningRef.current = false;
                window.dispatchEvent(new CustomEvent('zelify:demo-end'));
            }
        };

        const handleStopDemo = () => {
            if (isRunningRef.current) {
                abortDemo.current = true;
            }
        };

        window.addEventListener('zelify:play-demo:identity', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:identity', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:identity', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:identity', handleStopDemo);
            abortDemo.current = true;
        };
    }, [isDemoEnabled]);

    // -- Render Helpers --
    const renderWelcome = () => (
        <div className="relative flex h-full flex-col overflow-hidden">
            {/* Header Elements (Absolute) */}
            {/* <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 pointer-events-none">
                <div className="w-12"></div>
                <div className="absolute left-1/2 top-4 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-1">
                    <img
                        src="/images/zelify_logo.png"
                        alt="Logo"
                        className="h-14 w-14 object-contain drop-shadow-sm"
                    />
                </div>
                <div className="w-12"></div>
            </div> */}

            {/* Animation */}
            <div className="relative -mb-4 flex-shrink-0 z-0 flex justify-center mt-8">
                <img
                    src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                    alt="Identity Animation"
                    className="h-44 w-44 object-contain opacity-90 mix-blend-multiply"
                />
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center">
                <div className="text-center mb-6 px-6 pt-4">
                    <h2 className="text-2xl font-bold leading-tight" style={{ color: themeColor }}>
                        Verificación <span className="font-normal">de identidad</span>
                    </h2>
                    <p className="text-[11px] text-gray-500 mt-1 max-w-[200px] mx-auto">
                        Verificaremos tu identidad de forma segura y rápida
                    </p>
                </div>

                <div className="w-full mt-auto bg-[#EBECEF] rounded-t-[35px] pt-8 px-5 pb-10 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[340px]">
                    {/* Horizontal Stacked Cards (Accordion-like) */}
                    <div className="relative w-full h-[80px] mb-6 flex items-center justify-center">
                        {[
                            { title: "Proceso rápido y seguro", subtitle: "Finaliza en menos de 2 minutos", icon: "lock" },
                            { title: "Datos protegidos", subtitle: "Cifrado de extremo a extremo", icon: "shield" },
                            { title: "Verificación instantánea", subtitle: "Resultados en tiempo real", icon: "clock" }
                        ].map((card, index) => {
                            const isActive = index === activeWelcomeCard;

                            // Logic: Active is centered. 
                            // Others offset by X amount * direction
                            const diff = index - activeWelcomeCard;
                            const offsetX = diff * 40; // Increased offset for better clickability

                            // Determine visual layering
                            // Active is 30. Immediate neighbors 20. Farther 10.
                            const dist = Math.abs(diff);
                            const zIndex = 30 - dist * 10;

                            // Scale down slightly if not active
                            const scale = isActive ? 1 : 0.90;

                            return (
                                <div
                                    key={index}
                                    onClick={() => setActiveWelcomeCard(index)}
                                    className="absolute transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer"
                                    style={{
                                        zIndex,
                                        transform: `translateX(${offsetX}px) scale(${scale})`,
                                        width: '200px', // Fixed width to match text content
                                    }}
                                >
                                    <div
                                        className={`flex items-center gap-2.5 p-3 rounded-2xl border-[3px] transition-all duration-300
                                            ${isActive
                                                ? 'border-[#EBECEF] text-white'
                                                : 'border-[#EBECEF] bg-[#EBECEF] text-transparent' // Gray card, text hidden/blended?
                                            }
                                        `}
                                        style={{
                                            // Active gets gradient, Inactive gets flat gray
                                            background: isActive
                                                ? `linear-gradient(to right, ${themeColor} 0%, ${blackColor} 100%)`
                                                : '#9ca3af', // A standard gray matching the 'silver' look
                                            height: '64px'
                                        }}
                                    >
                                        {/* Icon Container */}
                                        <div className="flex-shrink-0">
                                            <div className="p-1.5">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                                                    {card.icon === 'lock' && <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                                                    {card.icon === 'shield' && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                                                    {card.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className={`flex-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                            <p className="text-[9px] font-bold leading-tight mb-0.5">{card.title}</p>
                                            <p className="text-[8px] font-normal leading-tight text-white/90">{card.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-full">
                        <button
                            onClick={() => setCurrentScreen("document_selection")}
                            className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-blue-900/20"
                            style={{
                                background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                            }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Iniciar verificación
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                        <p className="text-[9px] text-gray-400 text-center mt-3 px-4">
                            Al iniciar la verificación aceptas las <span className="font-bold text-gray-500">políticas de privacidad</span> y <span className="font-bold text-gray-500">términos de servicio</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDocumentSelection = () => (
        <div className="relative flex h-full flex-col overflow-hidden bg-white">
            {/* Header Elements (Absolute) */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 pointer-events-none">
                <button
                    onClick={() => setCurrentScreen("welcome")}
                    className="pointer-events-auto flex items-center gap-1 text-[10px] font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>back</span>
                </button>

                {/* <div className="absolute left-1/2 top-4 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-1">
                    <img
                        src="/images/zelify_logo.png"
                        alt="Logo"
                        className="h-14 w-14 object-contain drop-shadow-sm"
                    />
                </div> */}
                <div className="w-12"></div>
            </div>

            {/* Animation */}
            <div className="relative -mb-12 flex-shrink-0 z-0 flex justify-center mt-8">
                <img
                    src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                    alt="Identity Animation"
                    className="h-44 w-44 object-contain opacity-90 mix-blend-multiply"
                />
            </div>

            {/* Glassmorphism Container - From title to button */}
            <div className="relative z-10 flex-1 flex flex-col items-center overflow-hidden w-full">
                <div
                    className="w-full flex flex-col flex-1 mt-auto rounded-t-[35px] pt-8 pb-6 backdrop-blur-sm border-t border-x border-white/50"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                    }}
                >
                    {/* Title Section */}
                    <div className="text-center mb-4 px-6 pt-4 flex-shrink-0">
                        <h2 className="text-xl font-bold leading-tight" style={{ color: themeColor }}>
                            {PREVIEW_TEXTS.documentSelection.title}
                        </h2>
                        <p className="text-[11px] text-gray-500 mt-1 max-w-[220px] mx-auto">
                            {PREVIEW_TEXTS.documentSelection.subtitle}
                        </p>
                    </div>

                    {/* Cards Container */}
                    <div className="px-5 flex-1 min-h-0 overflow-y-auto">
                        {/* Vertical Stack Cards - Pyramid Effect */}
                        <div className="relative mb-4 flex-shrink-0" style={{ minHeight: '200px', paddingTop: '5px' }}>
                            {(["drivers_license", "id_card", "passport"] as DocumentType[]).map((type, idx) => {
                                const isActive = selectedDocumentType === type;
                                const activeIndex = (["drivers_license", "id_card", "passport"] as DocumentType[]).indexOf(selectedDocumentType);
                                const isAbove = idx < activeIndex;
                                const isBelow = idx > activeIndex;

                                // Card heights: active is taller, inactive are shorter
                                const activeHeight = 75;
                                const inactiveHeight = 58;

                                // Calculate position for pyramid effect - tighter spacing
                                let topPosition = 0;
                                if (isActive) {
                                    // Active card position based on its index
                                    topPosition = idx === 0 ? 0 : (idx === 1 ? 35 : 70);
                                } else if (isAbove) {
                                    // Cards above: start from top, very close together
                                    topPosition = idx * 38;
                                } else {
                                    // Cards below: positioned after active card, overlapping
                                    const activePos = activeIndex === 0 ? 0 : (activeIndex === 1 ? 35 : 70);
                                    topPosition = activePos + activeHeight - 15 + (idx - activeIndex - 1) * 38;
                                }

                                // Z-index: active is highest, then based on distance from active
                                let zIndex = 10;
                                if (isActive) {
                                    zIndex = 30;
                                } else if (isAbove) {
                                    zIndex = 20 - (activeIndex - idx);
                                } else {
                                    zIndex = 20 - (idx - activeIndex);
                                }

                                return (
                                    <div
                                        key={type}
                                        onClick={() => {
                                            setSelectedDocumentType(type);
                                            setActiveDocumentCard(idx);
                                        }}
                                        className={`absolute left-0 right-0 transition-all duration-300 cursor-pointer flex items-center gap-3 rounded-2xl border-[3px] overflow-visible
                                            ${isActive
                                                ? 'border-white shadow-xl'
                                                : 'border-white bg-[#d1d5db] hover:bg-[#c4c8ce]'
                                            }`}
                                        style={{
                                            background: isActive
                                                ? `linear-gradient(to right, ${themeColor} 0%, ${blackColor} 100%)`
                                                : undefined,
                                            top: `${topPosition}px`,
                                            height: isActive ? `${activeHeight}px` : `${inactiveHeight}px`,
                                            padding: isActive ? '0.875rem 1rem' : '0.75rem 1rem',
                                            width: isActive ? 'calc(100% + 16px)' : 'calc(100% - 16px)',
                                            left: isActive ? '-8px' : '8px',
                                            transform: isActive ? 'scale(1.06)' : 'scale(1)',
                                            zIndex: zIndex,
                                        }}
                                    >
                                        <div className={`p-1.5 rounded-lg flex-shrink-0 `}>
                                            {type === 'drivers_license' && <MdDriveEta className="w-6 h-6 text-white" />}
                                            {type === 'id_card' && <FaIdCard className="w-6 h-6 text-white" />}
                                            {type === 'passport' && <FaPassport className="w-6 h-6 text-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-white'}`}>
                                                {DOCUMENT_NAMES[country][type]}
                                            </h3>
                                            <p className={`text-[10px] leading-tight mt-0.5 ${isActive ? 'text-white/80' : 'hidden'}`}>
                                                {PREVIEW_TEXTS.documentSelection.descriptions[type]}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer Button - Split Alignment */}
                    <div className="w-full flex-shrink-0 px-5">
                        <button
                            onClick={() => setCurrentScreen("document_capture")}
                            className="group relative w-full overflow-hidden rounded-xl px-5 py-4 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-between"
                            style={{
                                background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                            }}
                        >
                            <span className="font-bold">Siguiente</span>
                            <span className="font-mono text-lg leading-none">{'>'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCapture = () => {
        const documentName = DOCUMENT_NAMES[country][selectedDocumentType];
        const isFront = captureStep === 'front';
        const isBack = captureStep === 'back';

        // Convert hex to rgb for gradient
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
        };
        const themeRgb = hexToRgb(themeColor) || "0, 68, 146";
        const darkThemeRgb = hexToRgb(darkThemeColor) || "0, 42, 92";
        const almostBlackRgb = hexToRgb(almostBlackColor) || "0, 17, 38";

        return (
            <div className="relative flex h-full flex-col overflow-hidden bg-white">
                {/* Header */}
                <div className="relative mb-3 flex items-center justify-between px-6 pt-6 z-20">
                    <button
                        onClick={() => setCurrentScreen("document_selection")}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <span>&lt; back</span>
                    </button>
                    {/* <img
                        src="/images/zelify_logo.png"
                        alt="Logo"
                        className="h-8 absolute left-1/2 -translate-x-1/2 object-contain drop-shadow-sm"
                    /> */}
                    <div className="w-12"></div>
                </div>

                {/* Main Content */}
                <div className="relative flex-1 flex flex-col px-6 z-10">
                    {/* Progress Indicator (only when capturing back) */}
                    {isBack && frontCaptured && (
                        <div className="mb-4 flex justify-center z-20">
                            <div className="relative flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
                                <FaIdCard className="h-4 w-4 text-gray-600" />
                                <span className="text-xs font-medium text-gray-700">Frente del documento</span>
                                <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                                    <FaCheck className="h-3 w-3 text-white" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Container with Gradient */}
                    <div
                        className="relative mx-auto w-full max-w-sm rounded-3xl px-6 py-8 mb-8"
                        style={{
                            background: `linear-gradient(to top, 
                                rgba(0, 0, 0, 1) 0%, 
                                rgba(${almostBlackRgb}, 1) 10%, 
                                rgba(${darkThemeRgb}, 1) 20%, 
                                rgba(${themeRgb}, 0.8) 30%, 
                                rgba(${themeRgb}, 0.4) 40%, 
                                transparent 50%, 
                                transparent 100%)`,
                            minHeight: '400px',
                        }}
                    >
                        {/* Title Section */}
                        <div className="mb-8 text-center z-20 relative">
                            <h2 className="mb-2 text-2xl font-bold leading-tight" style={{ color: themeColor }}>
                                Captura {documentName}
                            </h2>
                            <p className="text-sm text-gray-600 leading-tight">
                                {isFront
                                    ? "Alinea el documento dentro del marco y asegúrate de que sea legible"
                                    : "Gira el documento y alinea la parte posterior dentro del marco"
                                }
                            </p>
                        </div>

                        {/* Document Capture Area */}
                        <div className="relative mx-auto mb-6 z-30" style={{ maxWidth: '280px', height: '140px' }}>
                            <div
                                className="w-full h-full rounded-2xl border-2 border-dashed bg-white relative overflow-hidden"
                                style={{ borderColor: themeColor }}
                            >
                                {/* Flash Effect */}
                                {isCapturing && (
                                    <div className="absolute inset-0 z-20 bg-white rounded-2xl animate-pulse" />
                                )}

                                {/* Captured Document Simulation */}
                                {(isBack && frontCaptured) && (
                                    <div className="absolute inset-4 rounded-lg bg-white shadow-lg flex flex-col p-2">
                                        <div className="flex gap-2 mb-2">
                                            <div className="h-12 w-12 rounded bg-gray-200"></div>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-1 bg-gray-300 rounded w-full"></div>
                                                <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                                                <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-1 bg-gray-300 rounded w-full"></div>
                                            <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="text-center z-20 relative">
                            <h3 className="text-base font-bold text-white mb-1">
                                {isFront ? PREVIEW_TEXTS.documentCapture.overlayTitle.front : PREVIEW_TEXTS.documentCapture.overlayTitle.back}
                            </h3>
                            <p className="text-xs text-white/90 leading-tight">
                                {PREVIEW_TEXTS.documentCapture.overlayHint}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Capture Button - Outside gradient container, in white space */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
                    <button
                        onClick={() => {
                            setIsCapturing(true);
                            setTimeout(() => {
                                setIsCapturing(false);
                                if (isFront) {
                                    setFrontCaptured(true);
                                    setTimeout(() => {
                                        setCaptureStep("back");
                                    }, 500);
                                } else {
                                    setBackCaptured(true);
                                    setTimeout(() => {
                                        setCurrentScreen("liveness_check");
                                    }, 500);
                                }
                            }, 300);
                        }}
                        disabled={isCapturing}
                        className={`h-16 w-16 rounded-full shadow-xl transition-all duration-200 flex items-center justify-center ${isCapturing ? 'scale-95 opacity-80' : 'hover:scale-110 active:scale-95 hover:shadow-2xl'
                            }`}
                        style={{
                            background: themeColor,
                        }}
                    >
                        {isCapturing ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                            <FaCamera className="w-7 h-7 text-white" />
                        )}
                    </button>
                </div>

                {/* Full Screen Flash Effect */}
                {isCapturing && (
                    <div className="absolute inset-0 z-50 bg-white animate-pulse" />
                )}
            </div>
        );
    };

    const renderLiveness = () => {
        // Convert hex to rgb for gradient
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
        };
        const themeRgb = hexToRgb(themeColor) || "0, 68, 146";
        const darkThemeRgb = hexToRgb(darkThemeColor) || "0, 42, 92";
        const almostBlackRgb = hexToRgb(almostBlackColor) || "0, 17, 38";

        // Liveness options
        const livenessOptions: Array<{ type: LivenessType; title: string; description: string; icon: React.ReactNode }> = [
            {
                type: "selfie_photo",
                title: "Selfie con foto",
                description: "Toma una foto de tu rostro",
                icon: <FaImage className="w-6 h-6 text-white" />
            },
            {
                type: "selfie_video",
                title: "Selfie con video",
                description: "Graba un video corto de tu rostro",
                icon: <FaVideo className="w-6 h-6 text-white" />
            },
        ];

        // Calculate progress for circular indicator
        const viewBoxSize = 256;
        const progressStrokeWidth = 3;
        const perimeterProgressRadius = viewBoxSize / 2 - progressStrokeWidth / 2;
        const perimeterCircumference = 2 * Math.PI * perimeterProgressRadius;
        const normalizedProgress = Math.min(Math.max(faceIdProgress, 0), 100);
        const perimeterOffset = perimeterCircumference * (1 - normalizedProgress / 100);

        // ESTADO 1: Selección
        if (!isFaceIdScanning) {
            return (
                <div className="relative flex h-full flex-col overflow-hidden">
                    {/* Header */}
                    <div className="relative mb-3 flex items-center justify-between px-6 pt-6 z-20">
                        <button
                            onClick={() => setCurrentScreen("document_capture")}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <span>&lt; back</span>
                        </button>
                        {/* <img
                            src="/images/zelify_logo.png"
                            alt="Logo"
                            className="h-8 absolute left-1/2 -translate-x-1/2 object-contain drop-shadow-sm"
                        /> */}
                        <div className="w-12"></div>
                    </div>

                    {/* GIF Fondo */}
                    <div className="relative -mb-16 z-0 flex justify-center">
                        <img
                            src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                            alt="Animation"
                            className="h-48 w-48 object-contain opacity-90 mix-blend-multiply"
                        />
                    </div>

                    {/* Tarjeta Principal */}
                    <div
                        className="relative z-10 flex-1 flex flex-col rounded-2xl p-5 backdrop-blur-sm overflow-hidden"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}
                    >
                        {/* Título y Subtítulo */}
                        <div className="text-center mb-1 flex-shrink-0">
                            <h2 className="text-xl font-bold" style={{ color: themeColor }}>
                                {PREVIEW_TEXTS.liveness.title}
                            </h2>
                            <p className="text-xs text-gray-600 mt-1">
                                {PREVIEW_TEXTS.liveness.subtitle}
                            </p>
                        </div>

                        {/* Tarjetas Verticales - Pyramid Effect (centradas verticalmente) */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="relative w-full flex-shrink-0" style={{ minHeight: '200px', paddingTop: '5px' }}>
                                {livenessOptions.map((option, idx) => {
                                    const isActive = activeLivenessCard === idx;
                                    const activeIndex = activeLivenessCard ?? 0;
                                    const isAbove = idx < activeIndex;
                                    const isBelow = idx > activeIndex;

                                    // Card heights: active is taller, inactive are shorter
                                    const activeHeight = 75;
                                    const inactiveHeight = 58;

                                    // Calculate position for pyramid effect - tighter spacing
                                    let topPosition = 0;
                                    if (isActive) {
                                        // Active card position based on its index
                                        topPosition = idx === 0 ? 0 : (idx === 1 ? 35 : 70);
                                    } else if (isAbove) {
                                        // Cards above: start from top, very close together
                                        topPosition = idx * 38;
                                    } else {
                                        // Cards below: positioned after active card, overlapping
                                        const activePos = activeIndex === 0 ? 0 : (activeIndex === 1 ? 35 : 70);
                                        topPosition = activePos + activeHeight - 15 + (idx - activeIndex - 1) * 38;
                                    }

                                    // Z-index: active is highest, then based on distance from active
                                    let zIndex = 10;
                                    if (isActive) {
                                        zIndex = 30;
                                    } else if (isAbove) {
                                        zIndex = 20 - (activeIndex - idx);
                                    } else {
                                        zIndex = 20 - (idx - activeIndex);
                                    }

                                    return (
                                        <div
                                            key={option.type}
                                            onClick={() => {
                                                setActiveLivenessCard(idx);
                                                setSelectedLivenessType(option.type);
                                            }}
                                            className={`absolute left-0 right-0 transition-all duration-300 cursor-pointer flex items-center gap-3 rounded-2xl border-[3px] overflow-visible
                                            ${isActive
                                                    ? 'border-white shadow-xl'
                                                    : 'border-white bg-[#d1d5db] hover:bg-[#c4c8ce]'
                                                }`}
                                            style={{
                                                background: isActive
                                                    ? `linear-gradient(to right, ${themeColor} 0%, ${blackColor} 100%)`
                                                    : undefined,
                                                top: `${topPosition}px`,
                                                height: isActive ? `${activeHeight}px` : `${inactiveHeight}px`,
                                                padding: isActive ? '0.875rem 1rem' : '0.75rem 1rem',
                                                width: isActive ? 'calc(100% + 16px)' : 'calc(100% - 16px)',
                                                left: isActive ? '-8px' : '8px',
                                                transform: isActive ? 'scale(1.06)' : 'scale(1)',
                                                zIndex: zIndex,
                                            }}
                                        >
                                            <div className={`p-1.5 rounded-lg flex-shrink-0`}>
                                                {option.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-white'}`}>
                                                    {option.title}
                                                </h3>
                                                <p className={`text-[10px] leading-tight mt-0.5 ${isActive ? 'text-white/80' : 'hidden'}`}>
                                                    {option.description}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Botón "Iniciar Verificación" - Pegado abajo */}
                        {selectedLivenessType && (
                            <div className="mt-auto pt-4">
                                <button
                                    onClick={() => {
                                        setIsFaceIdScanning(true);
                                        setFaceIdProgress(0);
                                        // Simular progreso
                                        const duration = 5000;
                                        const interval = 50;
                                        const increment = 100 / (duration / interval);
                                        const progressInterval = setInterval(() => {
                                            setFaceIdProgress((prev) => {
                                                const newProgress = prev + increment;
                                                if (newProgress >= 100) {
                                                    clearInterval(progressInterval);
                                                    setTimeout(() => {
                                                        setIsFaceIdScanning(false);
                                                        setVerificationResult(Math.random() > 0.3 ? "approved" : "rejected");
                                                        setCurrentScreen("result");
                                                    }, 500);
                                                    return 100;
                                                }
                                                return newProgress;
                                            });
                                        }, interval);
                                    }}
                                    className="group relative w-full overflow-hidden rounded-xl px-5 py-4 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-between"
                                    style={{
                                        background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                    }}
                                >
                                    <span className="font-bold">Iniciar verificación</span>
                                    <span className="font-mono text-lg leading-none">{'>'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // ESTADO 2: Escaneo
        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white" style={{ paddingBottom: '100px', paddingLeft: '10px', paddingRight: '10px' }}>
                {/* Header - Solo logo */}
                {/* <div className="relative mb-3 flex items-center justify-between px-6 pt-6 z-20">
                    <div className="w-full"></div>
                    <img
                        src="/images/zelify_logo.png"
                        alt="Logo"
                        className="h-8 absolute left-1/2 -translate-x-1/2 object-contain drop-shadow-sm"
                    />
                    <div className="w-full"></div>
                </div> */}

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
                        minHeight: '500px',
                    }}
                >
                    {/* Título */}
                    <div className="text-center mb-6 mt-0">
                        <h2 className="text-xl font-bold leading-tight" style={{ color: themeColor }}>
                            Escaneando tu rostro
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
                                    src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/faceverification.mp4"
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
                            <p className="text-sm text-white mb-1">Completando verificación</p>
                            <p className="text-base font-bold text-white">Verificando identidad</p>
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
    };

    const renderResult = () => {
        const isApproved = verificationResult === "approved";

        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                {/* Header - Solo logo
                <div className="relative mb-3 flex items-center justify-between px-6 pt-6 z-20">
                    <div className="w-full"></div>
                    <img
                        src="/images/zelify_logo.png"
                        alt="Logo"
                        className="h-8 absolute left-1/2 -translate-x-1/2 object-contain drop-shadow-sm"
                    />
                    <div className="w-full"></div>
                </div> */}

                {/* Contenedor con Gradiente Horizontal */}
                <div
                    className="relative rounded-3xl flex flex-col items-center justify-center"
                    style={{
                        background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                        marginTop: '20px',
                        marginLeft: '10px',
                        marginRight: '10px',
                        marginBottom: '80px',
                        width: 'calc(100% - 20px)',
                        height: 'calc(100% - 10px)',
                        padding: '40px 20px',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Contenido Centrado */}
                    <div className="flex flex-col items-center justify-center text-center space-y-6">
                        {/* Icono (Checkmark o X) */}
                        {isApproved ? (
                            <svg
                                className="h-24 w-24"
                                style={{ color: 'white' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                    style={{ transform: 'rotate(-2deg)' }}
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-24 w-24"
                                style={{ color: 'white' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}

                        {/* Título Principal */}
                        <h2 className="text-3xl font-bold leading-tight" style={{ color: 'white' }}>
                            {isApproved ? 'Verificación Aprobada' : 'Verificación Rechazada'}
                        </h2>

                        {/* Subtítulo */}
                        <div className="flex flex-col items-center space-y-2">
                            <p className="text-base leading-relaxed" style={{ color: 'white', opacity: 0.9 }}>
                                {isApproved
                                    ? 'Tu identidad ha sido verificada exitosamente'
                                    : 'No pudimos verificar tu identidad'}
                            </p>
                            {!isApproved && (
                                <p className="text-base leading-relaxed" style={{ color: 'white', opacity: 0.9 }}>
                                    Intenta de nuevo
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    // -- Main Switch --
    return (
        <div className="w-full h-full bg-white relative font-sans overflow-hidden select-none">
            {/* Global Style overrides for this card */}
            <style>{`
         @keyframes scan { 0% { top: 10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 90%; opacity: 0; } }
         .animate-scan { animation: scan 2s linear infinite; }
       `}</style>

            {currentScreen === 'welcome' && renderWelcome()}
            {currentScreen === 'document_selection' && renderDocumentSelection()}
            {currentScreen === 'document_capture' && renderCapture()}
            {currentScreen === 'liveness_check' && renderLiveness()}
            {currentScreen === 'result' && renderResult()}
        </div>
    );
}
