import React, { useEffect, useMemo, useState } from "react";
import { Check, Copy, MessageCircle, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import type {
  ClientAccount,
  ClientChangeLog,
  ClientChecklistItem,
  ClientSnapshot,
  WhatsAppReportStyle,
} from "../clientTypes";
import {
  buildWhatsAppUniversalUrl,
  formatClientWhatsAppReport,
} from "../utils/whatsappReportFormatter";

interface ClientWhatsAppReportPanelProps {
  client: ClientAccount;
  snapshots: ClientSnapshot[];
  checklist: ClientChecklistItem[];
  changeLogs: ClientChangeLog[];
  selectedPeriodKey?: string;
}

export const ClientWhatsAppReportPanel: React.FC<ClientWhatsAppReportPanelProps> = ({
  client,
  snapshots,
  checklist,
  changeLogs,
  selectedPeriodKey,
}) => {
  const [style, setStyle] = useState<WhatsAppReportStyle>("mensal");
  const [copied, setCopied] = useState(false);

  const generatedText = useMemo(
    () =>
      formatClientWhatsAppReport({
        client,
        snapshots,
        checklist,
        changeLogs,
        style,
        targetPeriodKey: selectedPeriodKey,
      }),
    [client, snapshots, checklist, changeLogs, style, selectedPeriodKey],
  );

  const [draftText, setDraftText] = useState(generatedText);

  useEffect(() => {
    setDraftText(generatedText);
  }, [generatedText]);

  const waUrl = buildWhatsAppUniversalUrl(client.whatsapp, draftText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draftText);
      setCopied(true);
      toast.success("Relatório copiado para o WhatsApp!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível acessar a área de transferência.");
    }
  };

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-[#0e1320] p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Gerador de Relatório para WhatsApp</span>
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Texto formatado especialmente para leitura rápida no celular do cliente ({client.whatsapp || "sem telefone"}).
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-[#080b12] border border-[#1a2030] self-start">
          <button
            type="button"
            onClick={() => setStyle("mensal")}
            className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              style === "mensal" ? "bg-emerald-600 text-white" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setStyle("marco_zero")}
            className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              style === "marco_zero" ? "bg-amber-500 text-slate-950" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            Marco Zero (Antes × Depois)
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[#94a3b8]">
            Prévia editável antes do envio:
          </span>
          {draftText !== generatedText && (
            <button
              type="button"
              onClick={() => setDraftText(generatedText)}
              className="inline-flex items-center gap-1 min-h-[44px] px-2 text-[11px] font-bold text-amber-300 hover:text-amber-200"
            >
              <RefreshCw className="w-3 h-3" /> Restaurar automático
            </button>
          )}
        </div>
        <textarea
          rows={11}
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          className="w-full rounded-xl border border-[#1a2030] bg-[#060911] p-3.5 text-xs sm:text-sm font-mono text-slate-100 leading-relaxed focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copiado com Sucesso!" : "Copiar Relatório"}</span>
        </button>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all text-center"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enviar no WhatsApp (App / Web)</span>
        </a>
      </div>
    </section>
  );
};
