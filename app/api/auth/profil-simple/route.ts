import { NextResponse } from "next/server";
import { recupererUtilisateurConnecte } from "@/lib/auth";

export async function GET() {
  const utilisateur = await recupererUtilisateurConnecte();
  if (!utilisateur) {
    return NextResponse.json({ utilisateur: null }, { status: 200 });
  }
  return NextResponse.json({
    utilisateur: {
      id: utilisateur.id,
      pseudo: utilisateur.pseudo,
      avatar: utilisateur.avatar,
    },
  });
}
