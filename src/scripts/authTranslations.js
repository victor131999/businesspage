// Traducciones específicas para la página de autenticación
const authTranslations = {
    en: {
        badge: "Auth",
        title: "Unshakeable Identity Security: Face, Document & Liveness Verification",
        description: "Advanced face and document verification meets liveness detection for total authenticity. Compliant and seamlessly connected to onboarding, AML, and card issuance for secure, trusted user identity.",
        ctaTalk: "Let's talk",
        ctaDocs: "View API Docs"
    },
    es: {
        badge: "Autenticación",
        title: "Seguridad de Identidad Inquebrantable: Verificación Facial, Documental y de Presencia",
        description: "La verificación avanzada de rostros y documentos se combina con la detección de vida para una autenticidad total. Compatible y conectado perfectamente con el onboarding, AML y emisión de tarjetas para una identidad de usuario segura y confiable.",
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