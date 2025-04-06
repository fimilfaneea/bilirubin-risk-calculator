import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bilirubin Risk Assessment",
  description: "Calculate bilirubin risk levels based on gestational age and other factors",
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
