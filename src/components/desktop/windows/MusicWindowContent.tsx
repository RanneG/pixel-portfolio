import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

type MusicTrack = {
  id: string;
  album: string;
  artist: string;
  title: string;
  coverUrl: string;
  audioUrl: string;
};

type MusicData = {
  tracks: MusicTrack[];
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const MusicWindowContent: React.FC = () => {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const track = tracks[trackIndex];

  useEffect(() => {
    let cancelled = false;
    fetch("/data/music.json")
      .then((r) => r.json())
      .then((data: MusicData) => {
        if (!cancelled && Array.isArray(data.tracks) && data.tracks.length > 0) {
          setTracks(data.tracks);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track?.audioUrl) return;
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLoadError(false);
    audio.src = track.audioUrl;
    audio.load();
  }, [track?.audioUrl, track?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      if (tracks.length > 1) {
        setTrackIndex((i) => (i + 1) % tracks.length);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setLoadError(true);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, [tracks.length]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !track?.audioUrl) return;
    if (playing) {
      audio.pause();
    } else {
      void audio.play().catch(() => setLoadError(true));
    }
  }, [playing, track?.audioUrl]);

  const goPrev = useCallback(() => {
    if (tracks.length === 0) return;
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const goNext = useCallback(() => {
    if (tracks.length === 0) return;
    setTrackIndex((i) => (i + 1) % tracks.length);
  }, [tracks.length]);

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(e.target.value);
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!track) {
    return (
      <p style={{ margin: 0, fontSize: 11 }}>
        {loadError ? t("desktop.music.loadError") : t("desktop.music.loading")}
      </p>
    );
  }

  return (
    <div className="win98-music">
      <audio ref={audioRef} preload="metadata" />

      <div className="win98-music-art-wrap">
        <img className="win98-music-art" src={track.coverUrl} alt="" width={360} height={360} />
      </div>

      <div className="win98-music-meta">
        <div className="win98-music-meta-left">
          <p className="win98-music-album">{track.album}</p>
          <p className="win98-music-artist">{track.artist}</p>
        </div>
        <p className="win98-music-title">{track.title}</p>
      </div>

      <div className="win98-music-controls-row">
        <button
          type="button"
          className="win98-music-play-btn"
          onClick={togglePlay}
          aria-label={playing ? t("desktop.music.pause") : t("desktop.music.play")}
          disabled={!track.audioUrl}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <span className="win98-music-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <input
          className="win98-music-seek"
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={onSeek}
          aria-label={t("desktop.music.seek")}
          style={{ "--seek-pct": `${progress}%` } as React.CSSProperties}
        />
      </div>

      {loadError ? (
        <p className="win98-music-error">{t("desktop.music.playError")}</p>
      ) : null}

      <div className="win98-music-nav">
        <button type="button" className="win98-btn win98-music-nav-btn" onClick={goPrev}>
          {t("desktop.music.previous")}
        </button>
        <button type="button" className="win98-btn win98-music-nav-btn" onClick={goNext}>
          {t("desktop.music.next")}
        </button>
      </div>
    </div>
  );
};
