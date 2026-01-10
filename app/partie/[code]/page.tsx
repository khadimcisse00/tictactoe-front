"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GrilleTicTacToe } from "@/components/GrilleTicTacToe";
import { ModalFinPartie } from "@/components/ModalFinPartie";
import {
  Grille,
  Symbole,
  creerGrilleInitiale,
  verifierVictoire,
  estMatchNul,
  jouerCoup,
  chaineVersGrille,
  grilleVersChaîne,
} from "@/lib/tictactoe";
import { obtenirSocketClient } from "@/lib/socketClient";

export default function PagePartie() {
  const { code } = useParams() as { code: string };

  const [grille, setGrille] = useState<Grille>(creerGrilleInitiale);
  const [joueurCourant, setJoueurCourant] = useState<Symbole>("X");
  const [monSymbole, setMonSymbole] = useState<Symbole | null>(null);
  const [utilisateurId, setUtilisateurId] = useState<number | null>(null);
  const [messageEtat, setMessageEtat] = useState("Connexion en cours...");
  const [fin, setFin] = useState(false);
  const [messageFin, setMessageFin] = useState("");
  const [partieComplete, setPartieComplete] = useState(false);

  // -------------------------
  // Initialisation
  // -------------------------
  useEffect(() => {
    const socket = obtenirSocketClient();

    async function initialiser() {
      const res = await fetch("/api/auth/profil-simple");
      if (!res.ok) {
        setMessageEtat("Erreur : non connecté");
        return;
      }

      const data = await res.json();
      const userId = data.utilisateur.id;
      setUtilisateurId(userId);

      socket.emit("rejoindre_partie", { code, utilisateurId: userId });

      socket.on("partie_info", (donnees) => {
        setMonSymbole(donnees.symbole);

        const grilleArray =
          typeof donnees.grille === "string"
            ? chaineVersGrille(donnees.grille)
            : donnees.grille;

        setGrille(grilleArray);
        setJoueurCourant(donnees.joueurCourant);
        setPartieComplete(donnees.partieComplete);

        setMessageEtat(
          donnees.partieComplete
            ? `La partie peut commencer ! Vous êtes ${donnees.symbole}`
            : `En attente d'un adversaire... Vous êtes ${donnees.symbole}`
        );
      });

      socket.on("partie_prete", (donnees) => {
        const grilleArray =
          typeof donnees.grille === "string"
            ? chaineVersGrille(donnees.grille)
            : donnees.grille;

        setGrille(grilleArray);
        setJoueurCourant(donnees.joueurCourant);
        setPartieComplete(true);
        setMessageEtat("La partie peut commencer !");
      });

      socket.on("maj_grille", (donnees) => {
        const grilleArray =
          typeof donnees.grille === "string"
            ? chaineVersGrille(donnees.grille)
            : donnees.grille;

        setGrille(grilleArray);
        setJoueurCourant(donnees.joueurCourant);
      });

      socket.on("fin_partie", (donnees) => {
        setFin(true);
        setMessageFin(
          donnees.estNulle ? "Match nul" : `Le gagnant est : ${donnees.gagnant}`
        );
      });

      socket.on("relancer_partie", (donnees) => {
        const grilleArray =
          typeof donnees.grille === "string"
            ? chaineVersGrille(donnees.grille)
            : donnees.grille;

        setGrille(grilleArray);
        setJoueurCourant(donnees.joueurCourant);
        setFin(false);
        setMessageFin("");
        setMessageEtat("Nouvelle partie !");
      });
    }

    initialiser();

    return () => {
      socket.off("partie_info");
      socket.off("partie_prete");
      socket.off("maj_grille");
      socket.off("fin_partie");
      socket.off("relancer_partie");
    };
  }, [code]);

  // -------------------------
  // Jouer un coup
  // -------------------------
  function traiterClicCase(indice: number) {
    if (fin || !monSymbole || !utilisateurId || !partieComplete) return;
    if (grille[indice] !== "_") return;
    if (joueurCourant !== monSymbole) return;

    const nouvelleGrille = jouerCoup(grille, indice, joueurCourant);
    const prochain = joueurCourant === "X" ? "O" : "X";

    setGrille(nouvelleGrille);
    setJoueurCourant(prochain);

    const socket = obtenirSocketClient();

    socket.emit("jouer_coup", {
      code,
      grille: grilleVersChaîne(nouvelleGrille),
      joueurCourant: prochain,
      utilisateurId,
    });

    const gagnant = verifierVictoire(nouvelleGrille);
    const nul = estMatchNul(nouvelleGrille);

    if (gagnant || nul) {
      setFin(true);
      setMessageFin(gagnant ? `Le gagnant est : ${gagnant}` : "Match nul");

      socket.emit("fin_partie", {
        code,
        gagnant,
        estNulle: nul,
      });

      fetch("/api/parties/mise-a-jour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          grille: grilleVersChaîne(nouvelleGrille),
          gagnant,
          estNulle: nul,
        }),
      });
    }
  }

  // -------------------------
  // Relancer
  // -------------------------
  function relancerPartie() {
    const nouvelleGrille = creerGrilleInitiale();

    setGrille(nouvelleGrille);
    setJoueurCourant("X");
    setFin(false);
    setMessageFin("");
    setMessageEtat("Nouvelle partie !");

    const socket = obtenirSocketClient();

    socket.emit("relancer_partie", {
      code,
      grille: grilleVersChaîne(nouvelleGrille),
      joueurCourant: "X",
    });
  }

  const cEstMonTour = monSymbole === joueurCourant && partieComplete;

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Partie : {code}</h1>

      <div className="text-center">
        <p className="text-lg">{messageEtat}</p>

        {monSymbole && partieComplete && (
          <p className="text-sm mt-2">
            {cEstMonTour ? (
              <span className="text-success font-semibold">
                C&apos;est votre tour !
              </span>
            ) : (
              <span className="text-base-content/70">
                En attente de l&apos;adversaire...
              </span>
            )}
          </p>
        )}
      </div>

      <GrilleTicTacToe
        grille={grille}
        joueurCourant={joueurCourant}
        desactive={fin || !cEstMonTour}
        onClicCase={traiterClicCase}
      />

      <ModalFinPartie
        ouvert={fin}
        message={messageFin}
        onFermer={() => setFin(false)}
        onRejouer={relancerPartie}
      />
    </div>
  );
}
