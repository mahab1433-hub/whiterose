import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.whiterosekeysoulcosmatics.com'),
  title: {
    default: "White Rose Beauty Parlour Cosmetics & Tattoo Studio | Premium Luxury",
    template: "%s | White Rose Beauty Parlour"
  },
  description: "Experience the harmony of premium beauty care and world-class tattoo artistry at White Rose Beauty Parlour Cosmetics & Tattoo Studio.",
  keywords: ["beauty", "tattoo", "makeup", "skincare", "haircare", "luxury beauty"],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "White Rose Beauty Parlour Cosmetics & Tattoo Studio",
    description: "Experience the harmony of premium beauty care and world-class tattoo artistry at White Rose Beauty Parlour Cosmetics & Tattoo Studio.",
    url: 'https://www.whiterosekeysoulcosmatics.com',
    siteName: 'White Rose Beauty Parlour Cosmetics & Tattoo',
    images: [
      {
        url: '/logo.png',
        width: 1536,
        height: 1536,
        alt: 'White Rose Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "White Rose Beauty Parlour Cosmetics & Tattoo Studio",
    description: "Experience the harmony of premium beauty care and world-class tattoo artistry at White Rose Beauty Parlour Cosmetics & Tattoo Studio.",
    images: ['/logo.png'],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "White Rose Beauty Parlour Cosmetics & Tattoo",
  url: "https://www.whiterosekeysoulcosmatics.com",
  logo: "https://www.whiterosekeysoulcosmatics.com/logo.png",
  sameAs: [
    "https://www.instagram.com/white_roseparlour?igsh=MWpiYmYwMWk5cm45eQ=="
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-black text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
