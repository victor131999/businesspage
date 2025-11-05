// Traducciones específicas para la página de autenticación
const authTranslations = {
    en: {
        badge: "Auth",
        title: "Allows secure user registration, authentication, and authorization in web and mobile applications.",
        titleDesktop: "Allows secure user registration,<br/>authentication, and authorization<br/>in web and mobile applications.",
        description: "Managing login with proprietary or third-party credentials (Google, Apple, Facebook, etc.).",
        descriptionDesktop: "Managing login with proprietary or third-party credentials<br/>(Google, Apple, Facebook, etc.).",
        ctaTalk: "Let's talk",
        ctaDocs: "View API Docs"
    },
    es: {
        badge: "Auth",
        title: "Permite el registro seguro de usuarios, autenticación, y autorización en aplicaciones web y móviles.",
        titleDesktop: "Permite el registro seguro de usuarios,<br/>autenticación, y autorización<br/>en aplicaciones web y móviles.",
        description: "gestiona el inicio de sesión con credenciales propias o de terceros (Google, Apple, Facebook, etc.).",
        descriptionDesktop: "gestiona el inicio de sesión con credenciales propias o de terceros<br/>(Google, Apple, Facebook, etc.).",
        ctaTalk: "Hablemos",
        ctaDocs: "Ver documentación API"
    }
};

function updateTitle(lang) {
    const content = authTranslations[lang] || authTranslations.en;
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            titleElement.textContent = content.title;
        } else {
            titleElement.innerHTML = content.titleDesktop;
        }
    }
}

function updateDescription(lang) {
    const content = authTranslations[lang] || authTranslations.en;
    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            descriptionElement.textContent = content.description;
        } else {
            descriptionElement.innerHTML = content.descriptionDesktop;
        }
    }
}

// Variable para mantener el idioma actual
let currentLang = 'en';

function updateContent(lang) {
    // Actualizar el contenido de la página con las traducciones
    currentLang = lang;
    const content = authTranslations[lang] || authTranslations.en;
    
    const elements = {
        badge: document.querySelector('.badge'),
        title: document.querySelector('.title'),
        description: document.querySelector('.description'),
        ctaTalk: document.querySelector('.cta .btn:first-child'),
        ctaDocs: document.querySelector('.cta .btn:last-child')
    };

    if (elements.badge) elements.badge.textContent = content.badge;
    
    // Usar título y descripción con saltos de línea para desktop/tablet, sin saltos para mobile
    updateTitle(lang);
    updateDescription(lang);
    
    if (elements.ctaTalk) elements.ctaTalk.textContent = content.ctaTalk;
    if (elements.ctaDocs) elements.ctaDocs.textContent = content.ctaDocs;
}

// Función para manejar cambios de tamaño de ventana
function handleResize() {
    updateTitle(currentLang);
    updateDescription(currentLang);
}

// Agregar listener una sola vez cuando se carga el módulo
if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
}

export { updateContent };