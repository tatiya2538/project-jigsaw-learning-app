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

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(data);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i);
  }

  return new File([array], fileName, { type: mime });
}

export default function SectionCapture({
  enabled = false,
  label,
  filePrefix = "",
  children,
}) {
  const targetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");

  if (!enabled) {
    return children;
  }

  async function createImage() {
    if (!targetRef.current) {
      throw new Error("ไม่พบส่วนที่ต้องการแคป");
    }

    const mobile = isMobileDevice();
    const options = {
      cacheBust: true,
      pixelRatio: mobile ? 1.5 : 2,
      backgroundColor: "#FFFDF7",
      skipFonts: true,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;
        return !node.dataset?.captureIgnore;
      },
    };

    try {
      return await toPng(targetRef.current, options);
    } catch {
      // iPhone often fails on first attempt / high pixelRatio
      return await toPng(targetRef.current, {
        ...options,
        pixelRatio: 1,
      });
    }
  }

  async function handleCapture() {
    setLoading(true);
    setError("");

    try {
      const dataUrl = await createImage();
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      const nextFileName = `${safeFileName(filePrefix)}-${safeFileName(label)}-${stamp}.png`;

      setPreviewUrl(dataUrl);
      setFileName(nextFileName);

      // Desktop: still try direct download
      if (!isMobileDevice()) {
        const link = document.createElement("a");
        link.download = nextFileName;
        link.href = dataUrl;
        link.click();
      }
    } catch {
      setError("แคปไม่สำเร็จบนเครื่องนี้ ลองเลื่อนให้เห็นทั้งส่วนแล้วกดใหม่");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!previewUrl) return;

    setSharing(true);
    setError("");

    try {
      const file = dataUrlToFile(previewUrl, fileName || "capture.png");

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: label,
          text: "บันทึกภาพส่วนนี้เป็นผลงาน",
        });
        return;
      }

      // Fallback: open image in new tab for long-press save
      const opened = window.open(previewUrl, "_blank");
      if (!opened) {
        setError("เปิดรูปไม่สำเร็จ — กดค้างที่รูปด้านล่างแล้วเลือก Save Image");
      }
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        setError("แชร์ไม่สำเร็จ — กดค้างที่รูปแล้วเลือก Save Image");
      }
    } finally {
      setSharing(false);
    }
  }

  function handleClosePreview() {
    setPreviewUrl("");
    setFileName("");
    setError("");
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
          {error && !previewUrl ? (
            <span
              data-capture-ignore="true"
              className="max-w-[220px] rounded-full bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-700"
            >
              {error}
            </span>
          ) : null}
        </div>
      </div>

      <div ref={targetRef}>{children}</div>

      {previewUrl ? (
        <div
          data-capture-ignore="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-white p-4 shadow-card sm:p-6">
            <h3 className="text-lg font-bold text-text">บันทึกภาพ: {label}</h3>
            <p className="mt-2 text-sm text-text/70">
              บน iPhone กด <span className="font-semibold">แชร์ไปยังรูปภาพ</span>{" "}
              หรือกดค้างที่รูปแล้วเลือก Save Image
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={`Capture ${label}`}
              className="mt-4 w-full rounded-2xl border border-secondary/60"
            />

            {error ? (
              <p className="mt-3 text-sm font-medium text-orange-700">{error}</p>
            ) : null}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleShare}
                disabled={sharing}
                className="flex-1 rounded-2xl bg-gradient-to-r from-primary to-amber-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {sharing ? "กำลังแชร์..." : "แชร์ / บันทึกรูป"}
              </button>
              <a
                href={previewUrl}
                download={fileName}
                className="flex-1 rounded-2xl bg-secondary px-4 py-3 text-center text-sm font-semibold text-amber-900"
              >
                ดาวน์โหลด
              </a>
              <button
                type="button"
                onClick={handleClosePreview}
                className="flex-1 rounded-2xl bg-background px-4 py-3 text-sm font-semibold text-text"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
