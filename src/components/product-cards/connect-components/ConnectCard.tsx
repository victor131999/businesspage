import { useState, useRef, useEffect } from "react";
import { CONNECT_TRANSLATIONS } from "./connect-translations";

/* -- Types -- */
type Screen = "banks" | "credentials" | "loading" | "success" | "wallet" | "deposit";
type BankAccountCountry = "ecuador" | "mexico" | "brasil" | "colombia" | "estados_unidos";

interface Bank {
    id: string;
    name: string;
    logo?: string;
}

interface BankAccount {
    id: string;
    nameKey: "clabe" | "checking";
    accountNumber: string;
    balance: number;
}

/* -- Main Component -- */
export default function ConnectCard({ isDemoEnabled = true }: { isDemoEnabled?: boolean }) {
    const [lang, setLang] = useState<keyof typeof CONNECT_TRANSLATIONS>(() => {
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
        const val = String(raw).toLowerCase();
        return (val === "en" || val === "english" || val === "en-us") ? "en" : "es";
    });

    useEffect(() => {
        const handleLanguageChange = (event: Event) => {
            const customEvent = event as CustomEvent<{ language?: string }>;
            const next = customEvent.detail?.language;
            const val = String(next || "").toLowerCase();
            setLang((val === "en" || val === "english" || val === "en-us") ? "en" : "es");
        };

        window.addEventListener("ui:languagechange", handleLanguageChange);
        return () => window.removeEventListener("ui:languagechange", handleLanguageChange);
    }, []);

    const t = CONNECT_TRANSLATIONS[lang];

    // State
    const [currentScreen, setCurrentScreen] = useState<Screen>("banks");
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [activeBankCard, setActiveBankCard] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [selectedAccountForDeposit, setSelectedAccountForDeposit] = useState<BankAccount | null>(null);
    const [activeDepositAccountCard, setActiveDepositAccountCard] = useState<number>(0);
    const [depositAmount, setDepositAmount] = useState("");
    const [slideProgress, setSlideProgress] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);
    const [country, setCountry] = useState<BankAccountCountry>("mexico");

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

    // Demo Refs
    const isRunningRef = useRef(false);
    const abortDemo = useRef(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const slideContainerRef = useRef<HTMLDivElement | null>(null);

    // Banks data (simplified for demo)
    const banks: Bank[] = [
        { id: "1", name: "BBVA México" },
        { id: "2", name: "Banco Santander" },
        { id: "3", name: "Banamex" },
        { id: "4", name: "HSBC México" },
        { id: "5", name: "Banco Azteca" },
    ];

    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Deposit accounts
    const depositAccounts: BankAccount[] = [
        {
            id: "1",
            nameKey: "clabe",
            accountNumber: "012345678901234567",
            balance: 12345.67,
        },
        {
            id: "2",
            nameKey: "checking",
            accountNumber: "",
            balance: 145.67,
        },
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

    // Start loading progress
    const startLoadingProgress = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        setLoadingProgress(0);
        const duration = 3000;
        const interval = 30;
        const increment = 100 / (duration / interval);

        progressIntervalRef.current = setInterval(() => {
            setLoadingProgress((prev) => {
                const newProgress = prev + increment;
                if (newProgress >= 100) {
                    if (progressIntervalRef.current) {
                        clearInterval(progressIntervalRef.current);
                        progressIntervalRef.current = null;
                    }
                    return 100;
                }
                return newProgress;
            });
        }, interval);
    };

    // Get currency code
    const getCurrencyCode = (country: BankAccountCountry): string => {
        const currencyMap: Record<BankAccountCountry, string> = {
            mexico: "MXN",
            brasil: "BRL",
            colombia: "COP",
            estados_unidos: "USD",
            ecuador: "USD",
        };
        return currencyMap[country] || "USD";
    };

    // Demo flow
    const handlePlayDemo = async () => {
        if (!isDemoEnabled || isRunningRef.current) return;
        isRunningRef.current = true;
        abortDemo.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        try {
            while (isRunningRef.current && !abortDemo.current) {
                // Reset to initial state
                setCurrentScreen("banks");
                setSelectedBank(null);
                setActiveBankCard(0);
                setSearchQuery("");
                setUsername("");
                setPassword("");
                setLoadingProgress(0);
                setWalletBalance(0);
                setSelectedAccountForDeposit(null);
                setActiveDepositAccountCard(0);
                setDepositAmount("");
                setSlideProgress(0);
                setIsSliding(false);
                setIsTransferring(false);

                // 1. Banks screen - simulate selection
                await wait(1000);
                setActiveBankCard(1);
                setSelectedBank(banks[1]);
                await wait(800);
                setActiveBankCard(0);
                setSelectedBank(banks[0]);
                await wait(1000);

                // 2. Navigate to credentials
                if (abortDemo.current) break;
                setCurrentScreen("credentials");
                await wait(1500);

                // 3. Fill credentials
                for (let i = 0; i <= "demo@zelify.com".length; i++) {
                    if (abortDemo.current) break;
                    await wait(50);
                    setUsername("demo@zelify.com".slice(0, i));
                }
                await wait(500);
                for (let i = 0; i <= "password123".length; i++) {
                    if (abortDemo.current) break;
                    await wait(50);
                    setPassword("password123".slice(0, i));
                }
                await wait(1000);

                // 4. Navigate to loading
                if (abortDemo.current) break;
                setCurrentScreen("loading");
                startLoadingProgress();
                await wait(3200);

                // 5. Navigate to success
                if (abortDemo.current) break;
                setCurrentScreen("success");
                await wait(2000);

                // 6. Navigate to wallet
                if (abortDemo.current) break;
                setCurrentScreen("wallet");
                setWalletBalance(1000.00);
                await wait(2000);

                // 7. Navigate to deposit
                if (abortDemo.current) break;
                setCurrentScreen("deposit");
                await wait(1000);
                setActiveDepositAccountCard(0);
                setSelectedAccountForDeposit(depositAccounts[0]);
                await wait(500);
                setDepositAmount("500");
                await wait(1000);

                // 8. Simulate slide
                for (let i = 0; i <= 100; i += 5) {
                    if (abortDemo.current) break;
                    await wait(30);
                    setSlideProgress(i);
                }
                await wait(500);
                setIsTransferring(true);
                setCurrentScreen("loading");
                setLoadingProgress(0);
                startLoadingProgress();
                await wait(3200);

                // 9. Back to wallet
                if (abortDemo.current) break;
                setCurrentScreen("wallet");
                setWalletBalance(1500.00);
                await wait(3000); // Wait at end of loop
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
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        window.dispatchEvent(new CustomEvent('zelify:demo-end'));
    };

    // Auto-advance from loading to success when progress completes
    useEffect(() => {
        if (currentScreen === "loading" && loadingProgress >= 99.9) {
            const timer = setTimeout(() => {
                setCurrentScreen("success");
            }, 1000); // Delay to show completion state
            return () => clearTimeout(timer);
        }
    }, [currentScreen, loadingProgress]);

    // Auto-advance from success to wallet after showing success message
    useEffect(() => {
        if (currentScreen === "success") {
            const timer = setTimeout(() => {
                setCurrentScreen("wallet");
                setWalletBalance(1000.00); // Set initial wallet balance
            }, 2500); // Show success message for 2.5 seconds
            return () => clearTimeout(timer);
        }
    }, [currentScreen]);

    // Event listeners
    useEffect(() => {
        window.addEventListener('zelify:play-demo:connect', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:connect', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:connect', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:connect', handleStopDemo);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [isDemoEnabled]);

    // Render Banks Screen
    const renderBanksScreen = () => {
        return (
            <div className="flex h-full flex-col px-6 py-6">
                {/* Title */}
                <div className="mb-2 text-center">
                    <h2 className="mb-1 text-sm font-bold" style={{ color: themeColor }}>
                        {t.banks.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {t.banks.subtitle}
                    </p>
                </div>

                {/* Search bar */}
                <div className="mb-[10px]">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder={t.banks.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Bank cards - Pyramid effect */}
                <div
                    className="relative flex flex-col items-center flex-1 min-h-0 overflow-y-auto"
                    style={{ isolation: "isolate", backgroundColor: "transparent" }}
                >
                    {filteredBanks.map((bank, index) => {
                        const isActive = activeBankCard === index;
                        const activeIndex = activeBankCard;
                        const cardOverlap = 20;
                        const distanceFromActive = Math.abs(activeIndex - index);
                        const zIndex = 50 - distanceFromActive;

                        return (
                            <div
                                key={bank.id}
                                className={`relative w-full cursor-pointer flex items-center justify-center transition-all duration-500 ${isActive ? "shadow-lg" : ""
                                    }`}
                                onClick={() => {
                                    setActiveBankCard(index);
                                    setSelectedBank(bank);
                                }}
                                style={{
                                    borderRadius: "20px",
                                    zIndex: zIndex,
                                    marginTop: index === 0 ? "0px" : `-${cardOverlap}px`,
                                    height: isActive ? "60px" : "65px",
                                    padding: isActive ? "20px 24px" : "16px 24px",
                                    backgroundColor: isActive ? undefined : "#E5E7EB",
                                    color: isActive ? "white" : "#1F2937",
                                    border: "5px solid #FFFFFF",
                                    boxShadow: isActive
                                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    transform: isActive ? "scale(1.02)" : "scale(1)",
                                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    ...(isActive
                                        ? {
                                            background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                        }
                                        : {}),
                                }}
                            >
                                <div
                                    className="flex items-center w-full"
                                    style={{
                                        paddingLeft: isActive ? "14px" : "0",
                                        paddingRight: "14px",
                                    }}
                                >
                                    <span
                                        className={`${isActive ? "text-xs font-semibold" : "text-[10px] font-medium"}`}
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "visible",
                                            marginLeft: isActive ? "10px" : "0",
                                            flex: "1",
                                            textAlign: isActive ? "left" : "center",
                                        }}
                                    >
                                        {bank.name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue button */}
                <div className="mt-[10px] flex justify-center pb-4 flex-shrink-0">
                    <button
                        onClick={() => {
                            if (selectedBank) {
                                setCurrentScreen("credentials");
                            }
                        }}
                        disabled={!selectedBank}
                        className="group relative flex items-center justify-between overflow-hidden rounded-lg border px-6 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: !selectedBank
                                ? '#9BA2AF'
                                : `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                            borderColor: !selectedBank ? '#9BA2AF' : themeColor,
                            boxShadow: !selectedBank ? 'none' : `0 4px 14px 0 ${themeColor}40`,
                            minWidth: "200px",
                            width: "auto",
                        }}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {t.banks.continue}
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        );
    };

    // Render Credentials Screen
    const renderCredentialsScreen = () => {
        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                {/* Header/Logo Space (Optional, keeping consistent spacing) */}
                <div className="pt-6 px-6 text-center shrink-0">
                    {/* If a logo is needed strictly like AuthCard, uncomment below, otherwise keep simple space */}
                    {/* <img src="/images/zelify_logo.png" alt="Logo" className="h-10 w-auto mx-auto object-contain" /> */}
                </div>

                {/* Animated GIF - Behind the card */}
                <div className="relative -mb-10 flex-shrink-0 z-0 flex justify-center mt-2">
                    <img
                        src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                        alt="Security Animation"
                        className="h-40 w-40 object-contain opacity-90 mix-blend-multiply"
                    />
                </div>

                {/* Glass Card Container */}
                <div
                    className="relative z-10 flex-1 flex flex-col rounded-2xl p-6 backdrop-blur-sm border border-white/50 mx-4 mb-4 shadow-sm"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.45)' }}
                >
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold" style={{ color: themeColor }}>
                            {t.credentials.title}
                        </h2>
                        <p className="text-xs text-gray-600 mt-1">
                            {t.credentials.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4 flex-1">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5" style={{ color: themeColor }}>
                                {t.credentials.usernameLabel}
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={t.credentials.usernamePlaceholder}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5" style={{ color: themeColor }}>
                                {t.credentials.passwordLabel}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t.credentials.passwordPlaceholder}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                            />
                        </div>

                        <div className="mt-auto pt-4">
                            <button
                                onClick={() => {
                                    if (username && password) {
                                        setCurrentScreen("loading");
                                        startLoadingProgress();
                                    }
                                }}
                                disabled={!username || !password}
                                className="group relative w-full overflow-hidden rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                style={{
                                    background: (!username || !password)
                                        ? '#9BA2AF'
                                        : `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                    boxShadow: (!username || !password) ? 'none' : `0 4px 14px 0 ${themeColor}40`,
                                }}
                            >
                                {t.credentials.submit}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Loading Screen
    const renderLoadingScreen = () => {
        const isComplete = loadingProgress >= 100;
        const textShouldBeWhite = loadingProgress > 40;

        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                <div
                    className="relative rounded-3xl flex flex-col items-center justify-center overflow-hidden"
                    style={{
                        marginTop: "20px",
                        marginLeft: "10px",
                        marginRight: "10px",
                        marginBottom: "80px",
                        width: "calc(100% - 20px)",
                        height: "calc(100% - 10px)",
                        boxSizing: "border-box",
                        padding: "40px 20px",
                        position: "relative",
                        backgroundColor: "#f3f4f6",
                    }}
                >
                    {/* Filling gradient */}
                    <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                            background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                            clipPath: (() => {
                                const progress = loadingProgress + 20;
                                let points = `0% 0%, `;
                                for (let i = 0; i <= 50; i++) {
                                    const y = (i / 50) * 100;
                                    const distanceFromCenter = Math.abs(y - 50) / 50;
                                    const delay = distanceFromCenter * 15;
                                    const adjustedProgress = Math.max(0, progress - delay);
                                    const wave = Math.sin(
                                        (adjustedProgress / 100) * Math.PI * 5 +
                                        (y / 100) * Math.PI * 3
                                    ) * 10;
                                    const x = adjustedProgress + (wave / 100) * 12;
                                    points += `${x}% ${y}%, `;
                                }
                                points += `0% 100%`;
                                return `polygon(${points})`;
                            })(),
                            transition: "clip-path 0.05s linear",
                            maskImage: `linear-gradient(to right, 
                                rgba(0,0,0,1) 0%, 
                                rgba(0,0,0,1) ${Math.max(0, loadingProgress - 50)}%, 
                                rgba(0,0,0,0.9) ${Math.max(0, loadingProgress - 40)}%, 
                                rgba(0,0,0,0.6) ${Math.max(0, loadingProgress - 25)}%, 
                                rgba(0,0,0,0.3) ${Math.max(0, loadingProgress - 15)}%, 
                                rgba(0,0,0,0) ${loadingProgress}%, 
                                rgba(0,0,0,0) 100%
                            )`,
                            WebkitMaskImage: `linear-gradient(to right, 
                                rgba(0,0,0,1) 0%, 
                                rgba(0,0,0,1) ${Math.max(0, loadingProgress - 50)}%, 
                                rgba(0,0,0,0.9) ${Math.max(0, loadingProgress - 40)}%, 
                                rgba(0,0,0,0.6) ${Math.max(0, loadingProgress - 25)}%, 
                                rgba(0,0,0,0.3) ${Math.max(0, loadingProgress - 15)}%, 
                                rgba(0,0,0,0) ${loadingProgress}%, 
                                rgba(0,0,0,0) 100%
                            )`,
                        }}
                    />

                    {/* Content when complete */}
                    {isComplete && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                            <svg
                                className="h-24 w-24"
                                style={{ color: "white" }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                    style={{ transform: "rotate(-2deg)" }}
                                />
                            </svg>
                            <h2 className="text-3xl font-bold leading-tight" style={{ color: "white" }}>
                                {isTransferring ? t.loading.complete.transferTitle : t.loading.complete.linkingTitle}
                            </h2>
                            <p className="text-base leading-relaxed" style={{ color: "white", opacity: 0.9 }}>
                                {isTransferring
                                    ? t.loading.complete.transferSubtitle
                                    : t.loading.complete.linkingSubtitle}
                            </p>
                        </div>
                    )}

                    {/* Content while loading */}
                    {!isComplete && (
                        <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                            <h2 className="text-xl font-bold">
                                {(isTransferring ? t.loading.inProgress.transferTitle : t.loading.inProgress.linkingTitle)
                                    .split("")
                                    .map((char, index, array) => {
                                        const charProgress = (index / array.length) * 100;
                                        const isWhite = loadingProgress >= charProgress;
                                        return (
                                            <span
                                                key={index}
                                                style={{
                                                    color: isWhite ? "white" : almostBlackColor,
                                                    transition: "color 0.2s ease-out",
                                                }}
                                            >
                                                {char === " " ? "\u00A0" : char}
                                            </span>
                                        );
                                    })}
                            </h2>
                            <p className="text-sm">
                                {t.loading.inProgress.subtitle
                                    .split("")
                                    .map((char, index, array) => {
                                        const charProgress = (index / array.length) * 100;
                                        const isWhite = loadingProgress >= charProgress;
                                        return (
                                            <span
                                                key={index}
                                                style={{
                                                    color: isWhite ? "rgba(255, 255, 255, 0.9)" : "#666",
                                                    transition: "color 0.2s ease-out",
                                                }}
                                            >
                                                {char === " " ? "\u00A0" : char}
                                            </span>
                                        );
                                    })}
                            </p>
                            <div className="w-full max-w-xs mt-2">
                                <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300 ease-out"
                                        style={{
                                            width: `${loadingProgress}%`,
                                            backgroundColor: "white",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render Success Screen
    const renderSuccessScreen = () => {
        return (
            <div className="flex h-full flex-col relative overflow-hidden bg-white">
                <div
                    className="relative rounded-3xl flex flex-col items-center justify-center"
                    style={{
                        background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                        marginTop: "20px",
                        marginLeft: "10px",
                        marginRight: "10px",
                        marginBottom: "80px",
                        width: "calc(100% - 20px)",
                        height: "calc(100% - 10px)",
                        boxSizing: "border-box",
                        padding: "40px 20px",
                    }}
                >
                    <div className="flex flex-col items-center justify-center text-center space-y-6">
                        <svg
                            className="h-24 w-24"
                            style={{ color: "white" }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                                style={{ transform: "rotate(-2deg)" }}
                            />
                        </svg>
                        <h2 className="text-3xl font-bold leading-tight" style={{ color: "white" }}>
                            {isTransferring ? t.success.transferTitle : t.success.title}
                        </h2>
                        <p className="text-base leading-relaxed" style={{ color: "white", opacity: 0.9 }}>
                            {isTransferring ? t.success.transferSubtitle : t.success.subtitle}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // Render Wallet Screen
    const renderWalletScreen = () => {
        const currencyCode = getCurrencyCode(country);

        return (
            <div className="flex h-full flex-col relative bg-white overflow-hidden">
                {/* GIF Animation - Top Centered - Reduced size */}
                <div className="relative flex-shrink-0 z-0 flex justify-center -mb-6 mt-2">
                    <img
                        src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                        alt="Wallet Animation"
                        className="h-48 w-48 object-contain opacity-90"
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col px-6 relative z-10 min-h-0">
                    {/* Title Section - Reduced margins */}
                    <div className="text-center mb-4 shrink-0">
                        <h2 className="text-xl font-bold" style={{ color: almostBlackColor }}>
                            {t.wallet.title}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {t.wallet.subtitle}
                        </p>
                    </div>

                    {/* Balance Section - Compact */}
                    <div className="mb-4 shrink-0">
                        <label className="text-xs font-medium mb-2 block" style={{ color: almostBlackColor }}>
                            {t.wallet.totalBalance}
                        </label>

                        <div
                            className="rounded-2xl p-3 flex items-center justify-between"
                            style={{
                                backgroundColor: "#E5E7EB", // Light gray background
                            }}
                        >
                            <span className="text-2xl font-normal tracking-tight" style={{ color: almostBlackColor }}>
                                ${walletBalance.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                            <span
                                className="px-3 py-1 rounded-full text-[10px] font-bold"
                                style={{
                                    background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                    color: "white",
                                }}
                            >
                                {currencyCode}
                            </span>
                        </div>
                    </div>

                    {/* Deposit Button */}
                    <button
                        onClick={() => setCurrentScreen("deposit")}
                        className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl px-5 py-3 text-sm font-bold text-white transition-all active:scale-[0.98] shrink-0"
                        style={{
                            background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                            boxShadow: `0 4px 14px 0 ${themeColor}40`,
                        }}
                    >
                        <span>{t.wallet.depositFunds}</span>
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    {/* Bank Card (Bottom) - Flex fill to visually anchor bottom */}
                    <div className="flex-1 min-h-[20px]" />

                    <div
                        className="rounded-t-3xl pt-6 pb-8 px-8 -mx-6 shrink-0"
                        style={{
                            background: `linear-gradient(to bottom, ${themeColor} 0%, ${blackColor} 100%)`,
                        }}
                    >
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <svg
                                className="h-5 w-5 mb-0.5"
                                style={{ color: "white" }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 15l7-7 7 7"
                                />
                            </svg>
                            <h3 className="text-lg font-bold uppercase tracking-wide" style={{ color: "white" }}>
                                {selectedBank?.name || "BBVA MÉXICO"}
                            </h3>
                            <p className="text-xs font-medium" style={{ color: "white", opacity: 0.8 }}>
                                {t.wallet.bankConnected}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Deposit Screen
    const renderDepositScreen = () => {
        const currencyCode = getCurrencyCode(country);

        const handleSlideStart = () => {
            if (isTransferring) return;
            setIsSliding(true);
        };

        const handleSlideMove = (clientX: number) => {
            if (!isSliding || isTransferring) return;
            const container = slideContainerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const sliderWidth = 48;
            const x = clientX - rect.left;
            const maxX = rect.width - sliderWidth;
            const progress = Math.max(0, Math.min(100, (x / maxX) * 100));
            setSlideProgress(progress);
            if (progress >= 90 && !isTransferring) {
                setIsTransferring(true);
                setSlideProgress(100);
                setIsSliding(false);
                setLoadingProgress(0);
                setCurrentScreen("loading");
                setIsTransferring(true);
                startLoadingProgress();
            }
        };

        const handleSlideEnd = () => {
            setIsSliding(false);
            if (slideProgress < 90 && !isTransferring) {
                setSlideProgress(0);
            }
        };

        return (
            <div className="flex h-full flex-col overflow-y-auto relative">
                <div className="relative flex-shrink-0 z-0 mb-2 flex justify-center">
                    <img
                        src="https://zelify-proposals-pdf-prod.s3.us-east-1.amazonaws.com/video/animation1.gif"
                        alt="Deposit Animation"
                        className="h-48 w-48 object-contain opacity-90"
                    />
                </div>

                <div
                    className="relative z-10 flex-1 flex flex-col rounded-2xl backdrop-blur-sm"
                    style={{
                        marginLeft: "15px",
                        marginRight: "15px",
                        marginBottom: "15px",
                        padding: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.35)",
                        marginTop: "-100px",
                    }}
                >
                    <div className="flex flex-col flex-1 space-y-2">
                        <div className="text-center">
                            <h2 className="text-lg font-bold" style={{ color: almostBlackColor }}>
                                {t.deposit.title}
                            </h2>
                            <p className="text-xs text-gray-600 mt-0.5">
                                {t.deposit.subtitle}
                            </p>
                        </div>

                        <label className="text-sm font-medium" style={{ color: almostBlackColor, textAlign: "left" }}>
                            {t.deposit.selectAccount}
                        </label>

                        <div
                            className="relative flex flex-col items-center w-full"
                            style={{
                                isolation: "isolate",
                                backgroundColor: "transparent",
                                paddingTop: "20px",
                            }}
                        >
                            {depositAccounts.map((account, index) => {
                                const isActive = activeDepositAccountCard === index;
                                const activeIndex = activeDepositAccountCard;
                                const distanceFromActive = Math.abs(activeIndex - index);
                                const zIndex = 50 - distanceFromActive;

                                return (
                                    <div
                                        key={account.id}
                                        className="relative w-full cursor-pointer flex items-center justify-center"
                                        onClick={() => {
                                            if (activeDepositAccountCard !== index) {
                                                setActiveDepositAccountCard(index);
                                                setSelectedAccountForDeposit(account);
                                            }
                                        }}
                                        style={{
                                            borderRadius: "28px",
                                            zIndex: zIndex,
                                            marginTop: index === 0 ? "0px" : "-20px",
                                            height: isActive ? "70px" : "60px",
                                            padding: "12px 20px",
                                            backgroundColor: isActive ? undefined : "#E5E7EB",
                                            color: isActive ? "white" : "#1F2937",
                                            border: "5px solid #FFFFFF",
                                            boxShadow: isActive
                                                ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                                                : "none",
                                            transform: isActive ? "scale(1.02)" : "scale(1)",
                                            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                            ...(isActive
                                                ? {
                                                    background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                                }
                                                : {}),
                                        }}
                                    >
                                        <div
                                            className="flex items-center w-full"
                                            style={{
                                                gap: "16px",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div className="flex flex-col items-start flex-1">
                                                <span
                                                    className={`${isActive ? "text-base font-semibold" : "text-sm font-medium"}`}
                                                    style={{
                                                        color: isActive ? "white" : "#1F2937",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {t.deposit.accountNames[account.nameKey]}
                                                </span>
                                                {isActive && account.accountNumber && (
                                                    <span
                                                        className="text-xs mt-1"
                                                        style={{
                                                            color: "white",
                                                            opacity: 0.9,
                                                        }}
                                                    >
                                                        {account.accountNumber}
                                                    </span>
                                                )}
                                            </div>
                                            {isActive && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-semibold" style={{ color: "white" }}>
                                                        ${account.balance.toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                    <span className="text-xs" style={{ color: "white", opacity: 0.9 }}>
                                                        {currencyCode}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: almostBlackColor }}>
                                {t.deposit.amount}
                            </label>
                            <input
                                type="text"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder={t.deposit.amountPlaceholder}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Slider button */}
                        <div className="mt-6">
                            <div
                                ref={slideContainerRef}
                                className="relative w-full h-14 rounded-full overflow-hidden cursor-pointer"
                                style={{
                                    backgroundColor: "#E5E7EB",
                                }}
                                onMouseDown={(e) => {
                                    handleSlideStart();
                                    handleSlideMove(e.clientX);
                                }}
                                onMouseMove={(e) => {
                                    if (isSliding) {
                                        handleSlideMove(e.clientX);
                                    }
                                }}
                                onMouseUp={handleSlideEnd}
                                onMouseLeave={handleSlideEnd}
                                onTouchStart={(e) => {
                                    handleSlideStart();
                                    handleSlideMove(e.touches[0].clientX);
                                }}
                                onTouchMove={(e) => {
                                    if (isSliding) {
                                        handleSlideMove(e.touches[0].clientX);
                                    }
                                }}
                                onTouchEnd={handleSlideEnd}
                            >
                                <div
                                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-200"
                                    style={{
                                        width: `${slideProgress}%`,
                                        background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                    }}
                                />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        left: `${slideProgress}%`,
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "white",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                        transform: `translate(calc(${slideProgress}% - 24px), -50%)`,
                                    }}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        style={{ color: themeColor }}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                        className="text-sm font-semibold"
                                        style={{
                                            color: slideProgress > 50 ? "white" : almostBlackColor,
                                            transition: "color 0.2s",
                                        }}
                                    >
                                        {slideProgress >= 90 ? t.deposit.confirming : t.deposit.slideToConfirm}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render current screen
    const renderScreenContent = () => {
        switch (currentScreen) {
            case "banks":
                return renderBanksScreen();
            case "credentials":
                return renderCredentialsScreen();
            case "loading":
                return renderLoadingScreen();
            case "success":
                return renderSuccessScreen();
            case "wallet":
                return renderWalletScreen();
            case "deposit":
                return renderDepositScreen();
            default:
                return renderBanksScreen();
        }
    };

    return (
        <div className="flex h-full flex-col relative overflow-hidden bg-white">
            {renderScreenContent()}
        </div>
    );
}
