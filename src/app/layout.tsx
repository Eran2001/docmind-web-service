import type { Metadata, Viewport } from "next";

import { env } from "@/configs/env";
import { SIDEBAR_INIT_SCRIPT } from "@/lib/sidebar";
import { Providers } from "@/providers/Providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  // Relative image URLs (the share preview) are resolved against this.
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  applicationName: "DocMind",
  title: {
    default: "DocMind — Answers from your documents. With sources.",
    template: "%s · DocMind",
  },
  description:
    "Upload PDFs, Word files, and web pages into collections. Ask questions in plain language and get answers that cite the exact page they came from.",
  openGraph: {
    title: "DocMind: answers from your documents, with sources",
    description:
      "Upload your documents, ask in plain language, and get answers that cite the exact page they came from.",
    siteName: "DocMind",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocMind: answers from your documents, with sources",
    description:
      "Upload your documents, ask in plain language, and get answers that cite the exact page they came from.",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: SIDEBAR_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
