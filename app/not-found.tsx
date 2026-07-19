import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted mb-8">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none hover:scale-105 hover:bg-gray-950 active:scale-90 transition dark:bg-white dark:bg-opacity-10"
      >
        Back to Home
      </Link>
    </main>
  );
}
