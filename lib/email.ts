import fs from "fs";
import path from "path";
import mjml2html from "mjml";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// --------------------------------------------------
// Utils
// --------------------------------------------------
function chargerTemplateMjml(nom: "verification" | "reset") {
  const fichier = path.join(process.cwd(), "emails", `${nom}.mjml`);
  return fs.readFileSync(fichier, "utf8");
}

function rendreTemplate(contenu: string, variables: Record<string, string>) {
  let resultat = contenu;

  for (const [cle, valeur] of Object.entries(variables)) {
    resultat = resultat.replace(new RegExp(`{{${cle}}}`, "g"), valeur);
  }

  const { html } = mjml2html(resultat, {
    validationLevel: "soft",
    keepComments: false,
  });

  return html;
}

// --------------------------------------------------
// EMAIL : VERIFICATION
// --------------------------------------------------
export async function envoyerEmailVerification(
  email: string,
  nom: string,
  prenom: string,
  lien: string
) {
  const contenuMjml = chargerTemplateMjml("verification");
  const html = rendreTemplate(contenuMjml, { nom, prenom, lien });

  const result = await resend.emails.send({
    from: `Tic Tac Toe <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Activation de votre compte Tic Tac Toe",
    html,
  });

  console.log("✅ Email de vérification envoyé :", result);
  return result;
}

// --------------------------------------------------
// EMAIL : RESET MOT DE PASSE
// --------------------------------------------------
export async function envoyerEmailResetMotDePasse(
  email: string,
  nom: string,
  prenom: string,
  lien: string
) {
  const contenuMjml = chargerTemplateMjml("reset");
  const html = rendreTemplate(contenuMjml, { nom, prenom, lien });

  const result = await resend.emails.send({
    from: `Tic Tac Toe <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html,
  });

  console.log("✅ Email de reset envoyé :", result);
  return result;
}
