"use client";

import { useState } from "react";

export default function PageMotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [erreur, setErreur] = useState("");

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setInfo("");

    const res = await fetch("/api/auth/motdepasse", {
      method: "POST",
      body: JSON.stringify({ email, action: "DEMANDER_RESET" }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      setErreur(data.message || "Erreur");
      return;
    }
    setInfo(
      "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé."
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 card bg-base-100 shadow-lg">
      <div className="card-body">
        <h1 className="card-title">Mot de passe oublié</h1>
        {erreur && <div className="alert alert-error">{erreur}</div>}
        {info && <div className="alert alert-success">{info}</div>}
        <form className="flex flex-col gap-4" onSubmit={soumettre}>
          <input
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <div className="card-actions justify-end">
            <button className="btn btn-primary" type="submit">
              Envoyer le lien
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
