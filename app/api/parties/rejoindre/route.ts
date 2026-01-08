import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recupererUtilisateurConnecte } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const utilisateur = await recupererUtilisateurConnecte();
  if (!utilisateur) {
    return NextResponse.json(
      { message: "Non connecté" },
      { status: 401 }
    );
  }

  const { code } = await req.json();
  if (!code) {
    return NextResponse.json(
      { message: "Code manquant" },
      { status: 400 }
    );
  }

  const partie = await prisma.partie.findUnique({
    where: { code },
  });

  if (!partie) {
    return NextResponse.json(
      { message: "Partie introuvable" },
      { status: 404 }
    );
  }

  if (!partie.joueurOId && partie.joueurXId !== utilisateur.id) {
    await prisma.partie.update({
      where: { id: partie.id },
      data: { joueurOId: utilisateur.id },
    });
  }

  return NextResponse.json({ ok: true });
}
