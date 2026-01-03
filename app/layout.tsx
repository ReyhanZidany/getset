import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GetSet - Smart Closet Organizer",
  description: "Organize your daily outfits with AI-powered weather-based suggestions",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
