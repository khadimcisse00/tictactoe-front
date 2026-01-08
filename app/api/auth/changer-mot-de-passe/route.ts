import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recupererUtilisateurConnecte } from "@/lib/auth";
import { validerMotDePasse } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const utilisateur = await recupererUtilisateurConnecte();
  if (!utilisateur) {
    return NextResponse.json(
      { message: "Non connecté" },
      { status: 401 }
    );
  }

  const { motDePasseActuel, nouveauMotDePasse } = await req.json();

  if (!motDePasseActuel || !nouveauMotDePasse) {
    return NextResponse.json(
      { message: "Tous les champs sont requis" },
      { status: 400 }
    );
  }

  const validationMdp = validerMotDePasse(nouveauMotDePasse);
  if (!validationMdp.valide) {
    return NextResponse.json(
      { message: validationMdp.erreurs.join(". ") + "." },
      { status: 400 }
    );
  }

  const utilisateurComplet = await prisma.utilisateur.findUnique({
    where: { id: utilisateur.id },
  });

  if (!utilisateurComplet) {
    return NextResponse.json(
      { message: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  const motDePasseValide = await bcrypt.compare(
    motDePasseActuel,
    utilisateurComplet.motDePasse
  );

  if (!motDePasseValide) {
    return NextResponse.json(
      { message: "Mot de passe actuel incorrect" },
      { status: 400 }
    );
  }

  const nouveauHash = await bcrypt.hash(nouveauMotDePasse, 10);

  await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: { motDePasse: nouveauHash },
  });

  return NextResponse.json({ message: "Mot de passe changé avec succès" });
}
