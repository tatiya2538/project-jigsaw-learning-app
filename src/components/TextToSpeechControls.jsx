"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { isTtsUpToDate } from "../lib/tts-shared";

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M11.5 4.2a1 1 0 0 0-1.6-.8L5.8 6.5H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.8l4.1 3.1a1 1 0 0 0 1.6-.8V4.2Zm5.2 2.4a1 1 0 0 0-.2 1.4 4 4 0 0 1 0 5.2 1 1 0 1 0 1.6 1.2 6 6 0 0 0 0-7.6 1 1 0 0 0-1.4-.2Zm2.4-2.3a1 1 0 0 0-.1 1.4 7.5 7.5 0 0 1 0 10.6 1 1 0 1 0 1.5 1.3 9.5 9.5 0 0 0 0-13.2 1 1 0 0 0-1.4-.1Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M7 7h10v10H7V7Z" />
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

export default function TextToSpeechControls({
  paragraphs = [],
  tts = null,
  title = "เรื่องราวตัวละคร",
  subtitle = "อ่านชีวประวัติให้นักเรียนฟัง",
  imageSrc,
  name,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [error, setError] = useState("");

  const ready = isTtsUpToDate(paragraphs, tts);
  const audioUrl = ready ? tts.url : "";
  const voiceLabel = tts?.voiceLabel || "Premwadee (Edge Neural)";
  const progress =
    totalTime > 0 ? Math.min((currentTime / totalTime) * 100, 100) : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return undefined;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoaded = () => setTotalTime(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioUrl]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setTotalTime(0);
    setError("");
  }, [audioUrl]);

  async function handlePlay() {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    try {
      setError("");
      await audio.play();
    } catch {
      setIsPlaying(false);
      setError("เล่นเสียงไม่สำเร็จ");
    }
  }

  function handleStop() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }

  const statusMessage = !tts?.url
    ? "ยังไม่มีไฟล์เสียง — รอแอดมินสร้างจากหน้า Admin"
    : !ready
      ? "ชีวประวัติถูกแก้แล้ว — รอแอดมินสร้างเสียงใหม่"
      : isPlaying
        ? "กำลังอ่านชีวประวัติ..."
        : "กดปุ่มเพื่อฟังชีวประวัติ";

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mt-8 mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">
            เสียงบรรยาย
          </h2>
          <p className="mt-2 text-text/70">
            ฟังเรื่องราวก่อนไปเล่าให้เพื่อนฟัง
          </p>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-primary" />
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-card sm:p-7 animate-fade-in-up">
          {audioUrl ? (
            <audio ref={audioRef} src={audioUrl} preload="metadata" />
          ) : (
            <audio ref={audioRef} preload="none" />
          )}

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
              <h3 className="text-lg font-bold text-text sm:text-xl">{title}</h3>
              <p className="mt-1 text-sm text-text/65">{subtitle}</p>
              <p className="mt-2 inline-flex rounded-full bg-secondary/60 px-3 py-1 text-sm font-medium text-amber-800">
                เสียง Neural ภาษาไทย (Edge TTS)
              </p>
              <p className="mt-2 text-xs text-text/50">เสียง: {voiceLabel}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all"
                style={{ width: `${ready ? progress : 0}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-text/55 sm:text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{totalTime > 0 ? formatTime(totalTime) : "--:--"}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={isPlaying ? handleStop : handlePlay}
              disabled={!ready}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-500 text-white shadow-soft transition duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={isPlaying ? "หยุดอ่าน" : "เริ่มอ่าน"}
            >
              {isPlaying ? <StopIcon /> : <SpeakerIcon />}
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text/80">{statusMessage}</p>
              {error ? (
                <p className="mt-1 text-xs font-medium text-orange-600">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
