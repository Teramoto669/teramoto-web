import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rezha Shahidzinda — Portfolio",
  description:
    "Computer Science Student | Modder — Python, Next.js, Vite, TypeScript, C#, Kotlin, Flutter",
  keywords: [
    "Rezha Shahidzinda",
    "portfolio",
    "developer",
    "Computer Science",
    "Teramoto669",
  ],
  authors: [{ name: "Rezha Shahidzinda" }],
  openGraph: {
    title: "Rezha Shahidzinda — Portfolio",
    description: "Informatics Engineering Student | Modder",
    type: "website",
  },
};

import CustomCursor from "@/components/CustomCursor";
import Particles from "@/components/Particles";
import SpotlightEffect from "@/components/SpotlightEffect";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                if (!theme) theme = 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Particles />
          <CustomCursor />
          <SpotlightEffect />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
