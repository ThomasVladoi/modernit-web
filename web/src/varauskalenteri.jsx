
import { useEffect, useState } from 'react';
import { haeTilat, haeVaraukset, lisaaVaraus, poistaVaraus } from './api';

export default function Varauskalenteri() {
  const [tilat, setTilat] = useState([]);
  const [tila, setTila] = useState('');
  const [paiva, setPaiva] = useState(
    new Date().toLocaleDateString('sv-SE')
  );
  const [varaukset, setVaraukset] = useState([]);
  const [varaaja, setVaraaja] = useState('');
  const [aihe, setAihe] = useState('');
  const [alku, setAlku] = useState('');
  const [loppu, setLoppu] = useState('');
  const [virhe, setVirhe] = useState('');
  const [viesti, setViesti] = useState('');
  const [lataa, setLataa] = useState(false);

  useEffect(() => {
    haeTilat()
      .then((data) => {
        setTilat(data);
        if (data.length > 0) setTila(data[0].id);
      })
      .catch((error) => setVirhe(error.message));
  }, []);

  async function paivitaVaraukset() {
    if (!tila || !paiva) return;

    setLataa(true);
    try {
      const data = await haeVaraukset(tila, paiva);
      setVaraukset(data);
      setVirhe('');
    } catch (error) {
      setVirhe(error.message);
    } finally {
      setLataa(false);
    }
  }

  useEffect(() => {
    paivitaVaraukset();
  }, [tila, paiva]);

  async function teeVaraus(event) {
    event.preventDefault();
    setVirhe('');
    setViesti('');

    try {
      await lisaaVaraus({
        tila,
        alku,
        loppu,
        varaaja,
        aihe,
      });

      setViesti('Varaus onnistui!');
      setVaraaja('');
      setAihe('');
      setAlku('');
      setLoppu('');
      await paivitaVaraukset();
    } catch (error) {
      setVirhe(error.message);
    }
  }

  async function poista(id) {
    if (!window.confirm('Haluatko varmasti poistaa varauksen?')) return;

    try {
      await poistaVaraus(id);
      setViesti('Varaus poistettu.');
      await paivitaVaraukset();
    } catch (error) {
      setVirhe(error.message);
    }
  }

  const valittuTila = tilat.find((t) => t.id === tila);

  return (
    <main className="kalenteri">
      <h1>Tilavarauskalenteri</h1>
      <p>Valitse tila ja päivä nähdäksesi varaukset.</p>

      <section className="valinnat">
        <label>
          Valitse tila
          <select value={tila} onChange={(e) => setTila(e.target.value)}>
            {tilat.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nimi} ({t.id})
              </option>
            ))}
          </select>
        </label>

        <label>
          Valitse päivä
          <input
            type="date"
            value={paiva}
            onChange={(e) => setPaiva(e.target.value)}
          />
        </label>
      </section>

      {valittuTila && (
        <section className="tilatiedot">
          <h2>{valittuTila.nimi}</h2>
          <p>Paikkoja: {valittuTila.paikkoja}</p>
          <p>
            Aukioloajat: {valittuTila.aukeaa}–{valittuTila.sulkeutuu}
          </p>
        </section>
      )}

      <section>
        <h2>Varaukset</h2>

        {lataa && <p>Haetaan varauksia...</p>}

        {!lataa && varaukset.length === 0 && (
          <p>Ei varauksia valittuna päivänä.</p>
        )}

        {varaukset.map((v) => (
          <article className="varaus" key={v.id}>
            <div>
              <strong>
                {v.alku.slice(11, 16)}–{v.loppu.slice(11, 16)}
              </strong>
              <p>Varaaja: {v.varaaja}</p>
              {v.aihe && <p>Aihe: {v.aihe}</p>}
            </div>

            <button type="button" onClick={() => poista(v.id)}>
              Poista
            </button>
          </article>
        ))}
      </section>

      <section className="lomake">
        <h2>Tee uusi varaus</h2>

        <form onSubmit={teeVaraus}>
          <label>
            Varaajan nimi
            <input
              value={varaaja}
              onChange={(e) => setVaraaja(e.target.value)}
              required
            />
          </label>

          <label>
            Aihe
            <input
              value={aihe}
              onChange={(e) => setAihe(e.target.value)}
            />
          </label>

          <label>
            Alkamisaika
            <input
              type="datetime-local"
              value={alku}
              onChange={(e) => setAlku(e.target.value)}
              required
            />
          </label>

          <label>
            Päättymisaika
            <input
              type="datetime-local"
              value={loppu}
              onChange={(e) => setLoppu(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={!tila || !varaaja.trim()}>
            Tee varaus
          </button>
        </form>
      </section>

      {virhe && <p className="virhe">{virhe}</p>}
      {viesti && <p className="viesti">{viesti}</p>}
    </main>
  );
}
