import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export function SheetContent({
  children,
  side = "right",
  className,
  title,
}: {
  children: ReactNode;
  side?: "right" | "left";
  className?: string;
  title: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <Dialog.Content
        className={cn(
          "fixed z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-[var(--shadow-border)]",
          "transition-[transform,opacity] duration-[var(--motion-slow,400ms)] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "data-[state=open]:translate-x-0 data-[state=closed]:opacity-0",
          side === "right"
            ? "top-0 right-0 data-[state=closed]:translate-x-4"
            : "top-0 left-0 data-[state=closed]:-translate-x-4",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <Dialog.Title className="font-display text-lg font-medium">{title}</Dialog.Title>
          <Dialog.Close asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Close">
              <X />
            </Button>
          </Dialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
