import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { EditorsDesk } from "@/components/EditorsDesk";
import { site } from "@/content/site";
import "./globals.css";

const display = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Only the display face is preloaded so the cover photo isn't stuck behind font downloads.
const serif = Newsreader({
  variable: "--font-newsreader",
  preload: false,
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const sans = Archivo({
  variable: "--font-archivo",
  preload: false,
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.title,
    template: `%s | ${site.name}`,
  },
  description: site.seo.description,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f2ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Lets the scroll-reveal styles hide content only when JavaScript is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');try{if(localStorage.getItem('edition')==='night')document.documentElement.dataset.theme='night'}catch(e){}" }} />
      </head>
      <body className="min-h-dvh">
        {children}
        <EditorsDesk />
        <Analytics />
      </body>
    </html>
  );
}
