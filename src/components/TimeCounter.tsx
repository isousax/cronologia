import { useState, useEffect } from "react";
import { DateTime } from "luxon";

type Props = { startDate?: string };

export default function TimeCounter({ startDate }: Props) {
  const [timeTogether, setTimeTogether] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateCounter = () => {
      const start = DateTime.fromISO(startDate || new Date().toISOString());
      const now = DateTime.now();
      const diff = now
        .diff(start, [
          "years",
          "months",
          "days",
          "hours",
          "minutes",
          "seconds",
        ])
        .toObject();

      setTimeTogether({
        years: Math.floor(diff.years || 0),
        months: Math.floor(diff.months || 0),
        days: Math.floor(diff.days || 0),
        hours: Math.floor(diff.hours || 0),
        minutes: Math.floor(diff.minutes || 0),
        seconds: Math.floor(diff.seconds || 0),
      });
    };

    updateCounter();
    const id = setInterval(updateCounter, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  const timeUnits = [
    { value: timeTogether.years, label: "Anos", color: "bg-red-400" },
    { value: timeTogether.months, label: "Meses", color: "bg-pink-400" },
    { value: timeTogether.days, label: "Dias", color: "bg-purple-400" },
    { value: timeTogether.hours, label: "Horas", color: "bg-blue-400" },
    { value: timeTogether.minutes, label: "Minutos", color: "bg-green-400" },
    { value: timeTogether.seconds, label: "Segundos", color: "bg-yellow-400" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 fade-in">
      <h2 className="font-heading text-2xl md:text-3xl text-center mb-8 text-theme">
        Tempo Juntos
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {timeUnits.map((u, index) => (
          <div
            key={u.label}
            className={`rounded-xl p-4 text-white text-center shadow-md transform hover:scale-105 transition-transform duration-300 ${u.color} slide-in`}
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <div className="text-2xl md:text-3xl font-bold">{u.value || 0}</div>
            <div className="text-sm">{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
