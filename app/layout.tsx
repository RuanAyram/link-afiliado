import type { Metadata } from "next";
import { Unbounded, Sora } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VitrineHub — Melhores Achadinhos de Afiliados",
  description: "Encontre os melhores produtos em promoção recomendados na Shopee, Amazon e Mercado Livre. Centralizado em um só lugar.",
  keywords: ["afiliados", "shopee", "amazon", "mercado livre", "achadinhos", "descontos", "promoções"],
  authors: [{ name: "VitrineHub Curador" }],
  openGraph: {
    title: "VitrineHub — Melhores Achadinhos de Afiliados",
    description: "Encontre os melhores produtos em promoção recomendados na Shopee, Amazon e Mercado Livre.",
    type: "website",
    locale: "pt_BR",
    url: "https://vitrinehub.netlify.app",
    images: '/image_home.png',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${unbounded.variable} ${sora.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
