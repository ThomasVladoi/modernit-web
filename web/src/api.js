
const API = '/api';

// Tarkistaa vastauksen ja ilmoittaa virheestä sekä tilakoodista.
async function tarkistaVastaus(vastaus, oletus) {
  if (!vastaus.ok) {
    let data = {};

    try {
      data = await vastaus.json();
    } catch {
      // Vastauksessa ei ollut JSON-muotoista virheilmoitusta.
    }

    throw new Error(
      `${data?.virhe || oletus} (HTTP ${vastaus.status})`
    );
  }
}

export async function haeTilat() {
  const vastaus = await fetch(`${API}/tilat`);

  await tarkistaVastaus(
    vastaus,
    'Tilojen hakeminen epäonnistui.'
  );

  return vastaus.json();
}

export async function haeVaraukset(tila, paiva) {
  const parametrit = new URLSearchParams();

  if (tila) parametrit.set('tila', tila);
  if (paiva) parametrit.set('paiva', paiva);

  const vastaus = await fetch(
    `${API}/varaukset?${parametrit}`
  );

  await tarkistaVastaus(
    vastaus,
    'Varausten hakeminen epäonnistui.'
  );

  return vastaus.json();
}

export async function lisaaVaraus(varaus) {
  const vastaus = await fetch(`${API}/varaukset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(varaus),
  });

  await tarkistaVastaus(
    vastaus,
    'Varauksen lisääminen epäonnistui.'
  );

  if (vastaus.status === 204) {
    return null;
  }

  return vastaus.json();
}

export async function poistaVaraus(id) {
  const vastaus = await fetch(`${API}/varaukset/${id}`, {
    method: 'DELETE',
  });

  await tarkistaVastaus(
    vastaus,
    'Varauksen poistaminen epäonnistui.'
  );
}
