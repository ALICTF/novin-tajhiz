import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const vazir = Vazirmatn({ 
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نوین تجهیز | مرکز تخصصی خواب",
  description: "مرکز تخصصی فروش و تعمیرات تجهیزات کمک تنفسی و خواب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.className} min-h-screen flex flex-col bg-slate-50`}>
        
        <Header />
        
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}