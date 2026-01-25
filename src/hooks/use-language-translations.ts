import { useLanguage } from "@/contexts/language-context";

export function useLanguageTranslations<T>(translations: Record<string, T>) {
  const { language } = useLanguage();
  return translations[language] || translations["en"];
}
