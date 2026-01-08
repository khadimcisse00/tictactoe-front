import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recupererUtilisateurConnecte } from "@/lib/auth";

export async function GET() {
  const utilisateur = await recupererUtilisateurConnecte();
  if (!utilisateur) {
    return NextResponse.json(
      { message: "Non connecté" },
      { status: 401 }
    );
  }
  return NextResponse.json({
    pseudo: utilisateur.pseudo,
    avatar: utilisateur.avatar,
    nom: utilisateur.nom,
    prenom: utilisateur.prenom,
  });
}

export async function PATCH(req: NextRequest) {
  const utilisateur = await recupererUtilisateurConnecte();
  if (!utilisateur) {
    return NextResponse.json(
      { message: "Non connecté" },
      { status: 401 }
    );
  }

  const { pseudo, avatar, nom, prenom } = await req.json();

  const misAJour = await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: {
      pseudo: pseudo ?? utilisateur.pseudo,
      avatar: avatar ?? utilisateur.avatar,
      nom: nom ?? utilisateur.nom,
      prenom: prenom ?? utilisateur.prenom,
    },
  });

  return NextResponse.json({
    pseudo: misAJour.pseudo,
    avatar: misAJour.avatar,
    nom: misAJour.nom,
    prenom: misAJour.prenom,
  });
}
