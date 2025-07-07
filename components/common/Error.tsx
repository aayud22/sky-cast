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
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-500",
      text: "text-red-800 dark:text-red-200",
      icon: "text-red-500",
      button:
        "text-red-700 border-red-300 hover:bg-red-100 dark:hover:bg-red-900/30",
    },
    destructive: {
      bg: "bg-red-50 dark:bg-red-900/30",
      border: "border-red-600",
      text: "text-red-800 dark:text-red-100",
      icon: "text-red-600",
      button:
        "text-red-700 border-red-300 hover:bg-red-100 dark:hover:bg-red-900/40",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-400",
      text: "text-amber-800 dark:text-amber-200",
      icon: "text-amber-500",
      button:
        "text-amber-700 border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-400",
      text: "text-blue-800 dark:text-blue-200",
      icon: "text-blue-500",
      button:
        "text-blue-700 border-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-4 shadow-sm transition-all",
        currentVariant.bg,
        currentVariant.border,
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle
            className={cn("h-5 w-5", currentVariant.icon)}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className={cn("text-sm font-medium", currentVariant.text)}>
            {message}
          </p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className={cn(
                  "transition-colors duration-200",
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
