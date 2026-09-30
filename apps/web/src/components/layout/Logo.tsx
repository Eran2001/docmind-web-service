import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const MARK = {
  sm: "size-[18px] rounded-[5px] text-[10px]",
  md: "size-[22px] rounded-[7px] text-xs",
  lg: "size-7 rounded-lg text-sm",
};
const WORD = { sm: "text-sm", md: "text-[15px]", lg: "text-[17px]" };

export function LogoMark({
  size = "md",
  className,
}: Pick<LogoProps, "size" | "className">) {
  return (
    <span
      className={cn(
        "grid place-items-center bg-foreground font-semibold text-background",
        MARK[size],
        className,
      )}
    >
      D
    </span>
  );
}

export function Logo({ size = "md", href, className }: LogoProps) {
  const content = (
    <>
      <LogoMark size={size} />
      <span className={cn("font-semibold tracking-[-0.02em]", WORD[size])}>
        DocMind
      </span>
    </>
  );
  const classes = cn("flex items-center gap-2.5", className);
  return href ? (
    <Link href={href} aria-label="DocMind home" className={classes}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}
