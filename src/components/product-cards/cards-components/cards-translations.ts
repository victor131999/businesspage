type ActionId = "number" | "wallet" | "freeze" | "security" | "more" | "lock";

export const CARDS_TRANSLATIONS = {
  en: {
    actions: {
      number: "Number",
      wallet: "Wallet",
      freeze: "Freeze",
      security: "Security",
      more: "More",
      lock: "Lock",
    } satisfies Record<ActionId, string>,
    headers: {
      number: "Card details",
      wallet: "Daily spending details",
      freeze: "Freeze status",
      security: "Security settings",
      more: "More options",
      lock: "Lock card",
    } satisfies Record<ActionId, string>,
    number: {
      cardNumber: "Card number",
      expiryDate: "Expiry date",
      cvv: "CVV",
      cvvNote: "This CVV updates every 30 seconds",
    },
    wallet: {
      spentToday: "Spent today",
      dailyLimit: "Daily limit",
      available: "Available",
    },
    freeze: {
      status: "Status",
      active: "Active",
      lastFreeze: "Last freeze",
      never: "Never",
      canFreeze: "Can freeze",
      yes: "Yes",
    },
    security: {
      twoFa: "2FA verification",
      enabledSingle: "Enabled",
      notifications: "Notifications",
      enabledPlural: "Enabled",
      lastAccess: "Last access",
      twoHoursAgo: "2 hours ago",
    },
    more: {
      settings: "Settings",
      available: "Available",
      history: "History",
      viewAll: "View all",
      support: "Support",
      contact: "Contact",
    },
    lock: {
      currentStatus: "Current status",
      unlocked: "Unlocked",
      description:
        "When you lock your card, all transactions will be disabled until you unlock it again.",
    },
    cardInfo: {
      cardType: "Card type",
      virtualCredit: "Virtual credit",
      account: "Account",
      credit: "Credit",
    },
  },
  es: {
    actions: {
      number: "Número",
      wallet: "Billetera",
      freeze: "Congelar",
      security: "Seguridad",
      more: "Más",
      lock: "Bloquear",
    } satisfies Record<ActionId, string>,
    headers: {
      number: "Detalle de tarjeta",
      wallet: "Detalle de consumo diario",
      freeze: "Estado de congelación",
      security: "Configuración de seguridad",
      more: "Más opciones",
      lock: "Bloquear tarjeta",
    } satisfies Record<ActionId, string>,
    number: {
      cardNumber: "Número de tarjeta",
      expiryDate: "Fecha de expiración",
      cvv: "CVV",
      cvvNote: "Este CVV se actualiza cada 30 segundos",
    },
    wallet: {
      spentToday: "Gastado hoy",
      dailyLimit: "Límite diario",
      available: "Disponible",
    },
    freeze: {
      status: "Estado",
      active: "Activa",
      lastFreeze: "Última congelación",
      never: "Nunca",
      canFreeze: "Puede congelar",
      yes: "Sí",
    },
    security: {
      twoFa: "Verificación 2FA",
      enabledSingle: "Activada",
      notifications: "Notificaciones",
      enabledPlural: "Activadas",
      lastAccess: "Último acceso",
      twoHoursAgo: "Hace 2 horas",
    },
    more: {
      settings: "Configuración",
      available: "Disponible",
      history: "Historial",
      viewAll: "Ver todo",
      support: "Soporte",
      contact: "Contactar",
    },
    lock: {
      currentStatus: "Estado actual",
      unlocked: "Desbloqueada",
      description:
        "Al bloquear tu tarjeta, se desactivarán todas las transacciones hasta que la desbloquees nuevamente.",
    },
    cardInfo: {
      cardType: "Tipo de tarjeta",
      virtualCredit: "Crédito virtual",
      account: "Cuenta",
      credit: "Crédito",
    },
  },
} as const;

