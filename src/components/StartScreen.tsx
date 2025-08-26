type Props = {
  onStart: () => void;
  title?: string;
  buttonText?: string;
  intro?: string;
  startDate?: string;
};

export default function StartScreen({
  onStart,
  title,
  buttonText,
  intro,
  startDate,
}: Props) {
  
  const formattedDate = startDate
    ? new Date(startDate).toLocaleDateString()
    : "-";

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-love-primary/90 via-love-accent/80 to-love-secondary/90 flex flex-col justify-center items-center z-50 overflow-hidden">
      {/* Elementos decorativos sutis */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-10 left-8 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full mix-blend-soft-light animate-float"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-white rounded-full mix-blend-soft-light animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-4 w-20 h-20 md:w-32 md:h-32 bg-white rounded-full mix-blend-soft-light animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative text-center text-white backdrop-blur-sm bg-white/10 rounded-3xl py-12 px-8 shadow-2xl border border-white/20 max-w-md mx-4">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 font-bold tracking-tight animate-pulse">
          {title || "Infinito Particular"}
        </h1>

        <div className="w-20 h-1 bg-white/60 mx-auto mb-6 rounded-full"></div>

        <p className="font-body text-sm mb-8 leading-relaxed">
          {intro ||
            "Nem parece real o tanto que a gente já viveu junto. E o tanto que ainda vem...💕"}
        </p>

        <button
          onClick={onStart}
          className="group relative overflow-hidden border-none focus:outline-none bg-white/90 text-love-primary font-heading text-lg px-8 md:px-10 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-white"
        >
          <span className="relative z-10">
            {buttonText || "Vem comigo? 💖"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-love-primary/10 to-love-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <div className="absolute bottom-8 text-white font-body text-sm backdrop-blur-sm bg-black/20 rounded-full py-2 px-4">
        <p className="opacity-90">
          Tudo começou em{" "}
          <span className="font-semibold">
            {formattedDate}
          </span>
        </p>
      </div>
    </div>
  );
}
