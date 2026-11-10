import React, { useState } from "react";
import { useNavigate, Link } from "../../lib/local-router";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function CrmLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        if (typeof window !== "undefined") {
          localStorage.setItem("crm_offline_session", "true");
          localStorage.setItem("crm_user_email", cleanEmail);
        }
        toast.success("Acesso local liberado!");
        navigate("/crm/dashboard");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data?.session) {
        if (typeof window !== "undefined") {
          localStorage.setItem("crm_offline_session", "true");
          localStorage.setItem("crm_user_email", cleanEmail);
        }
        toast.success("Login realizado com sucesso!");
        navigate("/crm/dashboard");
        return;
      }

      if (error) {
        toast.error(`Falha no login: ${error.message}`);
      } else {
        toast.error("Sessão não iniciada. Verifique suas credenciais ou use o modo offline.");
      }
    } catch (err: any) {
      toast.error(`Erro ao autenticar: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBypassOffline = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("crm_offline_session", "true");
      localStorage.setItem("crm_user_email", "leonardoferrazbrasil@gmail.com");
    }
    toast.success("Acesso liberado com sucesso!");
    navigate("/crm/dashboard");
  };

  return (
    <div
      className="min-h-screen bg-[#0a0d14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#f1f5f9] selection:bg-blue-600 selection:text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.14), transparent 45%), radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.08), transparent 35%)",
      }}
    >
      <Helmet>
        <title>Login | CRM Executivo - Leonardo Brasil</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-5 hover:opacity-90 transition-opacity">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-400 p-[1.5px] shadow-lg shadow-blue-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Leonardo Brasil
          </span>
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-white">
          CRM Executivo de Prospecção
        </h2>
        <p className="mt-2 text-sm text-[#94a3b8]">
          Posicionamento Google Maps, SEO Local & Máquina de Vendas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0e1320] py-8 px-6 shadow-2xl shadow-black/80 rounded-2xl border border-[#1a2030] backdrop-blur-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                E-mail de acesso
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="leonardoferrazbrasil@gmail.com"
                  className="block w-full pl-10 pr-4 py-3 bg-[#080b12] border border-[#1a2030] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                Senha
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-[#080b12] border border-[#1a2030] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-blue-400/30 rounded-xl shadow-lg shadow-blue-600/25 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1a2030] flex flex-col gap-3">
            <button
              onClick={handleBypassOffline}
              type="button"
              className="w-full text-xs text-amber-300 hover:text-amber-200 font-bold py-3 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>⚡ Acesso Rápido / Modo Offline Local</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#94a3b8]">
          Ambiente executivo restrito • leonardobrasil.com.br/crm
        </div>
      </div>
    </div>
  );
}
