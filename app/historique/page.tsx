"use client";

import { useEffect, useState } from "react";
import { HistoryIcon, TrophyIcon, Users2Icon, CalendarIcon } from "lucide-react";

type PartieHistorique = {
  id: number;
  code: string;
  typePartie: string;
  niveauIA: string | null;
  adversaire: string;
  resultat: string;
  gagnant: string | null;
  date: string;
};

export default function PageHistorique() {
  const [parties, setParties] = useState<PartieHistorique[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch("/api/historique")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.parties) {
          setParties(data.parties);
        }
        setChargement(false);
      })
      .catch(() => {
        setChargement(false);
      });
  }, []);

  function obtenirCouleurResultat(resultat: string) {
    switch (resultat) {
      case "Victoire":
        return "badge-success";
      case "Défaite":
        return "badge-error";
      case "Match nul":
        return "badge-warning";
      default:
        return "badge-ghost";
    }
  }

  function formaterDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (chargement) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <HistoryIcon size={36} />
          Historique des parties
        </h1>
        <p className="text-base-content/70">
          Retrouvez toutes vos parties passées et vos résultats.
        </p>
      </div>

      {parties.length === 0 ? (
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body text-center py-12">
            <HistoryIcon size={48} className="mx-auto text-base-content/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Aucune partie jouée
            </h2>
            <p className="text-base-content/70">
              Commencez une partie pour voir votre historique ici.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {parties.map((partie) => (
            <div
              key={partie.id}
              className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow"
            >
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <TrophyIcon size={20} className="text-primary" />
                      <h3 className="font-semibold text-lg">
                        {partie.resultat === "Victoire" && (
                          <>Match gagné contre {partie.adversaire}</>
                        )}
                        {partie.resultat === "Défaite" && (
                          <>Match perdu contre {partie.adversaire}</>
                        )}
                        {partie.resultat === "Match nul" && (
                          <>Match nul contre {partie.adversaire}</>
                        )}
                        {partie.resultat === "En cours" && (
                          <>Partie en cours avec {partie.adversaire}</>
                        )}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                      <div className="flex items-center gap-2">
                        <Users2Icon size={16} />
                        <span>
                          {partie.typePartie === "ordi"
                            ? "VS Ordinateur"
                            : "Multijoueur"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} />
                        <span>{formaterDate(partie.date)}</span>
                      </div>
                      <div>
                        <span className="font-mono text-xs">
                          Code: {partie.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`badge ${obtenirCouleurResultat(
                        partie.resultat
                      )} badge-lg font-semibold`}
                    >
                      {partie.resultat}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
