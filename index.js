
const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { tarkistaApiAvain } = require("./auth");

const app = express();
const PORTTI = 3000;

app.use(express.json());

// Varaustiedoston sijainti
const varauksetPolku = path.join(
  __dirname,
  "data",
  "varaukset.json"
);

// Lue varaukset tiedostosta
function lueVaraukset() {
  return JSON.parse(fs.readFileSync(varauksetPolku, "utf8"));
}

// Tallenna varaukset tiedostoon
function tallennaVaraukset(data) {
  fs.writeFileSync(
    varauksetPolku,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

// Etusivu
app.get("/", (pyynto, vastaus) => {
  vastaus.send("<h1>Palvelin toimii Mahtavasti!!</h1>");
});

// Tervehdi käyttäjää
app.get("/tervehdi/:nimi", (pyynto, vastaus) => {
  vastaus.send(`Hei ${pyynto.params.nimi}!`);
});

// Laske kahden luvun summa
app.get("/laske", (pyynto, vastaus) => {
  const a = Number(pyynto.query.a);
  const b = Number(pyynto.query.b);

  vastaus.json({ summa: a + b });
});

// Uusi tuote
app.get("/tuotteet/uusi", (pyynto, vastaus) => {
  vastaus.send("Uusi tuote");
});

// Tuotteen tunniste
app.get("/tuotteet/:id", (pyynto, vastaus) => {
  vastaus.send(`Tuotteen tunniste on ${pyynto.params.id}`);
});

// Hae tilat ja varaukset (avoin reitti)
app.get("/varaukset", (pyynto, vastaus) => {
  const data = lueVaraukset();
  vastaus.json(data);
});

// Luo uusi varaus (vaatii API-avaimen)
app.post("/varaukset", tarkistaApiAvain, (pyynto, vastaus) => {
  const { tila, alku, loppu, aihe } = pyynto.body;

  if (!tila || !alku || !loppu || !aihe) {
    return vastaus.status(400).json({
      virhe: "Varauksesta puuttuu pakollisia tietoja"
    });
  }

  const data = lueVaraukset();

  const uusiVaraus = {
    id: crypto.randomUUID(),
    tila,
    alku,
    loppu,
    varaaja: pyynto.kayttaja.name,
    aihe
  };

  data.varaukset.push(uusiVaraus);
  tallennaVaraukset(data);

  vastaus.status(201).json(uusiVaraus);
});

// Poista varaus (vaatii API-avaimen)
app.delete(
  "/varaukset/:id",
  tarkistaApiAvain,
  (pyynto, vastaus) => {
    const data = lueVaraukset();

    const indeksi = data.varaukset.findIndex(
      (varaus) => varaus.id === pyynto.params.id
    );

    if (indeksi === -1) {
      return vastaus.status(404).json({
        virhe: "Varausta ei löydy"
      });
    }

    const varaus = data.varaukset[indeksi];

    // Ylläpitäjä saa poistaa kaikki varaukset.
    // Tavallinen käyttäjä saa poistaa vain omansa.
    if (
      pyynto.kayttaja.role !== "yllapitaja" &&
      varaus.varaaja !== pyynto.kayttaja.name
    ) {
      return vastaus.status(403).json({
        virhe: "Et voi poistaa toisen käyttäjän varausta"
      });
    }

    data.varaukset.splice(indeksi, 1);
    tallennaVaraukset(data);

    vastaus.status(204).end();
  }
);

// Käynnistä palvelin
app.listen(PORTTI, () => {
  console.log(`Palvelin osoitteessa http://localhost:${PORTTI}`);
});


