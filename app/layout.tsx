import Header from "@/components/layout/header";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/layout/footer";
import ThemeSwitch from "@/components/ui/theme-switch";
import BackToTop from "@/components/ui/back-to-top";
import ThemeContextProvider from "@/context/theme-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://devshadow.space";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbe2e3" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
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
    creator: "@im-shadowpool",
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
      image: `${siteUrl}/saipavan_veeravalli.png`,
      jobTitle: "Full-Stack Developer & SEO Specialist",
      description:
        "Full-Stack Developer specializing in Next.js, React, Node.js, and technical SEO.",
      email: "mailto:v.saipavan2001@gmail.com",
      sameAs: [
        "https://www.linkedin.com/in/saipavan-veeravalli/",
        "https://github.com/im-shadowpool1",
        "https://github.com/im-shadowpool",
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
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
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
                  var theme = localStorage.getItem('theme');
                  var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && supportDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-bodyBg text-main relative pt-28 sm:pt-36`}
      >
        <a
          href="#home"
          className="fixed top-0 left-0 z-[10000] bg-gray-900 text-white px-4 py-3 -translate-y-full focus:translate-y-0 transition-transform font-medium"
        >
          Skip to main content
        </a>

        <div className="bg-[#e2fbea] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#628c94]" aria-hidden="true"></div>
        <div className="bg-[#d7ecfb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]" aria-hidden="true"></div>

        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Header />
            {children}
            <Footer />

            <Toaster position="top-right" />
            <ThemeSwitch />
            <BackToTop />
          </ActiveSectionContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
