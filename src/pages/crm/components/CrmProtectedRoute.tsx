import React, { useEffect, useState } from "react";
import { Navigate } from "../../../lib/local-router";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

interface CrmProtectedRouteProps {
  children: React.ReactNode;
}

export const CrmProtectedRoute: React.FC<CrmProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // 1. Checa flag de sessão local / modo offline
    if (typeof window !== "undefined" && localStorage.getItem("crm_offline_session") === "true") {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    // 2. Se o Supabase não estiver configurado, permite acesso direto
    if (!isSupabaseConfigured) {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function checkAuth() {
      // Re-checa flag local
      if (typeof window !== "undefined" && localStorage.getItem("crm_offline_session") === "true") {
        if (isMounted) {
          setAuthenticated(true);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setAuthenticated(Boolean(session));
          setLoading(false);
        }
      } catch (err) {
        console.warn("Aviso na checagem de sessão do Supabase:", err);
        if (isMounted) {
          setAuthenticated(true);
          setLoading(false);
        }
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session || (typeof window !== "undefined" && localStorage.getItem("crm_offline_session") === "true")) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide text-slate-400">Verificando credenciais do CRM...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/crm/login" replace />;
  }

  return <>{children}</>;
};
