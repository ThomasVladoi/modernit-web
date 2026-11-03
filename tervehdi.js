const fs = require("node:fs");
const sisalto = fs.readFileSync("tervehdi.js", "utf-8");
console.log(`Tiedostossa on ${sisalto.length} merkkiä.`);