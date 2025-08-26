type Props = { name_couple?: string; top_phrase?: string };

export default function Header({ name_couple, top_phrase }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center mb-8 fade-in px-2">
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-love-primary mb-2 animate-float break-words">
        {name_couple || "Eu e Ela"}
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-love-primary to-love-secondary mx-auto mb-6 rounded-full"></div>
      <p className="font-heading text-lg md:text-xl text-theme italic max-w-2xl mx-auto">
        {top_phrase || "Não é sobre prometer perfeição… é sobre escolher a mesma pessoa todos os dias."}
      </p>
    </div>
  );
}
