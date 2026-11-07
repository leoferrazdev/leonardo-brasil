import { useState } from "react";

const DISMISS_KEY = "lb_announcement_gmn_v1";

const WHATSAPP_NUMBER = "5551992568861";
const WA_DIAG = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi o aviso no site e quero uma avaliação gratuita do perfil do meu negócio no Google Maps.")}`;

function isDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function AnnouncementBar() {
  const [visible, setVisible] = useState(() => !isDismissed());

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // localStorage indisponível (modo privado, etc.) — apenas oculta na sessão atual
    }
    setVisible(false);
  };

  return (
    <div className="relative z-50 bg-gold text-ink">
      <div className="mx-auto max-w-6xl px-10 sm:px-12 py-2 flex items-center justify-center text-center">
        <a
          href={WA_DIAG}
          target="_blank"
          rel="noreferrer"
          className="text-xs sm:text-sm font-bold leading-snug hover:underline underline-offset-2 decoration-2"
        >
          <span className="font-black">Diagnóstico Gratuito:</span> Descubra por que sua empresa está perdendo clientes no Google Maps <span aria-hidden="true">-&gt;</span>
        </a>
        <button
          onClick={dismiss}
          aria-label="Fechar aviso"
          className="absolute right-2 sm:right-4 p-1.5 text-ink/60 hover:text-ink transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="w-4 h-4">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
