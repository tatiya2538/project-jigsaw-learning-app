"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { buildDefaultGameEntries } from "../../data/games";

export default function AdminDashboard({ characters, games = [] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newShortTitle, setNewShortTitle] = useState("");
  const [newImage, setNewImage] = useState("");

  const [togglingSlug, setTogglingSlug] = useState("");
  const [togglingGameId, setTogglingGameId] = useState("");
  const [gameList, setGameList] = useState(() =>
    games?.length ? games : buildDefaultGameEntries(),
  );

  useEffect(() => {
    setGameList(games?.length ? games : buildDefaultGameEntries());
  }, [games]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function handleReset() {
    if (confirmText.trim().toUpperCase() !== "RESET") {
      setError("พิมพ์คำว่า RESET ให้ถูกต้องก่อนยืนยัน");
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
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาดขณะรีเซ็ต");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    setCreating(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: newSlug,
          name: newName,
          shortTitle: newShortTitle || undefined,
          image: newImage || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "เพิ่มบุคคลไม่สำเร็จ");
        return;
      }

      setMessage(`เพิ่ม “${data.entry?.label || newName}” สำเร็จแล้ว`);
      setNewSlug("");
      setNewName("");
      setNewShortTitle("");
      setNewImage("");
      router.refresh();

      if (data.entry?.slug) {
        router.push(`/admin/${data.entry.slug}`);
      }
    } catch {
      setError("เกิดข้อผิดพลาดขณะเพิ่มบุคคล");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(slug, nextActive) {
    setTogglingSlug(slug);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/characters/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "อัปเดตสถานะไม่สำเร็จ");
        return;
      }

      setMessage(
        nextActive
          ? `เปิดใช้งาน “${data.entry?.label || slug}” แล้ว — นักเรียนจะเห็นในหน้าแรก`
          : `ปิดใช้งาน “${data.entry?.label || slug}” แล้ว — ซ่อนจากหน้านักเรียน`,
      );
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาดขณะอัปเดตสถานะ");
    } finally {
      setTogglingSlug("");
    }
  }

  async function handleToggleGameActive(id, nextActive) {
    setTogglingGameId(id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/games/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "อัปเดตสถานะเกมไม่สำเร็จ");
        return;
      }

      setGameList((prev) =>
        prev.map((game) =>
          game.id === id
            ? { ...game, ...(data.entry || {}), active: nextActive }
            : game,
        ),
      );

      setMessage(
        nextActive
          ? `เปิดเกม “${data.entry?.label || id}” แล้ว — แสดงในหน้าแรก`
          : `ปิดเกม “${data.entry?.label || id}” แล้ว — ซ่อนจากหน้านักเรียน`,
      );
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาดขณะอัปเดตสถานะเกม");
    } finally {
      setTogglingGameId("");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Admin</h1>
          <p className="mt-2 text-text/70">
            เปิด/ปิดเกมด้านล่างนี้ · เลือกบัตรเพื่อแก้ไข หรือเพิ่มบุคคลใหม่ได้ต่อ
          </p>
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
        <h2 className="text-lg font-bold text-text">
          เปิด / ปิดเกม ({gameList.length})
        </h2>
        <p className="text-sm text-text/60">
          กดปุ่มเพื่อซ่อนหรือแสดงเกมในหน้าแรกของนักเรียน
        </p>
        {gameList.map((game) => {
          const isActive = game.active !== false;

          return (
            <div
              key={game.id}
              className={`rounded-3xl bg-white p-5 shadow-card ${
                isActive ? "" : "opacity-80"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-text">
                      {game.emoji} {game.label}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isActive ? "เปิดอยู่" : "ปิดอยู่"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text/60">{game.href}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleGameActive(game.id, !isActive)}
                    disabled={togglingGameId === game.id}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
                      isActive
                        ? "border border-orange-200 bg-orange-50 text-orange-700"
                        : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {togglingGameId === game.id
                      ? "กำลังบันทึก..."
                      : isActive
                        ? "ปิดเกม"
                        : "เปิดเกม"}
                  </button>
                  <Link
                    href={game.href}
                    className="rounded-2xl bg-background px-4 py-2 text-sm font-semibold text-sky-700"
                  >
                    เปิดดู →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleCreate}
        className="mt-8 space-y-4 rounded-3xl bg-white p-5 shadow-card sm:p-6"
      >
        <div>
          <h2 className="text-xl font-bold text-text">เพิ่มบุคคลใหม่</h2>
          <p className="mt-1 text-sm text-text/65">
            สร้างบัตรใหม่บน Blob ได้ทันที ไม่ต้องแก้โค้ด — แล้วไปแต่งเนื้อหาต่อได้เลย
          </p>
        </div>

        <label className="block text-sm font-medium text-text">
          ชื่อที่แสดง
          <input
            required
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-secondary bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="เช่น พระอานนท์"
          />
        </label>

        <label className="block text-sm font-medium text-text">
          slug (ภาษาอังกฤษ)
          <input
            required
            value={newSlug}
            onChange={(event) =>
              setNewSlug(event.target.value.trim().toLowerCase())
            }
            className="mt-2 w-full rounded-2xl border border-secondary bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="เช่น ananda"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          />
          <span className="mt-1 block text-xs text-text/50">
            ใช้ใน URL เช่น /ananda — ตัวเล็ก ตัวเลข และขีดกลางเท่านั้น
          </span>
        </label>

        <label className="block text-sm font-medium text-text">
          คำโปรยสั้น (ไม่บังคับ)
          <input
            value={newShortTitle}
            onChange={(event) => setNewShortTitle(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-secondary bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="เช่น พระสาวกผู้เลิศด้านความทรงจำ"
          />
        </label>

        <label className="block text-sm font-medium text-text">
          URL รูปภาพ (ไม่บังคับ)
          <input
            value={newImage}
            onChange={(event) => setNewImage(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-secondary bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="ว่างไว้จะใช้ path มาตรฐานบน Blob"
          />
          <span className="mt-1 block text-xs text-text/50">
            ค่าเริ่มต้น: .../charactor/&#123;slug&#125;.webp — อัปรูปขึ้น Blob ให้ตรง path นี้
          </span>
        </label>

        <button
          type="submit"
          disabled={creating || loading}
          className="rounded-2xl bg-gradient-to-r from-accent to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-soft disabled:opacity-60"
        >
          {creating ? "กำลังสร้าง..." : "สร้างบุคคลใหม่"}
        </button>
      </form>

      <div className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-text">
          รายการบุคคล ({characters.length})
        </h2>
        <p className="text-sm text-text/60">
          Active = แสดงให้นักเรียน · Inactive = ซ่อนไว้ แต่แอดมินยังแก้ไขได้
        </p>
        {characters.map((character) => {
          const isActive = character.active !== false;

          return (
            <div
              key={character.slug}
              className={`rounded-3xl bg-white p-5 shadow-card ${
                isActive ? "" : "opacity-80"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-text">{character.label}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text/60">/{character.slug}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleActive(character.slug, !isActive)
                    }
                    disabled={togglingSlug === character.slug}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
                      isActive
                        ? "border border-orange-200 bg-orange-50 text-orange-700"
                        : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {togglingSlug === character.slug
                      ? "กำลังบันทึก..."
                      : isActive
                        ? "ตั้งเป็น Inactive"
                        : "ตั้งเป็น Active"}
                  </button>
                  <Link
                    href={`/admin/${character.slug}`}
                    className="rounded-2xl bg-background px-4 py-2 text-sm font-semibold text-accent"
                  >
                    แก้ไข →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showResetModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-xl font-bold text-text">ยืนยันการรีเซ็ต</h2>
            <p className="mt-3 text-sm leading-relaxed text-text/75">
              การรีเซ็ตจะดึงข้อมูลจากไฟล์ในโค้ดไปทับบน Blob
              <span className="font-semibold">เฉพาะบุคคลที่มี seed ในโปรเจกต์</span>
              และจะซิงค์ catalog ให้ครบ
              <span className="font-semibold text-orange-700">
                {" "}
                บุคคลที่เพิ่มจาก Admin จะไม่ถูกลบ
              </span>
              แต่เนื้อหาของบุคคลในโค้ดจะถูกทับ
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
