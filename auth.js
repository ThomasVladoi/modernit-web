const fs = require("fs");
const path = require("path");

const avaimet = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "avaimet.json"), "utf8")
);

function tarkistaApiAvain(pyynto, vastaus, seuraava) {
  const avain = pyynto.header("X-API-Avain");

  const kayttaja = avaimet.find((a) => a.key === avain);

  if (!kayttaja) {
    return vastaus.status(401).json({
      virhe: "Puuttuva tai virheellinen API-avain",
    });
  }

  pyynto.kayttaja = kayttaja;
  seuraava();
}

module.exports = { tarkistaApiAvain };