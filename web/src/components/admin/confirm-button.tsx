"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";

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
      <Button
        type="submit"
        variant="destructive"
        size={size}
        onClick={(event) => {
          if (!window.confirm(message)) event.preventDefault();
        }}
      >
        {children}
      </Button>
    </form>
  );
}
