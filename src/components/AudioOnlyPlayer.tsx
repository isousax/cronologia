import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
declare namespace YT {
  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    setVolume(volume: number): void;
    mute(): void;
    unMute(): void;
    getCurrentTime(): number;
    getDuration(): number;
    isMuted(): boolean;
  }
}

type Props = {
  videoId: string;
  startAt?: number;
  title?: string;
};

export default function AudioOnlyPlayer({
  videoId,
  startAt = 0,
  title,
}: Props) {
  const playerRef = useRef<YT.Player | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // container no body para evitar interferência
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = document.createElement("div");
    container.setAttribute("id", "audio-player-portal");
    // estilos inline fortes (evitam heranças problemáticas)
    Object.assign(container.style, {
      position: "fixed",
      left: "0px",
      right: "0px",
      bottom: "0px",
      zIndex: "2147483647", // max z
      pointerEvents: "auto",
      // evita que filtros/transform no documento afetem o container
      transform: "none",
      willChange: "transform",
    } as CSSStyleDeclaration);
    document.body.appendChild(container);
    containerRef.current = container;
    return () => {
      if (container && container.parentNode) container.parentNode.removeChild(container);
    };
  }, []);

  // estabiliza a unidade de viewport em mobile (pattern --vh)
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  // YouTube player init (igual ao seu)
  useEffect(() => {
    let created = false;
    function onYouTubeIframeAPIReady() {
      if (created) return;
      created = true;
      try {
        playerRef.current = new window.YT.Player("yt-player", {
          videoId: extractVideoId(videoId),
          playerVars: { start: startAt, enablejsapi: 1 },
          host: "https://www.youtube.com",
          events: {
            onReady: (e: any) => {
              setPlayerReady(true);
              setDuration(e.target.getDuration?.() || 0);
              setMuted(e.target.isMuted?.() || false);
              setVolume((e.target.getVolume?.() || 100) / 100);
              const iframe = document.querySelector<HTMLIFrameElement>("#yt-player iframe");
              if (iframe) iframe.setAttribute("allow", "autoplay; encrypted-media");
            },
            onStateChange: (e: any) => {
              setPlaying(e.data === 1);
            },
          },
        });
      } catch (err) {
        console.error("Erro ao criar YT.Player:", err);
      }
    }

    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      onYouTubeIframeAPIReady();
    }

    return () => {
      try {
        if (playerRef.current && typeof (playerRef.current as any).destroy === "function") {
          (playerRef.current as any).destroy();
        }
      } catch (err) {
        /* ignore */
      }
    };
  }, [videoId, startAt]);

  // atualiza tempo
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    const iv = setInterval(() => {
      try {
        setCurrent(playerRef.current!.getCurrentTime());
      } catch (e) {}
    }, 500);
    return () => clearInterval(iv);
  }, [playerReady]);

  const handlePlayPause = () => {
    if (!playerReady || !playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    playerRef.current?.seekTo(val, true);
    setCurrent(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setMuted(val === 0);
    playerRef.current?.setVolume(val * 100);
    if (val === 0) playerRef.current?.mute();
    else playerRef.current?.unMute();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
      playerRef.current.setVolume(volume * 100);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // montagem dos controles (estilos inline para evitar interferências)
  const controls = (
    <div
      style={{
        // usa a variável --vh para minimizar saltos com address bar
        minHeight: "calc(var(--vh, 1vh) * 10)",
        boxSizing: "border-box",
        padding: "10px 12px",
        background: "var(--bg, rgba(10,10,14,0.98))",
        backdropFilter: "none",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
      aria-live="polite"
    >
      {/* iframe invisível */}
      <div
        id="yt-player"
        style={{
          width: 1,
          height: 1,
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.01,
          pointerEvents: "none",
        }}
      />

      <button
        onClick={handlePlayPause}
        disabled={!playerReady}
        style={{
          width: 44,
          height: 44,
          borderRadius: 44,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "var(--primary, #ff6b9a)",
          color: "#fff",
        }}
        aria-label={playing ? "Pausar" : "Tocar"}
      >
        {playing ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <div style={{ flex: "1 1 320px", minWidth: 160 }}>
        <div style={{ fontSize: 12, marginBottom: 4 }}>{title || "Nossa Música"}</div>
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={current}
          onChange={handleSeek}
          style={{ width: "100%" }}
          disabled={!playerReady}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6 }}>
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <button
        onClick={toggleMute}
        disabled={!playerReady}
        style={{
          width: 40,
          height: 40,
          borderRadius: 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          color: "var(--primary, #ff6b9a)",
        }}
        aria-label={muted ? "Desmutar" : "Mutar"}
      >
        {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={muted ? 0 : volume}
        onChange={handleVolume}
        style={{ width: 96 }}
        disabled={!playerReady}
      />
    </div>
  );

  if (!containerRef.current) return null;
  return createPortal(controls, containerRef.current);
}

function extractVideoId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
