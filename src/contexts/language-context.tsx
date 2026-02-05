import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

function normalizeLanguage(input: unknown): Language {
  const value = String(input ?? "").trim().toLowerCase();
  if (value === "en" || value === "english" || value === "us" || value === "en-us")
    return "en";
  if (value === "es" || value === "spanish" || value === "es-es" || value === "es-mx")
    return "es";
  if (String(input ?? "").toUpperCase() === "EN") return "en";
  if (String(input ?? "").toUpperCase() === "ES") return "es";
  return "es";
}

export function LanguageProvider({
  children,
  initialLanguage = "es",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = (() => {
      try {
        return localStorage.getItem("ui-language");
      } catch {
        return null;
      }
    })();

    const bootstrap = normalizeLanguage((window as any).__uiLanguage ?? stored);
    setLanguageState(bootstrap);

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ language?: string }>;
      setLanguageState(normalizeLanguage(customEvent.detail?.language));
    };

    window.addEventListener("ui:languagechange", handleLanguageChange);
    return () => window.removeEventListener("ui:languagechange", handleLanguageChange);
  }, []);

  // Simple mock t function
  const t = (key: string) => key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageState, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
