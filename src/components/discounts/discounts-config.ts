export type PlanType = "free" | "premium";

export interface Plan {
  id: PlanType;
  price: string;
}

export interface Branding {
  light?: { logo?: string; customColorTheme?: string };
  dark?: { logo?: string; customColorTheme?: string };
}

export interface DiscountsConfigState {
  viewMode: "mobile" | "web";
  plans: Plan[];
  promoCount: number;
  showHourField: boolean;
  branding?: Branding;
}
