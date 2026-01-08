"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { validerMotDePasse } from "@/lib/validation";

export default function PageResetMotDePasse() {
  const { token } = useParams() as { token: string };
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [info, setInfo] = useState("");
  const [erreur, setErreur] = useState("");
  const router = useRouter();

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setInfo("");

    const validationMdp = validerMotDePasse(motDePasse);
    if (!validationMdp.valide) {
      setErreur(validationMdp.erreurs.join(". ") + ".");
      return;
    }

    if (motDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch("/api/auth/motdepasse", {
      method: "POST",
      body: JSON.stringify({
        token,
        motDePasse,
        action: "UTILISER_RESET",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      setErreur(data.message || "Erreur");
      return;
    }
    setInfo("Mot de passe mis à jour. Vous pouvez vous connecter.");
    setTimeout(() => router.push("/connexion"), 2000);
  }

  return (
    <div className="max-w-md mx-auto mt-8 card bg-base-100 shadow-lg">
      <div className="card-body">
        <h1 className="card-title">Réinitialiser le mot de passe</h1>
        {erreur && <div className="alert alert-error">{erreur}</div>}
        {info && <div className="alert alert-success">{info}</div>}
        <form className="flex flex-col gap-4" onSubmit={soumettre}>
          <div>
            <input
              className="input input-bordered w-full"
              placeholder="Nouveau mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              type="password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
            </p>
          </div>
          <input
            className="input input-bordered w-full"
            placeholder="Confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            type="password"
          />
          <div className="card-actions justify-end">
            <button className="btn btn-primary" type="submit">
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
