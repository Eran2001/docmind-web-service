import type { Metadata, Viewport } from "next";

import { Providers } from "@/providers/Providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "DocMind — Answers from your documents. With sources.",
    template: "%s · DocMind",
  },
  description:
    "Upload PDFs, Word files, and web pages into collections. Ask questions in plain language and get answers that cite the exact page they came from.",
  openGraph: {
    title: "DocMind",
    description: "Answers from your documents. With sources.",
    type: "website",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
