"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MessageVerification() {
  const params = useSearchParams();
  const messageVerif =
    params.get("message") === "verifie"
      ? "Votre compte a été activé avec succès, vous pouvez vous connecter."
      : "";

  if (!messageVerif) return null;
  return <div className="alert alert-success mb-2">{messageVerif}</div>;
}

export default function PageConnexion() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const router = useRouter();

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");

    const res = await fetch("/api/auth/connexion", {
      method: "POST",
      body: JSON.stringify({ email, motDePasse }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      setErreur(data.message || "Erreur connexion");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto mt-8 card bg-base-100 shadow-lg">
      <div className="card-body">
        <h1 className="card-title">Connexion</h1>
        <Suspense fallback={null}>
          <MessageVerification />
        </Suspense>
        {erreur && <div className="alert alert-error mb-2">{erreur}</div>}
        <form className="flex flex-col gap-4" onSubmit={soumettre}>
          <input
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="input input-bordered w-full"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            type="password"
          />
          <div className="flex justify-between items-center">
            <a href="/mot-de-passe-oublie" className="link">
              Mot de passe oublié ?
            </a>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" type="submit">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
