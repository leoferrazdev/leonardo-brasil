import React from "react";
import { Link } from "../../../lib/local-router";
import { ShieldAlert } from "lucide-react";

interface CloudSyncBannerProps {
  visible: boolean;
}

export const CloudSyncBanner: React.FC<CloudSyncBannerProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200"
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-300 font-bold">Modo Offline Local Ativo: </strong>
          você entrou sem autenticação real no Supabase. Os dados exibidos podem estar apenas no cache deste navegador e{" "}
          <strong>não sincronizam com seu celular ou outros dispositivos</strong>.
        </p>
      </div>
      <Link
        to="/crm/login"
        className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
      >
        Fazer Login Real (Nuvem)
      </Link>
    </div>
  );
};
