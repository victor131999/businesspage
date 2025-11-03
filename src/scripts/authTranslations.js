// Traducciones específicas para la página de autenticación
const authTranslations = {
    en: {
        badge: "Auth",
        title: "Allows secure user registration, authentication,\n and authorization in web and mobile applications.",
        description: "managing login with proprietary or third-party credentials (Google, Apple, Facebook, etc.).",
        ctaTalk: "Let's talk",
        ctaDocs: "View API Docs"
    },
    es: {
        badge: "Auth",
        title: "Permite el registroseguro de usuarios,\n autenticación, y autorización en \n aplicaciones\nweb y móviles.",
        description: "gestiona el inicio de sesión con credenciales propias o de terceros (Google, Apple, Facebook, etc.).",
        ctaTalk: "Hablemos",
        ctaDocs: "Ver documentación API"
    }
};

function updateContent(lang) {
    // Actualizar el contenido de la página con las traducciones
    const content = authTranslations[lang] || authTranslations.en;
    
    const elements = {
        badge: document.querySelector('.badge'),
        title: document.querySelector('.title'),
        description: document.querySelector('.description'),
        ctaTalk: document.querySelector('.cta .btn:first-child'),
        ctaDocs: document.querySelector('.cta .btn:last-child')
    };

    if (elements.badge) elements.badge.textContent = content.badge;
    if (elements.title) elements.title.textContent = content.title;
    if (elements.description) elements.description.textContent = content.description;
    if (elements.ctaTalk) elements.ctaTalk.textContent = content.ctaTalk;
    if (elements.ctaDocs) elements.ctaDocs.textContent = content.ctaDocs;
}

export { updateContent };