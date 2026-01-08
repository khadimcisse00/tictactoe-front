"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectionAvatar } from "@/components/SelectionAvatar";
import { validerMotDePasse } from "@/lib/validation";

export default function PageInscription() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [avatar, setAvatar] = useState("/avatars/avatar1.png");
  const [erreur, setErreur] = useState("");
  const [info, setInfo] = useState("");
  const [emailExisteDeja, setEmailExisteDeja] = useState(false);
  const router = useRouter();

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setInfo("");
    setEmailExisteDeja(false);

    const validationMdp = validerMotDePasse(motDePasse);
    if (!validationMdp.valide) {
      setErreur(validationMdp.erreurs.join(". ") + ".");
      return;
    }

    if (motDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch("/api/auth/inscription", {
      method: "POST",
      body: JSON.stringify({
        nom,
        prenom,
        email,
        pseudo,
        motDePasse,
        avatar,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      if (data.code === "EMAIL_EXISTE") {
        setEmailExisteDeja(true);
      }
      setErreur(data.message || "Erreur inconnue");
      return;
    }

    setInfo(
      "Inscription réussie. Un email de vérification vous a été envoyé."
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 card bg-base-100 shadow-lg">
      <div className="card-body">
        <h1 className="card-title">Inscription</h1>
        <form className="flex flex-col gap-4" onSubmit={soumettre}>
          <input
            className="input input-bordered w-full"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="input input-bordered w-full"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <div>
            <input
              className="input input-bordered w-full"
              placeholder="Mot de passe"
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
            placeholder="Confirmation du mot de passe"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            type="password"
          />
          <div>
            <p className="mb-2">Choisissez un avatar</p>
            <SelectionAvatar valeur={avatar} onChange={setAvatar} />
          </div>
          {erreur && <div className="alert alert-error">{erreur}</div>}
          {info && <div className="alert alert-success">{info}</div>}
          <div className="card-actions justify-end">
            <button className="btn btn-primary" type="submit">
              Créer mon compte
            </button>
          </div>
        </form>
        {emailExisteDeja && (
          <button
            className="btn btn-outline btn-secondary mt-4"
            onClick={() => router.push("/connexion")}
          >
            Aller à la connexion
          </button>
        )}
      </div>
    </div>
  );
}
