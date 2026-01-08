import "./globals.css";
import { ReactNode } from "react";
import { BarreNavigation } from "@/components/BarreNavigation";

export const metadata = {
  title: "Tic Tac Toe",
  description: "Jeu Tic Tac Toe multijoueur",
};

export default function RacineLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" data-theme="light">
      <body className="min-h-screen flex flex-col">
        <BarreNavigation />
        <main className="flex-1 container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
