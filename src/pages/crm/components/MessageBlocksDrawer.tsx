import React, { useState, useEffect } from "react";
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
  Sparkles,
  RotateCcw
} from "lucide-react";
import { toast } from "react-hot-toast";
import { resolveLeadScore } from "../utils/deterministicScoring";
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
  const [bloco1Mode, setBloco1Mode] = useState<"volume" | "falha">("volume");
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
      setActiveTab(1);
      setBloco1Mode("volume");
    }
  }, [lead]);

  const defaultBlockText = !lead
    ? ""
    : activeTab === 1
    ? bloco1Mode === "volume"
      ? lead.bloco1Volume || lead.bloco1
      : lead.bloco1Falha || lead.bloco1
    : activeTab === 2
    ? lead.bloco2
    : activeTab === 3
    ? lead.bloco3
    : lead.bloco4;

  useEffect(() => {
    setCustomText(defaultBlockText);
  }, [defaultBlockText, activeTab, bloco1Mode]);

  if (!lead) return null;

  const scoreResult = resolveLeadScore(lead);

  const blocks = [
    {
      num: 1 as const,
      name: "Bloco 1: Gancho Inicial",
      subtitle:
        bloco1Mode === "volume"
          ? `Modelo A: Volume de Buscas (~${lead.monthlySearches || "2.400"}/mês) & Top 3`
          : "Modelo B: Falha Concreta / Divergência Auditada",
      targetStage: "contatado" as PipelineStageId,
      advanceLabel: "Marcar Bloco 1 Enviado → Mover para Contatado",
    },
    {
      num: 2 as const,
      name: "Bloco 2: Diagnóstico Gratuito",
      subtitle: "Análise de 3 pontos entregue quando o lead responde 'Sim'",
      targetStage: "em_conversa" as PipelineStageId,
      advanceLabel: "Marcar Diagnóstico Enviado → Mover para 'Em Conversa'",
    },
    {
      num: 3 as const,
      name: "Bloco 3: Escopo da Solução",
      subtitle: "Os 4 pilares de Otimização, Implantação e Blindagem",
      targetStage: "proposta_enviada" as PipelineStageId,
      advanceLabel: "Avançar para Proposta Enviada",
    },
    {
      num: 4 as const,
      name: "Bloco 4: Proposta e Valores",
      subtitle: "Condições comerciais: R$ 497 à vista (ou 2x R$ 250) / R$ 380 mensal",
      targetStage: "proposta_enviada" as PipelineStageId,
      advanceLabel: "Confirmar Proposta Enviada",
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

  const whatsappWebUrl =
    lead.formattedPhone && lead.whatsappConfirmed
      ? `https://web.whatsapp.com/send?phone=${lead.formattedPhone}&text=${encodeURIComponent(customText)}`
      : "";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0a0d14] border-l border-[#1a2030] shadow-2xl h-full flex flex-col text-[#f1f5f9]">
        {/* Barra Superior Azul Royal e Dourada */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

        {/* Cabeçalho da Gaveta */}
        <div className="p-5 border-b border-[#1a2030] bg-[#0e1320] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#080b12] text-[#94a3b8] border border-[#1a2030] font-bold">
                {lead.sampleId}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${
                  scoreResult.tier === "A"
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                    : scoreResult.tier === "B"
                    ? "border-amber-500/35 bg-amber-500/15 text-amber-300"
                    : "border-blue-500/35 bg-blue-500/15 text-blue-300"
                }`}
              >
                {scoreResult.classLabel}
              </span>
              {lead.ratingText && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-amber-300 font-semibold">
                  {lead.ratingText}
                </span>
              )}
              {lead.claimStatus === "nao_reivindicado" && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-rose-500/40 bg-rose-500/15 text-rose-300 font-bold">
                  Perfil Não Reivindicado
                </span>
              )}
              {lead.observedPosition && (
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/20 text-amber-300 font-bold inline-flex items-center gap-1">
                  📍 {lead.observedPosition}º lugar no Maps (Fora do Top 3)
                </span>
              )}
              {lead.monthlySearches && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-300 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  ~{lead.monthlySearches} buscas/mês
                </span>
              )}
            </div>

            <h2 className="text-xl font-extrabold text-white mt-2 flex items-center gap-2">
              {lead.name}
            </h2>

            <div className="flex items-center gap-3 text-xs text-[#94a3b8] mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-blue-300 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                {lead.segment}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {lead.neighborhood}, Porto Alegre
              </span>
              {lead.searchKeyword && (
                <>
                  <span>•</span>
                  <span className="text-slate-300 font-semibold">
                    Termo: "{lead.searchKeyword}"
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-[#161d2e] border border-transparent hover:border-[#2d3748] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo Rápido de Contato & Links Externos */}
        <div className="px-5 py-3 bg-[#080b12] border-b border-[#1a2030] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 font-mono text-[#f1f5f9] font-semibold">
            <Phone className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{lead.phone || "Sem telefone"}</span>
            {lead.whatsappConfirmed ? (
              <span className="text-[11px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30 font-bold">
                WhatsApp Confirmado ✓
              </span>
            ) : (
              <span className="text-[11px] text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30 font-semibold">
                {lead.canalStatus || "Apenas Fixo"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {lead.mapsUrl && (
              <a
                href={lead.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f1420] border border-[#1a2030] text-blue-300 hover:text-white hover:border-blue-500/40 transition-colors font-semibold"
              >
                <span>Ver Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {lead.siteUrl && (
              <a
                href={lead.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f1420] border border-[#1a2030] text-amber-300 hover:text-white hover:border-amber-500/40 transition-colors font-semibold"
              >
                <span>Site / Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Alerta de Diagnóstico Observado + Pontuação Determinística */}
        <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/25 space-y-2 text-xs text-amber-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-bold">Evidência Auditada: </strong>
              {lead.opportunityIssue}
            </div>
          </div>
          {scoreResult.breakdown.signalsTriggered.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mr-1">
                Critérios ({scoreResult.score}/100):
              </span>
              {scoreResult.breakdown.signalsTriggered.map((sig, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#0a0d14]/80 text-emerald-300 border border-emerald-500/25"
                >
                  {sig}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Abas dos 4 Blocos */}
        <div className="px-5 pt-3 border-b border-[#1a2030] bg-[#0e1320] flex items-center gap-2 overflow-x-auto">
          {blocks.map((b) => (
            <button
              key={b.num}
              onClick={() => setActiveTab(b.num)}
              className={`pb-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === b.num
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-[#94a3b8] hover:text-white"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-mono ${
                  activeTab === b.num
                    ? "bg-blue-600 text-white"
                    : "bg-[#161d2e] text-[#94a3b8]"
                }`}
              >
                {b.num}
              </span>
              <span>Bloco {b.num}</span>
            </button>
          ))}
        </div>

        {/* Área Central: Texto Editável do Bloco e Botões de Ação */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h3 className="text-base font-extrabold text-white">{currentBlock.name}</h3>
                <p className="text-xs text-[#94a3b8]">{currentBlock.subtitle}</p>
              </div>

              {customText !== defaultBlockText && (
                <button
                  type="button"
                  onClick={() => setCustomText(defaultBlockText)}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/25 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar Padrão</span>
                </button>
              )}
            </div>

            {/* Alternador de Modelo A (Volume) vs Modelo B (Falha) no Bloco 1 */}
            {activeTab === 1 && (
              <div className="flex items-center gap-2 p-1.5 bg-[#080b12] border border-[#1a2030] rounded-xl mb-3">
                <button
                  type="button"
                  onClick={() => setBloco1Mode("volume")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    bloco1Mode === "volume"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Modelo A: Volume de Buscas (~{lead.monthlySearches}/mês)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBloco1Mode("falha")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    bloco1Mode === "falha"
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Modelo B: Falha Factual Auditada</span>
                </button>
              </div>
            )}

            {/* Caixa de Texto Editável para WhatsApp */}
            <textarea
              rows={8}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full rounded-xl border border-[#1a2030] focus:border-blue-500 bg-[#06080e] p-4 text-sm font-mono text-[#f1f5f9] leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
            />
            <p className="text-[11px] text-[#94a3b8] mt-1">
              💡 Você pode editar qualquer palavra acima antes de copiar ou abrir no WhatsApp.
            </p>
          </div>

          {/* Botões de Ação Principal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handleCopy(currentBlock.num, customText)}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all active:scale-[0.99]"
            >
              {copiedBlock === currentBlock.num ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Bloco {currentBlock.num}</span>
                </>
              )}
            </button>

            {whatsappWebUrl ? (
              <a
                href={whatsappWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.99] text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp Web Pré-carregado</span>
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#0f1420] border border-[#1a2030] text-slate-500 font-bold text-xs cursor-not-allowed"
              >
                WhatsApp Indisponível (Apenas Fixo)
              </button>
            )}
          </div>

          {/* Botão de Avanço Rápido de Etapa */}
          <div className="pt-1 space-y-2">
            <button
              onClick={() => onAdvanceStage(lead.id, currentBlock.targetStage)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 font-bold text-xs transition-colors"
            >
              <span>{currentBlock.advanceLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onAdvanceStage(lead.id, "fechado_ganho")}
                className="py-2 px-3 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all text-center"
              >
                ✓ Marcar Fechado (Ganho)
              </button>
              <button
                type="button"
                onClick={() => onAdvanceStage(lead.id, "perdido_invalido")}
                className="py-2 px-3 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all text-center"
              >
                ✕ Descartar (Inválido/Perdido)
              </button>
            </div>
          </div>

          {/* Anotações e Histórico */}
          <div className="pt-4 border-t border-[#1a2030]">
            <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2">
              Anotações da Conversa / Resposta do Prospect:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Conversou com a recepcionista; sócio-proprietário atende pelo celular à tarde..."
              className="w-full p-3.5 rounded-xl bg-[#06080e] border border-[#1a2030] text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#161d2e] hover:bg-blue-600 text-xs font-bold text-white transition-colors"
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
