"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDashboard({ characters }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function handleReset() {
    if (confirmText.trim().toUpperCase() !== "RESET") {
      setError('พิมพ์คำว่า RESET ให้ถูกต้องก่อนยืนยัน');
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/seed", { method: "POST" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "รีเซ็ตไม่สำเร็จ");
        return;
      }

      setMessage(
        `รีเซ็ตจากไฟล์โค้ดสำเร็จ ${data.results?.length || 0} รายการ (ข้อมูลที่แก้ใน Admin ถูกทับแล้ว)`,
      );
      setShowResetModal(false);
      setConfirmText("");
    } catch {
      setError("เกิดข้อผิดพลาดขณะรีเซ็ต");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Admin</h1>
          <p className="mt-2 text-text/70">เลือกบัตรเพื่อแก้ไขเนื้อหา</p>
          <p className="mt-2 text-xs text-text/50">
            แก้เสร็จกด “บันทึก” ในหน้ารายละเอียดเท่านั้น — ไม่ต้องรีเซ็ตทุกครั้ง
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-text shadow-soft"
          >
            ← หน้าแรก
          </Link>
          <button
            type="button"
            onClick={() => {
              setShowResetModal(true);
              setConfirmText("");
              setError("");
            }}
            disabled={loading}
            className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 disabled:opacity-60"
          >
            รีเซ็ตจากไฟล์โค้ด
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-text shadow-soft"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 space-y-3">
        {characters.map((character) => (
          <Link
            key={character.slug}
            href={`/admin/${character.slug}`}
            className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div>
              <p className="font-bold text-text">{character.label}</p>
              <p className="mt-1 text-sm text-text/60">/{character.slug}</p>
            </div>
            <span className="text-sm font-semibold text-accent">แก้ไข →</span>
          </Link>
        ))}
      </div>

      {showResetModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-xl font-bold text-text">ยืนยันการรีเซ็ต</h2>
            <p className="mt-3 text-sm leading-relaxed text-text/75">
              การรีเซ็ตจะดึงข้อมูลจากไฟล์ในโค้ดไปทับบน Blob
              <span className="font-semibold text-orange-700">
                {" "}
                ข้อมูลที่ admin คนอื่นแก้ไว้จะหายทั้งหมด
              </span>
            </p>
            <p className="mt-3 text-sm text-text/70">
              พิมพ์ <span className="font-bold">RESET</span> เพื่อยืนยัน
            </p>
            <input
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="RESET"
            />
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setConfirmText("");
                }}
                className="flex-1 rounded-2xl bg-background px-4 py-3 text-sm font-semibold text-text"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || confirmText.trim().toUpperCase() !== "RESET"}
                className="flex-1 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {loading ? "กำลังรีเซ็ต..." : "ยืนยันรีเซ็ต"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
