"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SelectionAvatar } from "@/components/SelectionAvatar";
import { validerMotDePasse } from "@/lib/validation";

type ProfilData = {
  pseudo: string;
  nom: string;
  prenom: string;
  avatar: string;
};

export default function PageProfil() {
  const router = useRouter();
  const [profil, setProfil] = useState<ProfilData | null>(null);
  const [pseudo, setPseudo] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [avatar, setAvatar] = useState("");
  const [motDePasseActuel, setMotDePasseActuel] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [messageSucces, setMessageSucces] = useState("");
  const [messageErreur, setMessageErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profil")
      .then((r) => {
        if (!r.ok) {
          router.push("/connexion");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setProfil(data);
          setPseudo(data.pseudo);
          setNom(data.nom);
          setPrenom(data.prenom);
          setAvatar(data.avatar);
        }
      })
      .catch(() => {
        router.push("/connexion");
      });
  }, [router]);

  async function mettreAJourProfil(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);
    setMessageErreur("");
    setMessageSucces("");

    try {
      const res = await fetch("/api/auth/profil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, nom, prenom, avatar }),
      });

      if (res.ok) {
        setMessageSucces("Profil mis à jour avec succès");
        const data = await res.json();
        setProfil(data);
      } else {
        const data = await res.json();
        setMessageErreur(data.message || "Erreur lors de la mise à jour");
      }
    } catch {
      setMessageErreur("Erreur de connexion");
    } finally {
      setChargement(false);
    }
  }

  async function changerMotDePasse(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);
    setMessageErreur("");
    setMessageSucces("");

    const validationMdp = validerMotDePasse(nouveauMotDePasse);
    if (!validationMdp.valide) {
      setMessageErreur(validationMdp.erreurs.join(". ") + ".");
      setChargement(false);
      return;
    }

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setMessageErreur("Les mots de passe ne correspondent pas");
      setChargement(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/changer-mot-de-passe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motDePasseActuel,
          nouveauMotDePasse,
        }),
      });

      if (res.ok) {
        setMessageSucces("Mot de passe changé avec succès");
        setMotDePasseActuel("");
        setNouveauMotDePasse("");
        setConfirmationMotDePasse("");
      } else {
        const data = await res.json();
        setMessageErreur(data.message || "Erreur lors du changement");
      }
    } catch {
      setMessageErreur("Erreur de connexion");
    } finally {
      setChargement(false);
    }
  }

  if (!profil) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      {messageSucces && (
        <div className="alert alert-success mb-4">
          <span>{messageSucces}</span>
        </div>
      )}

      {messageErreur && (
        <div className="alert alert-error mb-4">
          <span>{messageErreur}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Informations personnelles</h2>
            <form onSubmit={mettreAJourProfil}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Pseudo</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Prénom</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nom</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Avatar</span>
                </label>
                <SelectionAvatar
                  valeur={avatar}
                  onChange={setAvatar}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={chargement}
              >
                {chargement ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </form>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Changer le mot de passe</h2>
            <form onSubmit={changerMotDePasse}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Mot de passe actuel</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={motDePasseActuel}
                  onChange={(e) => setMotDePasseActuel(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nouveau mot de passe</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={nouveauMotDePasse}
                  onChange={(e) => setNouveauMotDePasse(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
                </p>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Confirmer le mot de passe</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={confirmationMotDePasse}
                  onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary w-full"
                disabled={chargement}
              >
                {chargement ? "Changement..." : "Changer le mot de passe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
