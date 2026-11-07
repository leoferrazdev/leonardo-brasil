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
    if (!email || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        toast.success("Acesso local liberado");
        navigate("/crm/dashboard");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Falha no login: ${error.message}`);
      } else if (data.session) {
        toast.success("Login realizado com sucesso!");
        navigate("/crm/dashboard");
      }
    } catch (err: any) {
      toast.error(`Erro ao autenticar: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBypassOffline = () => {
    toast("Acessando em modo contingência local...", { icon: "⚡" });
    navigate("/crm/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Helmet>
        <title>Login | CRM Prospecção Local - Leonardo Brasil</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Leonardo Brasil
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          CRM de Prospecção Local
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Perfil da Empresa no Google & Estrutura de Vendas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0f1420] py-8 px-6 shadow-2xl shadow-black/80 rounded-2xl border border-slate-800/80 backdrop-blur-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                E-mail de acesso
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                  placeholder="seu@email.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#080b11] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Senha
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#080b11] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99]"
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

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col gap-3">
            <button
              onClick={handleBypassOffline}
              type="button"
              className="w-full text-xs text-slate-400 hover:text-emerald-400 font-medium py-2 px-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acesso Rápido / Modo Offline Local</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          Ambiente restrito • leonardobrasil.com.br/crm
        </div>
      </div>
    </div>
  );
}
