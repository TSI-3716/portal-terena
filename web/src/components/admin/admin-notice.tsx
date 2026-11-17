import { Alert, AlertDescription } from "@/components/ui/alert";

const sucesso = {
  salvo: "Registro salvo.",
  excluido: "Registro excluído.",
} as const;

const falha = {
  excluir: "Não foi possível excluir. Tente novamente.",
  salvar: "Não foi possível salvar. Tente novamente.",
} as const;

export function AdminNotice({ ok, erro }: { ok?: string; erro?: string }) {
  if (ok && ok in sucesso) {
    return (
      <Alert className="mb-4">
        <AlertDescription>{sucesso[ok as keyof typeof sucesso]}</AlertDescription>
      </Alert>
    );
  }

  if (erro && erro in falha) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{falha[erro as keyof typeof falha]}</AlertDescription>
      </Alert>
    );
  }

  return null;
}
