import Header from "@/components/layout/header";
import "./globals.css";
import { Inter } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/layout/footer";
import ThemeSwitch from "@/components/ui/theme-switch";
import BackToTop from "@/components/ui/back-to-top";
import ThemeContextProvider from "@/context/theme-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://devshadow.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saipavan Veeravalli | Full-Stack Developer & SEO Specialist",
    template: "%s | Saipavan Veeravalli",
  },
  description:
    "Portfolio of Saipavan Veeravalli — a full-stack developer specializing in Next.js, React, and Node.js with expertise in SEO and digital marketing.",
  keywords: [
    "Saipavan Veeravalli",
    "full-stack developer",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "SEO specialist",
    "web developer portfolio",
    "JavaScript developer",
    "TypeScript developer",
  ],
  authors: [{ name: "Saipavan Veeravalli", url: siteUrl }],
  creator: "Saipavan Veeravalli",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Saipavan Veeravalli Portfolio",
    title: "Saipavan Veeravalli | Full-Stack Developer & SEO Specialist",
    description:
      "Portfolio of Saipavan Veeravalli — a full-stack developer specializing in Next.js, React, and Node.js with expertise in SEO and digital marketing.",
    images: [
      {
        url: "/saipavan_veeravalli.png",
        width: 192,
        height: 192,
        alt: "Saipavan Veeravalli - Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saipavan Veeravalli | Full-Stack Developer & SEO Specialist",
    description:
      "Portfolio of Saipavan Veeravalli — a full-stack developer specializing in Next.js, React, and Node.js.",
    images: ["/saipavan_veeravalli.png"],
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
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Saipavan Veeravalli",
              url: siteUrl,
              image: `${siteUrl}/saipavan_veeravalli.png`,
              jobTitle: "Full-Stack Developer",
              sameAs: [
                "https://www.linkedin.com/in/saipavan-veeravalli/",
                "https://github.com/im-shadowpool",
              ],
              knowsAbout: [
                "Next.js",
                "React",
                "Node.js",
                "TypeScript",
                "SEO",
                "JavaScript",
                "MongoDB",
              ],
            }),
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
