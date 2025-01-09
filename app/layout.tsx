"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "./components/themeProvider";
import QueryProvider from "./QueryProvider/QueryProvider";
import { cn } from "../utils/utilis";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.variable
        )}
      >
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
