import { translations } from '../i18n/translations.js';

export function initializeLanguageSystem() {
    const languageButtons = document.querySelectorAll(".lang-toggle");
    if (languageButtons.length === 0) return;

    let currentLang = "EN";

    try {
        const stored = localStorage.getItem("ui-language");
        if (stored) currentLang = stored;
    } catch (error) {
        console.warn("Unable to access localStorage.", error);
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
                element.textContent = translations[translationLang][key];
            }
        });
    };

    const setLanguage = (lang) => {
        const normalized = lang === "ES" ? "ES" : "EN";
        currentLang = normalized;
        updateToggleUI(currentLang);
        try {
            localStorage.setItem("ui-language", currentLang);
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