import Link from "next/link";

import { SITE_NAME } from "../lib/config";

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-secondary/60 bg-white/70 px-4 py-10 text-center backdrop-blur-sm sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-400 text-xl shadow-soft">
          🧩
        </div>
        <p className="text-base font-semibold text-text">
          Developed for Educational Learning Kit
        </p>
        <p className="mt-1 text-base font-bold leading-snug text-primary sm:text-lg">
          {SITE_NAME}
        </p>
        <div className="flex items-center justify-center gap-x-2">
          <p className="mt-4 text-sm text-text/55">
            สำหรับนักเรียนระดับมัธยมต้น
          </p>
          <Link
            href="/admin/login"
            className="mt-5 inline-block text-xs text-text/35 transition hover:text-text/60"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
