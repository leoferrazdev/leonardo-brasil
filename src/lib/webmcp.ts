export interface SiteTool {
  name: string;
  description: string;
  inputSchema: { type: "object"; properties: Record<string, never>; additionalProperties: false };
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown, options?: { signal: AbortSignal }) => Promise<unknown>;
}

export interface ModelContext {
  registerTool: (tool: SiteTool, options: { signal: AbortSignal }) => Promise<void> | void;
  unregisterTool?: (name: string) => void;
}

type ContextHost = { modelContext?: ModelContext };
const origin = "https://leonardobrasil.com.br";

export function createSiteTools(navigate: (path: string) => void, fetcher: typeof fetch = fetch): SiteTool[] {
  const inputSchema = { type: "object" as const, properties: {}, additionalProperties: false as const };
  const result = (value: unknown) => ({ content: [{ type: "text", text: JSON.stringify(value) }] });
  return [
    {
      name: "consultar_servicos",
      description: "Consulta os serviços públicos e links oficiais de Leonardo Brasil sobre Google Meu Negócio e SEO Local.",
      inputSchema, annotations: { readOnlyHint: true },
      execute: async () => result({ servicos: [
        { nome: "Google Meu Negócio e SEO Local", url: `${origin}/google-meu-negocio` },
        { nome: "Otimização do perfil", url: `${origin}/otimizacao-google-meu-negocio` },
        { nome: "Recuperação de perfil suspenso", url: `${origin}/recuperar-perfil-suspenso-google` },
        { nome: "Diagnóstico interativo", url: `${origin}/auditoria-perfil-google` }
      ] })
    },
    {
      name: "abrir_diagnostico",
      description: "Navega nesta aba para o diagnóstico interativo do perfil Google. Não responde às perguntas nem envia mensagens.",
      inputSchema, annotations: { readOnlyHint: false },
      execute: async () => {
        navigate("/auditoria-perfil-google");
        return result({ url: `${origin}/auditoria-perfil-google`, status: "diagnostico_aberto" });
      }
    },
    {
      name: "consultar_catalogo_apis",
      description: "Consulta o catálogo público de APIs e retorna links de especificação, documentação e saúde. Não executa operações da API.",
      inputSchema, annotations: { readOnlyHint: true },
      execute: async (_input, options) => {
        const response = await fetcher("/.well-known/api-catalog", { signal: options?.signal, credentials: "omit" });
        if (!response.ok || !response.headers.get("content-type")?.includes("json")) {
          throw new Error("Catálogo de APIs indisponível.");
        }
        const catalog: unknown = await response.json();
        if (!catalog || typeof catalog !== "object" || !("linkset" in catalog) || !Array.isArray(catalog.linkset)) {
          throw new Error("Formato do catálogo de APIs inválido.");
        }
        return result(catalog);
      }
    }
  ];
}

export function registerSiteTools(documentHost: ContextHost, navigatorHost: ContextHost, tools: SiteTool[]): () => void {
  const context = typeof documentHost.modelContext?.registerTool === "function"
    ? documentHost.modelContext : navigatorHost.modelContext;
  if (!context || typeof context.registerTool !== "function") return () => {};
  const controller = new AbortController();
  const legacy = context === navigatorHost.modelContext && context !== documentHost.modelContext;
  const registered = new Set<string>();
  for (const tool of tools) {
    try {
      const pending = context.registerTool(tool, { signal: controller.signal });
      // Implementações antigas retornam void e usam unregisterTool.
      if (pending === undefined) {
        registered.add(tool.name);
        continue;
      }
      void Promise.resolve(pending).then(() => {
        if (controller.signal.aborted) {
          if (legacy) context.unregisterTool?.(tool.name);
        } else registered.add(tool.name);
      }).catch(() => { /* WebMCP opcional: uma falha não interrompe o site. */ });
    } catch { /* API experimental indisponível ou registro recusado. */ }
  }
  return () => {
    controller.abort();
    if (legacy) for (const name of registered) {
      try { context.unregisterTool?.(name); } catch { /* Já removida. */ }
    }
  };
}

export function getBrowserContextHosts(): [ContextHost, ContextHost] {
  return [document as Document & ContextHost, navigator as Navigator & ContextHost];
}
