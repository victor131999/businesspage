// Traducciones para home.astro
export const homeTranslations = {
  en: {
    // Welcome Section
    "home.welcome.title.line1": "Build the bank of <br/> the future, in one integration.",
    "home.welcome.title.line2": "Powered by AI.",
    "home.welcome.subtitle": "We digitize services for financial institutions,<br />building neobank stacks with a single line of code",
    "home.welcome.email.placeholder": "Enter your email",
    "home.welcome.email.aria": "Enter your email",
    "home.welcome.quote": "Quote",
    "home.welcome.demo": "Demo",
    "home.welcome.quote.aria": "Request quote",

    // Bench Section
    "home.bench.title": "Pay only what you use",
    "home.bench.subtitle": "and scale without friction with the lowest prices in the market.",
    "home.bench.button": "Bench 1",

    // Tokens Section
    "home.tokens.title": "Tokens",
    "home.tokens.description": "Zelify integrates into a single digital platform: authentication and identity validation, AML compliance, account digitization, card issuance and processing, local and international transfers, multiple payments, discount and coupon programs.",
    "home.tokens.demo": "Demo Tour",

    // Action Products Section
    "home.action.products.title": "Our products in action",
    "home.action.products.auth": "Auth",
    "home.action.products.identity": "Identity",
    "home.action.products.aml": "AML",

    // AI Section
    "home.ai.title.line1": "Build the bank of the future,",
    "home.ai.title.line2": "powered by AI.",
    "home.ai.quote": "Quote",

    // Navbar
    "nav.producto": "Products",
    "nav.nosotros": "About us",
    "nav.desarrollo": "Development",
    "nav.otros": "Others",
  },
  es: {
    // Welcome Section
    "home.welcome.title.line1": "Construye la banca del <br/> futuro, en una integración.",
    "home.welcome.title.line2": "Potenciada por IA.",
    "home.welcome.subtitle": "Digitalizamos servicios a instituciones financieras,<br />construyendo stacks neobancarios con una sola línea de código.",
    "home.welcome.email.placeholder": "Ingresa tu correo",
    "home.welcome.email.aria": "Ingresa tu correo",
    "home.welcome.quote": "Hablemos",
    "home.welcome.demo": "Demo",
    "home.welcome.quote.aria": "Solicitar cotización",

    // Bench Section
    "home.bench.title": "Paga solo lo que usas",
    "home.bench.subtitle": "y escala sin fricción con los precios más bajos del mercado.",
    "home.bench.button": "Bench 1",

    // Tokens Section
    "home.tokens.title": "Tokens",
    "home.tokens.description": "Zelify integra en una sola plataforma digital: autenticación y validación de identidad, cumplimiento AML, digitalización de cuentas, emisión y procesamiento de tarjetas, transferencias locales e internacionales, pagos múltiples, programas de descuentos y cupones.",
    "home.tokens.demo": "Demo Tour",

    // Action Products Section
    "home.action.products.title": "Nuestros productos en acción",
    "home.action.products.auth": "Auth",
    "home.action.products.identity": "Identity",
    "home.action.products.aml": "AML",

    // AI Section
    "home.ai.title.line1": "Construye la banca del futuro,",
    "home.ai.title.line2": "potenciada por IA.",
    "home.ai.quote": "Hablemos",
  }
};

// Función para aplicar traducciones
export function applyHomeTranslations(lang = "es") {
  const langKey = lang.toLowerCase();
  const translations = homeTranslations[langKey] || homeTranslations.es;

  // Actualizar elementos con data-i18n
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (!key || !translations[key]) {
      return;
    }

    // Para títulos con múltiples líneas (welcome-title)
    if (element.classList.contains('welcome-title')) {
      const line1Key = 'home.welcome.title.line1';
      const line2Key = 'home.welcome.title.line2';
      if (translations[line1Key] && translations[line2Key]) {
        const line2Span = element.querySelector('.welcome-title-line');
        if (line2Span) {
          // Limpiar y reconstruir el contenido
          element.innerHTML = `${translations[line1Key]} <span class="welcome-title-line" data-i18n="${line2Key}">${translations[line2Key]}</span>`;
        } else {
          element.innerHTML = `${translations[line1Key]} <span class="welcome-title-line" data-i18n="${line2Key}">${translations[line2Key]}</span>`;
        }
      }
    }
    // Para títulos con múltiples líneas (ai-section-title)
    else if (element.classList.contains('ai-section-title')) {
      const line1Key = 'home.ai.title.line1';
      const line2Key = 'home.ai.title.line2';
      if (translations[line1Key] && translations[line2Key]) {
        element.innerHTML = `${translations[line1Key]}<br />${translations[line2Key]}`;
      }
    }
    // Para contenido normal
    else {
      element.innerHTML = translations[key];
    }
  });

  // Actualizar placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translations[key]) {
      element.setAttribute('placeholder', translations[key]);
    }
  });

  // Actualizar aria-labels
  const ariaElements = document.querySelectorAll('[data-i18n-aria], [data-i18n-aria-label]');
  ariaElements.forEach(element => {
    const key = element.getAttribute('data-i18n-aria') || element.getAttribute('data-i18n-aria-label');
    if (translations[key]) {
      element.setAttribute('aria-label', translations[key]);
    }
  });

  // Actualizar links del navbar si tienen data-i18n
  const navLinks = document.querySelectorAll('.simple-navbar__link[data-i18n]');
  navLinks.forEach(link => {
    const key = link.getAttribute('data-i18n');
    if (translations[key]) {
      link.textContent = translations[key];
    }
  });
}
