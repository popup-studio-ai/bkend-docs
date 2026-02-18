import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Recipe App - Your Personal Kitchen Manager",
    template: "%s | Recipe App",
  },
  description:
    "A full-featured recipe management app powered by bkend BaaS. Manage recipes, plan meals, create shopping lists, and track your cooking journey.",
  keywords: ["bkend", "BaaS", "recipe", "meal plan", "shopping list", "cooking"],
  authors: [{ name: "bkend Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Recipe App",
    title: "Recipe App - Your Personal Kitchen Manager",
    description:
      "A full-featured recipe management app powered by bkend BaaS.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recipe App - Your Personal Kitchen Manager",
    description:
      "A full-featured recipe management app powered by bkend BaaS.",
  },
  robots: { index: true, follow: true },
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
