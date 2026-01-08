import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifierMotDePasse, creerTokenSession, definirCookieSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, motDePasse } = await req.json();

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (!utilisateur) {
    return NextResponse.json(
      { message: "Identifiants invalides" },
      { status: 400 }
    );
  }

  if (!utilisateur.estVerifie) {
    return NextResponse.json(
      { message: "Votre compte n'est pas encore vérifié." },
      { status: 403 }
    );
  }

  const ok = await verifierMotDePasse(motDePasse, utilisateur.motDePasse);
  if (!ok) {
    return NextResponse.json(
      { message: "Identifiants invalides" },
      { status: 400 }
    );
  }

  const token = creerTokenSession(utilisateur.id);
  definirCookieSession(token);

  return NextResponse.json({ ok: true });
}
