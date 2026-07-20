"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-card sm:p-8"
    >
      <h1 className="text-2xl font-bold text-text">Admin Login</h1>
      <p className="mt-2 text-sm text-text/65">
        เข้าสู่ระบบเพื่อแก้ไขเนื้อหาบัตรการเรียนรู้
      </p>

      <label className="mt-6 block text-sm font-medium text-text">
        รหัสผ่าน
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-secondary bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="กรอกรหัสผ่าน"
          required
        />
      </label>

      {error ? (
        <p className="mt-3 text-sm font-medium text-orange-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-primary to-amber-500 px-4 py-3 font-bold text-white shadow-soft transition hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
