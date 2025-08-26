import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import StartScreen from "./components/StartScreen";
import Header from "./components/Header";
import PhotoCarousel from "./components/PhotoCarousel";
import TimeCounter from "./components/TimeCounter";
import LoveMessages from "./components/LoveMessages";
import AudioOnlyPlayer from "./components/AudioOnlyPlayer";
//import SplashScreen from "./components/ui/SplashScreen";

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

  // flags / refs pra handshake e timeouts
  const receivedFromParent = useRef(false);
  const parentOriginRef = useRef<string | null>(null);
  const readyIntervalRef = useRef<number | null>(null);
  const readyRetryCountRef = useRef(0);

  // Fallback timeout (se quiser tentar alguma fetch própria mais tarde)
  const fallbackFetchTimeoutRef = useRef<number | null>(null);

  // recebe dados via postMessage
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;

      // Aceitar mensagens de qualquer origem para handshake inicial.
      // Quando receber DEDICATION_DATA, guardamos a origem como parentOriginRef.current
      if (msg.type === "DEDICATION_DATA") {
        console.log("[Child] recebeu DEDICATION_DATA de", e.origin, msg);
        parentOriginRef.current = e.origin;
        receivedFromParent.current = true;
        setData(msg.payload);
        setLoading(false);

        // pare os retries de READY_FOR_DATA
        if (readyIntervalRef.current) {
          window.clearInterval(readyIntervalRef.current);
          readyIntervalRef.current = null;
        }
        // cancela fallback se houver
        if (fallbackFetchTimeoutRef.current) {
          window.clearTimeout(fallbackFetchTimeoutRef.current);
          fallbackFetchTimeoutRef.current = null;
        }
        return;
      }

      // se receber outro tipo (ex: handshake confirm), logue para debug
      console.log("[Child] mensagem recebida (não DEDICATION_DATA):", e.origin, msg);
    }

    window.addEventListener("message", onMessage);
    console.log("[Child] listener de message registrado");

    // cleanup
    return () => {
      window.removeEventListener("message", onMessage);
      console.log("[Child] listener de message removido");
      if (readyIntervalRef.current) {
        window.clearInterval(readyIntervalRef.current);
        readyIntervalRef.current = null;
      }
      if (fallbackFetchTimeoutRef.current) {
        window.clearTimeout(fallbackFetchTimeoutRef.current);
        fallbackFetchTimeoutRef.current = null;
      }
    };
  }, []);

  // envia READY_FOR_DATA repetidamente até chegar DEDICATION_DATA (handshake)
  useEffect(() => {
    // tenta determinar origem do parent via document.referrer (se disponível)
    let initialParentOrigin: string | "*" = "*";
    try {
      if (document.referrer) {
        const u = new URL(document.referrer);
        initialParentOrigin = u.origin;
      }
    } catch {
      initialParentOrigin = "*";
    }

    const sendReady = () => {
      try {
        // use a origem conhecida (se existir) para postMessage, senão use '*'
        const target = parentOriginRef.current || initialParentOrigin || "*";
        window.parent.postMessage({ type: "READY_FOR_DATA" }, target);
        console.log("[Child] READY_FOR_DATA enviado para", target);
      } catch (err) {
        console.warn("[Child] erro ao postar READY_FOR_DATA:", err);
      }
    };

    // envia imediato
    sendReady();

    // e tenta a cada 700ms até 10 tentativas (≈7s)
    readyIntervalRef.current = window.setInterval(() => {
      if (receivedFromParent.current) {
        if (readyIntervalRef.current) {
          window.clearInterval(readyIntervalRef.current);
          readyIntervalRef.current = null;
        }
        return;
      }
      if (readyRetryCountRef.current >= 10) {
        // chegou ao limite de tentativas
        if (readyIntervalRef.current) {
          window.clearInterval(readyIntervalRef.current);
          readyIntervalRef.current = null;
        }
        console.warn("[Child] READY_FOR_DATA retries esgotados; aguardando dados do parent");
        // opcional: você pode iniciar aqui um fallback fetch (se tiver como obter o id)
        return;
      }
      readyRetryCountRef.current += 1;
      sendReady();
    }, 700);

    // opcional: fallback se quiser tentar buscar dados direto (depende de saber o id)
    // fallbackFetchTimeoutRef.current = window.setTimeout(() => { ... }, 8000);

    return () => {
      if (readyIntervalRef.current) {
        window.clearInterval(readyIntervalRef.current);
        readyIntervalRef.current = null;
      }
      if (fallbackFetchTimeoutRef.current) {
        window.clearTimeout(fallbackFetchTimeoutRef.current);
        fallbackFetchTimeoutRef.current = null;
      }
    };
  }, []);

  // o resto do código permanece inalterado...
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

  if (loading || !data) console.log("Loading...");
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
      <div className="min-h-screen bg-theme py-12 transition-colors">
        <div className="container mx-auto">
          <Header
            name_couple={data?.basic?.name_couple}
            top_phrase={data?.customText?.top_phrase}
          />
          <PhotoCarousel photos={data?.photos} />
          <TimeCounter startDate={data?.basic?.data_inicio} />
          <LoveMessages customText={data?.customText?.phrases} />
          <AudioOnlyPlayer
            videoId={data?.music?.url || "https://www.youtube.com/watch?v=ICS6uKC93w0"}
            startAt={data?.music?.url ? 1 : 13}
            title={data?.music?.title || "Jorge & Mateus - Os Anjos Cantam"}
          />
        </div>
        <footer className="text-center text-theme font-body text-sm mt-12 pb-6">
          <p>
            {data?.customText?.phrase_final ||
              "Nosso amor cresce a cada segundo 💕"}
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
