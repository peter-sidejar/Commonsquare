import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CommonSquare — See Where You Stand",
  description:
    "Stop watching politics. Start debating it. Take the political profile quiz and discover your ideological position.",
  metadataBase: new URL("https://commonsquare.us"),
  openGraph: {
    title: "CommonSquare — See Where You Stand",
    description:
      "Take the 5-minute political profile quiz. No sign-up required.",
    siteName: "CommonSquare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommonSquare — See Where You Stand",
    description:
      "Take the 5-minute political profile quiz. No sign-up required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
