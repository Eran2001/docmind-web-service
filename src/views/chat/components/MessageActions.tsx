"use client";

import { useState } from "react";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import type { Message } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { FEEDBACK_REASONS } from "@/configs/constants";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useSendFeedback } from "@/queries/chat.queries";
import { plainAnswer } from "@/utils/citations";

const iconBtn =
  "grid size-[30px] place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";

function formatMeta(message: Message, stoppedTokens?: number): string {
  if (stoppedTokens !== undefined)
    return `stopped · ${stoppedTokens.toLocaleString()} tokens`;
  if (!message.usage) return "";
  const tokens = message.usage.inputTokens + message.usage.outputTokens;
  const parts = [
    `${tokens.toLocaleString()} tokens`,
    `$${message.usage.costUsd.toFixed(4)}`,
  ];
  if (message.latencyMs != null)
    parts.push(`${(message.latencyMs / 1000).toFixed(1)}s`);
  return parts.join(" · ");
}

function FeedbackDialog({
  message,
  conversationId,
}: {
  message: Message;
  conversationId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [text, setText] = useState("");
  const feedback = useSendFeedback(conversationId);
  const down = message.feedback?.rating === -1;
  const disabled = (!reason && !text.trim()) || feedback.isPending;

  const submit = () =>
    feedback.mutate(
      {
        messageId: message.id,
        rating: -1,
        comment: [reason, text.trim()].filter(Boolean).join(": ") || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setReason(null);
          setText("");
          toast.success("Feedback sent", {
            description: "Thanks — this answer was flagged for review.",
          });
        },
        onError: (err) =>
          toast.error("Something went wrong", {
            description: getErrorMessage(err),
          }),
      },
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Bad answer"
          aria-pressed={down}
          className={cn(
            iconBtn,
            (down || open) && "bg-secondary text-foreground",
          )}
        >
          <ThumbsDown className="size-[15px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-[min(340px,calc(100vw-48px))] rounded-xl p-4"
      >
        <div className="text-sm font-semibold tracking-[-0.01em]">
          What went wrong?
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          Your feedback is reviewed to improve answers.
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {FEEDBACK_REASONS.map((r) => (
            <button
              key={r}
              aria-pressed={reason === r}
              onClick={() => setReason(reason === r ? null : r)}
              className={cn(
                "h-7 rounded-full border px-3 text-xs",
                reason === r
                  ? "border-foreground bg-foreground text-background"
                  : "bg-background text-fg2",
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Add a comment (optional)"
          maxLength={1000}
          className="mt-3 min-h-0 rounded-[14px] px-3.5 py-2.5 text-[13px]"
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={disabled} onClick={submit}>
            Send feedback
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface Props {
  message: Message;
  conversationId: string;
  stoppedTokens?: number;
}

export function MessageActions({
  message,
  conversationId,
  stoppedTokens,
}: Props) {
  const [copied, setCopied] = useState(false);
  const feedback = useSendFeedback(conversationId);
  const up = message.feedback?.rating === 1;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        plainAnswer(message.content, message.citations),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy", {
        description: "Your browser blocked clipboard access.",
      });
    }
  };

  return (
    <div className="-ml-1.5 flex flex-wrap items-center gap-0.5">
      <button
        aria-label="Good answer"
        aria-pressed={up}
        disabled={feedback.isPending}
        onClick={() =>
          !up && feedback.mutate({ messageId: message.id, rating: 1 })
        }
        className={cn(iconBtn, up && "bg-secondary text-foreground")}
      >
        <ThumbsUp className="size-[15px]" />
      </button>
      <FeedbackDialog message={message} conversationId={conversationId} />
      <button aria-label="Copy answer" onClick={copy} className={iconBtn}>
        {copied ? (
          <Check className="size-[15px]" />
        ) : (
          <Copy className="size-[15px]" />
        )}
      </button>
      <span className="ml-auto pl-3 font-mono text-xs whitespace-nowrap text-faint">
        {formatMeta(message, stoppedTokens)}
      </span>
    </div>
  );
}
