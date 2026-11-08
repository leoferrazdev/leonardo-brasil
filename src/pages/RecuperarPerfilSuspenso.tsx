import React, { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Meu perfil no Google Meu Negócio foi suspenso/desativado. Preciso de ajuda para recuperar minha ficha.")}`;

const WhatsApp = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.04-.95.23-3.2-.67-2.7-1.07-4.42-3.83-4.55-4.01-.13-.18-1.1-1.46-1.1-2.78 0-1.32.69-1.97.94-2.24.24-.27.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.6.46.24.55.8 1.9.87 2.04.07.13.12.29.02.47-.09.18-.14.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.42.11.58-.07.16-.18.67-.78.85-1.05.18-.27.35-.22.6-.13.24.09 1.55.73 1.82.86.27.13.44.2.5.31.07.11.07.63-.17 1.32Z" />
  </svg>
);

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const Check = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

const Chevron = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

const MOTIVOS = [
  {
    n: "01",
    titulo: "Atividade Suspeita ou Qualidade",
    desc: "O algoritmo detectou edições recentes bruscas (mudança de nome, categoria ou endereço) e bloqueou preventivamente para evitar fraudes."
  },
  {
    n: "02",
    titulo: "Inconsistência de Endereço Físico",
    desc: "Negócios que atendem em domicílio exibindo endereço residencial ou clínicas sem placa visível na fachada sofrem suspensão imediata."
  },
  {
    n: "03",
    titulo: "Excesso de Palavras-chave no Nome",
    desc: "Inserir termos como 'Dentista Barato em SP' ou 'Melhor Advogado' no nome do perfil viola expressamente as diretrizes de integridade do Google."
  },
  {
    n: "04",
    titulo: "Perfis Duplicados ou Conflito",
    desc: "Criação de mais de um perfil para o mesmo CNPJ, endereço ou telefone, gerando desativação automática de ambas as fichas."
  }
];

const ETAPAS = [
  {
    passo: "1",
    titulo: "Diagnóstico da Causa Raiz",
    desc: "Identifico com precisão cirúrgica qual diretriz oficial do Google foi violada para não enviar contestação com dados errados."
  },
  {
    passo: "2",
    titulo: "Adequação Cadastral Prévia",
    desc: "Corrijo os dados internos do perfil antes de acionar o suporte, pois contestar um perfil ainda em desconformidade resulta em negação definitiva."
  },
  {
    passo: "3",
    titulo: "Montagem do Dossiê Probatório",
    desc: "Reúno e organizo a documentação oficial da empresa: Cartão CNPJ, contrato de locação/social, contas de consumo em nome da empresa e fotos georreferenciadas."
  },
  {
    passo: "4",
    titulo: "Protocolo de Contestação Oficial",
    desc: "Submeto a apelação técnica diretamente ao canal de engenharia de suporte do Google e acompanho o processo até a reativação da ficha."
  }
];

const FAQ = [
  {
    q: "Quanto tempo demora para o Google reativar o perfil suspenso?",
    a: "Após a submissão correta do dossiê comprobatório, o time de conformidade do Google costuma responder e liberar a ficha entre 3 a 14 dias úteis, dependendo do volume de solicitações na fila do suporte."
  },
  {
    q: "Vale a pena criar um perfil novo do zero em vez de recuperar?",
    a: "Não! Criar uma nova ficha para uma empresa já suspensa configura infração grave de evasão de diretrizes e duplicidade. O novo perfil será suspenso rapidamente e você perderá todas as avaliações, fotos e tempo de autoridade da ficha original."
  },
  {
    q: "Eu perco as avaliações que já tinha conquistado?",
    a: "Não. Quando o processo de contestação é aprovado pelo Google, todo o histórico do perfil é restaurado intacto: notas, avaliações dos clientes, fotos e posicionamento geográfico."
  },
  {
    q: "Qualquer tipo de suspensão pode ser recuperada?",
    a: "A imensa maioria das suspensões por 'Atividade suspeita' ou 'Diretrizes de qualidade' é perfeitamente reversível quando provamos a legitimidade do negócio com documentação idônea. Apenas casos de empresas fantasmas ou negócios proibidos sofrem negação irrecorrível."
  },
  {
    q: "Como funciona o seu atendimento para perfis suspensos?",
    a: "O atendimento é feito diretamente comigo no WhatsApp. Analiso a notificação de suspensão do Google, verifico os documentos disponíveis e conduzo todo o processo técnico de regularização."
  }
];

export default function RecuperarPerfilSuspenso() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a
      }
    }))
  };

  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Recuperação de Perfil Suspenso no Google Meu Negócio",
    provider: {
      "@type": "Person",
      name: "Leonardo Brasil",
      jobTitle: "Especialista em Google Meu Negócio",
      url: "https://leonardobrasil.com.br"
    },
    areaServed: "BR",
    description: "Serviço especializado de auditoria, ajuste de diretrizes e contestação técnica para reativação de fichas e perfis suspensos no Google Maps."
  };

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title="Recuperação de Perfil Suspenso no Google Meu Negócio | Leonardo Brasil"
        description="Perfil da Empresa no Google suspenso ou desativado? Recupere sua ficha no Google Maps com auditoria técnica, adequação de diretrizes e contestação oficial."
        canonicalUrl="https://leonardobrasil.com.br/recuperar-perfil-suspenso-google"
        schema={[schemaFaq, schemaService]}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight hover:text-accent transition-colors">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/15 border border-accent/30">
              <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none">
                <rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" />
                <rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" />
                <rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" />
              </svg>
            </span>
            Leonardo Brasil
          </Link>
          <nav className="flex gap-6 items-center">
            <Link to="/google-meu-negocio" className="text-sm font-bold text-accent hover:text-accent-300 transition-colors">
              Google Meu Negócio
            </Link>
            <Link to="/" className="text-sm font-medium text-muted hover:text-text transition-colors">
              Início
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/15 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/30 mb-6">
              Serviço Especializado de Desbloqueio e Reativação
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-text">
              Perfil no Google <span className="text-red-400">Suspenso ou Desativado</span>?<br />
              Recupere suas ligações e clientes locais.
            </h1>
            <p className="mt-6 text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Quando sua ficha sai do ar, você some do Google Maps e perde vendas todos os dias. Eu realizo a análise técnica das diretrizes violadas, monto o dossiê probatório oficial e protocolo a contestação para restaurar seu perfil.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25 hover:scale-105 active:scale-95"
              >
                <WhatsApp className="w-5 h-5" />
                Falar com Leonardo para Recuperar meu Perfil
              </a>
              <a
                href="#processo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-line-strong px-7 py-4 text-base font-semibold text-text hover:bg-panel transition-colors rounded-full"
              >
                Como funciona o processo
              </a>
            </div>
            <p className="mt-4 text-xs text-muted">
              Atendimento ágil e sigiloso diretamente comigo pelo WhatsApp.
            </p>
          </div>
        </section>

        {/* MOTIVOS COMUNS */}
        <section className="py-20 border-b border-line bg-panel/30">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">Diagnóstico Preventivo</span>
              <h2 className="text-3xl sm:text-4xl font-black text-text mt-2">Por que o Google suspendeu seu perfil?</h2>
              <p className="mt-3 text-muted text-sm sm:text-base">
                O Google não costuma explicar claramente o motivo. Estas são as 4 causas que mais derrubam empresas:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {MOTIVOS.map((m) => (
                <div key={m.n} className="p-7 rounded-2xl border border-line bg-ink hover:border-red-500/40 transition-colors">
                  <span className="text-xs font-black text-red-400">{m.n}</span>
                  <h3 className="text-lg font-bold text-text mt-2 mb-2">{m.titulo}</h3>
                  <p className="text-sm text-muted leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESSO DE REATIVAÇÃO */}
        <section id="processo" className="py-20 border-b border-line">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Método de Reativação</span>
              <h2 className="text-3xl sm:text-4xl font-black text-text mt-2">Como conduzo a recuperação técnica</h2>
              <p className="mt-3 text-muted text-sm sm:text-base">
                Nunca envie uma contestação sem antes corrigir a ficha. O Google rejeita contestações repetidas sem prova.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ETAPAS.map((e) => (
                <div key={e.passo} className="p-6 rounded-2xl border border-line bg-panel flex flex-col justify-between">
                  <div>
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent/20 text-accent font-black text-sm mb-4">
                      {e.passo}
                    </span>
                    <h3 className="font-bold text-base text-text mb-2">{e.titulo}</h3>
                    <p className="text-xs text-muted leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AVISO IMPORTANTE */}
            <div className="mt-12 rounded-2xl border border-gold/30 bg-gold/5 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <h4 className="font-bold text-text text-sm">Não tente criar um perfil novo!</h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Criar um novo perfil no mesmo endereço, telefone ou com o mesmo CNPJ é interpretado pelo Google como tentativa deliberada de contornar a punição. Além de perder todas as avaliações da ficha antiga, o novo perfil também será suspenso.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 border-b border-line bg-panel/30">
          <div className="mx-auto max-w-3xl px-5">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Tira-Dúvidas</span>
              <h2 className="text-3xl font-black text-text mt-2">Perguntas Frequentes sobre Suspensão</h2>
            </div>

            <div className="space-y-4">
              {FAQ.map((f, i) => (
                <div key={f.q} className="rounded-2xl border border-line bg-ink overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 hover:text-accent transition-colors"
                  >
                    <span>{f.q}</span>
                    <span className={`transition-transform duration-200 ${openFaq === i ? "rotate-180 text-accent" : "text-muted"}`}>
                      <Chevron className="w-5 h-5" />
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-muted leading-relaxed border-t border-line/50 pt-4">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-ink text-center">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-text">
              Precisa da ficha ativa para voltar a faturar?
            </h2>
            <p className="mt-4 text-muted text-base sm:text-lg max-w-xl mx-auto">
              Me envie uma mensagem no WhatsApp com o nome da sua empresa e o print da notificação de suspensão para iniciarmos a avaliação técnica imediata.
            </p>
            <div className="mt-8">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-accent text-white font-black text-base px-9 py-4 rounded-full hover:bg-accent-600 transition-all shadow-2xl shadow-accent/30 hover:scale-105 active:scale-95"
              >
                <WhatsApp className="w-5 h-5" />
                Avaliar meu Perfil Suspenso no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
