import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "./contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kerelys - Premium Minoxidil Solutions",
  description: "Transform your hair growth journey with Kerelys premium minoxidil solutions. Clinically proven, FDA-approved hair regrowth treatment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Toaster />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
