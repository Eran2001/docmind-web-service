import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description: string;
  danger?: boolean;
  last?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Title and description on top, the form below. The page decides how sections sit side by side.
export function SettingsSection({
  title,
  description,
  danger,
  last,
  className,
  children,
}: SettingsSectionProps) {
  return (
    <section
      className={cn("flex flex-col gap-5 py-8", !last && "border-b", className)}
    >
      <div>
        <h2
          className={cn(
            "m-0 text-[15px] font-semibold tracking-[-0.01em]",
            danger && "text-destructive",
          )}
        >
          {title}
        </h2>
        <p className="mt-1 mb-0 text-[13px] text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
