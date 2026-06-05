import { useRef, useEffect, useCallback, useState } from "react";
import { SONGS } from "../data/songs.js";
const VOLUME_KEY = "disktop_volume";
function useAudio() {
  const audioRef = useRef(null);
  const songIdxRef = useRef(0);
  const [songIndex, setSongIndex] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem(VOLUME_KEY);
    return saved !== null ? parseFloat(saved) : 0.7;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileError, setFileError] = useState(false);
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = parseFloat(localStorage.getItem(VOLUME_KEY) ?? "0.7");
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("error", () => {
      setFileError(true);
      setIsPlaying(false);
    });
    audio.addEventListener("canplay", () => setFileError(false));
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);
  const loadAndPlay = useCallback((idx) => {
    const audio = audioRef.current;
    if (!audio) return;
    const normalised = (idx % SONGS.length + SONGS.length) % SONGS.length;
    songIdxRef.current = normalised;
    setSongIndex(normalised);
    setFileError(false);
    audio.pause();
    audio.src = SONGS[normalised].file;
    audio.currentTime = 0;
    audio.load();
    const playPromise = audio.play();
    if (playPromise !== void 0) {
      playPromise.catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);
  const setVolume = useCallback((val) => {
    const v = Math.max(0, Math.min(1, val));
    if (audioRef.current) audioRef.current.volume = v;
    setVolumeState(v);
    localStorage.setItem(VOLUME_KEY, String(v));
  }, []);
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (!audio.src) loadAndPlay(songIdxRef.current);
      else audio.play().catch(() => {
      });
    } else {
      audio.pause();
    }
  }, [loadAndPlay]);
  const nextTrack = useCallback(() => loadAndPlay(songIdxRef.current + 1), [loadAndPlay]);
  const prevTrack = useCallback(() => loadAndPlay(songIdxRef.current - 1), [loadAndPlay]);
  return {
    songIndex,
    song: SONGS[songIndex],
    volume,
    isPlaying,
    fileError,
    loadAndPlay,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume
  };
}
export {
  useAudio
};
