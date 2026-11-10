import { readFile } from "node:fs/promises";
import ts from "typescript";
import test from "node:test";
import assert from "node:assert/strict";

const loginRaw = await readFile(new URL("../src/pages/crm/Login.tsx", import.meta.url), "utf8");
const detailRaw = await readFile(new URL("../src/pages/crm/ClientDetail.tsx", import.meta.url), "utf8");

const runnableLoginSource = `
const storageMap = new Map();
const localStorage = {
  getItem: (k) => (storageMap.has(k) ? storageMap.get(k) : null),
  setItem: (k, v) => storageMap.set(k, String(v)),
  removeItem: (k) => storageMap.delete(k),
  clear: () => storageMap.clear(),
};
const window = { localStorage };

let hookCursor = 0;
const hooks = [];
function useState(initial) {
  const idx = hookCursor++;
  if (!(idx in hooks)) hooks[idx] = initial;
  const setState = (next) => {
    hooks[idx] = typeof next === "function" ? next(hooks[idx]) : next;
  };
  return [hooks[idx], setState];
}

let mockAuthResponse = { data: { session: null }, error: { message: "Invalid login credentials" } };
let mockSupabaseConfigured = true;
const supabase = {
  auth: {
    signInWithPassword: async () => mockAuthResponse,
  },
};
const isSupabaseConfigured = true;

let navigatedTo = null;
const useNavigate = () => (to) => {
  navigatedTo = to;
};
const Link = (props) => ({ type: "Link", props });
const Helmet = (props) => ({ type: "Helmet", props });
const ShieldCheck = () => null;
const Lock = () => null;
const Mail = () => null;
const ArrowRight = () => null;
const Sparkles = () => null;

const toastCalls = { success: [], error: [] };
const toast = {
  success: (msg) => toastCalls.success.push(msg),
  error: (msg) => toastCalls.error.push(msg),
};

const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
};

${loginRaw
  .replace(/import\s+React,\s*\{\s*useState\s*\}\s+from\s+["']react["'];?\r?\n?/, "")
  .replace(/import\s+\{\s*useNavigate,\s*Link\s*\}\s+from\s+["']\.\.\/\.\.\/lib\/local-router["'];?\r?\n?/, "")
  .replace(/import\s+\{\s*supabase,\s*isSupabaseConfigured\s*\}\s+from\s+["']\.\.\/\.\.\/lib\/supabase["'];?\r?\n?/, "")
  .replace(/import\s+\{\s*toast\s*\}\s+from\s+["']react-hot-toast["'];?\r?\n?/, "")
  .replace(/import\s+\{\s*ShieldCheck,\s*Lock,\s*Mail,\s*ArrowRight,\s*Sparkles\s*\}\s+from\s+["']lucide-react["'];?\r?\n?/, "")
  .replace(/import\s+\{\s*Helmet\s*\}\s+from\s+["']react-helmet-async["'];?\r?\n?/, "")}

export function __reset(authResponse) {
  hookCursor = 0;
  hooks.length = 0;
  localStorage.clear();
  navigatedTo = null;
  toastCalls.success.length = 0;
  toastCalls.error.length = 0;
  mockAuthResponse = authResponse;
}

export function __render() {
  hookCursor = 0;
  return CrmLogin();
}

export function __getState() {
  return {
    offlineSession: localStorage.getItem("crm_offline_session"),
    userEmail: localStorage.getItem("crm_user_email"),
    navigatedTo,
    toastCalls: { success: [...toastCalls.success], error: [...toastCalls.error] },
  };
}
`;

const compiledLogin = ts.transpileModule(runnableLoginSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.React },
}).outputText;

const loginMod = await import(`data:text/javascript;base64,${Buffer.from(compiledLogin).toString("base64")}`);

function findNode(node, predicate) {
  if (!node || typeof node !== "object") return null;
  if (predicate(node)) return node;
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (Array.isArray(child)) {
        for (const nested of child) {
          const found = findNode(nested, predicate);
          if (found) return found;
        }
      } else {
        const found = findNode(child, predicate);
        if (found) return found;
      }
    }
  }
  if (node.props?.children) {
    const kids = Array.isArray(node.props.children) ? node.props.children : [node.props.children];
    for (const kid of kids) {
      const found = findNode(kid, predicate);
      if (found) return found;
    }
  }
  return null;
}

test("CrmLogin does NOT silently fall back to offline session when Supabase password login fails", async () => {
  loginMod.__reset({ data: { session: null }, error: { message: "Invalid login credentials" } });
  let tree = loginMod.__render();
  const emailInput = findNode(tree, (n) => n.type === "input" && n.props?.id === "email");
  const passInput = findNode(tree, (n) => n.type === "input" && n.props?.id === "password");
  assert.ok(emailInput && passInput, "email and password inputs should render");

  emailInput.props.onChange({ target: { value: "leonardoferrazbrasil@gmail.com" } });
  passInput.props.onChange({ target: { value: "wrong-password" } });

  tree = loginMod.__render();
  const form = findNode(tree, (n) => n.type === "form");
  await form.props.onSubmit({ preventDefault() {} });

  const state = loginMod.__getState();
  assert.equal(state.offlineSession, null, "failed login must not silently set crm_offline_session");
  assert.equal(state.navigatedTo, null, "failed login must not navigate into CRM");
  assert.equal(state.toastCalls.success.length, 0);
  assert.deepEqual(state.toastCalls.error, ["Falha no login: Invalid login credentials"]);
});

test("CrmLogin keeps explicit Acesso Rápido / Modo Offline Local button working", () => {
  loginMod.__reset({ data: { session: null }, error: null });
  const tree = loginMod.__render();
  const offlineBtn = findNode(
    tree,
    (n) => n.type === "button" && typeof n.props?.onClick === "function" && JSON.stringify(n.children).includes("Modo Offline Local"),
  );
  assert.ok(offlineBtn, "explicit offline button must still exist");
  offlineBtn.props.onClick();

  const state = loginMod.__getState();
  assert.equal(state.offlineSession, "true");
  assert.equal(state.navigatedTo, "/crm/dashboard");
  assert.equal(state.toastCalls.success.length, 1);
});

test("ClientDetail toolbar does not duplicate a '+' character next to Plus icons", () => {
  assert.doesNotMatch(
    detailRaw,
    /<Plus[^>]*\/>\s*\+\s*(?:Entrega \/ Versão|Item Checklist)/,
    "toolbar labels with <Plus /> icon should not repeat a literal '+'",
  );
});
