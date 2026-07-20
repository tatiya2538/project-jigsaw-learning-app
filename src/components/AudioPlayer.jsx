"use client";

import Image from "next/image";
import { useState } from "react";

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-7 w-7"
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-7 w-7"
    >
      <path d="M7 5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm7 0a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-3Z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-text/70"
    >
      <path d="M11.5 4.2a1 1 0 0 0-1.6-.8L5.8 6.5H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.8l4.1 3.1a1 1 0 0 0 1.6-.8V4.2Zm5.2 2.4a1 1 0 0 0-.2 1.4 4 4 0 0 1 0 5.2 1 1 0 1 0 1.6 1.2 6 6 0 0 0 0-7.6 1 1 0 0 0-1.4-.2Zm2.4-2.3a1 1 0 0 0-.1 1.4 7.5 7.5 0 0 1 0 10.6 1 1 0 1 0 1.5 1.3 9.5 9.5 0 0 0 0-13.2 1 1 0 0 0-1.4-.1Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L11 12.6V4a1 1 0 0 1 1-1ZM5 18a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

export default function AudioPlayer({
  title,
  subtitle,
  duration,
  imageSrc,
  name,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(35);
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState("1x");

  const speeds = ["0.75x", "1x", "1.25x", "1.5x"];

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mt-8 mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">
            Audio Narration
          </h2>
          <p className="mt-2 text-text/70">
            ฟังเรื่องราวก่อนไปเล่าให้เพื่อนฟัง
          </p>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-primary" />
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-card sm:p-7 animate-fade-in-up">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-amber-300 to-secondary shadow-soft sm:mx-0 sm:h-32 sm:w-32">
              <Image
                src={imageSrc}
                alt={name || title}
                fill
                sizes="128px"
                className="object-contain p-1"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-text sm:text-xl">
                {title}
              </h3>
              <p className="mt-1 text-sm text-text/65">{subtitle}</p>
              <p className="mt-2 inline-flex rounded-full bg-secondary/60 px-3 py-1 text-sm font-medium text-amber-800">
                ระยะเวลา {duration}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative h-2.5 overflow-hidden rounded-full bg-secondary/50">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-soft"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-text/55 sm:text-sm">
              <span>00:45</span>
              <span>{duration}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-500 text-white shadow-soft transition duration-300 hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "หยุดชั่วคราว" : "เล่น"}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <div className="flex flex-1 items-center gap-2 min-w-[140px]">
              <VolumeIcon />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
                aria-label="ระดับเสียง"
              />
              <span className="w-10 text-right text-xs text-text/60">
                {volume}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="speed"
                className="text-xs text-text/60 sm:text-sm"
              >
                ความเร็ว
              </label>
              <select
                id="speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="rounded-xl border border-secondary bg-background px-3 py-2 text-sm font-medium text-text outline-none transition focus:ring-2 focus:ring-primary/40"
              >
                {speeds.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed"
              title="ยังไม่พร้อมใช้งาน"
            >
              <DownloadIcon />
              ดาวน์โหลด
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
