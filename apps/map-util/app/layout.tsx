import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Map Util",
  description: "A tool to integrate map functions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
