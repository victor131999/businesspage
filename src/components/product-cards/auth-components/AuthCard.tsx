
import { useState, useEffect } from "react";
import { GoogleIcon, FacebookIcon, AppleIcon } from "./oauth-icons";
import { OTPInput } from "./otp-input";
import { CountrySelector, type Country } from "./country-selector";
import { ProgressIndicator } from "./progress-indicator";
import { SuccessAnimation } from "./success-animation";
import { AUTH_TRANSLATIONS } from "./auth-translations";

// --- Utility Functions ---
function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
    return /^[0-9]{10,15}$/.test(phone.replace(/\s/g, ""));
}

function validateFullName(name: string): boolean {
    return name.trim().length >= 2;
}

function validatePassword(password: string): boolean {
    return password.length >= 8;
}

// Helper para cn
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

export function AuthCard() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerStep, setRegisterStep] = useState(1);
    const [otpStatus, setOtpStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Theme configuration (matches the blue theme from config)
    const themeColor = "#004492";
    const darkThemeColor = "#002f66"; // Darker version
    const almostBlackColor = "#001126"; // Almost black version
    const blackColor = "#000000";

    // Language state (default to Spanish as per user context, could be dynamic)
    const lang = 'es';
    const t = AUTH_TRANSLATIONS[lang];

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        emailOTP: "",
        phoneCountry: "US",
        phoneNumber: "",
        phoneOTP: "",
        password: "",
        showPassword: false,
        idNumber: "",
        birthDate: "",
    });

    // Handlers
    const handleStep1Continue = () => {
        const errors: Record<string, string> = {};
        if (!validateFullName(formData.fullName)) {
            errors.fullName = "El nombre debe tener al menos 2 caracteres";
        }
        if (!validateEmail(formData.email)) {
            errors.email = "Correo electrónico inválido";
        }

        if (Object.keys(errors).length === 0) {
            setRegisterStep(2);
            setValidationErrors({});
        } else {
            setValidationErrors(errors);
        }
    };

    const handleStep2Verify = () => {
        if (formData.emailOTP.length === 6) {
            setOtpStatus('verifying');
            // Simulated verification
            const isValid = formData.emailOTP === '202601';

            if (isValid) {
                setTimeout(() => {
                    setOtpStatus('success');
                    setTimeout(() => {
                        setOtpStatus('idle');
                        setRegisterStep(3);
                    }, 3000);
                }, 1000);
            } else {
                setTimeout(() => {
                    setOtpStatus('error');
                    setTimeout(() => {
                        setOtpStatus('idle');
                        setFormData(prev => ({ ...prev, emailOTP: '' }));
                    }, 2000);
                }, 1000);
            }
        }
    };

    const handleStep3Continue = () => {
        const errors: Record<string, string> = {};
        if (!validatePhone(formData.phoneNumber)) {
            errors.phoneNumber = "Número de teléfono inválido";
        }

        if (Object.keys(errors).length === 0) {
            setRegisterStep(4);
            setValidationErrors({});
        } else {
            setValidationErrors(errors);
        }
    };

    const handleStep4Verify = () => {
        if (formData.phoneOTP.length === 6) {
            setOtpStatus('verifying');
            // Simulated verification
            const isValid = formData.phoneOTP === '202601';

            if (isValid) {
                setTimeout(() => {
                    setOtpStatus('success');
                    setTimeout(() => {
                        setOtpStatus('idle');
                        setRegisterStep(5);
                    }, 3000);
                }, 1000);
            } else {
                setTimeout(() => {
                    setOtpStatus('error');
                    setTimeout(() => {
                        setOtpStatus('idle');
                        setFormData(prev => ({ ...prev, phoneOTP: '' }));
                    }, 2000);
                }, 1000);
            }
        }
    };
    const handleStep5CreateAccount = () => {
        const errors: Record<string, string> = {};
        if (!validatePassword(formData.password)) {
            errors.password = "La contraseña debe tener al menos 8 caracteres";
        }
        if (formData.idNumber.trim().length < 5) {
            errors.idNumber = "Número de documento inválido";
        }
        if (!formData.birthDate) {
            errors.birthDate = "Fecha de nacimiento requerida";
        }

        if (Object.keys(errors).length === 0) {
            console.log("Registry complete", formData);
            // Reset flow for demo purposes
            alert("¡Registro completado! (Demo)");
            setIsRegistering(false);
            setRegisterStep(1);
            setFormData({
                fullName: "",
                email: "",
                emailOTP: "",
                phoneCountry: "US",
                phoneNumber: "",
                phoneOTP: "",
                password: "",
                showPassword: false,
                idNumber: "",
                birthDate: "",
            });
        } else {
            setValidationErrors(errors);
        }
    };

    // Render Functions
    const renderLogin = () => (
        <div className="relative flex h-full flex-col overflow-hidden">
            {/* Logo */}
            <div className="flex items-center justify-center p-1">
                <img
                    src="/images/zelify_logo.png"
                    alt="Logo"
                    className="h-14 w-14 object-contain drop-shadow-sm"
                />
            </div>
            {/* Animated GIF */}
            <div className="relative -mb-12 flex-shrink-0 z-0 flex justify-center">
                <img
                    src="/ANIMACION%201.gif"
                    alt="Connecting Animation"
                    className="h-40 w-40 object-contain opacity-90 mix-blend-multiply"
                />
            </div>

            <div
                className="relative z-10 flex-1 overflow-hidden rounded-2xl p-5 backdrop-blur-sm shadow-sm border border-white/50"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.45)' }}
            >
                <h3 className="mb-1 text-2xl font-bold" style={{ color: themeColor }}>
                    {t.preview.loginTitle}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                    Welcome back
                </p>

                <div className="space-y-3">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium" style={{ color: themeColor }}>
                            {t.preview.emailLabel}
                        </label>
                        <input
                            type="email"
                            placeholder={t.preview.emailPlaceholder}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#004492] focus:ring-1 focus:ring-[#004492]/20"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium" style={{ color: themeColor }}>
                            {t.preview.passwordLabel}
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#004492] focus:ring-1 focus:ring-[#004492]/20"
                        />
                    </div>

                    <button
                        className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{
                            background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                        }}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {t.preview.signInButton}
                            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </button>

                    <div className="pt-2">
                        <div className="relative mb-3 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <span className="relative bg-[#f3f4f6] px-2 text-[10px] uppercase text-gray-400">
                                {t.preview.or} {t.preview.providerAction}
                            </span>
                        </div>
                        <div className="flex justify-center gap-3">
                            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50 active:scale-95">
                                <div className="scale-75"><GoogleIcon /></div>
                            </button>
                            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50 active:scale-95">
                                <div className="scale-75"><FacebookIcon /></div>
                            </button>
                            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50 active:scale-95">
                                <div className="scale-75"><AppleIcon /></div>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs">
                    <button
                        className="font-medium hover:underline"
                        style={{ color: themeColor }}
                        onClick={() => setIsRegistering(true)}
                    >
                        {t.preview.createAccountButton}
                    </button>
                </p>
            </div>
        </div>
    );

    const renderRegisterContent = () => {
        switch (registerStep) {
            case 1:
                return (
                    <div className="space-y-3">
                        <div>
                            <h3 className="mb-1 text-base font-bold" style={{ color: themeColor }}>{t.preview.step1Title}</h3>
                            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">{t.preview.step1Subtitle}</p>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium" style={{ color: themeColor }}>
                                {t.registrationFields.fullName} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-xs outline-none transition focus:ring-1",
                                    validationErrors.fullName ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 bg-white focus:border-[#004492] focus:ring-[#004492]/20"
                                )}
                                placeholder={t.registrationFields.fullName}
                            />
                            {validationErrors.fullName && <p className="mt-0.5 text-[10px] text-red-500">{validationErrors.fullName}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium" style={{ color: themeColor }}>
                                {t.preview.emailLabel} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-xs outline-none transition focus:ring-1",
                                    validationErrors.email ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 bg-white focus:border-[#004492] focus:ring-[#004492]/20"
                                )}
                                placeholder={t.preview.emailPlaceholder}
                            />
                            {validationErrors.email && <p className="mt-0.5 text-[10px] text-red-500">{validationErrors.email}</p>}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col items-center space-y-4 pt-2">
                        <div className="text-center">
                            <h3 className="mb-1 text-base font-bold" style={{ color: themeColor }}>{t.preview.step2Title}</h3>
                            <p className="text-[11px] text-gray-500">
                                {t.preview.step2Subtitle} <span className="font-medium text-gray-700">{formData.email}</span>
                            </p>
                        </div>

                        <OTPInput
                            value={formData.emailOTP}
                            onChange={(val) => setFormData({ ...formData, emailOTP: val })}
                            onComplete={() => { }}
                            status={otpStatus}
                            themeColor={themeColor}
                        />

                        <div className="text-center text-[11px] text-gray-500">
                            <p>{t.preview.didntReceiveCode}</p>
                            <button className="mt-1 font-medium hover:underline" style={{ color: themeColor }}>
                                {t.preview.resendCode}
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 pt-2">
                        <div>
                            <h3 className="mb-1 text-base font-bold" style={{ color: themeColor }}>{t.preview.step3Title}</h3>
                            <p className="mb-4 text-[11px] leading-relaxed text-gray-500">{t.preview.step3Subtitle}</p>
                        </div>

                        <div className="flex gap-2">
                            <CountrySelector
                                value={formData.phoneCountry}
                                onChange={(c) => setFormData({ ...formData, phoneCountry: c.code })}
                                className="w-24 flex-shrink-0"
                            />
                            <div className="flex-1">
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-1 h-10",
                                        validationErrors.phoneNumber ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 bg-white focus:border-[#004492] focus:ring-[#004492]/20"
                                    )}
                                    placeholder={t.preview.phoneNumberPlaceholder}
                                />
                            </div>
                        </div>
                        {validationErrors.phoneNumber && <p className="mt-0.5 text-[10px] text-red-500">{validationErrors.phoneNumber}</p>}
                    </div>
                );
            case 4:
                return (
                    <div className="flex flex-col items-center space-y-4 pt-2">
                        <div className="text-center">
                            <h3 className="mb-1 text-base font-bold" style={{ color: themeColor }}>{t.preview.step4Title}</h3>
                            <p className="text-[11px] text-gray-500">
                                {t.preview.step4Subtitle} <span className="font-medium text-gray-700">...{formData.phoneNumber.slice(-4)}</span>
                            </p>
                        </div>

                        <OTPInput
                            value={formData.phoneOTP}
                            onChange={(val) => setFormData({ ...formData, phoneOTP: val })}
                            onComplete={() => { }}
                            status={otpStatus}
                            themeColor={themeColor}
                        />

                        <div className="text-center text-[11px] text-gray-500">
                            <p>{t.preview.didntReceiveCode}</p>
                            <button className="mt-1 font-medium hover:underline" style={{ color: themeColor }}>
                                {t.preview.resendCode}
                            </button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-3 pt-1">
                        <div>
                            <h3 className="mb-1 text-base font-bold" style={{ color: themeColor }}>{t.preview.step5Title}</h3>
                            <p className="mb-3 text-[11px] text-gray-500">{t.preview.step5Subtitle}</p>
                        </div>

                        {/* Read-only summaries */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                            <div>
                                <span className="block font-medium text-gray-400">Nombre</span>
                                <span className="text-gray-700 truncate block">{formData.fullName}</span>
                            </div>
                            <div>
                                <span className="block font-medium text-gray-400">Teléfono</span>
                                <span className="text-gray-700 truncate block">{formData.phoneNumber}</span>
                            </div>
                            <div className="col-span-2 border-t border-gray-100 pt-1 mt-1">
                                <span className="block font-medium text-gray-400">Email</span>
                                <span className="text-gray-700 truncate block">{formData.email}</span>
                            </div>
                        </div>

                        {/* ID Document */}
                        <div>
                            <label className="mb-1 block text-xs font-medium" style={{ color: themeColor }}>
                                {t.registrationFields.idNumber} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.idNumber}
                                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-xs outline-none transition focus:ring-1",
                                    validationErrors.idNumber ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 bg-white focus:border-[#004492] focus:ring-[#004492]/20"
                                )}
                                placeholder="Cédula / DNI"
                            />
                            {validationErrors.idNumber && <p className="mt-0.5 text-[10px] text-red-500">{validationErrors.idNumber}</p>}
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label className="mb-1 block text-xs font-medium" style={{ color: themeColor }}>
                                {t.registrationFields.birthDate} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-xs outline-none transition focus:ring-1",
                                    validationErrors.birthDate ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 bg-white focus:border-[#004492] focus:ring-[#004492]/20"
                                )}
                            />
                            {validationErrors.birthDate && <p className="mt-0.5 text-[10px] text-red-500">{validationErrors.birthDate}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium" style={{ color: themeColor }}>
                                {t.preview.passwordLabel} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={formData.showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-xs outline-none transition focus:ring-1 pr-10",
                                        validationErrors.password ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 bg-white focus:border-[#004492] focus:ring-[#004492]/20"
                                    )}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-500 hover:text-gray-700"
                                >
                                    {formData.showPassword ? t.preview.hidePassword : t.preview.showPassword}
                                </button>
                            </div>
                            {validationErrors.password && <p className="mt-0.5 text-[10px] text-red-500">{validationErrors.password}</p>}
                        </div>

                        <p className="text-[10px] text-gray-400">
                            {t.preview.termsAndPrivacy}
                        </p>
                    </div>
                );
            default:
                return null;
        }
    }

    const renderRegister = () => (
        <div className="relative flex h-full flex-col overflow-hidden">
            {/* Header Elements (Absolute) */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 pointer-events-none">
                {/* Back Button (Pointer events re-enabled) */}
                <button
                    onClick={() => {
                        if (registerStep === 1) setIsRegistering(false);
                        else setRegisterStep(prev => prev - 1);
                    }}
                    className="pointer-events-auto flex items-center gap-1 text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Logo */}
                <div className="absolute left-1/2 top-4 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-1">
                    <img
                        src="/images/zelify_logo.png"
                        alt="Logo"
                        className="h-14 w-14 object-contain drop-shadow-sm"
                    />
                </div>

                {/* Spacer for symmetry if needed, or just empty */}
                <div className="w-8"></div>
            </div>

            {/* Animated GIF */}
            <div className="relative -mb-12 flex-shrink-0 z-0 flex justify-center mt-4">
                <img
                    src="/ANIMACION%201.gif"
                    alt="Connecting Animation"
                    className="h-40 w-40 object-contain opacity-90 mix-blend-multiply"
                />
            </div>

            {/* Glass Card */}
            <div
                className="relative z-10 flex-1 overflow-hidden rounded-2xl p-5 backdrop-blur-sm shadow-sm border border-white/50"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.45)' }}
            >
                <div className="flex h-full flex-col">
                    {/* Progress Indicator */}
                    <div className="mb-2 flex flex-col items-center justify-center gap-1">
                        <ProgressIndicator
                            current={registerStep}
                            total={5}
                            themeColor={themeColor}
                        />
                        <p className="text-[9px] text-gray-400 font-medium tracking-wide">
                            {t.preview.progressStep.replace('{current}', registerStep.toString()).replace('{total}', '5')}
                        </p>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pt-1">
                        {renderRegisterContent()}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-3 pt-2">
                        {registerStep === 1 && (
                            <button
                                onClick={handleStep1Continue}
                                className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{
                                    background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {t.preview.continueButton}
                                </span>
                            </button>
                        )}
                        {registerStep === 2 && (
                            <button
                                onClick={handleStep2Verify}
                                disabled={otpStatus !== 'idle'}
                                className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                    background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {otpStatus === 'verifying' ? 'Verifying...' : t.preview.verifyButton}
                                </span>
                            </button>
                        )}
                        {registerStep === 3 && (
                            <button
                                onClick={handleStep3Continue}
                                className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{
                                    background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {t.preview.continueButton}
                                </span>
                            </button>
                        )}
                        {registerStep === 4 && (
                            <button
                                onClick={handleStep4Verify}
                                disabled={otpStatus !== 'idle'}
                                className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                    background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {otpStatus === 'verifying' ? 'Verifying...' : t.preview.verifyButton}
                                </span>
                            </button>
                        )}
                        {registerStep === 5 && (
                            <button
                                onClick={handleStep5CreateAccount}
                                className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{
                                    background: `linear-gradient(to right, ${themeColor} 0%, ${darkThemeColor} 40%, ${almostBlackColor} 70%, ${blackColor} 100%)`,
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {t.preview.createAccountButton}
                                </span>
                            </button>
                        )}

                        <div className="mt-3 text-center">
                            <button
                                onClick={() => setIsRegistering(false)}
                                className="text-[10px] text-gray-500 hover:text-[#004492] hover:underline"
                            >
                                {t.preview.alreadyHaveAccount} <span className="font-semibold">{t.preview.signInLink}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full font-sans text-[#00223e]">
            {isRegistering ? renderRegister() : renderLogin()}
        </div>
    );
}
