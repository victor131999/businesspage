const identityTranslations = {
    en: {
        sectionLabel: "Identity",
        title: "Unshakeable Identity Security:\nFace, Document & Liveness Verification",
        description: "Advanced face and document verification meets liveness detection for total authenticity.\nCompliant and seamlessly connected to onboarding, AML, and card issuance for secure, trusted user identity.",
        ctaTalk: "Let's talk",
        ctaDocs: "View API Docs"
    },
    es: {
        sectionLabel: "Identity",
        title: "Seguridad de Identidad Inquebrantable:\nVerificación Facial, Documental y de Presencia",
        description: "La verificación avanzada de rostros y documentos se combina con la detección de vida para una autenticidad total.\nCompatible y perfectamente conectada con onboarding, AML y emisión de tarjetas para una identidad de usuario segura y confiable.",
        ctaTalk: "Hablemos",
        ctaDocs: "Ver documentación API"
    }
};

function updateContent(lang) {
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
    if (elements.title) elements.title.innerHTML = content.title.replace(/\n/g, '<br>');
    if (elements.description) elements.description.innerHTML = content.description.replace(/\n/g, '<br>');
    if (elements.ctaTalk) elements.ctaTalk.textContent = content.ctaTalk;
    if (elements.ctaDocs) elements.ctaDocs.textContent = content.ctaDocs;
}

export { updateContent };