import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Seigaiha from "@/components/ui/seigaiha";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Saipavan Veeravalli",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main id="main">
      <div className="mx-auto max-w-column pb-10">
        <div className="dots-b relative h-32 overflow-hidden">
          <Seigaiha scale={1.1} />
        </div>
        <div className="px-4 py-16">
          <p className="label mb-3">Error 404</p>
          <h1 className="font-display text-5xl font-medium tracking-tight">Lost at sea.</h1>
          <p className="mb-8 mt-3 text-ink-soft">This page doesn&apos;t exist, or it drifted away.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-3.5 py-2 text-[0.85rem] font-medium text-paper transition-transform active:scale-[0.97]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
