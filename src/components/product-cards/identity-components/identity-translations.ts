type Country = "ecuador" | "mexico" | "colombia";
type DocumentType = "drivers_license" | "id_card" | "passport";
type LivenessType = "photo" | "video" | "selfie_photo" | "selfie_video";

export const IDENTITY_TRANSLATIONS = {
  en: {
    common: {
      back: "back",
      next: "Next",
    },
    welcome: {
      titleStrong: "Identity",
      titleLight: "verification",
      subtitle: "We’ll verify your identity securely and quickly",
      cards: [
        { title: "Fast & secure", subtitle: "Finish in under 2 minutes", icon: "lock" },
        { title: "Protected data", subtitle: "End-to-end encryption", icon: "shield" },
        { title: "Instant verification", subtitle: "Real-time results", icon: "clock" },
      ],
      startButton: "Start verification",
      terms: {
        prefix: "By starting verification you accept the",
        privacy: "Privacy Policy",
        and: "and",
        terms: "Terms of Service",
      },
    },
    documentSelection: {
      title: "Select your document",
      subtitle: "Choose the document type you want to use for verification",
      descriptions: {
        drivers_license: "Driver’s license",
        id_card: "National ID",
        passport: "Valid passport",
      } satisfies Record<DocumentType, string>,
    },
    documentNames: {
      ecuador: {
        drivers_license: "Driver’s license",
        id_card: "National ID",
        passport: "Passport",
      },
      mexico: {
        drivers_license: "Driver’s license",
        id_card: "INE / IFE",
        passport: "Passport",
      },
      colombia: {
        drivers_license: "Driver’s license",
        id_card: "National ID",
        passport: "Passport",
      },
    } satisfies Record<Country, Record<DocumentType, string>>,
    documentCapture: {
      titlePrefix: "Capture",
      instructionFront: "Align the document within the frame and make sure it’s readable",
      instructionBack: "Flip the document and align the back side within the frame",
      frontCaptured: "Document front",
      overlayTitle: {
        front: "Document front",
        back: "Document back",
      },
      overlayHint: "Make sure the document is well lit and fully visible in the image",
    },
    liveness: {
      title: "Liveness check",
      subtitle: "We’ll verify you’re a real person",
      options: [
        {
          type: "selfie_photo",
          title: "Selfie photo",
          description: "Take a photo of your face",
        },
        {
          type: "selfie_video",
          title: "Selfie video",
          description: "Record a short video of your face",
        },
      ] satisfies Array<{ type: LivenessType; title: string; description: string }>,
      startButton: "Start verification",
      scanningFace: "Scanning your face",
      scanningProgressTitle: "Completing verification",
      scanningProgressLabel: "Verifying identity",
    },
    result: {
      approvedTitle: "Verification Approved",
      rejectedTitle: "Verification Rejected",
      approvedSubtitle: "Your identity has been verified successfully",
      rejectedSubtitle: "We couldn’t verify your identity",
      tryAgain: "Try again",
    },
  },
  es: {
    common: {
      back: "atrás",
      next: "Siguiente",
    },
    welcome: {
      titleStrong: "Verificación",
      titleLight: "de identidad",
      subtitle: "Verificaremos tu identidad de forma segura y rápida",
      cards: [
        { title: "Proceso rápido y seguro", subtitle: "Finaliza en menos de 2 minutos", icon: "lock" },
        { title: "Datos protegidos", subtitle: "Cifrado de extremo a extremo", icon: "shield" },
        { title: "Verificación instantánea", subtitle: "Resultados en tiempo real", icon: "clock" },
      ],
      startButton: "Iniciar verificación",
      terms: {
        prefix: "Al iniciar la verificación aceptas las",
        privacy: "políticas de privacidad",
        and: "y",
        terms: "términos de servicio",
      },
    },
    documentSelection: {
      title: "Selecciona tu documento",
      subtitle: "Elige el tipo de documento que deseas usar para la verificación",
      descriptions: {
        drivers_license: "Licencia de conducir",
        id_card: "Cédula de identidad",
        passport: "Pasaporte vigente",
      } satisfies Record<DocumentType, string>,
    },
    documentNames: {
      ecuador: { drivers_license: "Licencia de conducir", id_card: "Cédula de identidad", passport: "Pasaporte" },
      mexico: { drivers_license: "Licencia", id_card: "INE / IFE", passport: "Pasaporte" },
      colombia: { drivers_license: "Licencia", id_card: "Cédula", passport: "Pasaporte" },
    } satisfies Record<Country, Record<DocumentType, string>>,
    documentCapture: {
      titlePrefix: "Captura",
      instructionFront: "Alinea el documento dentro del marco y asegúrate de que sea legible",
      instructionBack: "Gira el documento y alinea la parte posterior dentro del marco",
      frontCaptured: "Frente del documento",
      overlayTitle: {
        front: "Frente del documento",
        back: "Reverso del documento",
      },
      overlayHint: "Asegúrate de que el documento esté bien iluminado y completo en la imagen",
    },
    liveness: {
      title: "Prueba de vida",
      subtitle: "Validaremos que eres una persona real",
      options: [
        {
          type: "selfie_photo",
          title: "Selfie con foto",
          description: "Toma una foto de tu rostro",
        },
        {
          type: "selfie_video",
          title: "Selfie con video",
          description: "Graba un video corto de tu rostro",
        },
      ] satisfies Array<{ type: LivenessType; title: string; description: string }>,
      startButton: "Iniciar verificación",
      scanningFace: "Escaneando tu rostro",
      scanningProgressTitle: "Completando verificación",
      scanningProgressLabel: "Verificando identidad",
    },
    result: {
      approvedTitle: "Verificación Aprobada",
      rejectedTitle: "Verificación Rechazada",
      approvedSubtitle: "Tu identidad ha sido verificada exitosamente",
      rejectedSubtitle: "No pudimos verificar tu identidad",
      tryAgain: "Intenta de nuevo",
    },
  },
} as const;
