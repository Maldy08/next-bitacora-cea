import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./auth/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitácora CEA",
  description: "Sistema de Seguimiento de Temas - Comisión Estatal del Agua",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="es" className="h-full antialiased">
        <body className={`${inter.className} min-h-full`}>{children}</body>
      </html>
    </AuthProvider>
  );
}
