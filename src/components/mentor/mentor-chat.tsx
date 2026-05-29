"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Markdown } from "@/components/mentor/markdown";
import { chatThreads, suggestionChips } from "@/lib/data/mentor";
import { useUser, nameFromEmail } from "@/lib/user-store";
import { generateMentorReply, buildWelcome, type MentorProfile } from "@/lib/mentor-engine";
import { initials, cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

let idSeq = 0;
const newId = () => `msg-${++idSeq}-${Date.now()}`;

export function MentorChat() {
  const { name, email, onboarding } = useUser();

  const profile = useMemo<MentorProfile>(
    () => ({
      name: (name || nameFromEmail(email) || "there").split(" ")[0],
      gpa: onboarding?.gpa ?? null,
      gpaScale: onboarding?.gpaScale ?? 4,
      ielts: onboarding?.ielts ?? null,
      sat: onboarding?.sat ?? null,
      major: onboarding?.intendedMajor || "your field",
      intake: onboarding?.targetIntake || "your intake",
    }),
    [name, email, onboarding],
  );
  const welcome = useMemo(() => buildWelcome(profile), [profile]);
  const userInitials = initials(name || nameFromEmail(email) || "You");

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: welcome },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeThread, setActiveThread] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const streamReply = async (prompt: string) => {
    const full = generateMentorReply(prompt, profile);
    const id = newId();
    setMessages((m) => [...m, { id, role: "assistant", content: "" }]);
    setStreaming(true);
    stopRef.current = false;

    const tokens = full.split(/(\s+)/); // keep whitespace
    for (let i = 0; i < tokens.length; i++) {
      if (stopRef.current) break;
      const snapshot = tokens.slice(0, i + 1).join("");
      setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, content: snapshot } : msg)));
      // vary cadence slightly for a natural feel
      await new Promise((r) => setTimeout(r, tokens[i].trim() ? 18 : 8));
    }
    setStreaming(false);
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setMessages((m) => [...m, { id: newId(), role: "user", content: trimmed }]);
    setInput("");
    setActiveThread(null);
    void streamReply(trimmed);
  };

  const stop = () => {
    stopRef.current = true;
    setStreaming(false);
  };

  const newChat = () => {
    if (streaming) stop();
    setMessages([{ id: "welcome", role: "assistant", content: welcome }]);
    setActiveThread(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden">
      {/* History sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="hidden shrink-0 overflow-hidden border-r border-border/60 bg-card/30 md:block"
          >
            <div className="flex h-full w-72 flex-col">
              <div className="p-3">
                <Button variant="gradient" className="w-full" onClick={newChat}>
                  <Plus className="size-4" /> New conversation
                </Button>
              </div>
              <p className="px-4 pb-2 pt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recent
              </p>
              <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
                {chatThreads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveThread(t.id)}
                    className={cn(
                      "group flex w-full flex-col gap-0.5 rounded-xl border border-transparent p-3 text-left transition-colors",
                      activeThread === t.id ? "border-border/70 bg-card" : "hover:bg-card/60",
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{t.title}</span>
                    </span>
                    <span className="truncate pl-[1.375rem] text-xs text-muted-foreground">{t.preview}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Chat column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              className="hidden md:inline-flex"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle history"
            >
              {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
            </Button>
            <span className="grid size-9 place-items-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] text-white shadow-glow">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                AdmitFlow Mentor
                <span className="inline-flex items-center gap-1 text-xs font-normal text-success">
                  <span className="size-1.5 rounded-full bg-success" /> Online
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Personalized to your profile</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={newChat} className="md:hidden">
            <Plus className="size-4" /> New
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                streaming={streaming && i === messages.length - 1}
                userInitials={userInitials}
              />
            ))}

            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pl-11"
              >
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => send(chip)}
                      className="rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/60 bg-background/60 px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-border/70 bg-card/60 p-2 shadow-card transition-colors focus-within:border-primary/50">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask your mentor anything…"
                className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              {streaming ? (
                <Button variant="outline" size="icon" onClick={stop} aria-label="Stop generating">
                  <Square className="size-4 fill-current" />
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  size="icon"
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </Button>
              )}
            </div>
            <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground">
              AdmitFlow Mentor can make mistakes. Verify important deadlines and requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  streaming,
  userInitials,
}: {
  message: ChatMessage;
  streaming: boolean;
  userInitials: string;
}) {
  const isUser = message.role === "user";
  const isEmpty = message.content.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      {isUser ? (
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-[11px]">{userInitials}</AvatarFallback>
        </Avatar>
      ) : (
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] text-white">
          <Sparkles className="size-4" />
        </span>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border/60 bg-card/60",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        ) : isEmpty && streaming ? (
          <TypingDots />
        ) : (
          <div className="relative">
            <Markdown content={message.content} />
            {streaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary align-middle" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-muted-foreground/60"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
