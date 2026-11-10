import { readFile } from "node:fs/promises";
import ts from "typescript";
import test from "node:test";
import assert from "node:assert/strict";

const raw = await readFile(new URL("../src/components/RouteAnnouncementBar.tsx", import.meta.url), "utf8");
const runnableSource = `
let currentPathname = "/";
const React = { createElement: (type) => ({ type }) };
const useLocation = () => ({ pathname: currentPathname });
const AnnouncementBar = () => "ANNOUNCEMENT_BAR";
${raw
  .replace(/import\s+\{\s*useLocation\s*\}\s+from\s+["']\.\.\/lib\/local-router["'];?/, "")
  .replace(/import\s+\{\s*AnnouncementBar\s*\}\s+from\s+["']\.\/AnnouncementBar["'];?/, "")}
export function __setPathname(p) { currentPathname = p; }
`;

const compiled = ts.transpileModule(runnableSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.React },
}).outputText;

const mod = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("shouldHideAnnouncement hides banner on private presentation and all /crm routes while keeping public site", () => {
  assert.equal(mod.shouldHideAnnouncement("/porto-alegre-digital"), true);
  assert.equal(mod.shouldHideAnnouncement("/crm"), true);
  assert.equal(mod.shouldHideAnnouncement("/crm/login"), true);
  assert.equal(mod.shouldHideAnnouncement("/crm/dashboard"), true);
  assert.equal(mod.shouldHideAnnouncement("/crm/clientes"), true);
  assert.equal(mod.shouldHideAnnouncement("/crm/clientes/angelo-car"), true);
  assert.equal(mod.shouldHideAnnouncement("/"), false);
  assert.equal(mod.shouldHideAnnouncement("/auditoria-perfil-google"), false);
  assert.equal(mod.shouldHideAnnouncement("/crm-info"), false);

  mod.__setPathname("/crm/clientes/angelo-car");
  assert.equal(mod.RouteAnnouncementBar(), null);

  mod.__setPathname("/");
  assert.notEqual(mod.RouteAnnouncementBar(), null);
});
