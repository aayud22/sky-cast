import { Loader2, Cloud } from "lucide-react";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative">
        <Cloud className="h-24 w-24 text-gray-300 animate-pulse" />
        <Loader2 className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
      </div>
      <p className="text-lg font-medium text-gray-600">{message}</p>
    </div>
  );
}
