import { CircleAlert } from "lucide-react";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span
      role="alert"
      className="flex items-center gap-1.5 pl-3.5 text-xs text-destructive"
    >
      <CircleAlert className="size-[13px]" />
      {message}
    </span>
  );
}
