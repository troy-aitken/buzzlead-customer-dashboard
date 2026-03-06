import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuzzLead Dashboard",
  description: "Customer performance dashboard for BuzzLead",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`}>
        <div className="min-h-screen">
          <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <h1 className="text-xl font-semibold text-white">BuzzLead</h1>
                </div>
                <div className="text-sm text-slate-400">
                  Performance Dashboard
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
