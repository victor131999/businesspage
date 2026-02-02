import { useEffect } from "react";

export function useCTAButtonAnimations(themeColor?: string) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const styleId = "cta-button-animations";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    const color = themeColor && themeColor.trim().length > 0 ? themeColor : "#004492";

    style.textContent = `
      :root {
        --cta-theme-color: ${color};
      }
    `;

    return () => {
      // keep style in place to avoid flicker across mounts
    };
  }, [themeColor]);
}

