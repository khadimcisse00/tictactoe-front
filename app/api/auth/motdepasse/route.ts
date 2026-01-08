import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { envoyerEmailResetMotDePasse } from "@/lib/email";
import { hacherMotDePasse } from "@/lib/auth";
import { validerMotDePasse } from "@/lib/validation";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email, action, token, motDePasse } = await req.json();

  if (action === "DEMANDER_RESET") {
    if (!email) {
      return NextResponse.json(
        { message: "Email manquant" },
        { status: 400 }
      );
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      return NextResponse.json({ ok: true });
    }

    const valeur = crypto.randomBytes(32).toString("hex");
    const expire = new Date();
    expire.setHours(expire.getHours() + 1);

    await prisma.token.create({
      data: {
        type: "RESET",
        valeur,
        utilisateurId: utilisateur.id,
        expireLe: expire,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL!;
    const lien = `${baseUrl}/mot-de-passe-reset/${valeur}`;

    await envoyerEmailResetMotDePasse(
      utilisateur.email,
      utilisateur.nom,
      utilisateur.prenom,
      lien
    );

    return NextResponse.json({ ok: true });
  }

  if (action === "UTILISER_RESET") {
    if (!token || !motDePasse) {
      return NextResponse.json(
        { message: "Données manquantes" },
        { status: 400 }
      );
    }

    const validationMdp = validerMotDePasse(motDePasse);
    if (!validationMdp.valide) {
      return NextResponse.json(
        { message: validationMdp.erreurs.join(". ") + "." },
        { status: 400 }
      );
    }

    const tokenEnBase = await prisma.token.findUnique({
      where: { valeur: token },
    });

    if (
      !tokenEnBase ||
      tokenEnBase.type !== "RESET" ||
      tokenEnBase.utilise ||
      tokenEnBase.expireLe < new Date()
    ) {
      return NextResponse.json(
        { message: "Token invalide" },
        { status: 400 }
      );
    }

    const hash = await hacherMotDePasse(motDePasse);

    await prisma.$transaction([
      prisma.utilisateur.update({
        where: { id: tokenEnBase.utilisateurId },
        data: { motDePasse: hash },
      }),
      prisma.token.update({
        where: { id: tokenEnBase.id },
        data: { utilise: true },
      }),
    ]);

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ message: "Action inconnue" }, { status: 400 });
}
