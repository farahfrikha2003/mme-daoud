import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import StandardLayout from "@/components/layout/StandardLayout";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Pâtisserie Mme Daoud - Depuis 1996",
  description: "Mme Daoud est un label de qualité inscrit dans la tradition de la pâtisserie tunisienne. Découvrez nos délices traditionnels, nos coffrets cadeaux et nos créations uniques.",
  keywords: ["pâtisserie", "tunisienne", "traditionnelle", "gâteaux", "hlou arbi", "Mme Daoud", "cadeaux"],
  authors: [{ name: "Pâtisserie Mme Daoud" }],
  openGraph: {
    title: "Pâtisserie Mme Daoud - Depuis 1996",
    description: "Découvrez les saveurs authentiques de la pâtisserie tunisienne traditionnelle",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <FavoritesProvider>
            <AnalyticsTracker />
            <StandardLayout>{children}</StandardLayout>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
