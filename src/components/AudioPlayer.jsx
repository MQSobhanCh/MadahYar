import { useEffect, useRef, useState } from "react";

import {
  HiOutlineMusicalNote,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlineSpeakerWave,
  HiOutlineSpeakerXMark,
} from "react-icons/hi2";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function AudioPlayer({
  src,
  title = "فایل صوتی",
}) {
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !src) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch (error) {
      console.error("Audio play error:", error);
      setPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    setDuration(audio.duration || 0);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    setCurrentTime(audio.currentTime || 0);
  };

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;

    if (!audio || !duration) {
      return;
    }

    const value = Number(event.target.value);

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolume = (event) => {
    const audio = audioRef.current;

    const value = Number(event.target.value);

    setVolume(value);

    if (audio) {
      audio.volume = value;
    }
  };

  if (!src) {
    return (
      <div
        dir="rtl"
        className="rounded-3xl border border-white/10 bg-slate-900 p-5"
      >
        <div className="flex items-center gap-3 text-slate-500">
          <HiOutlineMusicalNote className="text-2xl" />

          <span className="text-sm">
            فایل صوتی قابل پخش نیست.
          </span>
        </div>
      </div>
    );
  }

  const progress =
    duration > 0
      ? Math.min((currentTime / duration) * 100, 100)
      : 0;

  return (
    <div
      dir="rtl"
      className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-xl"
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
            <HiOutlineMusicalNote className="text-2xl text-green-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-white">
              {title}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              پخش فایل صوتی
            </p>
          </div>

          <button
            type="button"
            onClick={togglePlay}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 transition hover:bg-amber-400"
          >
            {playing ? (
              <HiOutlinePause className="text-2xl" />
            ) : (
              <HiOutlinePlay className="text-2xl" />
            )}
          </button>
        </div>

        <div className="mt-5">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-amber-500"
            style={{
              background: `linear-gradient(to left, #f59e0b ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
            }}
          />

          <div
            dir="ltr"
            className="mt-2 flex items-center justify-between text-xs text-slate-500"
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {volume === 0 ? (
            <HiOutlineSpeakerXMark className="text-xl text-slate-500" />
          ) : (
            <HiOutlineSpeakerWave className="text-xl text-slate-500" />
          )}

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
