import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./styles/globals.css";
import { BoardsProvider } from "./contexts/boards";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chunkify",
  description: "Transforme em pedaços!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={plusJakartaSans.className}>
      <BoardsProvider>
        <body>{children}</body>
      </BoardsProvider>
    </html>
  );
}
