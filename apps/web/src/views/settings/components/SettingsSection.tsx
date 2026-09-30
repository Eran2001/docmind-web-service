import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description: string;
  danger?: boolean;
  last?: boolean;
  children: React.ReactNode;
}

export function SettingsSection({ title, description, danger, last, children }: SettingsSectionProps) {
  return (
    <section className={cn("flex flex-wrap gap-x-10 gap-y-4 py-8", !last && "border-b")}>
      <div className="flex-[1_1_200px]">
        <h2 className={cn("m-0 text-[15px] font-semibold tracking-[-0.01em]", danger && "text-destructive")}>{title}</h2>
        <p className="mt-1 mb-0 text-[13px] text-muted-foreground">{description}</p>
      </div>
      <div className="flex-[2_1_400px]">{children}</div>
    </section>
  );
}
