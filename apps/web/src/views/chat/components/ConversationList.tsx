"use client";

import Link from "next/link";
import { SquarePen, X } from "lucide-react";
import type { Conversation } from "@docmind/shared";

import { Bone } from "@/components/common/Skeletons";
import { routes } from "@/configs/routes";
import { cn } from "@/lib/utils";
import {
  conversationGroup,
  formatShortAgo,
  type ConversationGroup,
} from "@/utils/format-date";

const ORDER: ConversationGroup[] = ["Today", "Previous 7 days", "Older"];

interface Props {
  collectionId: string;
  conversations: Conversation[] | undefined;
  loading: boolean;
  activeId?: string;
  onNavigate?: () => void;
  onClose?: () => void;
}

export function ConversationList({
  collectionId,
  conversations,
  loading,
  activeId,
  onNavigate,
  onClose,
}: Props) {
  const groups = ORDER.map((label) => ({
    label,
    items: (conversations ?? []).filter(
      (c) => conversationGroup(c.updatedAt) === label,
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex flex-none items-center gap-2 p-3">
        <Link
          href={routes.chat(collectionId)}
          onClick={onNavigate}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border bg-background text-[13px] font-medium hover:bg-secondary"
        >
          <SquarePen className="size-[15px]" />
          New chat
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pt-1 pb-4">
        {loading && (
          <div className="flex animate-dmpulse flex-col gap-3.5 px-2.5 py-3">
            <Bone className="h-2.5 w-10" />
            <Bone className="h-3 w-[85%]" />
            <Bone className="h-3 w-[70%]" />
            <Bone className="h-3 w-[78%]" />
            <Bone className="mt-2.5 h-2.5 w-16" />
            <Bone className="h-3 w-[66%]" />
          </div>
        )}
        {!loading && groups.length === 0 && (
          <p className="px-2.5 py-3 text-[13px] text-muted-foreground">
            No conversations yet.
          </p>
        )}
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-2.5 pt-3 pb-1.5 text-xs font-medium text-faint">
              {g.label}
            </div>
            <div className="flex flex-col gap-px">
              {g.items.map((c) => {
                const on = c.id === activeId;
                return (
                  <Link
                    key={c.id}
                    href={routes.chat(collectionId, c.id)}
                    onClick={onNavigate}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "flex h-[34px] items-center gap-2 rounded-lg px-2.5 text-[13px] hover:bg-secondary hover:text-foreground",
                      on
                        ? "bg-secondary font-medium text-foreground"
                        : "text-fg2",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    <span className="flex-none text-[11px] font-normal text-faint">
                      {formatShortAgo(c.updatedAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
