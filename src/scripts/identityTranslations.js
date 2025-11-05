const identityTranslations = {
    en: {
        sectionLabel: "Identity",
        title: "Unshakeable Identity Security:\nFace, Document & Liveness Verification",
        titleDesktop: "Unshakeable Identity Security:<br/>Face, Document &<br/>Liveness Verification",
        description: "Advanced face and document verification meets liveness detection for total authenticity.\nCompliant and seamlessly connected to onboarding, AML, and card issuance for secure, trusted user identity.",
        descriptionDesktop: "Advanced face and document verification meets liveness detection<br/>for total authenticity. Compliant and seamlessly connected to<br/><span style='white-space: nowrap;'>onboarding, AML, and card issuance for secure, trusted user identity.</span>",
        ctaTalk: "Let's talk",
        ctaDocs: "View API Docs"
    },
    es: {
        sectionLabel: "Identity",
        title: "Seguridad de Identidad Inquebrantable:\nVerificación Facial, Documental y de Presencia",
        titleDesktop: "Seguridad de Identidad Inquebrantable:<br/>Verificación Facial, Documental<br/>y de Presencia",
        description: "La verificación avanzada de rostros y documentos se combina con la detección de vida para una autenticidad total.\nCompatible y perfectamente conectada con onboarding, AML y emisión de tarjetas para una identidad de usuario segura y confiable.",
        descriptionDesktop: "La verificación avanzada de rostros y documentos se combina con la detección de vida<br/>para una autenticidad total.<br/>Compatible y perfectamente conectada con onboarding, AML,<br/>y emisión de tarjetas para una identidad de usuario segura y confiable.",
        ctaTalk: "Hablemos",
        ctaDocs: "Ver documentación API"
    }
};

function updateTitle(lang) {
    const content = identityTranslations[lang] || identityTranslations.en;
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            titleElement.innerHTML = content.title.replace(/\n/g, '<br>');
        } else {
            titleElement.innerHTML = content.titleDesktop;
        }
    }
}

function updateDescription(lang) {
    const content = identityTranslations[lang] || identityTranslations.en;
    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            descriptionElement.innerHTML = content.description.replace(/\n/g, '<br>');
        } else {
            descriptionElement.innerHTML = content.descriptionDesktop;
        }
    }
}

// Variable para mantener el idioma actual
let currentLang = 'en';

function updateContent(lang) {
    currentLang = lang;
    const content = identityTranslations[lang] || identityTranslations.en;
    
    const elements = {
        sectionLabel: document.querySelector('.section-label'),
        title: document.querySelector('.title'),
        description: document.querySelector('.description'),
        ctaTalk: document.querySelector('.cta .btn:first-child'),
        ctaDocs: document.querySelector('.cta .btn:last-child')
    };

    // Actualizar el contenido manteniendo los saltos de línea
    if (elements.sectionLabel) elements.sectionLabel.textContent = content.sectionLabel;
    
    // Usar título y descripción con saltos de línea específicos para desktop/tablet
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