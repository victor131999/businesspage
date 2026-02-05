/**
 * Design System — Atomic Design
 * Exportaciones centralizadas para uso en páginas.
 *
 * Átomos: Button, Input, Title, Text, IconButton, Divider
 * Moléculas: EmailQuoteForm, CtaGroup, LoginFormCard, Modal, TabList
 * Organismos: WelcomeHero, QuoteModalHubSpot, SectionTwoCol
 *
 * Documentación: /system/design
 * Tokens: import "../components/design-system/tokens.css"
 */

// Los componentes son .astro; desde otros .astro se importan por path.
// Este archivo sirve como referencia de la API del design system.
export const DESIGN_SYSTEM = {
  atoms: ["Button", "Input", "Title", "Text", "IconButton", "Divider"],
  molecules: ["EmailQuoteForm", "CtaGroup", "LoginFormCard", "Modal", "TabList"],
  organisms: ["WelcomeHero", "QuoteModalHubSpot", "SectionTwoCol"],
  tokens: "tokens.css",
  docs: "/system/design",
} as const;
