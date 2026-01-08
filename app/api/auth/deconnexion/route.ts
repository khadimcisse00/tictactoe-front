import { NextResponse } from "next/server";
import { effacerCookieSession } from "@/lib/auth";

export async function POST() {
  effacerCookieSession();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_URL));
}
