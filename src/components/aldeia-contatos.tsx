import { InfoList, type InfoItem } from "@/components/content-blocks";
import { Card, CardContent } from "@/components/ui/card";
import type { ContatoAldeia } from "@/lib/database";

/** Converte um registro de contato_aldeia em linhas "rótulo / valor". */
export function contatoItems(contato: ContatoAldeia): InfoItem[] {
  const items: InfoItem[] = [];
  if (contato.telefone) {
    const digits = contato.telefone.replace(/\D/g, "");
    items.push({
      label: "Telefone / WhatsApp",
      value: digits ? (
        <a href={`tel:${digits}`} className="underline-offset-4 hover:underline">
          {contato.telefone}
        </a>
      ) : (
        contato.telefone
      ),
    });
  }
  if (contato.email) {
    items.push({
      label: "E-mail",
      value: (
        <a href={`mailto:${contato.email}`} className="underline-offset-4 hover:underline">
          {contato.email}
        </a>
      ),
    });
  }
  if (contato.endereco) items.push({ label: "Endereço", value: contato.endereco });
  if (contato.horario_atendimento) {
    items.push({ label: "Horário de atendimento", value: contato.horario_atendimento });
  }
  if (contato.observacao) items.push({ label: "Observação", value: contato.observacao });
  return items;
}

export function AldeiaContatos({ contatos }: { contatos: ContatoAldeia[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {contatos.map((contato) => (
        <Card key={contato.id_contato}>
          <CardContent>
            <InfoList items={contatoItems(contato)} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
