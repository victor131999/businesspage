import React, { createContext, useContext, useMemo, useState } from "react";

export type TourStep = {
  id: string;
  title?: string;
  description?: string;
};

type TourContextValue = {
  isTourActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (steps?: TourStep[]) => void;
  endTour: () => void;
  goToStep: (index: number) => void;
  next: () => void;
  prev: () => void;
};

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({
  children,
  initialSteps = [],
}: {
  children: React.ReactNode;
  initialSteps?: TourStep[];
}) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>(initialSteps);

  const value = useMemo<TourContextValue>(() => {
    const clampedGoTo = (index: number) => {
      const max = Math.max(steps.length - 1, 0);
      setCurrentStep(Math.min(Math.max(index, 0), max));
    };

    return {
      isTourActive,
      currentStep,
      steps,
      startTour: (nextSteps) => {
        if (nextSteps) setSteps(nextSteps);
        setCurrentStep(0);
        setIsTourActive(true);
      },
      endTour: () => setIsTourActive(false),
      goToStep: clampedGoTo,
      next: () => clampedGoTo(currentStep + 1),
      prev: () => clampedGoTo(currentStep - 1),
    };
  }, [currentStep, isTourActive, steps]);

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (ctx) return ctx;
  return {
    isTourActive: false,
    currentStep: 0,
    steps: [],
    startTour: () => {},
    endTour: () => {},
    goToStep: () => {},
    next: () => {},
    prev: () => {},
  } satisfies TourContextValue;
}

