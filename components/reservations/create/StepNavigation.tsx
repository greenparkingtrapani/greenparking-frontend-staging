import { Check } from "lucide-react";

interface StepNavigationProps {
  steps: { number: number; title: string; icon: React.ReactNode }[];
  currentStep: number;
  t: (key: string) => string;
}

export default function StepNavigation({ steps, currentStep, t }: StepNavigationProps) {
  return (
    <>
      <div className="mt-8 hidden md:flex justify-between">
        {steps.map((step, idx) => (
          <div
            key={step.number}
            className={`flex flex-col items-center ${
              currentStep === idx + 1
                ? "text-primary"
                : currentStep > idx + 1
                ? "text-muted-foreground"
                : "text-muted-foreground/50"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 ${
                currentStep === idx + 1
                  ? "border-primary bg-primary/10"
                  : currentStep > idx + 1
                  ? "border-muted-foreground bg-muted"
                  : "border-muted-foreground/50"
              }`}
            >
              {currentStep > idx + 1 ? (
                <Check className="h-5 w-5" />
              ) : currentStep === idx + 1 && step.number === steps.length ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-lg font-bold">{step.number}</span>
              )}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex md:hidden items-center justify-center">
        <span className="text-sm font-medium">
          {t("step")} {currentStep} {t("of")} {steps.length}: {steps[currentStep - 1].title}
        </span>
      </div>
    </>
  );
}
