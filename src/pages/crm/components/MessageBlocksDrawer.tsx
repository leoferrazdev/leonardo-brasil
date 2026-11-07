import React, { useState } from "react";
import { 
  X, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink, 
  AlertTriangle, 
  Save, 
  Building2, 
  MapPin, 
  Phone, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { ProspectLead, PipelineStageId } from "../types";

interface MessageBlocksDrawerProps {
  lead: ProspectLead | null;
  onClose: () => void;
  onAdvanceStage: (leadId: string, nextStage: PipelineStageId) => void;
  onSaveNotes: (leadId: string, notes: string) => void;
}

export const MessageBlocksDrawer: React.FC<MessageBlocksDrawerProps> = ({
  lead,
  onClose,
  onAdvanceStage,
  onSaveNotes,
}) => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [notes, setNotes] = useState(lead?.notes || "");

  if (!lead) return null;

  const blocks = [
    {
      num: 1 as const,
      name: "Bloco 1: Gancho Inicial",
      subtitle: "Abertura consultiva e verificação da falha",
      text: lead.bloco1,
      targetStage: "contatado" as PipelineStageId,
      advanceLabel: "Marcar Bloco 1 Enviado -> Mover para Contatado",
    },
    {
      num: 2 as const,
      name: "Bloco 2: Diagnóstico",
      subtitle: "Apresentação da falha concreta com evidência",
      text: lead.bloco2,
      targetStage: "em_conversa" as PipelineStageId,
      advanceLabel: "Mover para 'Em Conversa'",
    },
    {
      num: 3 as const,
      name: "Bloco 3: Solução / Serviço",
      subtitle: "O que será feito na implantação e blindagem",
      text: lead.bloco3,
      targetStage: "proposta_enviada" as PipelineStageId,
      advanceLabel: "Avançar para Apresentação",
    },
    {
      num: 4 as const,
      name: "Bloco 4: Proposta e Valores",
      subtitle: "Condições comerciais (R$ 650 / R$ 380)",
      text: lead.bloco4,
      targetStage: "proposta_enviada" as PipelineStageId,
      advanceLabel: "Marcar Proposta Enviada",
    },
  ];

  const currentBlock = blocks.find((b) => b.num === activeTab) || blocks[0];

  const handleCopy = (num: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(num);
    toast.success(`Bloco ${num} copiado para o WhatsApp!`);
    setTimeout(() => setCopiedBlock(null), 2500);
  };

  const handleSaveNotes = () => {
    onSaveNotes(lead.id, notes);
    toast.success("Anotações salvas com sucesso!");
  };

  const whatsappWebUrl = lead.formattedPhone
    ? `https://web.whatsapp.com/send?phone=${lead.formattedPhone}&text=${encodeURIComponent(currentBlock.text)}`
    : "";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0b0f17] border-l border-slate-800 shadow-2xl h-full flex flex-col text-slate-200">
        {/* Cabeçalho da Gaveta */}
        <div className="p-5 border-b border-slate-800 bg-[#0d121c] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                {lead.sampleId}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold">
                {lead.opportunityClass}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              {lead.name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {lead.segment}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {lead.neighborhood}, Porto Alegre
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo Rápido de Contato & Oportunidade */}
        <div className="px-5 py-3 bg-[#080b11] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{lead.phone || "Sem telefone"}</span>
            {lead.whatsappConfirmed && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                WhatsApp Confirmado ✓
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {lead.mapsUrl && (
              <a
                href={lead.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors font-medium"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {lead.siteUrl && (
              <a
                href={lead.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors font-medium"
              >
                <span>Site Oficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Alerta de Diagnóstico */}
        <div className="px-5 py-2.5 bg-amber-500/5 border-b border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200/90">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-semibold">Falha observada: </strong>
            {lead.opportunityIssue}
          </div>
        </div>

        {/* Abas dos 4 Blocos */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-[#0d121c] flex items-center gap-2 overflow-x-auto">
          {blocks.map((b) => (
            <button
              key={b.num}
              onClick={() => setActiveTab(b.num)}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === b.num
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-mono">
                {b.num}
              </span>
              <span>Bloco {b.num}</span>
            </button>
          ))}
        </div>

        {/* Área Central: Texto do Bloco e Ações de Cópia */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-white">{currentBlock.name}</h3>
                <p className="text-xs text-slate-400">{currentBlock.subtitle}</p>
              </div>

              <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Formato WhatsApp
              </span>
            </div>

            {/* Caixa de Texto do WhatsApp com scroll */}
            <div className="relative rounded-xl border border-slate-700/80 bg-[#06080e] p-4 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500 selection:text-white shadow-inner">
              {currentBlock.text}
            </div>
          </div>

          {/* Botões de Ação para o Bloco Ativo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleCopy(currentBlock.num, currentBlock.text)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99]"
            >
              {copiedBlock === currentBlock.num ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Bloco {currentBlock.num} (WhatsApp)</span>
                </>
              )}
            </button>

            {whatsappWebUrl ? (
              <a
                href={whatsappWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all active:scale-[0.99] text-center"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Abrir WhatsApp Web Pré-carregado</span>
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-600 font-bold text-xs cursor-not-allowed"
              >
                WhatsApp Web Indisponível
              </button>
            )}
          </div>

          {/* Botão de Avanço Rápido de Etapa */}
          <div className="pt-2">
            <button
              onClick={() => onAdvanceStage(lead.id, currentBlock.targetStage)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors"
            >
              <span>{currentBlock.advanceLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Anotações e Histórico */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Anotações da Conversa / Resposta do Prospect:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Conversou com a recepcionista; sócio-proprietário atende pelo celular à tarde..."
              className="w-full p-3 rounded-xl bg-[#06080e] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Anotações</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
