export type Symbole = "X" | "O";
export type CaseGrille = Symbole | "_";
export type Grille = CaseGrille[];

// ---------------------------------------------------------
// Créer une grille vide
// ---------------------------------------------------------
export function creerGrilleInitiale(): Grille {
  return Array(9).fill("_");
}

// ---------------------------------------------------------
// Convertir une chaîne en grille
// ---------------------------------------------------------
export function chaineVersGrille(chaine: string): Grille {
  return chaine.split("") as Grille;
}

// ---------------------------------------------------------
// Convertir une grille en chaîne
// ---------------------------------------------------------
export function grilleVersChaîne(grille: Grille): string {
  return grille.join("");
}

// ---------------------------------------------------------
// Vérifier victoire
// ---------------------------------------------------------
export function verifierVictoire(grille: Grille): Symbole | null {
  const lignes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lignes) {
    if (
      grille[a] !== "_" &&
      grille[a] === grille[b] &&
      grille[b] === grille[c]
    ) {
      return grille[a] as Symbole;
    }
  }
  return null;
}

// ---------------------------------------------------------
// Match nul
// ---------------------------------------------------------
export function estMatchNul(grille: Grille): boolean {
  return grille.every((c) => c !== "_") && !verifierVictoire(grille);
}

// ---------------------------------------------------------
// Cases disponibles
// ---------------------------------------------------------
export function casesDisponibles(grille: Grille): number[] {
  return grille
    .map((c, i) => (c === "_" ? i : -1))
    .filter((i) => i !== -1);
}

// ---------------------------------------------------------
// Jouer un coup
// ---------------------------------------------------------
export function jouerCoup(
  grille: Grille,
  indice: number,
  symbole: Symbole
): Grille {
  if (grille[indice] !== "_") return grille;
  const copie = [...grille];
  copie[indice] = symbole;
  return copie;
}

// ---------------------------------------------------------
// Coup IA FACILE = aléatoire
// ---------------------------------------------------------
export function coupIAFacile(grille: Grille): number | null {
  const dispo = casesDisponibles(grille);
  if (dispo.length === 0) return null;
  const index = Math.floor(Math.random() * dispo.length);
  return dispo[index];
}

// ---------------------------------------------------------
// Trouver un coup gagnant
// ---------------------------------------------------------
function trouverCoupGagnant(
  grille: Grille,
  symbole: Symbole
): number | null {
  for (const i of casesDisponibles(grille)) {
    const simule = jouerCoup(grille, i, symbole);
    if (verifierVictoire(simule) === symbole) return i;
  }
  return null;
}

// ---------------------------------------------------------
// Coup IA MOYEN
// ---------------------------------------------------------
export function coupIAMoyen(
  grille: Grille,
  symboleIA: Symbole,
  symboleAdverse: Symbole
): number | null {
  const coupGagnant = trouverCoupGagnant(grille, symboleIA);
  if (coupGagnant !== null) return coupGagnant;

  const coupBloquant = trouverCoupGagnant(grille, symboleAdverse);
  if (coupBloquant !== null) return coupBloquant;

  return coupIAFacile(grille);
}

// ---------------------------------------------------------
// Coup IA DIFFICILE
// ---------------------------------------------------------
export function coupIADifficile(
  grille: Grille,
  symboleIA: Symbole,
  symboleAdverse: Symbole
): number | null {
  // 1. Jouer centre en priorité
  const coupCentre = 4;
  if (grille[coupCentre] === "_") return coupCentre;

  // 2. Jouer un coin gagnant / stratégique
  const coins = [0, 2, 6, 8].filter((i) => grille[i] === "_");

  if (coins.length > 0) {
    // On teste si un coin mène à une victoire
    for (const coin of coins) {
      const simule = jouerCoup(grille, coin, symboleIA);
      if (verifierVictoire(simule) === symboleIA) return coin;
    }
  }

  // 3. Coup gagnant immédiat
  const coupGagnant = trouverCoupGagnant(grille, symboleIA);
  if (coupGagnant !== null) return coupGagnant;

  // 4. Bloquer l'adversaire
  const coupBloquant = trouverCoupGagnant(grille, symboleAdverse);
  if (coupBloquant !== null) return coupBloquant;

  // 5. Jouer un coin libre
  const coinsLibres = [0, 2, 6, 8].filter((i) => grille[i] === "_");
  if (coinsLibres.length > 0) return coinsLibres[0];

  // 6. Sinon → mode facile
  return coupIAFacile(grille);
}
