"use client";

import { toPng } from "html-to-image";
import { useRef, useState } from "react";

function CameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M9 3a1 1 0 0 0-.8.4L6.9 5H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-1.9l-1.3-1.6A1 1 0 0 0 15 3H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function safeFileName(value) {
  return String(value || "section")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export default function SectionCapture({
  enabled = false,
  label,
  filePrefix = "",
  children,
}) {
  const targetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!enabled) {
    return children;
  }

  async function handleCapture() {
    if (!targetRef.current) return;

    setLoading(true);
    setError("");

    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#FFFDF7",
        filter: (node) => {
          if (!(node instanceof HTMLElement)) return true;
          return !node.dataset?.captureIgnore;
        },
      });

      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      link.download = `${safeFileName(filePrefix)}-${safeFileName(label)}-${stamp}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("แคปไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <div className="pointer-events-auto flex flex-col items-end gap-1">
          <button
            type="button"
            data-capture-ignore="true"
            onClick={handleCapture}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-text shadow-soft backdrop-blur-sm transition hover:bg-secondary/80 disabled:opacity-60"
          >
            <CameraIcon />
            {loading ? "กำลังแคป..." : "Capture"}
          </button>
          {error ? (
            <span
              data-capture-ignore="true"
              className="rounded-full bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-700"
            >
              {error}
            </span>
          ) : null}
        </div>
      </div>
      <div ref={targetRef}>{children}</div>
    </div>
  );
}
