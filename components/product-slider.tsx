"use client";

import { useState } from "react";

export function ProductSlider({ slides, alt }: { slides: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  if (count === 0) return null;

  return (
    <div>
      <div className="card relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slides[index]} alt={`${alt} — слайд ${index + 1}`} className="aspect-[16/10] w-full object-cover" />

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Предыдущий слайд"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur transition hover:bg-white"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Следующий слайд"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur transition hover:bg-white"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Слайд ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-brand" : "w-2 bg-white/80 shadow"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === index ? "border-brand shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt="" className="h-16 w-24 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
