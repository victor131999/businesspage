import { translations } from '../i18n/translations.js';

export function initializeLanguageSystem() {
    const languageButtons = document.querySelectorAll(".lang-toggle");
    if (languageButtons.length === 0) return;

    const detectBrowserLanguage = () => {
        const locale = (navigator.languages && navigator.languages[0]) || navigator.language || "";
        return locale.toLowerCase().startsWith("es") ? "ES" : "EN";
    };

    let currentLang = detectBrowserLanguage();

    try {
        const stored = localStorage.getItem("ui-language");
        const source = localStorage.getItem("ui-language-source");
        if (source === "user" && stored) {
            currentLang = stored;
        }
    } catch (error) {
        console.warn("Unable to access localStorage.", error);
        currentLang = detectBrowserLanguage();
    }

    const updateToggleUI = (lang) => {
        languageButtons.forEach((btn) => {
            btn.setAttribute("data-language", lang);
            const thumb = btn.querySelector(".lang-toggle__thumb");
            if (thumb) {
                const label = thumb.querySelector(".lang-label");
                if (label) label.textContent = lang;
            }
        });
    };

    const propagateLanguage = (lang) => {
        window.__uiLanguage = lang;
        document.documentElement.setAttribute("lang", lang.toLowerCase());
        window.dispatchEvent(
            new CustomEvent("ui:languagechange", {
                detail: { language: lang },
            })
        );

        // Aplicar traducciones
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translationLang = lang.toLowerCase();
            if (translations[translationLang] && translations[translationLang][key]) {
                element.innerHTML = translations[translationLang][key];
            }
        });
    };

    const setLanguage = (lang) => {
        const normalized = lang === "ES" ? "ES" : "EN";
        currentLang = normalized;
        updateToggleUI(currentLang);
        try {
            localStorage.setItem("ui-language", currentLang);
            localStorage.setItem("ui-language-source", "user");
        } catch (error) {
            console.warn("Unable to persist language preference.", error);
        }
        propagateLanguage(currentLang);
    };

    languageButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            setLanguage(currentLang === "EN" ? "ES" : "EN");
        });
    });

    // Inicializar con el idioma actual
    updateToggleUI(currentLang);
    propagateLanguage(currentLang);
}