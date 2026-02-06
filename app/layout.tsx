import type { Metadata } from "next";
import { Onest, Inter, Jersey_10 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./src/auth/context/AuthContext";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jersey10 = Jersey_10({
  variable: "--font-jersey",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Stellar – Hackathons & Events Platform",
  description:
    "Discover, organize, and participate in Stellar ecosystem hackathons and events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }} data-theme="light">
      <body className={`${inter.variable} ${onest.variable} ${jersey10.variable} antialiased font-sans`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
