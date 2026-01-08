"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BasculeTheme } from "./BasculeTheme";

type UtilisateurNav = {
  pseudo: string;
  avatar: string;
};

export function BarreNavigation() {
  const [utilisateur, setUtilisateur] = useState<UtilisateurNav | null>(null);

  useEffect(() => {
    fetch("/api/auth/profil-simple")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.utilisateur) setUtilisateur(data.utilisateur);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="navbar bg-base-100 border-b">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Tic Tac Toe
        </Link>
      </div>
      <div className="flex-none gap-4">
        <BasculeTheme />
        {utilisateur ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={utilisateur.avatar} alt="avatar" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li className="px-3 py-2 font-semibold">
                {utilisateur.pseudo}
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/profil">Profil</Link>
              </li>
              <li>
                <Link href="/historique">Historique</Link>
              </li>
              <li>
                <form action="/api/auth/deconnexion" method="post">
                  <button type="submit">Déconnexion</button>
                </form>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
                           

            <Link href="/connexion" className="btn btn-ghost">
              Connexion
            </Link>
            <Link href="/inscription" className="btn btn-primary">
              Inscription
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
