"use client";

import Link from "next/link";
import { useState } from "react";

import { SECTION_LABELS, normalizeSections } from "../../lib/sections";

function Section({ title, children }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-xl font-bold text-text">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-text">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-secondary bg-background px-4 py-3 text-base text-text outline-none focus:ring-2 focus:ring-primary/40";

export default function AdminEditor({ slug, initialData }) {
  const [data, setData] = useState({
    ...initialData,
    sections: normalizeSections(initialData.sections),
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(path, value) {
    setData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let cursor = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        cursor = cursor[keys[i]];
      }

      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function toggleSection(key) {
    setData((prev) => ({
      ...prev,
      sections: {
        ...normalizeSections(prev.sections),
        [key]: !normalizeSections(prev.sections)[key],
      },
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/content/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error || "บันทึกไม่สำเร็จ");
        return;
      }

      setMessage("บันทึกสำเร็จแล้ว — ลองรีเฟรชหน้าบัตรได้เลย");
    } catch {
      setError("เกิดข้อผิดพลาดขณะบันทึก");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-3xl space-y-5 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm font-semibold text-accent">
            ← กลับรายการ
          </Link>
          <Link
            href="/"
            className="ml-3 text-sm font-semibold text-text/60 hover:text-text"
          >
            หน้าแรก
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-text">แก้ไข: {slug}</h1>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-gradient-to-r from-primary to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-soft disabled:opacity-60"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกเนื้อหา"}
        </button>
      </div>

      {message ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-700">
          {error}
        </p>
      ) : null}

      <Section title="แสดง / ซ่อนส่วนต่าง ๆ">
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTION_LABELS.map((item) => {
            const enabled = data.sections?.[item.key] !== false;

            return (
              <label
                key={item.key}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 px-4 py-3 transition ${
                  enabled
                    ? "border-accent/40 bg-emerald-50"
                    : "border-transparent bg-background"
                }`}
              >
                <span className="text-sm font-medium text-text">{item.label}</span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => toggleSection(item.key)}
                  className="h-5 w-5 accent-primary"
                />
              </label>
            );
          })}
        </div>
        <p className="text-xs text-text/55">
          ปิดส่วนใดส่วนหนึ่งแล้ว ส่วนนั้นจะไม่แสดงในหน้าบัตรของนักเรียน
        </p>
      </Section>

      <Section title="ข้อมูลหลัก">
        <Field label="ชื่อ">
          <input
            className={inputClass}
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </Field>
        <Field label="คำโปรยสั้น">
          <input
            className={inputClass}
            value={data.shortTitle}
            onChange={(e) => updateField("shortTitle", e.target.value)}
          />
        </Field>
        <Field label="บทนำ Hero">
          <textarea
            className={inputClass}
            rows={3}
            value={data.heroIntro}
            onChange={(e) => updateField("heroIntro", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="ชีวประวัติ (ย่อหน้า)">
        {data.biography.paragraphs.map((paragraph, index) => (
          <Field key={index} label={`ย่อหน้า ${index + 1}`}>
            <textarea
              className={inputClass}
              rows={3}
              value={paragraph}
              onChange={(e) => {
                const paragraphs = [...data.biography.paragraphs];
                paragraphs[index] = e.target.value;
                updateField("biography.paragraphs", paragraphs);
              }}
            />
          </Field>
        ))}
      </Section>

      <Section title="เหตุการณ์สำคัญ">
        {data.timeline.map((event, index) => (
          <div key={event.id || index} className="rounded-2xl bg-background p-4">
            <p className="mb-3 text-sm font-semibold text-primary">
              เหตุการณ์ {index + 1}
            </p>
            <Field label="หัวข้อเหตุการณ์">
              <input
                className={inputClass}
                value={event.title}
                onChange={(e) => {
                  const timeline = structuredClone(data.timeline);
                  timeline[index].title = e.target.value;
                  updateField("timeline", timeline);
                }}
              />
            </Field>
            <div className="mt-3">
              <Field label="รายละเอียด">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={event.description}
                  onChange={(e) => {
                    const timeline = structuredClone(data.timeline);
                    timeline[index].description = e.target.value;
                    updateField("timeline", timeline);
                  }}
                />
              </Field>
            </div>
          </div>
        ))}
      </Section>

      <Section title="คุณธรรม">
        {data.virtues.map((virtue, index) => (
          <div key={virtue.id || index} className="rounded-2xl bg-background p-4">
            <p className="mb-3 text-sm font-semibold text-primary">
              คุณธรรม {index + 1}
            </p>
            <div className="grid gap-3 sm:grid-cols-[100px_1fr]">
              <Field label="อีโมจิ">
                <input
                  className={inputClass}
                  value={virtue.emoji}
                  onChange={(e) => {
                    const virtues = structuredClone(data.virtues);
                    virtues[index].emoji = e.target.value;
                    updateField("virtues", virtues);
                  }}
                />
              </Field>
              <Field label="ชื่อคุณธรรม">
                <input
                  className={inputClass}
                  value={virtue.title}
                  onChange={(e) => {
                    const virtues = structuredClone(data.virtues);
                    virtues[index].title = e.target.value;
                    updateField("virtues", virtues);
                  }}
                />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="คำอธิบาย">
                <textarea
                  className={inputClass}
                  rows={2}
                  value={virtue.description}
                  onChange={(e) => {
                    const virtues = structuredClone(data.virtues);
                    virtues[index].description = e.target.value;
                    updateField("virtues", virtues);
                  }}
                />
              </Field>
            </div>
          </div>
        ))}
      </Section>

      <Section title="ข้อคิดในชีวิตประจำวัน">
        <Field label="คำคม">
          <textarea
            className={inputClass}
            rows={3}
            value={data.lifeLesson.quote}
            onChange={(e) => updateField("lifeLesson.quote", e.target.value)}
          />
        </Field>
        <Field label="คำอธิบายเพิ่ม">
          <textarea
            className={inputClass}
            rows={3}
            value={data.lifeLesson.note}
            onChange={(e) => updateField("lifeLesson.note", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="คำถามชวนคิด">
        {data.discussions.map((item, index) => (
          <Field key={item.id || index} label={`คำถาม ${index + 1}`}>
            <textarea
              className={inputClass}
              rows={3}
              value={item.question}
              onChange={(e) => {
                const discussions = structuredClone(data.discussions);
                discussions[index].question = e.target.value;
                updateField("discussions", discussions);
              }}
            />
          </Field>
        ))}
      </Section>

      <Section title="ข้อมูลเสียง (ข้อความ)">
        <Field label="ชื่อเรื่องเสียง">
          <input
            className={inputClass}
            value={data.audio.title}
            onChange={(e) => updateField("audio.title", e.target.value)}
          />
        </Field>
        <Field label="คำบรรยายเสียง">
          <input
            className={inputClass}
            value={data.audio.subtitle}
            onChange={(e) => updateField("audio.subtitle", e.target.value)}
          />
        </Field>
        <Field label="ระยะเวลา (เช่น 01:33)">
          <input
            className={inputClass}
            value={data.audio.duration}
            onChange={(e) => updateField("audio.duration", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="แบบทดสอบ">
        {data.quiz.map((quiz, index) => (
          <div key={quiz.id || index} className="rounded-2xl bg-background p-4">
            <p className="mb-3 text-sm font-semibold text-primary">
              ข้อ {index + 1}
            </p>
            <Field label="คำถาม">
              <textarea
                className={inputClass}
                rows={2}
                value={quiz.question}
                onChange={(e) => {
                  const nextQuiz = structuredClone(data.quiz);
                  nextQuiz[index].question = e.target.value;
                  updateField("quiz", nextQuiz);
                }}
              />
            </Field>
            <div className="mt-3 space-y-2">
              {quiz.options.map((option, optionIndex) => (
                <Field key={optionIndex} label={`ตัวเลือก ${optionIndex + 1}`}>
                  <input
                    className={inputClass}
                    value={option}
                    onChange={(e) => {
                      const nextQuiz = structuredClone(data.quiz);
                      nextQuiz[index].options[optionIndex] = e.target.value;
                      updateField("quiz", nextQuiz);
                    }}
                  />
                </Field>
              ))}
            </div>
            <div className="mt-3">
              <Field label="คำตอบที่ถูก (เลขลำดับ 0-3)">
                <input
                  type="number"
                  min="0"
                  max="3"
                  className={inputClass}
                  value={quiz.correctIndex}
                  onChange={(e) => {
                    const nextQuiz = structuredClone(data.quiz);
                    nextQuiz[index].correctIndex = Number(e.target.value);
                    updateField("quiz", nextQuiz);
                  }}
                />
              </Field>
            </div>
          </div>
        ))}
      </Section>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-2xl bg-gradient-to-r from-primary to-amber-500 px-5 py-3 text-base font-bold text-white shadow-soft disabled:opacity-60"
      >
        {saving ? "กำลังบันทึก..." : "บันทึกเนื้อหา"}
      </button>
    </form>
  );
}
