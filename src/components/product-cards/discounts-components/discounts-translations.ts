import type { Language } from "@/contexts/language-context";

export type DiscountsTranslations = {
  common: {
    back: string;
    continue: string;
    perMonth: string;
    promo: string;
    letsGo: string;
  };
  plans: {
    free: {
      name: string;
      features: string[];
    };
    premium: {
      name: string;
      features: string[];
    };
  };
  step1: {
    title: string;
    subtitle: string;
  };
  step2: {
    title: string;
    subtitle: string;
    businessNameLabel: string;
    businessNamePlaceholder: string;
    businessIdLabel: string;
    businessIdPlaceholder: string;
    demoBusinessName: string;
  };
  step4: {
    title: string;
    phone: string;
    building: string;
    floor: string;
  };
  step5: {
    title: string;
    subtitle: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
  };
  step6: {
    subtitle: string;
    category: string;
    retry: string;
    confirm: string;
  };
  step7: {
    title: string;
    subtitle: string;
    productName: string;
    price: string;
    customerProfile: string;
  };
  step8: {
    titleLight: string;
    titleBold: string;
    subtitle: string;
    specialDiscount: string;
  };
  step9: {
    title: string;
    titleBold: string;
    subtitle: string;
    startDate: string;
    endDate: string;
    selectDate: string;
    launch: string;
  };
  step10: {
    title: string;
    subtitle: string;
  };
  step11: {
    title: string;
    subtitle: string;
  };
};

export const DISCOUNTS_TRANSLATIONS: Record<Language, DiscountsTranslations> = {
  en: {
    common: {
      back: "Back",
      continue: "Continue",
      perMonth: "/month",
      promo: "PROMO",
      letsGo: "Let's go!",
    },
    plans: {
      free: {
        name: "Free",
        features: [
          "Up to 3 active promotions",
          "Basic discount analytics",
          "Email support",
        ],
      },
      premium: {
        name: "Premium",
        features: [
          "Unlimited promotions",
          "Advanced analytics",
          "Priority support",
          "Custom API",
        ],
      },
    },
    step1: {
      title: "Business",
      subtitle: "Choose a plan",
    },
    step2: {
      title: "Business",
      subtitle: "Complete the fields to continue",
      businessNameLabel: "Business name",
      businessNamePlaceholder: "Enter the name",
      businessIdLabel: "Business ID",
      businessIdPlaceholder: "Enter the ID",
      demoBusinessName: "My Business",
    },
    step4: {
      title: "Address details",
      phone: "Phone",
      building: "Building",
      floor: "Floor",
    },
    step5: {
      title: "Description",
      subtitle: "Describe your business",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Write here...",
    },
    step6: {
      subtitle: "Detected category",
      category: "Restaurant",
      retry: "No, try again",
      confirm: "Yes, continue",
    },
    step7: {
      title: "Create promotion",
      subtitle: "Complete the fields",
      productName: "Product name",
      price: "Price",
      customerProfile: "Customer profile",
    },
    step8: {
      titleLight: "Here",
      titleBold: "we go",
      subtitle: "Select a promotion",
      specialDiscount: "Special discount",
    },
    step9: {
      title: "Configure",
      titleBold: "promo",
      subtitle: "Define dates and schedules",
      startDate: "Start date",
      endDate: "End date",
      selectDate: "Select date",
      launch: "Launch promotion",
    },
    step10: {
      title: "Launching promotion",
      subtitle: "This will take a few seconds",
    },
    step11: {
      title: "Promotion created!",
      subtitle: "Your promotion is active",
    },
  },
  es: {
    common: {
      back: "Atrás",
      continue: "Continuar",
      perMonth: "/mes",
      promo: "PROMO",
      letsGo: "¡Aquí vamos!",
    },
    plans: {
      free: {
        name: "Gratis",
        features: [
          "Hasta 3 promociones activas",
          "Análisis básico de descuentos",
          "Soporte por email",
        ],
      },
      premium: {
        name: "Premium",
        features: [
          "Promociones ilimitadas",
          "Análisis avanzado",
          "Soporte prioritario",
          "API personalizada",
        ],
      },
    },
    step1: {
      title: "Negocio",
      subtitle: "Elige un plan",
    },
    step2: {
      title: "Negocio",
      subtitle: "Completa los campos para continuar",
      businessNameLabel: "Nombre del negocio",
      businessNamePlaceholder: "Ingresa el nombre",
      businessIdLabel: "ID del negocio",
      businessIdPlaceholder: "Ingresa el ID",
      demoBusinessName: "Mi Negocio",
    },
    step4: {
      title: "Detalles de dirección",
      phone: "Teléfono",
      building: "Edificio",
      floor: "Piso",
    },
    step5: {
      title: "Descripción",
      subtitle: "Describe tu negocio",
      descriptionLabel: "Descripción",
      descriptionPlaceholder: "Escribe aquí...",
    },
    step6: {
      subtitle: "Categoría detectada",
      category: "Restaurante",
      retry: "No, intentar de nuevo",
      confirm: "Sí, continuar",
    },
    step7: {
      title: "Crear promoción",
      subtitle: "Completa los campos",
      productName: "Nombre del producto",
      price: "Precio",
      customerProfile: "Perfil del cliente",
    },
    step8: {
      titleLight: "Aquí",
      titleBold: "vamos",
      subtitle: "Selecciona una promoción",
      specialDiscount: "Descuento especial",
    },
    step9: {
      title: "Configura",
      titleBold: "promo",
      subtitle: "Define fechas y horarios",
      startDate: "Fecha de inicio",
      endDate: "Fecha de fin",
      selectDate: "Seleccionar fecha",
      launch: "Lanzar promoción",
    },
    step10: {
      title: "Lanzando promoción",
      subtitle: "Esto tomará unos segundos",
    },
    step11: {
      title: "¡Promoción creada!",
      subtitle: "Tu promoción está activa",
    },
  },
};

