export interface ValidationMotDePasseResultat {
  valide: boolean;
  erreurs: string[];
}

export function validerMotDePasse(motDePasse: string): ValidationMotDePasseResultat {
  const erreurs: string[] = [];

  if (motDePasse.length < 8) {
    erreurs.push("Au moins 8 caractères requis");
  }

  if (!/[A-Z]/.test(motDePasse)) {
    erreurs.push("Au moins 1 lettre majuscule requise");
  }

  if (!/[a-z]/.test(motDePasse)) {
    erreurs.push("Au moins 1 lettre minuscule requise");
  }

  if (!/[0-9]/.test(motDePasse)) {
    erreurs.push("Au moins 1 chiffre requis");
  }

  if (!/[!@#$%^&*()_\-+]/.test(motDePasse)) {
    erreurs.push("Au moins 1 caractère spécial requis (!@#$%^&*()_-+)");
  }

  return {
    valide: erreurs.length === 0,
    erreurs,
  };
}

export function obtenirMessageErreurMotDePasse(motDePasse: string): string {
  const resultat = validerMotDePasse(motDePasse);
  if (resultat.valide) return "";
  return resultat.erreurs.join(". ") + ".";
}
