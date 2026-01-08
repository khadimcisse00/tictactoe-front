"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GamepadIcon, LinkIcon, CpuIcon, HistoryIcon } from "lucide-react";

export default function PageDashboard() {
  const [codePartieRejoindre, setCodePartieRejoindre] = useState("");
  const router = useRouter();

  async function creerPartie() {
    const res = await fetch("/api/parties/creer", {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/partie/${data.code}`);
    }
  }

  async function rejoindrePartie() {
    if (!codePartieRejoindre) return;

    const res = await fetch("/api/parties/rejoindre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: codePartieRejoindre }),
    });

    if (res.ok) {
      router.push(`/partie/${codePartieRejoindre}`);
    } else {
      const data = await res.json();
      alert(data.message || "Erreur lors de la tentative de rejoindre la partie");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-3 text-center">
        Bienvenue sur Tic Tac Toe
      </h1>

      <p className="text-center mb-10 text-base-content/70 text-lg">
        Jouez en ligne, affrontez un ami, l’ordinateur ou consultez votre historique.
      </p>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Créer une partie */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <GamepadIcon size={20} />
              Créer une partie
            </h2>
            <p className="text-base-content/70">
              Générez un code et commencez une partie en ligne.
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-neutral" onClick={creerPartie}>
                Créer
              </button>
            </div>
          </div>
        </div>

        {/* Rejoindre une partie */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <LinkIcon size={20} />
              Rejoindre une partie
            </h2>

            <input
              className="input input-bordered w-full"
              placeholder="Code de la partie"
              inputMode="numeric"
              pattern="[0-9]*"
              value={codePartieRejoindre}
              onChange={(e) =>
                setCodePartieRejoindre(e.target.value.replace(/\D/g, ""))
              }
            />

            <div className="card-actions justify-end">
              <button className="btn btn-outline" onClick={rejoindrePartie}>
                Rejoindre
              </button>
            </div>
          </div>
        </div>

        {/* Jouer contre ordinateur */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <CpuIcon size={20} />
              Jouer contre l’ordinateur
            </h2>
            <p className="text-base-content/70">
              Affrontez l’IA dans différents niveaux de difficulté.
            </p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-accent btn-soft"
                onClick={() => router.push("/ordinateur")}
              >
                Jouer
              </button>
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <HistoryIcon size={20} />
              Historique
            </h2>
            <p className="text-base-content/70">
              Consultez vos parties passées.
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-ghost" onClick={() => router.push("/historique")}>
                Voir
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
