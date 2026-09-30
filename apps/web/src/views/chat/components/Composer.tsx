"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { CHAT_MAX_CHARS } from "@/configs/constants";
import { cn } from "@/lib/utils";

interface Props {
  streaming: boolean;
  disabled?: boolean;
  placeholder: string;
  onSend: (text: string) => void;
  onStop: () => void;
}

const MIN_H = 40;
const MAX_H = 168;

export function Composer({
  streaming,
  disabled,
  placeholder,
  onSend,
  onStop,
}: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSend = !!value.trim() && !streaming && !disabled;

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = `${MIN_H}px`;
    el.style.height = `${Math.min(MAX_H, el.scrollHeight)}px`;
    el.style.overflowY = el.scrollHeight > MAX_H ? "auto" : "hidden";
  };

  // Hand focus back once a stream finishes (the input is disabled while streaming).
  useEffect(() => {
    if (!streaming && !disabled) ref.current?.focus();
  }, [streaming, disabled]);

  const send = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    requestAnimationFrame(resize);
  };

  return (
    <div className="flex-none bg-background px-[clamp(12px,3vw,24px)] pt-2 pb-3.5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className={cn(
          "mx-auto flex max-w-[760px] items-end gap-2 rounded-[28px] border bg-secondary py-1.5 pr-1.5 pl-5 transition-[border-color,box-shadow]",
          focused
            ? "border-ring shadow-[0_0_0_3px_var(--accent-bg)]"
            : "border-transparent",
        )}
      >
        <textarea
          ref={ref}
          rows={1}
          value={value}
          maxLength={CHAT_MAX_CHARS}
          disabled={streaming || disabled}
          aria-label="Message"
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              send();
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="max-h-[168px] h-10 min-w-0 flex-1 resize-none overflow-y-hidden border-0 bg-transparent py-2 text-[15px] leading-6 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            className="inline-flex h-10 flex-none items-center gap-2 rounded-full border bg-background pr-3.5 pl-3 text-[13px] font-medium hover:bg-secondary"
          >
            <span className="size-2.5 rounded-[2px] bg-foreground" />
            Stop
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Send"
            disabled={!canSend}
            className="grid size-10 flex-none place-items-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="size-[18px]" strokeWidth={2} />
          </button>
        )}
      </form>
      <p className="mt-2 mb-0 text-center text-xs text-faint">
        Answers can be wrong. Check the cited source before relying on it.
      </p>
    </div>
  );
}
