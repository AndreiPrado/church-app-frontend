import type { Metadata } from "next";
import { Lato } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "@fontsource/lato";
import "@fontsource/lato/700.css";
import "./globals.css";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Z'ele Church",
  description: "Igreja Z'ele - Visão que nasce com zelo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${lato.variable} antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
