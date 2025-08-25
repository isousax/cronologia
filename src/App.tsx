import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import StartScreen from "./components/StartScreen";
import Header from "./components/Header";
import PhotoCarousel from "./components/PhotoCarousel";
import TimeCounter from "./components/TimeCounter";
import LoveMessages from "./components/LoveMessages";
import AudioOnlyPlayer from "./components/AudioOnlyPlayer";

function isMonthlyAnniversary(startDateStr: string) {
  const start = new Date(startDateStr);
  const now = new Date();
  return now.getDate() === start.getDate();
}

function App() {
  const [started, setStarted] = useState(false);
  const startDate = "2025-07-04T00:00:00";

  useEffect(() => {
    if (!started) return;
    let heartsInterval: any = null;
    let sparklesInterval: any = null;

    const showHearts = isMonthlyAnniversary(startDate);

    if (showHearts) {
      heartsInterval = setInterval(() => {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${6 + Math.random() * 4}s`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
      }, 600);
    } else {
      sparklesInterval = setInterval(() => {
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

  if (!started) return <StartScreen onStart={() => setStarted(true)} />;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme py-12 transition-colors">
        <div className="container mx-auto">
          <Header />
          <PhotoCarousel />
          <TimeCounter startDate={startDate} />
          <LoveMessages />
          <AudioOnlyPlayer videoId="L0_nXyTMyqM" startAt={4} />
        </div>
        <footer className="text-center text-theme font-body text-sm mt-12 pb-6">
          <p>Nosso amor cresce a cada segundo 💕</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App
