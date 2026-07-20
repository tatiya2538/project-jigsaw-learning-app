"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const speedOptions = [
  { label: "0.75x", value: 0.75 },
  { label: "1x", value: 1 },
  { label: "1.25x", value: 1.25 },
  { label: "1.5x", value: 1.5 },
];

export default function AudioPlayer({
  title,
  subtitle,
  duration,
  imageSrc,
  name,
  audioSrc,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const hasAudio = Boolean(audioSrc);
  const progress =
    totalTime > 0 ? Math.min((currentTime / totalTime) * 100, 100) : 0;
  const displayDuration =
    totalTime > 0 ? formatTime(totalTime) : duration || "00:00";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return undefined;

    const handleLoadedMetadata = () => {
      setTotalTime(audio.duration || 0);
      setIsReady(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioSrc, hasAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
  }, [speed]);

  async function handleTogglePlay() {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  }

  function handleSeek(event) {
    const audio = audioRef.current;
    if (!audio || !totalTime) return;

    const nextProgress = Number(event.target.value);
    const nextTime = (nextProgress / 100) * totalTime;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

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
          {hasAudio ? (
            <audio ref={audioRef} src={audioSrc} preload="metadata" />
          ) : null}

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
                ระยะเวลา {displayDuration}
              </p>
              {!hasAudio ? (
                <p className="mt-2 text-sm text-orange-600">
                  ยังไม่มีไฟล์เสียงสำหรับตัวละครนี้
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="h-2.5 overflow-hidden rounded-full bg-secondary/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                disabled={!hasAudio || !isReady}
                onChange={handleSeek}
                className="absolute inset-0 h-2.5 w-full cursor-pointer appearance-none bg-transparent accent-primary disabled:cursor-not-allowed"
                aria-label="ความคืบหน้าเสียง"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-text/55 sm:text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{displayDuration}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleTogglePlay}
              disabled={!hasAudio}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-500 text-white shadow-soft transition duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={isPlaying ? "หยุดชั่วคราว" : "เล่น"}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <div className="flex min-w-[140px] flex-1 items-center gap-2">
              <VolumeIcon />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                disabled={!hasAudio}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary disabled:cursor-not-allowed disabled:opacity-50"
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
                disabled={!hasAudio}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-xl border border-secondary bg-background px-3 py-2 text-sm font-medium text-text outline-none transition focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {speedOptions.map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {hasAudio ? (
              <a
                href={audioSrc}
                download
                className="inline-flex items-center gap-2 rounded-2xl bg-secondary/70 px-4 py-2.5 text-sm font-medium text-amber-900 transition hover:bg-secondary"
              >
                <DownloadIcon />
                ดาวน์โหลด
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-400"
                title="ยังไม่มีไฟล์เสียง"
              >
                <DownloadIcon />
                ดาวน์โหลด
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
