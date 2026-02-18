import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "bkend Blog — Build Faster, Ship Smarter",
    template: "%s | bkend Blog",
  },
  description:
    "A modern blog platform powered by bkend BaaS. Explore articles on backend development, AI-native tools, and building apps without infrastructure.",
  keywords: [
    "bkend",
    "BaaS",
    "backend as a service",
    "blog",
    "AI native",
    "MCP",
    "REST API",
  ],
  authors: [{ name: "bkend Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "bkend Blog",
    title: "bkend Blog — Build Faster, Ship Smarter",
    description:
      "A modern blog platform powered by bkend BaaS. Explore articles on backend development, AI-native tools, and building apps without infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bkend Blog — Build Faster, Ship Smarter",
    description:
      "A modern blog platform powered by bkend BaaS.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
