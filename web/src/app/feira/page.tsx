import { permanentRedirect } from "next/navigation";

/** "Feira & Artesanato" virou "Artesanato" (item 21). Mantém links antigos funcionando. */
export default function FeiraPage() {
  permanentRedirect("/artesanato");
}
