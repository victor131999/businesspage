import { translations } from '../i18n/translations.js';

let currentLanguage = 'en';

export function initializeTranslations() {
    // Obtener el botón de cambio de idioma
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    
    // Aplicar el idioma inicial
    applyTranslations();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.setAttribute('data-language', currentLanguage.toUpperCase());
        const langLabel = langToggle.querySelector('.lang-label');
        if (langLabel) {
            langLabel.textContent = currentLanguage.toUpperCase();
        }
    }
    applyTranslations();
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}