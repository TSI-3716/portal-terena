import type { ReactNode } from "react";
import { InamatyNav } from "@/components/inamaty-nav";

export default function InamatyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-container">
      <div className="crumb">Início › Aldeias › Inamaty Kaxé</div>
      <InamatyNav />
      {children}
    </div>
  );
}
