import type { ReactNode } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { NativeSelect } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

export function FilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 grid gap-3 rounded-xl border bg-muted/50 p-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function FilterSelect({
  label,
  children,
  defaultValue,
}: {
  label: string;
  children: ReactNode;
  defaultValue?: string;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <NativeSelect className="w-full" defaultValue={defaultValue}>
        {children}
      </NativeSelect>
    </Field>
  );
}
