import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "QC Production"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100vh" }}>
      <body style={{ height: "100%" }}>
        {children}
      </body>
    </html>
  );
}
