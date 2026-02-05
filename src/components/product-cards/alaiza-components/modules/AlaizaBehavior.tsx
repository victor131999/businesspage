import React, { useState, useEffect, useRef } from "react";

/* -- Types -- */
interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    color: string;
}

/* -- Configuration -- */
const baConfig = {
    cardHeight: 85,
    cardGap: 10,
    stackOffset: 12,
    stackScale: 0.05,
    stackVisibleCount: 3,
};

const sampleNotifications = [
    {
        title: "Unusual spending",
        message: "$250 at restaurants this week, 60% more than your average.",
        color: "#10B981",
    },
    {
        title: "Subscription detected",
        message: "New recurring charge of $14.99 identified for 'Streaming Plus'.",
        color: "#10B981",
    },
    {
        title: "Income received",
        message: "Your salary of $3,200 has been deposited successfully.",
        color: "#3B82F6",
    },
    {
        title: "Goal reached!",
        message: "You've hit 50% of your 'Vacation' savings goal. Keep it up!",
        color: "#8B5CF6",
    },
    {
        title: "Budget alert",
        message: "You've used 85% of your Shopping budget for this month.",
        color: "#F59E0B",
    }
];

export default function AlaizaBehavior({ onBack }: { onBack: () => void }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Helpers
    const formatTime24 = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    // Update time
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-add notifications
    useEffect(() => {
        const addNotification = () => {
            const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
            const hours = new Date().getHours();
            const mins = new Date().getMinutes().toString().padStart(2, "0");
            const nowLabel = `${hours}:${mins}`;

            const newNotif: Notification = {
                id: crypto.randomUUID(),
                title: randomNotif.title,
                message: randomNotif.message,
                timestamp: nowLabel,
                color: randomNotif.color,
            };

            setNotifications((prev) => [newNotif, ...prev].slice(0, 8)); // Limit history
        };

        // Initial Seed
        if (notifications.length === 0) {
            addNotification();
            setTimeout(addNotification, 1000);
            setTimeout(addNotification, 2000);
        }

        notificationIntervalRef.current = setInterval(() => {
            // Keep cycling even if expanded, or verify behavior. 
            // Astro original adds every 4000ms.
            addNotification();
        }, 4000);

        return () => {
            if (notificationIntervalRef.current) {
                clearInterval(notificationIntervalRef.current);
            }
        };
    }, []); // Run once on mount

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (isExpanded) {
            e.stopPropagation();
            setIsExpanded(false);
        }
    };

    const toggleExpand = (e: React.MouseEvent) => {
        if (notifications.length > 1) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }
    };

    const renderNotificationItem = (notif: Notification, index: number) => {
        let translateY = 0;
        let scale = 1;
        let opacity = 1;
        let zIndex = 50 - index;
        let pointerEvents: "auto" | "none" = "auto";

        if (isExpanded) {
            // Expanded List Mode (Fan out upwards)
            const cardFullHeight = baConfig.cardHeight + baConfig.cardGap;
            // 0 is top (most recent)
            translateY = -((notifications.length - 1 - index) * cardFullHeight);
            // Wait, Astro logic was: 
            // "yPos = -((total - 1 - index) * cardFullHeight);"
            // This anchors the TOP card at highest negative position. 
            // Correct.

            // Adjust for scrolling context if needed, but Astro used basic absolute transform stack.
            // Let's stick to absolute for the visual effect.

            zIndex = notifications.length - index;
            // Ensure they are visible
            opacity = 1;
        } else {
            // Stack Mode
            if (index < baConfig.stackVisibleCount) {
                translateY = -(index * baConfig.stackOffset);
                scale = 1 - (index * baConfig.stackScale);
                opacity = 1 - (index * 0.15); // front is 1, behind slightly less
            } else {
                // Hidden behind stack
                translateY = 0;
                scale = 0.8;
                opacity = 0;
                pointerEvents = "none";
            }
        }

        // Dynamic Styles for React
        const style: React.CSSProperties = {
            zIndex,
            opacity,
            transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
            transition: isExpanded
                ? "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
                : "all 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents,
            transformOrigin: 'bottom center'
        };

        return (
            <div key={notif.id} style={style} onClick={toggleExpand} className="px-4 pb-4">
                <div className="relative overflow-hidden rounded-[22px] backdrop-blur-2xl transition-all"
                    style={{
                        background: "rgba(80, 80, 80, 0.25)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                        minHeight: `${baConfig.cardHeight}px`,
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px'
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    {/* Icon Box */}
                    <div className="h-10 w-10 shrink-0 rounded-[12px] flex items-center justify-center relative z-10"
                        style={{
                            background: "linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}>
                        <img src="/images/iconAlaiza.svg" className="h-6 w-6 object-contain" alt="" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5 relative z-10 text-left">
                        <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-[14px] font-semibold text-white truncate pr-2 text-shadow-sm">{notif.title}</h4>
                            <span className="text-[12px] text-white/70 flex-shrink-0 font-medium">{notif.timestamp}</span>
                        </div>
                        <p className="text-[13px] text-white/90 leading-snug line-clamp-2 text-shadow-sm font-light">
                            {notif.message}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-black relative overflow-hidden text-white" onClick={handleBackdropClick}>
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear hover:scale-110"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop')`,
                        filter: 'brightness(0.95) contrast(1.1) saturate(1.05)',
                        transform: 'scale(1.05)' // subtle zoom base
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
            </div>

            {/* Status Bar Replica */}
            <div className="relative z-20 flex items-center justify-between px-6 pt-10 pb-2">
                <div className="text-white text-xs font-semibold">
                    {currentTime.getHours() + ":" + currentTime.getMinutes()}
                </div>
                <div className="absolute left-1/2 top-3 -translate-x-1/2">
                    {/* Notch Placeholder */}
                    {/* <div className="h-7 w-28 rounded-full bg-black flex items-center justify-center">
                        <div className="h-1 w-16 rounded-full bg-gray-900/50"></div>
                    </div> */}
                </div>
                <div className="flex items-center gap-1.5 text-white">
                    <svg className="h-3 w-4" fill="currentColor" viewBox="0 0 20 12"><path d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-2h2v6H7V4zm3-1h2v7h-2V3z"></path></svg>
                    <div className="h-2.5 w-6 rounded-sm border border-white/50 p-[1px]"><div className="h-full w-full rounded-[1px] bg-white"></div></div>
                </div>
            </div>

            {/* Back Button
            <div className="absolute top-12 left-6 z-30">
                <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="text-white/80 text-sm font-medium hover:text-white transition-colors flex items-center gap-1 backdrop-blur-md bg-black/20 px-3 py-1.5 rounded-full">
                    <span>←</span> Back
                </button>
            </div> */}

            {/* Clock */}
            <div className="relative z-10 mt-12 text-center text-white transition-opacity duration-300" style={{ opacity: isExpanded ? 0.3 : 1, filter: isExpanded ? 'blur(4px)' : 'none' }}>
                <div className="text-7xl font-thin drop-shadow-md tracking-tighter">{formatTime24(currentTime)}</div>
                <div className="mt-1 text-lg font-medium drop-shadow-md opacity-90">
                    {currentTime.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Notification Stack Container */}
            {/* Positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-0 pb-8 flex flex-col justify-end min-h-[500px] pointer-events-none">
                <div className="relative w-full pointer-events-none transition-all duration-500"
                    style={{
                        height: '100px', // base anchor height
                        transform: isExpanded ? `translateY(-${(notifications.length * 20)}px)` : 'translateY(0)' // slight push up if simple
                    }}>
                    {/* Inject Cards */}
                    {notifications.map((notif, index) => renderNotificationItem(notif, index))}
                </div>

                {notifications.length === 0 && (
                    <div className="text-white/60 text-sm text-center pb-12 animate-pulse">Waiting for activity...</div>
                )}
            </div>

            {/* Home Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <div className="h-1 w-32 rounded-full bg-white/40 backdrop-blur-md"></div>
            </div>

            <style>{`
                .text-shadow-sm { text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
            `}</style>
        </div>
    );
}
