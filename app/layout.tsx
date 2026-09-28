import Header from "@/components/layout/header";
import "./globals.css";
import { Caveat, Geist, Geist_Mono, Shippori_Mincho } from "next/font/google";
import type { Metadata, Viewport } from "next";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/layout/footer";
import ThemeContextProvider from "@/context/theme-context";
import SeasonProvider from "@/components/providers/season";
import ShojiTransition from "@/components/ui/shoji-transition";
import Shortcuts from "@/components/ui/shortcuts";

const display = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// Handwriting for the margin doodles
const hand = Caveat({ subsets: ["latin"], weight: ["500"], variable: "--font-hand", display: "swap" });

const siteUrl = "https://devshadow.space";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saipavan Veeravalli | Full-Stack Developer & SEO Specialist",
    template: "%s | Saipavan Veeravalli",
  },
  description:
    "Portfolio of Saipavan Veeravalli — a full-stack developer specializing in Next.js, React, and Node.js with expertise in SEO, web performance, and modern cloud architecture.",
  applicationName: "Saipavan Veeravalli Portfolio",
  keywords: [
    "Saipavan Veeravalli",
    "devshadow",
    "devshadow.space",
    "full-stack developer",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "SEO specialist",
    "web developer portfolio",
    "JavaScript developer",
    "TypeScript developer",
    "software engineer",
    "frontend developer",
    "backend developer",
  ],
  authors: [{ name: "Saipavan Veeravalli", url: siteUrl }],
  creator: "Saipavan Veeravalli",
  publisher: "Saipavan Veeravalli",
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Saipavan Veeravalli Portfolio",
    title: "Saipavan Veeravalli | Full-Stack Developer & SEO Specialist",
    description:
      "Portfolio of Saipavan Veeravalli — full-stack developer specializing in Next.js, React, and Node.js with expertise in SEO and modern web technologies.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Saipavan Veeravalli - Full-Stack Developer & SEO Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saipavan Veeravalli | Full-Stack Developer & SEO Specialist",
    description:
      "Portfolio of Saipavan Veeravalli — full-stack developer specializing in Next.js, React, and Node.js with expertise in SEO and web performance.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@im_shadowpool",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Saipavan Veeravalli Portfolio",
      description:
        "Full-stack developer portfolio specializing in Next.js, React, and Node.js with SEO expertise.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Saipavan Veeravalli",
      url: siteUrl,
      image: `${siteUrl}/saipavan-veeravalli.png`,
      jobTitle: "Full-Stack Developer & SEO Specialist",
      description:
        "Full-Stack Developer specializing in Next.js, React, Node.js, and technical SEO.",
      email: "mailto:v.saipavan2001@gmail.com",
      sameAs: [
        "https://www.linkedin.com/in/saipavan-veeravalli/",
        "https://github.com/im-shadowpool",
        "https://x.com/im_shadowpool",
        "https://www.instagram.com/im_shadowpool/",
        "https://codepen.io/shadowpool",
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Avanthi Institute of Engineering and Technology",
      },
      knowsAbout: [
        "Next.js",
        "React",
        "Node.js",
        "TypeScript",
        "JavaScript",
        "SEO",
        "Search Engine Optimization",
        "Tailwind CSS",
        "MongoDB",
        "REST APIs",
        "Data Structures & Algorithms",
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#projects`,
      name: "Featured Projects by Saipavan Veeravalli",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "WebApplication",
            name: "Admin Dashboard",
            description:
              "Full-stack admin dashboard to manage e-commerce analytics, real-time revenue tracking, and data visualization.",
            url: "https://admin-dashboard-ten-nu-63.vercel.app/dashboard",
            applicationCategory: "BusinessApplication",
            operatingSystem: "All",
            author: { "@id": `${siteUrl}/#person` },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "WebApplication",
            name: "Sticky Docs",
            description:
              "Interactive note-taking application featuring draggable cards, color categorization, and database persistence.",
            url: "https://sticky-docs.vercel.app/",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "All",
            author: { "@id": `${siteUrl}/#person` },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "WebApplication",
            name: "DealsTracker",
            description:
              "E-commerce price tracking platform with price drop alerts, historical trend charts, and automated web scraping.",
            url: "https://dealstracker.vercel.app/",
            applicationCategory: "ShoppingApplication",
            operatingSystem: "All",
            author: { "@id": `${siteUrl}/#person` },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "WebApplication",
            name: "RiteBlog App",
            description:
              "Full-featured blogging platform with user authentication, role-based authorization, and rich text editing.",
            url: "https://riteblogapp-project-vmy7.vercel.app/",
            applicationCategory: "PublishingApplication",
            operatingSystem: "All",
            author: { "@id": `${siteUrl}/#person` },
          },
        },
        {
          "@type": "ListItem",
          position: 5,
          item: {
            "@type": "WebApplication",
            name: "Memory Game",
            description:
              "Interactive memory card matching game featuring multiple difficulty levels and score tracking.",
            url: "https://memory-game-nine-delta.vercel.app/",
            applicationCategory: "GameApplication",
            operatingSystem: "All",
            author: { "@id": `${siteUrl}/#person` },
          },
        },
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Saipavan Veeravalli | Full-Stack Developer & SEO Specialist",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#person`,
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
      hasPart: [
        {
          "@id": `${siteUrl}/#projects`,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', dark);
                  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} ${hand.variable} overflow-x-clip font-sans`}
      >
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>

        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <SeasonProvider>
              <Header />
              {children}
              <Footer />
              <ShojiTransition />
              <Shortcuts />
            </SeasonProvider>
          </ActiveSectionContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
