import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "GetSet - Smart Closet Organizer",
  description: "Organize your daily outfits with AI-powered weather-based suggestions",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className="antialiased bg-slate-50">
        <ToastProvider>
          <div className="flex h-screen overflow-hidden">
            <Navigation />
            <main className="flex-1 overflow-y-auto md:ml-64 pb-16 md:pb-0">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
