import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recupererUtilisateurConnecte } from "@/lib/auth";

function genererCode() {
  const base = Math.random().toString().slice(2, 8);
  return base;
}

export async function POST() {
  const utilisateur = await recupererUtilisateurConnecte();
  if (!utilisateur) {
    return NextResponse.json(
      { message: "Non connecté" },
      { status: 401 }
    );
  }

  const code = genererCode();

  const partie = await prisma.partie.create({
    data: {
      code,
      joueurXId: utilisateur.id,
      typePartie: "MULTI",
      grille: "_________",
      joueurCourant: "X",
    },
  });

  return NextResponse.json({ code: partie.code });
}
