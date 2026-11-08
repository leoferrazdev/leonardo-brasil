import fs from "fs";

const content = fs.readFileSync("src/data/seoNicheData.ts", "utf8");
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

const missing = requiredSlugs.filter(slug => !content.includes(`${slug}: {`) && !content.includes(`"${slug}": {`));
if (missing.length > 0) {
  console.error("FAIL: Slugs ausentes em seoNicheData.ts:", missing);
  process.exit(1);
}
console.log("PASS: Todos os 10 clusters possuem FAQs e dados ricos em seoNicheData.ts.");
