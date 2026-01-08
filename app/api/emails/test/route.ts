import { NextResponse } from "next/server";
import { envoyerEmailVerification } from "@/lib/email";

export async function GET() {
  try {
    
    const email = "khadimcisse00@gmail.com";

    const lien = "https://google.com";

    await envoyerEmailVerification(
      email,
      "Test",
      "Email",
      lien
    );

    return NextResponse.json({ message: "Email envoyé avec succès" });
  } catch (err: any) {
    console.error("Erreur test email :", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
