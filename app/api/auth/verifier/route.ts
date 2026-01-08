import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tokenValeur = searchParams.get("token");

  if (!tokenValeur) {
    return NextResponse.redirect(
      new URL("/connexion?message=erreur", req.url)
    );
  }

  const token = await prisma.token.findUnique({
    where: { valeur: tokenValeur },
    include: { utilisateur: true },
  });

  if (
    !token ||
    token.type !== "VERIFICATION" ||
    token.utilise ||
    token.expireLe < new Date()
  ) {
    return NextResponse.redirect(
      new URL("/connexion?message=erreur", req.url)
    );
  }

  await prisma.$transaction([
    prisma.utilisateur.update({
      where: { id: token.utilisateurId },
      data: { estVerifie: true },
    }),
    prisma.token.update({
      where: { id: token.id },
      data: { utilise: true },
    }),
  ]);

  return NextResponse.redirect(
    new URL("/connexion?message=verifie", req.url)
  );
}
