"use client";

import { Grille, Symbole } from "@/lib/tictactoe";

type Props = {
  grille: Grille;
  joueurCourant: Symbole;
  desactive: boolean;
  onClicCase: (indice: number) => void;
};

export function GrilleTicTacToe({
  grille,
  joueurCourant,
  desactive,
  onClicCase,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p>Tour de : {joueurCourant}</p>
      <div className="grid grid-cols-3 gap-2 w-64">
        {grille.map((valeur, i) => (
          <button
            key={i}
            disabled={desactive || valeur !== "_"}
            onClick={() => onClicCase(i)}
            className="btn h-20 text-3xl"
          >
            {valeur === "_" ? "" : valeur}
          </button>
        ))}
      </div>
    </div>
  );
}
