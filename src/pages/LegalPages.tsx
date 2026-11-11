// Páginas jurídicas PÚBLICAS exigidas pela Meta (e boas práticas LGPD):
// Termos de Serviço, Política de Privacidade e Instruções de Exclusão de Dados.
// URLs fixas, sem login: /termos, /privacidade, /exclusao-de-dados (ver main.tsx).
// Site de marca pessoal (sem contas de usuário/CRM) — o contato ocorre via WhatsApp.

import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const COMPANY = {
  brand: "Leonardo Brasil",
  legalName: "LEONARDO FERRAZ DA SILVA BRASIL",
  cnpj: "65.993.728/0001-07",
  email: "contato@leonardobrasil.com.br",
  site: "https://leonardobrasil.com.br",
};

const LAST_UPDATE = "12 de julho de 2026";

function Mark() {
  return (
    <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none" aria-hidden="true">
      <rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" />
      <rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" />
      <rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" />
    </svg>
  );
}

function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-ink text-text flex flex-col font-sans">
      <SeoHead title={title} canonicalUrl={`https://leonardobrasil.com.br${pathname}`} />
      <header className="sticky top-0 z-40 w-full border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/15 border border-accent/30"><Mark /></span>
            Leonardo Brasil
          </Link>
          <nav className="flex flex-wrap gap-4 sm:gap-6 items-center">
            <Link to="/auditoria-perfil-google" className="text-sm font-bold text-accent-400 hover:text-accent-300 transition-colors">Raio-X do Perfil</Link>
            <Link to="/about" className="text-sm font-medium text-muted hover:text-text transition-colors">Sobre</Link>
            <Link to="/contact" className="text-sm font-medium text-muted hover:text-text transition-colors">Contato</Link>
            <Link to="/docs" className="text-sm font-medium text-muted hover:text-text transition-colors">API Docs</Link>
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-text transition-colors">
              Voltar ao site
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{title}</h1>
          <p className="text-sm text-muted mb-10">Última atualização: {LAST_UPDATE}</p>
          <div className="space-y-6 text-sm md:text-base leading-relaxed text-muted">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-xl md:text-2xl font-bold text-text pt-4">{children}</h2>;
}
function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}
function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2">{children}</ul>;
}

const mail = <a href={`mailto:${COMPANY.email}`} className="text-accent hover:underline">{COMPANY.email}</a>;

export function PrivacyPage() {
  return (
    <LegalLayout title="Política de Privacidade">
      <P>
        Esta Política de Privacidade descreve como {COMPANY.legalName}, inscrito no CNPJ nº {COMPANY.cnpj}
        (marca "{COMPANY.brand}", doravante "nós"), coleta, usa, armazena, compartilha e protege dados
        pessoais no site {COMPANY.site}, em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção
        de Dados — LGPD) e com as políticas da Meta Platforms, Inc. aplicáveis.
      </P>
      <P>Ao utilizar o site e nossos canais de contato, você declara estar ciente e de acordo com esta Política.</P>

      <H2>1. Controlador dos dados</H2>
      <P>
        O controlador é {COMPANY.legalName}, CNPJ {COMPANY.cnpj}. Para qualquer questão sobre privacidade e
        proteção de dados, entre em contato pelo e-mail {mail}.
      </P>

      <H2>2. Dados que coletamos</H2>
      <P>Este é um site institucional de marca pessoal e consultoria em SEO Local. Coletamos:</P>
      <UL>
        <li>
          <strong>Dados de contato que você nos envia</strong> — ao clicar em nossos botões de WhatsApp ou
          nos contatar, você pode nos fornecer nome, número de telefone/WhatsApp, e-mail e o conteúdo das
          mensagens e informações que voluntariamente compartilhar sobre o seu negócio;
        </li>
        <li>
          <strong>API pública e sandbox OAuth 2.0 (`/api/v1/*`)</strong> — os tokens sandbox emitidos em{" "}
          <code className="text-text">/api/v1/oauth/sandbox-clients</code> utilizam assinatura stateless (HMAC-SHA256) e não armazenam dados pessoais de clientes finais em banco de dados permanente;
        </li>
        <li>
          <strong>Dados de navegação e técnicos</strong> — endereço IP, tipo de navegador e dispositivo,
          páginas visitadas e registros de acesso, coletados por cookies e tecnologias similares;
        </li>
        <li>
          <strong>Dados de medição e marketing (quando utilizados)</strong> — quando ativados, cookies e
          pixels de terceiros (por exemplo, <strong>Meta Pixel</strong> e ferramentas de analytics) para
          medir o desempenho de anúncios, entender o uso do site e realizar remarketing.
        </li>
      </UL>

      <H2>3. Finalidades e bases legais</H2>
      <UL>
        <li>
          <strong>Responder ao seu contato e prestar os serviços</strong> (procedimentos preliminares e
          execução de contrato — art. 7º, V, LGPD);
        </li>
        <li>
          <strong>Legítimo interesse</strong> (art. 7º, IX) — segurança do site, prevenção a fraudes,
          melhoria da experiência e comunicação comercial pertinente;
        </li>
        <li>
          <strong>Consentimento</strong> (art. 7º, I) — para cookies de marketing/medição e comunicações,
          quando aplicável, podendo ser revogado a qualquer momento;
        </li>
        <li><strong>Cumprimento de obrigação legal</strong> (art. 7º, II), quando exigido.</li>
      </UL>

      <H2>4. Compartilhamento de dados</H2>
      <P>Não vendemos dados pessoais. Compartilhamos apenas com prestadores necessários ao funcionamento:</P>
      <UL>
        <li><strong>Meta Platforms, Inc.</strong> — o contato por WhatsApp ocorre na plataforma da Meta, sujeita à privacidade da própria Meta; e, quando utilizados, o Meta Pixel/anúncios para medição e remarketing;</li>
        <li>Ferramentas de <strong>analytics</strong> (quando utilizadas), para estatísticas de uso;</li>
        <li>Provedor de <strong>hospedagem</strong> do site;</li>
        <li>Autoridades públicas, quando exigido por lei ou ordem judicial.</li>
      </UL>

      <H2>5. Armazenamento, segurança e transferência internacional</H2>
      <P>
        Adotamos medidas técnicas e organizacionais para proteger os dados, incluindo criptografia em
        trânsito (HTTPS/TLS) e controle de acesso. Alguns prestadores podem armazenar dados em servidores
        fora do Brasil; nesses casos, observamos os requisitos de transferência internacional da LGPD.
      </P>

      <H2>6. Retenção</H2>
      <P>
        Mantemos os dados apenas pelo tempo necessário às finalidades desta Política ou pelo prazo exigido
        por lei. Atendida a solicitação de exclusão, os dados são eliminados ou anonimizados, salvo hipóteses
        de guarda obrigatória.
      </P>

      <H2>7. Direitos do titular (LGPD)</H2>
      <P>A qualquer momento, você pode:</P>
      <UL>
        <li>Confirmar a existência de tratamento e acessar seus dados;</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>Solicitar a portabilidade;</li>
        <li>Revogar o consentimento e opor-se a tratamento baseado em legítimo interesse.</li>
      </UL>

      <H2>8. Como excluir seus dados</H2>
      <P>
        Você pode solicitar a exclusão dos seus dados a qualquer momento — veja as{" "}
        <Link to="/exclusao-de-dados" className="text-accent hover:underline">Instruções de Exclusão de Dados</Link>{" "}
        ou escreva para {mail} com o assunto "Exclusão de dados".
      </P>

      <H2>9. Cookies</H2>
      <P>
        Utilizamos cookies necessários ao funcionamento do site e, quando ativados, cookies de medição e
        marketing (incluindo o Meta Pixel). Você pode gerenciá-los nas configurações do seu navegador; a
        desativação de alguns cookies pode afetar a experiência.
      </P>

      <H2>10. Menores de idade</H2>
      <P>O site é destinado a profissionais e empresas. Não coletamos intencionalmente dados de menores de 18 anos.</P>

      <H2>11. Alterações</H2>
      <P>Podemos atualizar esta Política. A versão vigente estará sempre nesta página, com a data no topo.</P>

      <H2>12. Contato</H2>
      <P>Para exercer seus direitos ou tirar dúvidas, escreva para {mail}.</P>
    </LegalLayout>
  );
}

export function DataDeletionPage() {
  return (
    <LegalLayout title="Exclusão de Dados">
      <P>
        Nós, de {COMPANY.legalName} (CNPJ nº {COMPANY.cnpj}, marca "{COMPANY.brand}"), respeitamos o seu
        direito de controlar seus dados. Esta página explica como solicitar a exclusão dos dados que você
        compartilhou conosco pelo site {COMPANY.site} e por nossos canais de contato, incluindo o WhatsApp.
      </P>

      <H2>1. Quais dados podem ser excluídos</H2>
      <UL>
        <li>Dados de contato que você nos enviou (nome, telefone/WhatsApp, e-mail e mensagens);</li>
        <li>Informações sobre o seu negócio que você tenha compartilhado;</li>
        <li>Dados de navegação/medição associados ao seu acesso (cookies e identificadores).</li>
      </UL>

      <H2>2. Como solicitar a exclusão</H2>
      <UL>
        <li>Envie um e-mail para {mail} (de preferência do e-mail que você usou para nos contatar);</li>
        <li>Use o assunto: <strong>"Exclusão de dados"</strong>;</li>
        <li>Informe seu nome e o número de WhatsApp usado no contato, para localizarmos seus dados.</li>
      </UL>
      <P>
        Também é possível pedir a exclusão diretamente pela conversa de WhatsApp que você iniciou conosco.
        Após confirmarmos sua identidade, removeremos ou anonimizaremos seus dados no prazo abaixo.
      </P>

      <H2>3. Prazo</H2>
      <P>As solicitações são atendidas em até 30 (trinta) dias, contados da confirmação da sua identidade, ressalvadas hipóteses de guarda obrigatória por lei.</P>

      <H2>4. Contato</H2>
      <P>
        Dúvidas sobre a exclusão? Escreva para {mail}. Veja também a{" "}
        <Link to="/privacidade" className="text-accent hover:underline">Política de Privacidade</Link>.
      </P>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout title="Termos de Serviço">
      <P>
        Estes Termos regem o uso do site {COMPANY.site} e dos serviços oferecidos por {COMPANY.legalName},
        CNPJ nº {COMPANY.cnpj} (marca "{COMPANY.brand}"). Ao utilizar o site ou nos contatar, você concorda
        com estes Termos.
      </P>

      <H2>1. O que oferecemos</H2>
      <P>
        {COMPANY.brand} é uma marca pessoal de consultoria especializada em <strong>Google Meu Negócio e SEO
        Local</strong> (otimização de perfil no Google Maps, posicionamento orgânico e atração de clientes locais). O site apresenta os serviços e permite que
        você entre em contato — principalmente por WhatsApp — para um diagnóstico gratuito e para conhecer os serviços.
        Escopo, condições e valores de eventuais serviços são combinados diretamente no atendimento.
      </P>

      <H2>2. Uso do site</H2>
      <UL>
        <li>Navegar e nos contatar não exige cadastro nem conta;</li>
        <li>Você concorda em fornecer informações verdadeiras ao nos contatar;</li>
        <li>É proibido usar o site para fins ilícitos, enviar conteúdo ofensivo/enganoso, ou tentar comprometer sua segurança e disponibilidade.</li>
      </UL>

      <H2>3. Contato por WhatsApp e Meta</H2>
      <P>
        Ao nos contatar pelo WhatsApp, a conversa ocorre na plataforma da Meta e está sujeita aos termos e
        políticas da própria Meta/WhatsApp. Você é responsável pelas informações que compartilhar nesse canal.
      </P>

      <H2>4. Propriedade intelectual</H2>
      <P>
        Marca, textos, layout e demais elementos do site são de titularidade de {COMPANY.legalName} ou de
        seus licenciadores, protegidos pela legislação aplicável. É vedada a cópia ou o uso não autorizado.
      </P>

      <H2>5. Privacidade</H2>
      <P>
        O tratamento de dados pessoais é regido pela nossa{" "}
        <Link to="/privacidade" className="text-accent hover:underline">Política de Privacidade</Link>, que integra estes Termos.
      </P>

      <H2>6. Limitação de responsabilidade</H2>
      <P>
        O site é fornecido "no estado em que se encontra". Na máxima extensão permitida em lei, não nos
        responsabilizamos por danos indiretos ou por indisponibilidades de serviços de terceiros (incluindo
        Meta/WhatsApp e hospedagem). Empregamos esforços razoáveis para manter o site disponível e seguro.
      </P>

      <H2>7. Lei aplicável e foro</H2>
      <P>
        Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro do
        domicílio do usuário para dirimir controvérsias, salvo disposição legal em contrário.
      </P>

      <H2>8. Contato</H2>
      <P>Dúvidas sobre estes Termos? Escreva para {mail}.</P>
    </LegalLayout>
  );
}
