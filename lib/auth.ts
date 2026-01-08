import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const NOM_COOKIE = "session_tictactoe";

export async function hacherMotDePasse(motDePasse: string) {
  const sel = await bcrypt.genSalt(10);
  return bcrypt.hash(motDePasse, sel);
}

export async function verifierMotDePasse(
  motDePasse: string,
  hash: string
) {
  return bcrypt.compare(motDePasse, hash);
}

export function creerTokenSession(utilisateurId: number) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant");
  return jwt.sign({ utilisateurId }, secret, { expiresIn: "7d" });
}

export function lireUtilisateurDepuisCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get(NOM_COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as { utilisateurId: number };
    return payload.utilisateurId;
  } catch {
    return null;
  }
}

export function definirCookieSession(token: string) {
  const cookieStore = cookies();
  cookieStore.set(NOM_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function effacerCookieSession() {
  const cookieStore = cookies();
  cookieStore.delete(NOM_COOKIE);
}

export async function recupererUtilisateurConnecte() {
  const id = lireUtilisateurDepuisCookies();
  if (!id) return null;
  return prisma.utilisateur.findUnique({ where: { id } });
}
