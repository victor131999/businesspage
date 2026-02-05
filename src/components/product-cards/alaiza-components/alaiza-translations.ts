import type { Language } from "@/contexts/language-context";

export type AlaizaTranslations = {
  card: {
    selector: {
      chat: string;
      education: string;
      analysis: string;
    };
  };
  chat: {
    back: string;
    assistantRole: string;
    quickPrompts: [string, string, string];
    placeholders: {
      default: string;
      transferred: string;
    };
    initialBotMessage: string;
    transferSystemMessage: string;
    responses: {
      greeting: string;
      capabilities: string;
      fundsWhere: string;
      balance: string;
      transferHow: string;
      pay: string;
      cards: string;
      security: string;
      history: string;
      help: string;
      bye: string;
      fallback: string;
    };
  };
  behavior: {
    dateLocale: string;
    notifications: Array<{
      title: string;
      message: string;
      color: string;
    }>;
  };
  education: {
    pills: {
      streak: string;
      graph: string;
      rewards: string;
      learn: string;
    };
    scoreSystem: string;
    back: string;
    streak: {
      daysSuffix: string;
      startedLabel: string;
      thisWeek: string;
      daysLeft: string; // expects {n}
      toUnlockReward: string;
      daysShort: [string, string, string, string, string, string, string];
      streakStartDate: string;
    };
    graph: {
      today: string;
      totalSpent: string;
      deltaLabel: string;
      stats: {
        increasing: string;
        spending: string;
        savings: string;
      };
    };
    learn: {
      title: string;
    };
    tips: Array<{
      id: string;
      title: string;
      image: string;
    }>;
    pyramidItems: Array<{
      id: number;
      title: string;
      subtitle: string;
      description: string;
      isBrainIcon?: boolean;
    }>;
    rewards: string[];
    weeklySummary: string;
  };
};

export const ALAIZA_TRANSLATIONS: Record<Language, AlaizaTranslations> = {
  en: {
    card: {
      selector: {
        chat: "Chat",
        education: "Education",
        analysis: "Analysis",
      },
    },
    chat: {
      back: "Back",
      assistantRole: "AI Financial Assistant",
      quickPrompts: [
        "How can you help me?",
        "How do I make a transfer?",
        "Where can I check my funds?",
      ],
      placeholders: {
        default: "Write your message...",
        transferred: "Your conversation has been transferred...",
      },
      initialBotMessage:
        "Hi! I'm Alaiza, your smart financial assistant. How can I help you today?",
      transferSystemMessage:
        "Your conversation has been transferred to a human agent. You'll be assisted shortly.",
      responses: {
        greeting:
          "Hi! Great to meet you. How can I help with your finances today?",
        capabilities:
          "I can help with balances, transfers, payments, cards, activity, and security. What do you want to do now?",
        fundsWhere:
          "You can check your funds in the 'Accounts' or 'Balance' section. Want me to show recent activity too?",
        balance:
          "Your current balance is $1,250.00 MXN. Would you like to see recent transactions?",
        transferHow:
          "To make a transfer, go to 'Transfers', choose a recipient, enter an amount, and confirm. Want a step-by-step guide?",
        pay: "You can make payments from the 'Payments' section. What do you want to pay today?",
        cards:
          "From 'Cards' you can view details, freeze/unfreeze, and manage limits. What do you need?",
        security:
          "For security, you can enable biometrics, set limits, and review sign-in activity. Want me to help you set it up?",
        history:
          "Your activity is in 'History'. Do you want to filter by date or transaction type?",
        help: "I'm here to help. What do you need?",
        bye: "You're welcome! I'm here whenever you need me. Have a great day!",
        fallback:
          "Got it. Could you be a bit more specific? I can help with balances, transfers, payments, cards, and more.",
      },
    },
    behavior: {
      dateLocale: "en-US",
      notifications: [
        {
          title: "Unusual spending",
          message: "$250 at restaurants this week, 60% more than your average.",
          color: "#10B981",
        },
        {
          title: "Subscription detected",
          message:
            "New recurring charge of $14.99 identified for 'Streaming Plus'.",
          color: "#10B981",
        },
        {
          title: "Income received",
          message: "Your salary of $3,200 has been deposited successfully.",
          color: "#3B82F6",
        },
        {
          title: "Goal reached!",
          message:
            "You've hit 50% of your 'Vacation' savings goal. Keep it up!",
          color: "#8B5CF6",
        },
        {
          title: "Budget alert",
          message: "You've used 85% of your Shopping budget for this month.",
          color: "#F59E0B",
        },
      ],
    },
    education: {
      pills: {
        streak: "Streak",
        graph: "Graph",
        rewards: "Rewards",
        learn: "Learn",
      },
      scoreSystem: "Score System",
      back: "back",
      streak: {
        daysSuffix: "days streak",
        startedLabel: "Streak started:",
        thisWeek: "This week",
        daysLeft: "{n} days left",
        toUnlockReward: "To unlock reward",
        daysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        streakStartDate: "Jan 02, 2026",
      },
      graph: {
        today: "Today",
        totalSpent: "Total spent",
        deltaLabel: "+12% vs last week",
        stats: {
          increasing: "Increasing",
          spending: "Spending",
          savings: "Savings",
        },
      },
      learn: {
        title: "Learn center",
      },
      tips: [
        {
          id: "tip-1",
          title: "How to reduce non-essential spending",
          image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
        {
          id: "tip-2",
          title: "How to increase your income",
          image:
            "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400",
        },
      ],
      pyramidItems: [
        {
          id: 0,
          title: "Stability",
          subtitle: "Intelligence",
          description:
            "Turning your spending data into clear insights, enabling smarter decisions and better outcomes.",
        },
        {
          id: 1,
          title: "Intelligence",
          subtitle: "Intelligence",
          description:
            "Turning your spending data into clear insights, enabling smarter decisions and better outcomes.",
          isBrainIcon: true,
        },
        {
          id: 2,
          title: "Discipline",
          subtitle: "Discipline",
          description:
            "Assesses your consistency in managing finances and following through with your financial goals.",
        },
      ],
      rewards: [
        "Only & Sons 20% off",
        "Juan Valdez 2 in coffee",
        "Multicines Free Combo",
        "BK",
      ],
      weeklySummary:
        "Your spending is increasing this week, which is preventing you from growing your savings. The categories where you're overspending are food and entertainment.",
    },
  },
  es: {
    card: {
      selector: {
        chat: "Chat",
        education: "Educación",
        analysis: "Análisis",
      },
    },
    chat: {
      back: "Atrás",
      assistantRole: "Asistente financiero con IA",
      quickPrompts: [
        "¿Cómo puedes ayudarme?",
        "¿Cómo se hace una transferencia?",
        "¿Dónde reviso mis fondos?",
      ],
      placeholders: {
        default: "Escribe tu mensaje...",
        transferred: "Tu conversación ha sido transferida...",
      },
      initialBotMessage:
        "¡Hola! Soy Alaiza, tu asistente financiero inteligente. ¿En qué puedo ayudarte hoy?",
      transferSystemMessage:
        "Tu conversación ha sido transferida a un agente humano. Pronto te atenderá.",
      responses: {
        greeting:
          "¡Hola! Me alegra saludarte. ¿Cómo puedo ayudarte con tus finanzas hoy?",
        capabilities:
          "Puedo ayudarte con saldos, transferencias, pagos, tarjetas, movimientos y seguridad. ¿Qué necesitas hacer ahora?",
        fundsWhere:
          "Puedes revisar tus fondos en la sección 'Cuentas' o 'Saldo'. ¿Quieres que te muestre los movimientos también?",
        balance:
          "Tu saldo actual es de $1,250.00 MXN. ¿Te gustaría ver tus movimientos recientes?",
        transferHow:
          "Para hacer una transferencia ve a 'Transferencias', elige destinatario, monto y confirma. ¿Quieres que te guíe paso a paso?",
        pay: "Puedes realizar pagos desde la sección 'Pagos'. ¿Qué deseas pagar hoy?",
        cards:
          "En 'Tarjetas' puedes ver detalles, congelar/descongelar y gestionar límites. ¿Qué necesitas?",
        security:
          "En seguridad puedes activar biometría, definir límites y revisar actividad de inicio de sesión. ¿Quieres que te ayude a configurarlo?",
        history:
          "Tus movimientos están en 'Historial'. ¿Quieres filtrar por fecha o tipo de transacción?",
        help: "Estoy aquí para ayudarte. ¿Qué necesitas?",
        bye: "¡De nada! Estoy aquí cuando me necesites. ¡Que tengas un excelente día!",
        fallback:
          "Entiendo tu consulta. ¿Podrías ser más específico? Puedo ayudarte con saldos, transferencias, pagos, tarjetas y más.",
      },
    },
    behavior: {
      dateLocale: "es-ES",
      notifications: [
        {
          title: "Gasto inusual",
          message:
            "$250 en restaurantes esta semana, 60% más que tu promedio.",
          color: "#10B981",
        },
        {
          title: "Suscripción detectada",
          message:
            "Nuevo cargo recurrente de $14.99 identificado para 'Streaming Plus'.",
          color: "#10B981",
        },
        {
          title: "Ingreso recibido",
          message: "Tu salario de $3,200 se depositó exitosamente.",
          color: "#3B82F6",
        },
        {
          title: "¡Meta alcanzada!",
          message:
            "Ya lograste el 50% de tu meta de ahorro 'Vacaciones'. ¡Sigue así!",
          color: "#8B5CF6",
        },
        {
          title: "Alerta de presupuesto",
          message:
            "Has usado el 85% de tu presupuesto de compras de este mes.",
          color: "#F59E0B",
        },
      ],
    },
    education: {
      pills: {
        streak: "Racha",
        graph: "Gráfico",
        rewards: "Recompensas",
        learn: "Aprender",
      },
      scoreSystem: "Sistema de puntaje",
      back: "volver",
      streak: {
        daysSuffix: "días de racha",
        startedLabel: "Racha iniciada:",
        thisWeek: "Esta semana",
        daysLeft: "{n} días restantes",
        toUnlockReward: "Para desbloquear recompensa",
        daysShort: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        streakStartDate: "02 Ene, 2026",
      },
      graph: {
        today: "Hoy",
        totalSpent: "Total gastado",
        deltaLabel: "+12% vs semana pasada",
        stats: {
          increasing: "Aumentando",
          spending: "Gasto",
          savings: "Ahorro",
        },
      },
      learn: {
        title: "Centro de aprendizaje",
      },
      tips: [
        {
          id: "tip-1",
          title: "Cómo controlar el gasto excesivo en artículos no básicos",
          image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
        {
          id: "tip-2",
          title: "Cómo aumentar tus ingresos",
          image:
            "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400",
        },
      ],
      pyramidItems: [
        {
          id: 0,
          title: "Estabilidad",
          subtitle: "Inteligencia",
          description:
            "Transforma tus datos de gasto en insights claros para tomar mejores decisiones.",
        },
        {
          id: 1,
          title: "Inteligencia",
          subtitle: "Inteligencia",
          description:
            "Transforma tus datos de gasto en insights claros para tomar mejores decisiones.",
          isBrainIcon: true,
        },
        {
          id: 2,
          title: "Disciplina",
          subtitle: "Disciplina",
          description:
            "Evalúa tu consistencia al administrar tus finanzas y cumplir tus metas.",
        },
      ],
      rewards: [
        "Only & Sons 20% off",
        "Juan Valdez 2 in coffee",
        "Multicines Free Combo",
        "BK",
      ],
      weeklySummary:
        "Tu gasto está aumentando esta semana, lo que no te permite aumentar tus ahorros. Las categorías en las que estás gastando de más son comida y entretenimiento.",
    },
  },
};
