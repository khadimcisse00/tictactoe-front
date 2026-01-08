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

  const body = await req.json();

  if (body.code) {
    const { code, grille, gagnant, estNulle } = body;

    const partie = await prisma.partie.findUnique({ where: { code } });
    if (!partie) {
      return NextResponse.json(
        { message: "Partie introuvable" },
        { status: 404 }
      );
    }

    let gagnantId: number | null = null;
    if (gagnant === "X") gagnantId = partie.joueurXId ?? null;
    if (gagnant === "O") gagnantId = partie.joueurOId ?? null;

    await prisma.partie.update({
      where: { id: partie.id },
      data: {
        grille: typeof grille === "string" ? grille : grille.join(""),
        estNulle: !!estNulle,
        gagnantId: gagnantId ?? undefined,
      },
    });

    return NextResponse.json({ ok: true });
  }

  if (body.typePartie === "IA") {
    const { niveau, resultat, estNulle } = body;

    await prisma.partie.create({
      data: {
        code: `IA-${Date.now()}`,
        joueurXId: utilisateur.id,
        typePartie: "IA",
        grille: "_________",
        joueurCourant: "X",
        niveauIA: niveau,
        estNulle: !!estNulle,
        gagnantId:
          resultat === "X" ? utilisateur.id : undefined,
      },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { message: "Données invalides" },
    { status: 400 }
  );
}
