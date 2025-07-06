import { Button } from "./Button";
import { AlertCircle } from "lucide-react";

interface ErrorProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function Error({
  message,
  onRetry,
  retryLabel = "Try Again",
}: ErrorProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <div>
          <p className="text-sm text-red-700">{message}</p>
          {onRetry && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-red-700 border-red-300 hover:bg-red-50"
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
