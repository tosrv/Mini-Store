import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Initializer from "@/components/auth/Initializer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yellow Store",
  description:
    "Discover a wide selection of trendy clothes, shoes and accessories on Yellow. Enjoy fast delivery and free returns. Shop now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}  antialiased flex flex-col min-h-screen`}
      >
        <Initializer />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
