import { useState, useEffect, useMemo } from "react";

type Props = {
  customText?: string[];
};

export default function LoveMessages({ customText }: Props) {
  const defaultMessages = useMemo(() => [
    "Cada dia ao seu lado é um novo capítulo na nossa história de amor.",
    "Seu sorriso ilumina meus dias e aquece meu coração.",
    "Amo a forma como você transforma o ordinário em extraordinário.",
    "Nossa conexão é a prova de que almas gêmeas existem.",
    "Você é minha melhor escolha, todos os dias.",
  ], []);

  const messages = Array.isArray(customText) && customText.length > 0
    ? customText
    : defaultMessages;

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 p-6 card-theme rounded-2xl shadow-md love-card">
      <div className="text-center">
        <div className="text-love-primary text-4xl mb-4 animate-pulse">💖</div>
        <p className="font-body italic text-lg text-theme">
          "{messages[idx]}"
        </p>
      </div>
    </div>
  );
}
