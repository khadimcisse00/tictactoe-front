import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hacherMotDePasse } from "@/lib/auth";
import { envoyerEmailVerification } from "@/lib/email";
import { validerMotDePasse } from "@/lib/validation";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  console.log("test");

  try {
    const { nom, prenom, email, pseudo, motDePasse, avatar } = await req.json();

    if (!nom || !prenom || !email || !pseudo || !motDePasse || !avatar) {
      return NextResponse.json(
        { message: "Champs manquants" },
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

    const deja = await prisma.utilisateur.findUnique({ where: { email } });

    if (deja) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email.", code: "EMAIL_EXISTE" },
        { status: 400 }
      );
    }

    const hash = await hacherMotDePasse(motDePasse);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        pseudo,
        motDePasse: hash,
        avatar,
        estVerifie: false,
      },
    });

    const valeur = crypto.randomBytes(32).toString("hex");
    const expire = new Date();
    expire.setHours(expire.getHours() + 24);

    await prisma.token.create({
      data: {
        type: "VERIFICATION",
        valeur,
        utilisateurId: utilisateur.id,
        expireLe: expire,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL!;
    const lien = `${baseUrl}/api/auth/verifier?token=${valeur}`;

    await envoyerEmailVerification(
      utilisateur.email,
      utilisateur.nom,
      utilisateur.prenom,
      lien
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ERREUR INSCRIPTION :", error);

    return NextResponse.json(
      {
        message:
          "Une erreur est survenue lors de l'inscription. Réessayez plus tard.",
      },
      { status: 500 }
    );
  }
}
