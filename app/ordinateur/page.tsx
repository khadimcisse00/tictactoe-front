"use client";

import { useState } from "react";
import { GrilleTicTacToe } from "@/components/GrilleTicTacToe";
import {
  Grille,
  Symbole,
  creerGrilleInitiale,
  verifierVictoire,
  estMatchNul,
  jouerCoup,
  coupIAFacile,
  coupIAMoyen,
  coupIADifficile,
} from "@/lib/tictactoe";
import { ModalFinPartie } from "@/components/ModalFinPartie";

type Niveau = "FACILE" | "MOYEN" | "DIFFICILE";

export default function PageOrdinateur() {
  const [grille, setGrille] = useState<Grille>(creerGrilleInitiale);
  const [joueurCourant, setJoueurCourant] = useState<Symbole>("X");
  const [niveau, setNiveau] = useState<Niveau>("FACILE");
  const [fin, setFin] = useState(false);
  const [messageFin, setMessageFin] = useState("");

  function resetPartie() {
    setGrille(creerGrilleInitiale());
    setJoueurCourant("X");
    setFin(false);
    setMessageFin("");
  }

  function choisirCoupIA(g: Grille): number | null {
    if (niveau === "FACILE") return coupIAFacile(g);
    if (niveau === "MOYEN") return coupIAMoyen(g, "O", "X");
    return coupIADifficile(g, "O", "X");
  }

  function traiterClicCase(indice: number) {
    if (fin) return;
    if (grille[indice] !== "_") return;

    let g = jouerCoup(grille, indice, "X");
    let gagnant = verifierVictoire(g);
    let nul = estMatchNul(g);

    if (gagnant || nul) {
      setGrille(g);
      setFin(true);
      setMessageFin(gagnant ? `Vous avez gagné (${gagnant}).` : "Match nul");
      return;
    }

    const coupIA = choisirCoupIA(g);
    if (coupIA !== null) {
      g = jouerCoup(g, coupIA, "O");
    }

    gagnant = verifierVictoire(g);
    nul = estMatchNul(g);

    setGrille(g);

    if (gagnant || nul) {
      setFin(true);
      if (gagnant === "X") {
        setMessageFin("Vous avez gagné.");
      } else if (gagnant === "O") {
        setMessageFin("L'ordinateur a gagné.");
      } else {
        setMessageFin("Match nul");
      }

      fetch("/api/parties/mise-a-jour", {
        method: "POST",
        body: JSON.stringify({
          typePartie: "IA",
          niveau,
          resultat: gagnant,
          estNulle: nul,
        }),
        headers: { "Content-Type": "application/json" },
      });

      return;
    }

    setJoueurCourant("X");
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Mode ordinateur</h1>
      <div className="join mb-4">
        <button
          className={`btn join-item ${
            niveau === "FACILE" ? "btn-primary" : ""
          }`}
          onClick={() => setNiveau("FACILE")}
        >
          Facile
        </button>
        <button
          className={`btn join-item ${
            niveau === "MOYEN" ? "btn-primary" : ""
          }`}
          onClick={() => setNiveau("MOYEN")}
        >
          Moyen
        </button>
        <button
          className={`btn join-item ${
            niveau === "DIFFICILE" ? "btn-primary" : ""
          }`}
          onClick={() => setNiveau("DIFFICILE")}
        >
          Difficile
        </button>
      </div>
      <GrilleTicTacToe
        grille={grille}
        joueurCourant={joueurCourant}
        desactive={fin}
        onClicCase={traiterClicCase}
      />
      <ModalFinPartie
        ouvert={fin}
        message={messageFin}
        onFermer={() => setFin(false)}
        onRejouer={resetPartie}
      />
    </div>
  );
}
