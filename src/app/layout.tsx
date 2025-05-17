import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navigation } from "./components/navigation";
import "./styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chunkify",
  description: "Transforme em pedaços!",
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.className}>
      <body>
        <div className="bg-light-gray dark:bg-very-dark-gray flex h-svh w-screen flex-col md:h-screen md:flex-row">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
