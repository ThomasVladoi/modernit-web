
const API = '/api';

export async function haeTilat() {
  const vastaus = await fetch(`${API}/tilat`);

  if (!vastaus.ok) {
    throw new Error('Tilojen hakeminen epäonnistui.');
  }

  return vastaus.json();
}

export async function haeVaraukset(tila, paiva) {
  const parametrit = new URLSearchParams();

  if (tila) parametrit.set('tila', tila);
  if (paiva) parametrit.set('paiva', paiva);

  const vastaus = await fetch(
    `${API}/varaukset?${parametrit}`
  );

  if (!vastaus.ok) {
    throw new Error('Varausten hakeminen epäonnistui.');
  }

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

  const data = vastaus.status === 204
    ? null
    : await vastaus.json();

  if (!vastaus.ok) {
    throw new Error(data?.virhe || 'Varauksen lisääminen epäonnistui.');
  }

  return data;
}

export async function poistaVaraus(id) {
  const vastaus = await fetch(`${API}/varaukset/${id}`, {
    method: 'DELETE',
  });

  if (!vastaus.ok) {
    throw new Error('Varauksen poistaminen epäonnistui.');
  }
}
