import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="en">
      <body
        className={`${onest.variable} antialiased`}
        style={{ fontFamily: "var(--font-onest)" }}
      >
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
