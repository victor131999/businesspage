import { useState, useRef, useEffect } from "react";
import AlaizaChat from "./modules/AlaizaChat";
import AlaizaEducation from "./modules/AlaizaEducation";
import AlaizaBehavior from "./modules/AlaizaBehavior";

/* -- Types -- */
type ModuleType = "chat" | "financial-education" | "behavior-analysis";

/* -- Main Component -- */
export default function AlaizaCard({ isDemoEnabled = true }: { isDemoEnabled?: boolean }) {
    // Module Navigation
    const [currentModule, setCurrentModule] = useState<ModuleType>("chat");
    const [moduleKey, setModuleKey] = useState(0);
    const isRunningRef = useRef(false);

    // ========== DEMO FLOW ==========
    const wait = (ms: number) => new Promise<void>((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            if (!isRunningRef.current) {
                // If stopped mid-wait
                // reject(new Error("Demo aborted")); // Silent fail preferred
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

    const switchModule = (next: ModuleType) => {
        if (next === currentModule) return;
        setCurrentModule(next);
        setModuleKey((prev) => prev + 1);
    };

    const handlePlayDemo = async () => {
        if (!isDemoEnabled || isRunningRef.current) return;
        isRunningRef.current = true;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        try {
            while (isRunningRef.current) {
                // Reset to initial state
                switchModule("chat");
                await wait(20000); // Stay on Chat

                if (!isRunningRef.current) break;
                switchModule("financial-education");
                await wait(10000); // Show Summary

                if (!isRunningRef.current) break;
                switchModule("behavior-analysis");
                await wait(10000); // Show behavior

                if (!isRunningRef.current) break;
                await wait(4000); // Small pause before loop reset
            }
        } catch (error) {
            // Demo aborted
        } finally {
            isRunningRef.current = false;
            window.dispatchEvent(new CustomEvent('zelify:demo-end'));
        }
    };

    const handleStopDemo = () => {
        isRunningRef.current = false;
        window.dispatchEvent(new CustomEvent('zelify:demo-end'));
    };

    // Event listeners
    useEffect(() => {
        window.addEventListener('zelify:play-demo:alaiza', handlePlayDemo);
        window.addEventListener('zelify:stop-demo:alaiza', handleStopDemo);

        return () => {
            window.removeEventListener('zelify:play-demo:alaiza', handlePlayDemo);
            window.removeEventListener('zelify:stop-demo:alaiza', handleStopDemo);
        };
    }, [isDemoEnabled]);

    // Render Module Selector (Internal Navigation)
    const renderModuleSelector = () => {
        // Only show selector on Chat or Education modules for easy nav? 
        // Behavior Analysis is a full-screen immersive view (lock screen style).
        // Let's keep it visible on Chat and Education.

        return (
            <div className="absolute top-20 left-0 right-0 z-30 px-4 pointer-events-none flex justify-center">
                <div className="flex justify-center gap-1 bg-white/90 backdrop-blur-md rounded-full p-1 shadow-lg pointer-events-auto border border-gray-100">
                    <button
                        onClick={() => switchModule("chat")}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${currentModule === "chat" ? "bg-[#004492] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                        Chat
                    </button>
                    <button
                        onClick={() => switchModule("financial-education")}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${currentModule === "financial-education" ? "bg-[#004492] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                        Educación
                    </button>
                    <button
                        onClick={() => switchModule("behavior-analysis")}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${currentModule === "behavior-analysis" ? "bg-[#004492] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                        Análisis
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white relative">
            {renderModuleSelector()}

            <div className="flex-1 min-h-0 relative">
                <div key={`${currentModule}-${moduleKey}`} className="absolute inset-0 animate-module-fade">
                    {currentModule === "chat" && (
                        <AlaizaChat />
                    )}

                    {currentModule === "financial-education" && (
                        <AlaizaEducation />
                    )}

                    {currentModule === "behavior-analysis" && (
                        <AlaizaBehavior onBack={() => switchModule("chat")} />
                    )}
                </div>
            </div>

            <style>{`
                .animate-module-fade {
                    animation: moduleFadeIn 0.4s ease-out;
                }
                @keyframes moduleFadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
