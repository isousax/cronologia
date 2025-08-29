import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import StartScreen from "./components/StartScreen";
import Header from "./components/Header";
import PhotoCarousel from "./components/PhotoCarousel";
import TimeCounter from "./components/TimeCounter";
import LoveMessages from "./components/LoveMessages";
import AudioOnlyPlayer from "./components/AudioOnlyPlayer";
import SplashScreen from "./components/ui/SplashScreen";

function isMonthlyAnniversary(startDateStr: string) {
  const start = new Date(startDateStr);
  const now = new Date();
  return now.getDate() === start.getDate();
}

interface DedicationData {
  customText: {
    title: string;
    intro: string;
    button: string;
    top_phrase: string;
    phrases?: string[];
    phrase_final: string;
  };
  basic: {
    data_inicio: string;
    name_couple: string;
  };
  photos: Array<{
    preview: string;
    title: string;
  }>;
  music: {
    title: string;
    url: string;
  };
}

function App() {
  const [data, setData] = useState<DedicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const receivedFromParent = useRef(false);
  const parentOriginRef = useRef("https://dedicart.com.br");
  const fallbackFetchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;
      if (e.origin !== "https://dedicart.com.br") return;

      if (msg.type === "DEDICATION_DATA") {
        parentOriginRef.current = e.origin || "*";
        setData(msg.payload);
        receivedFromParent.current = true;
        setLoading(false);
        if (fallbackFetchTimeoutRef.current) {
          clearTimeout(fallbackFetchTimeoutRef.current);
          fallbackFetchTimeoutRef.current = null;
        }
      }
    }

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      if (fallbackFetchTimeoutRef.current) {
        clearTimeout(fallbackFetchTimeoutRef.current);
        fallbackFetchTimeoutRef.current = null;
      }
    };
  }, []);

  const startDate = data?.basic?.data_inicio;

  useEffect(() => {
    if (!startDate) return;

    let heartsInterval: number | null = null;
    let sparklesInterval: number | null = null;

    const showHearts = isMonthlyAnniversary(startDate);

    if (showHearts) {
      heartsInterval = window.setInterval(() => {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${6 + Math.random() * 4}s`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
      }, 600);
    } else {
      sparklesInterval = window.setInterval(() => {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.left = `${Math.random() * 100}vw`;
        sparkle.style.animationDuration = `${4 + Math.random() * 3}s`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 9000);
      }, 350);
    }

    return () => {
      if (heartsInterval) clearInterval(heartsInterval);
      if (sparklesInterval) clearInterval(sparklesInterval);
    };
  }, [started, startDate]);

  if (loading || !data) return <SplashScreen />;
  if (!started)
    return (
      <StartScreen
        onStart={() => setStarted(true)}
        title={data?.customText?.title}
        buttonText={data?.customText?.button}
        intro={data?.customText?.intro}
        startDate={data?.basic?.data_inicio}
      />
    );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme py-4 sm:p-6 transition-colors">
        <div className="container mx-auto">
          <Header
            name_couple={data?.basic?.name_couple}
            top_phrase={data?.customText?.top_phrase}
          />
          <PhotoCarousel photos={data?.photos} />
          <TimeCounter startDate={data?.basic?.data_inicio} />
          <LoveMessages customText={data?.customText?.phrases} />
          <div className="text-center text-theme font-body text-sm mt-12 pb-6">
            <p className="mb-24">
              {data?.customText?.phrase_final ||
                "Nosso amor cresce a cada segundo 💕"}
            </p>
          </div>
        </div>
      </div>

      {/* Player fixo, fora do fluxo */}
      <AudioOnlyPlayer
        videoId={
          data?.music?.url || "https://www.youtube.com/watch?v=ICS6uKC93w0"
        }
        startAt={data?.music?.url ? 1 : 13}
        title={data?.music?.title || "Jorge & Mateus - Os Anjos Cantam"}
      />
    </ThemeProvider>
  );
}

export default App;
