
function vapaatAjat(tila, varaukset, minimi = 30) {
    const minuutit = (aika) => {
        const [tunnit, minuutit] = aika.split(":").map(Number);
        return tunnit * 60 + minuutit;
    };

    const kellonaika = (minuutit) => {
        const tunnit = Math.floor(minuutit / 60);
        const minuutitJaljella = minuutit % 60;

        return `${String(tunnit).padStart(2, "0")}:${String(
            minuutitJaljella
        ).padStart(2, "0")}`;
    };

    const alku = minuutit(tila.alku);
    const loppu = minuutit(tila.loppu);

    if (
        !Number.isFinite(alku) ||
        !Number.isFinite(loppu) ||
        alku < 0 ||
        loppu > 1440 ||
        alku >= loppu ||
        !Array.isArray(varaukset) ||
        !Number.isFinite(minimi) ||
        minimi < 0
    ) {
        throw new Error("Virheellinen tila, varaukset tai minimiaika.");
    }

    const varatut = varaukset
        .map((varaus) => ({
            alku: minuutit(varaus.alku),
            loppu: minuutit(varaus.loppu),
        }))
        .filter(
            (varaus) =>
                Number.isFinite(varaus.alku) &&
                Number.isFinite(varaus.loppu) &&
                varaus.alku < varaus.loppu &&
                varaus.loppu > alku &&
                varaus.alku < loppu
        )
        .map((varaus) => ({
            alku: Math.max(varaus.alku, alku),
            loppu: Math.min(varaus.loppu, loppu),
        }))
        .sort((a, b) => a.alku - b.alku);

    // Yhdistetään päällekkäiset ja toisiaan koskettavat varaukset.
    const yhdistetyt = [];

    for (const varaus of varatut) {
        const edellinen = yhdistetyt[yhdistetyt.length - 1];

        if (!edellinen || varaus.alku > edellinen.loppu) {
            yhdistetyt.push({ ...varaus });
        } else {
            edellinen.loppu = Math.max(edellinen.loppu, varaus.loppu);
        }
    }

    const vapaat = [];
    let kohta = alku;

    for (const varaus of yhdistetyt) {
        if (varaus.alku - kohta >= minimi) {
            vapaat.push({
                alku: kellonaika(kohta),
                loppu: kellonaika(varaus.alku),
                minuutit: varaus.alku - kohta,
            });
        }

        kohta = Math.max(kohta, varaus.loppu);
    }

    if (loppu - kohta >= minimi) {
        vapaat.push({
            alku: kellonaika(kohta),
            loppu: kellonaika(loppu),
            minuutit: loppu - kohta,
        });
    }

    return vapaat;
}

module.exports = { vapaatAjat };
