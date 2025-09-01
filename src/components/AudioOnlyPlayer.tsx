import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
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
  const [volume, setVolume] = useState(1); // 0-1
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Criação do player
  useEffect(() => {
    let created = false;

    function onYouTubeIframeAPIReady() {
      if (created) return;
      created = true;

      playerRef.current = new window.YT.Player("yt-player", {
        videoId: extractVideoId(videoId),
        playerVars: {
          start: startAt,
          enablejsapi: 1,
        },
        host: "https://www.youtube.com",
        events: {
          onReady: (e: any) => {
            setPlayerReady(true);
            setDuration(e.target.getDuration());
            setMuted(e.target.isMuted());
            setVolume(e.target.getVolume() / 100);

            // forçar autoplay permitido
            const iframe =
              document.querySelector<HTMLIFrameElement>("#yt-player iframe");
            if (iframe) {
              iframe.setAttribute("allow", "autoplay; encrypted-media");
            }
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === 1);
          },
        },
      });
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
      if (
        playerRef.current &&
        typeof (playerRef.current as any).destroy === "function"
      ) {
        (playerRef.current as any).destroy();
      }
    };
  }, [videoId, startAt]);

  // Atualiza tempo atual
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    const interval = setInterval(() => {
      setCurrent(playerRef.current!.getCurrentTime());
    }, 500);
    return () => clearInterval(interval);
  }, [playerReady]);

  // Play/pause
  const handlePlayPause = () => {
    if (!playerReady || !playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(value, true);
      setCurrent(value);
    }
  };

  // Volume
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setMuted(val === 0);
    playerRef.current?.setVolume(val * 100);
    if (val === 0) playerRef.current?.mute();
    else playerRef.current?.unMute();
  };

  // Mute/unmute
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
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const controls = (
    <>
      {/* iframe invisível */}
      <div
        id="yt-player"
        style={{
          width: "1px",
          height: "1px",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.01,
          pointerEvents: "none",
        }}
      ></div>

      {/* controles personalizados */}
      <div
        className="fixed left-0 right-0 z-50 bg-theme shadow-lg px-3 py-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full"
        style={{
          minHeight: '10dvh',
          height: 'auto',
          bottom: 'env(safe-area-inset-bottom, 0)',
          // Garante que o player fique sempre visível na viewport dinâmica
        }}
      >
        <button
          className="p-2 rounded-full bg-love-primary text-white hover:bg-love-secondary transition shrink-0 border-none focus:outline-none"
          onClick={handlePlayPause}
          disabled={!playerReady}
        >
          {playing ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className="flex flex-col flex-1 min-w-0 w-full sm:max-w-md">
          <div className="font-heading text-xs text-theme sm:text-sm mb-1">
            {title || "Nossa Música"}
          </div>
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={current}
            onChange={handleSeek}
            className="w-full accent-love-primary"
            disabled={!playerReady}
          />
          <div className="flex justify-between text-xs text-theme mt-1">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          className="p-2 rounded-full bg-theme text-love-primary hover:bg-love-primary hover:text-white transition shrink-0 border-none focus:outline-none"
          onClick={toggleMute}
          disabled={!playerReady}
        >
          {muted || volume === 0 ? (
            <VolumeX size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={handleVolume}
          className="w-full max-w-[96px] accent-love-primary shrink-0"
          disabled={!playerReady}
        />
      </div>
    </>
  );

  return createPortal(controls, document.body);
}

function extractVideoId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
