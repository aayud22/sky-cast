import { Button } from "./Button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorProps {
  message: string | React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  variant?: "default" | "destructive" | "warning" | "info";
}

export function Error({
  message,
  onRetry,
  retryLabel = "Try Again",
  className,
  variant = "default",
}: ErrorProps) {
  const variants = {
    default: {
      bg: "bg-red-50/90 dark:bg-red-900/30 backdrop-blur-sm",
      border: "border-red-500/80 dark:border-red-600",
      text: "text-red-800 dark:text-red-100",
      icon: "text-red-500 dark:text-red-400",
      button:
        "text-red-700 dark:text-red-100 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200",
    },
    destructive: {
      bg: "bg-red-50/90 dark:bg-red-900/40 backdrop-blur-sm",
      border: "border-red-600 dark:border-red-700",
      text: "text-red-800 dark:text-red-100",
      icon: "text-red-600 dark:text-red-400",
      button:
        "text-red-700 dark:text-red-100 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/60 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200",
    },
    warning: {
      bg: "bg-amber-50/90 dark:bg-amber-900/30 backdrop-blur-sm",
      border: "border-amber-400 dark:border-amber-600",
      text: "text-amber-800 dark:text-amber-100",
      icon: "text-amber-500 dark:text-amber-400",
      button:
        "text-amber-700 dark:text-amber-100 border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-200",
    },
    info: {
      bg: "bg-blue-50/90 dark:bg-blue-900/30 backdrop-blur-sm",
      border: "border-blue-400 dark:border-blue-600",
      text: "text-blue-800 dark:text-blue-100",
      icon: "text-blue-500 dark:text-blue-400",
      button:
        "text-blue-700 dark:text-blue-100 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200",
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 p-5 shadow-lg transition-all transform hover:shadow-xl",
        "max-w-2xl w-full mx-auto backdrop-blur-sm",
        currentVariant.bg,
        currentVariant.border,
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <AlertCircle
            className={cn("h-6 w-6", currentVariant.icon)}
            aria-hidden="true"
          />
        </div>
        <div className="ml-4 flex-1">
          <p
            className={cn(
              "text-base font-medium leading-6",
              currentVariant.text
            )}
          >
            {message}
          </p>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50",
                  currentVariant.button
                )}
              >
                {retryLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
