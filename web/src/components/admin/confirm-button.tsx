"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

function SubmitButton({
  message,
  children,
  size,
  variant = "destructive",
  pendingLabel = "Aguarde...",
}: {
  message?: string;
  children: ReactNode;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      onClick={(event) => {
        if (message && !window.confirm(message)) event.preventDefault();
      }}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}

export function ConfirmButton({
  action,
  message,
  children,
  size,
}: {
  action: () => Promise<void>;
  message: string;
  children: ReactNode;
  size?: ComponentProps<typeof Button>["size"];
}) {
  return (
    <form action={action}>
      <SubmitButton message={message} size={size} pendingLabel="Excluindo...">
        {children}
      </SubmitButton>
    </form>
  );
}

export function PendingSubmit({
  children,
  size,
  variant = "outline",
  pendingLabel = "Salvando...",
}: {
  children: ReactNode;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
  pendingLabel?: string;
}) {
  return (
    <SubmitButton size={size} variant={variant} pendingLabel={pendingLabel}>
      {children}
    </SubmitButton>
  );
}
