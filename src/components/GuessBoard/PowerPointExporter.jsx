"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { exportGuessBoardPptx } from "../../lib/pptExporter";

export default function PowerPointExporter() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleExport() {
    if (busy) return;
    setBusy(true);
    setMessage("กำลังสร้าง PowerPoint...");
    try {
      await exportGuessBoardPptx();
      setMessage("ดาวน์โหลดเรียบร้อย");
    } catch (error) {
      console.error(error);
      setMessage("สร้างไฟล์ไม่สำเร็จ ลองอีกครั้ง");
    } finally {
      setBusy(false);
      window.setTimeout(() => setMessage(""), 2800);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={busy}
        onClick={handleExport}
        className="rounded-2xl border border-amber-300/30 bg-amber-400/15 px-4 py-2 text-sm font-bold text-amber-100 shadow-lg backdrop-blur-md disabled:opacity-50"
      >
        {busy ? "กำลังสร้างไฟล์..." : "📥 ดาวน์โหลด PowerPoint"}
      </motion.button>
      {message ? (
        <p className="text-xs text-slate-400">{message}</p>
      ) : null}
    </div>
  );
}
