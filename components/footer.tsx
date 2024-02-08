import React from "react";
import { start } from "repl";

export default function Footer() {
  return (
    <footer className="mb-10 px-4 text-center text-gray-500">
      <small className="mb-2 block text-xs">&copy; 2024 devshadow.live.</small>
      <p className="text-xs mb-1">
        Design inspired by{" "}
        <a className="italic" href="https://bytegrad.com/">
          Wesley
        </a>
        .
      </p>
      <p className="text-xs">
        <span className="font-semibold">Built with </span>
        React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS,
        Framer Motion, React Email & Resend.
      </p>
    </footer>
  );
}
