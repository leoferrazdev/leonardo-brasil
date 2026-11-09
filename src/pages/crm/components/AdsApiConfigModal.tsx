import React, { useState } from "react";
import { X, KeyRound, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

export interface AdsIntegrationStatus {
  ready: boolean;
  mode: "google-ads-api" | "local-intelligence-fallback";
  configured: {
    developerToken: boolean;
    clientId: boolean;
    clientSecret: boolean;
    refreshToken: boolean;
    loginCustomerId: boolean;
    customerId: boolean;
  };
  masked?: {
    loginCustomerId: string | null;
    customerId: string | null;
    hasClientId: boolean;
    hasDeveloperToken: boolean;
    hasRefreshToken: boolean;
  };
}

interface AdsApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: AdsIntegrationStatus | null;
  onSaved: (newStatus: AdsIntegrationStatus) => void;
}

export const AdsApiConfigModal: React.FC<AdsApiConfigModalProps> = ({
  isOpen,
  onClose,
  status,
  onSaved
}) => {
  const [developerToken, setDeveloperToken] = useState("");
  const [loginCustomerId, setLoginCustomerId] = useState(status?.masked?.loginCustomerId || "");
  const [customerId, setCustomerId] = useState(status?.masked?.customerId || "");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [authorizing, setAuthorizing] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (developerToken.trim()) payload.developerToken = developerToken.trim();
      if (loginCustomerId.trim()) payload.loginCustomerId = loginCustomerId.trim();
      if (customerId.trim()) payload.customerId = customerId.trim();
      if (clientId.trim()) payload.clientId = clientId.trim();
      if (clientSecret.trim()) payload.clientSecret = clientSecret.trim();
      if (refreshToken.trim()) payload.refreshToken = refreshToken.trim();

      const res = await fetch("/api/ads/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar credenciais.");
      }

      onSaved(data);
      toast.success("Credenciais do Google Ads salvas no servidor!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar credenciais.");
    } finally {
      setSaving(false);
    }
  };

  const handleStartOAuth = async () => {
    setAuthorizing(true);
    try {
      // Salva Client ID e Secret primeiro caso o usuário tenha acabado de preencher
      if (clientId.trim() || clientSecret.trim() || developerToken.trim() || loginCustomerId.trim()) {
        await fetch("/api/ads/credentials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            developerToken: developerToken.trim() || undefined,
            loginCustomerId: loginCustomerId.trim() || undefined,
            customerId: customerId.trim() || undefined,
            clientId: clientId.trim() || undefined,
            clientSecret: clientSecret.trim() || undefined
          })
        });
      }

      const res = await fetch("/api/ads/oauth/url");
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Preencha e salve o Client ID primeiro.");
      }
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao iniciar autorização OAuth.");
      setAuthorizing(false);
    }
  };

  const cfg = status?.configured;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0b101b] border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0f1626]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Conexão Oficial Google Ads API (MCC)</h3>
              <p className="text-xs text-slate-400">
                Configure as credenciais da sua conta Administrador (MCC) e Google Cloud Console
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-[#090d16] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {status?.ready ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                API Oficial Google Ads Pronta (Modo Direto)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertCircle className="w-4 h-4" />
                Operando em Modo Híbrido Local (Aguardando credenciais completas da MCC)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <a
              href="https://ads.google.com/aw/apicenter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 inline-flex items-center gap-1 underline"
            >
              Abrir Central de API (MCC) <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 inline-flex items-center gap-1 underline"
            >
              Abrir Cloud Console <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Passo 1: MCC */}
          <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                1. Dados da Conta Google Ads (MCC)
              </span>
              <span className="text-[11px] text-slate-400">
                Em: Google Ads → Administrador → Central de API
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Developer Token {cfg?.developerToken && <span className="text-emerald-400">✓</span>}
                </label>
                <input
                  type="password"
                  placeholder={cfg?.developerToken ? "••••••••••••••••" : "Ex: aBcDeFgHiJkLmNoPqR"}
                  value={developerToken}
                  onChange={(e) => setDeveloperToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d18] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ID da MCC (Login ID) {cfg?.loginCustomerId && <span className="text-emerald-400">✓</span>}
                </label>
                <input
                  type="text"
                  placeholder="Ex: 123-456-7890"
                  value={loginCustomerId}
                  onChange={(e) => setLoginCustomerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d18] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ID da Conta de Consulta {cfg?.customerId && <span className="text-emerald-400">✓</span>}
                </label>
                <input
                  type="text"
                  placeholder="Ex: 987-654-3210 (ou igual MCC)"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d18] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Passo 2: Google Cloud OAuth2 */}
          <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                2. Credenciais OAuth 2.0 (Google Cloud Console)
              </span>
              <span className="text-[11px] text-slate-400">
                Redirect URI: <code className="text-slate-200 bg-slate-900 px-1.5 py-0.5 rounded">{typeof window !== "undefined" ? `${window.location.origin}/api/ads/oauth/callback` : "/api/ads/oauth/callback"}</code>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  OAuth Client ID {cfg?.clientId && <span className="text-emerald-400">✓</span>}
                </label>
                <input
                  type="text"
                  placeholder={cfg?.clientId ? "Configurado (preencha para substituir)" : "xxxx.apps.googleusercontent.com"}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d18] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  OAuth Client Secret {cfg?.clientSecret && <span className="text-emerald-400">✓</span>}
                </label>
                <input
                  type="password"
                  placeholder={cfg?.clientSecret ? "••••••••••••••••" : "GOCSPX-..."}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d18] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Refresh Token {cfg?.refreshToken && <span className="text-emerald-400">✓ Conectado</span>}
                </label>
                <input
                  type="password"
                  placeholder={cfg?.refreshToken ? "Refresh token ativo (ou gere automaticamente ao lado →)" : "1//0g... (ou clique em Autorizar com Google)"}
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d18] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:pt-5">
                <button
                  type="button"
                  onClick={handleStartOAuth}
                  disabled={authorizing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-blue-300 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${authorizing ? "animate-spin" : ""}`} />
                  <span>Autorizar com Google (1 Clique)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Salvo localmente em <code className="text-slate-300">.env</code> (ignorado pelo Git).</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Fechar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition-all"
              >
                {saving ? "Salvando..." : "Salvar Credenciais"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
