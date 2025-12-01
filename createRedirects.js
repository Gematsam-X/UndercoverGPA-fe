const fs = require("fs");
const path = require("path");

const distFolder = path.join(
  process.cwd(),
  "dist",
  "UndercoverGPA-fe",
  "browser"
);
const redirectsPath = path.join(distFolder, "_redirects");
const redirectsContent = "/* /index.html 200\n";

if (!fs.existsSync(distFolder)) {
  console.error(`❌ Cartella di build non trovata: ${distFolder}`);
  process.exit(1);
}

fs.writeFileSync(redirectsPath, redirectsContent, "utf8");
console.log(`✅ File _redirects creato in: ${redirectsPath}`);
