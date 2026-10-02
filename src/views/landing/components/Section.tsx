import type { ReactNode } from "react";

export const pad = "px-[clamp(16px,4vw,32px)]";

/** A landing section: optional small label, a heading and an optional lead line, then the content. */
export function Section({
  id,
  kicker,
  title,
  lead,
  children,
  className = "",
}: {
  id?: string;
  kicker?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-[1160px] scroll-mt-16 py-[clamp(56px,8vw,96px)] ${pad} ${className}`}
    >
      <div className="mx-auto mb-[clamp(32px,5vw,48px)] max-w-[640px] text-center">
        {kicker && (
          <div className="mb-3 text-[13px] font-medium text-muted-foreground">
            {kicker}
          </div>
        )}
        <h2 className="m-0 text-[clamp(26px,3.6vw,36px)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance">
          {title}
        </h2>
        {lead && (
          <p className="mx-auto mt-3.5 mb-0 text-[16px] leading-[1.55] text-pretty text-muted-foreground">
            {lead}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
