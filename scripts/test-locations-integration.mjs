import fs from "fs";

const locData = JSON.parse(fs.readFileSync("src/data/seoLocations.json", "utf8"));
const landingCode = fs.readFileSync("src/pages/GoogleMeuNegocioLocalLanding.tsx", "utf8");

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

const missingInLoc = requiredSlugs.filter(slug => !locData.NICHES.some(n => n.slug === slug));
if (missingInLoc.length > 0) {
  console.error("FAIL: Slugs ausentes em seoLocations.json:", missingInLoc);
  process.exit(1);
}

const missingInFormat = requiredSlugs.filter(slug => !landingCode.includes(`"${slug}"`));
if (missingInFormat.length > 0) {
  console.error("FAIL: Slugs ausentes no formatNiche de GoogleMeuNegocioLocalLanding.tsx:", missingInFormat);
  process.exit(1);
}

console.log("PASS: Malha de locais e formatters 100% sincronizados.");
