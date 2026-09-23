"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmButton({
  action,
  message,
  children,
}: {
  action: () => Promise<void>;
  message: string;
  children: ReactNode;
}) {
  return (
    <form action={action}>
      <Button
        type="submit"
        variant="destructive"
        onClick={(event) => {
          if (!window.confirm(message)) event.preventDefault();
        }}
      >
        {children}
      </Button>
    </form>
  );
}
