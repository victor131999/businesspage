type DepositAccountNameKey = "clabe" | "checking";

export const CONNECT_TRANSLATIONS = {
  en: {
    banks: {
      title: "Bank account linking",
      subtitle: "Let’s link your account",
      searchPlaceholder: "Search banks...",
      continue: "Continue",
    },
    credentials: {
      title: "Enter your credentials",
      subtitle: "Please enter your credentials to connect your bank account",
      usernameLabel: "Username",
      usernamePlaceholder: "Enter your username",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      submit: "Sign in",
    },
    loading: {
      complete: {
        linkingTitle: "Linking complete",
        transferTitle: "Transfer complete",
        linkingSubtitle: "The bank account has been linked successfully",
        transferSubtitle: "Funds have been transferred successfully",
      },
      inProgress: {
        linkingTitle: "Connecting your account",
        transferTitle: "Transferring funds",
        subtitle: "Please wait",
      },
    },
    success: {
      title: "Linking successful",
      subtitle: "Your bank account has been linked successfully",
    },
    wallet: {
      title: "Wallet",
      subtitle: "Manage your funds",
      totalBalance: "Total balance",
      depositFunds: "Deposit funds",
      bankConnected: "Bank connected",
    },
    deposit: {
      title: "Deposit funds",
      subtitle: "Select an account and enter an amount",
      selectAccount: "Select account",
      amount: "Amount",
      amountPlaceholder: "0.00",
      slideToConfirm: "Slide to confirm",
      confirming: "Confirming...",
      accountNames: {
        clabe: "CLABE account",
        checking: "Checking account",
      } satisfies Record<DepositAccountNameKey, string>,
    },
  },
  es: {
    banks: {
      title: "Vinculación de cuenta bancaria",
      subtitle: "Vamos a vincular tu cuenta",
      searchPlaceholder: "Buscar bancos...",
      continue: "Continuar",
    },
    credentials: {
      title: "Ingresa tus credenciales",
      subtitle: "Por favor ingrese sus credenciales para conectar su cuenta bancaria",
      usernameLabel: "Usuario",
      usernamePlaceholder: "Ingrese su usuario",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Ingrese su contraseña",
      submit: "Ingresar",
    },
    loading: {
      complete: {
        linkingTitle: "Vinculación Completa",
        transferTitle: "Transferencia Completa",
        linkingSubtitle: "La cuenta bancaria ha sido vinculada exitosamente",
        transferSubtitle: "Los fondos han sido transferidos exitosamente",
      },
      inProgress: {
        linkingTitle: "Conectando tu cuenta",
        transferTitle: "Transfiriendo fondos",
        subtitle: "Espera por favor",
      },
    },
    success: {
      title: "Vinculación Exitosa",
      subtitle: "Tu cuenta bancaria ha sido vinculada exitosamente",
    },
    wallet: {
      title: "Billetera",
      subtitle: "Administra tus fondos",
      totalBalance: "Balance total",
      depositFunds: "Depositar fondos",
      bankConnected: "Banco conectado",
    },
    deposit: {
      title: "Depositar fondos",
      subtitle: "Seleccione una cuenta e ingrese el monto",
      selectAccount: "Seleccionar cuenta",
      amount: "Monto",
      amountPlaceholder: "0.00",
      slideToConfirm: "Desliza para confirmar",
      confirming: "Confirmando...",
      accountNames: {
        clabe: "Cuenta CLABE",
        checking: "Chequera",
      } satisfies Record<DepositAccountNameKey, string>,
    },
  },
} as const;

