
const express = require("express");

const app = express();
const PORTTI = 3000;

// Etusivu
app.get("/", (pyynto, vastaus) => {
  vastaus.send("<h1>Palvelin toimii Mahtavasti!!</h1>");
});

// 1. Tervehdi käyttäjää nimellä
app.get("/tervehdi/:nimi", (pyynto, vastaus) => {
  vastaus.send(`Hei ${pyynto.params.nimi}!`);
});

// 2. Laske kahden luvun summa
app.get("/laske", (pyynto, vastaus) => {
  const a = Number(pyynto.query.a);
  const b = Number(pyynto.query.b);

  vastaus.json({ summa: a + b });
});

// Uuden tuotteen reitti (ensin tarkempi reitti)
app.get("/tuotteet/uusi", (pyynto, vastaus) => {
  vastaus.send("Uusi tuote");
});

// 3. Tuotteen tunniste
app.get("/tuotteet/:id", (pyynto, vastaus) => {
  vastaus.send(`Tuotteen tunniste on ${pyynto.params.id}`);
});

// Käynnistä palvelin
app.listen(PORTTI, () => {
  console.log(`Palvelin osoitteessa http://localhost:${PORTTI}`);
});


