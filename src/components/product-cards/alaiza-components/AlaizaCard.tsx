import { useState, useRef, useEffect } from "react";
import AlaizaChat from "./modules/AlaizaChat";
import AlaizaEducation from "./modules/AlaizaEducation";
import AlaizaBehavior from "./modules/AlaizaBehavior";

/* -- Types -- */
type ModuleType = "chat" | "financial-education" | "behavior-analysis";

/* -- Main Component -- */
export default function AlaizaCard() {
    // Module Navigation
    const [currentModule, setCurrentModule] = useState<ModuleType>("chat");
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

    const handlePlayDemo = async () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        window.dispatchEvent(new CustomEvent('zelify:demo-start'));

        // Reset to initial state
        setCurrentModule("chat");

        try {
            // Chat demo - The module handles its own typing simulation on mount or user interaction?
            // The Astro demo script simulated user interaction.
            // Our modules are self-contained. We can just switch views to show them off for now.
            // Or we could pass a ref to trigger actions.

            // For this refactor, we focus on Visuals. The demo flow simply switches screens.

            await wait(4000); // Stay on Chat

            setCurrentModule("financial-education");
            await wait(5000); // Show Summary

            // Ideally we'd trigger screen types inside Education, but let's just cycle top level modules first.

            setCurrentModule("behavior-analysis");
            await wait(5000); // Show behavior

            // Loop or End?
            setCurrentModule("chat");
            window.dispatchEvent(new CustomEvent('zelify:demo-end'));
        } catch (error) {
            // Demo aborted
        } finally {
            isRunningRef.current = false;
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
    }, []);

    // Render Module Selector (Internal Navigation)
    const renderModuleSelector = () => {
        // Only show selector on Chat or Education modules for easy nav? 
        // Behavior Analysis is a full-screen immersive view (lock screen style).
        // Let's keep it visible on Chat and Education.

        if (currentModule === "behavior-analysis") return null;

        return (
            <div className="absolute top-20 left-0 right-0 z-30 px-4 pointer-events-none flex justify-center">
                <div className="flex justify-center gap-1 bg-white/90 backdrop-blur-md rounded-full p-1 shadow-lg pointer-events-auto border border-gray-100">
                    <button
                        onClick={() => setCurrentModule("chat")}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${currentModule === "chat" ? "bg-[#004492] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                        Chat
                    </button>
                    <button
                        onClick={() => setCurrentModule("financial-education")}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${currentModule === "financial-education" ? "bg-[#004492] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                        Educación
                    </button>
                    <button
                        onClick={() => setCurrentModule("behavior-analysis")}
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
                {/* 
                    We could animate transitions between modules here.
                    For now, simple conditional rendering.
                 */}

                {currentModule === "chat" && (
                    <AlaizaChat />
                )}

                {currentModule === "financial-education" && (
                    <AlaizaEducation />
                )}

                {currentModule === "behavior-analysis" && (
                    <AlaizaBehavior onBack={() => setCurrentModule("chat")} />
                )}
            </div>
        </div>
    );
}
