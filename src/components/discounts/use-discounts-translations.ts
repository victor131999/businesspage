export function useDiscountsTranslations() {
  return {
    preview: {
      back: "Atrás",
      continue: "Continuar",
      perMonth: "/mes",
      planSelection: { title: "Seleccionar Plan", subtitle: "Elige un plan" },
      plans: {
        free: {
          title: "Gratuito",
          features: ["Característica 1", "Característica 2"],
        },
        premium: {
          title: "Premium",
          features: ["Característica 1", "Característica 2"],
        },
      },
      basicInfo: {
        title: "Información Básica",
        subtitle: "Ingresa los detalles",
        businessNameLabel: "Nombre del Negocio",
        businessNamePlaceholder: "Nombre",
        businessIdLabel: "RUC/ID",
        businessIdPlaceholder: "ID",
      },
      map: {
        heroAlt: "Mapa",
        businessAddress: "Dirección del Negocio",
      },
      addressDetails: {
        title: "Detalles de Dirección",
        phoneLabel: "Teléfono",
        buildingLabel: "Edificio",
        buildingPlaceholder: "Edificio A",
        floorLabel: "Piso",
        floorPlaceholder: "1",
        referenceLabel: "Referencia",
        referencePlaceholder: "Cerca del parque",
      },
      description: {
        title: "Descripción",
        prompt: "Describe tu negocio",
        label: "Descripción",
        placeholder: "Ingresa la descripción",
      },
      categoryDetection: {
        detected: "Detectada",
        category: "Categoría",
        noTryAgain: "No, intentar de nuevo",
        yesContinue: "Sí, continuar",
      },
      createPromo: {
        title: "Crear Promoción",
        subtitle: "Nueva promoción",
        fields: {
          productName: "Nombre del Producto",
          price: "Precio",
          clientProfile: "Perfil del Cliente",
        },
      },
    },
  };
}
