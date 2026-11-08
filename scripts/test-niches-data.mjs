import fs from "fs";

const content = fs.readFileSync("src/data/niches.ts", "utf8");
const requiredSlugs = [
  "eletricistas",
  "pedreiros",
  "guinchos",
  "assistencia-celulares",
  "manutencao-computadores",
  "oficinas-mecanicas",
  "clinicas-veterinarias",
  "pet-shops",
  "agropecuarias",
  "restaurantes"
];

const missing = requiredSlugs.filter(slug => !content.includes(`slug: "${slug}"`));
if (missing.length > 0) {
  console.error("FAIL: Slugs ausentes em niches.ts:", missing);
  process.exit(1);
}
console.log("PASS: Todos os 10 clusters estão declarados em niches.ts.");
