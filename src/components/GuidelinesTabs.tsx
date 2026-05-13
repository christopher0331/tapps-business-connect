"use client";

import { useState, type ReactNode } from "react";

type GuidelinesTab = {
  title: string;
  body: ReactNode;
};

export default function GuidelinesTabs({ items }: { items: GuidelinesTab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] ?? items[0];

  if (!activeItem) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
      <aside className="rounded-[2rem] border border-charcoal/8 bg-[#f2ede6] p-3 lg:sticky lg:top-28 lg:self-start">
        <p className="px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-charcoal/40">
          Guidelines
        </p>
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group flex min-w-[240px] items-center justify-between rounded-2xl px-4 py-4 text-left transition-all duration-300 lg:min-w-0 ${
                  isActive
                    ? "bg-charcoal text-white shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
                    : "text-charcoal/75 hover:bg-white hover:text-charcoal"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="font-serif text-[1.05rem] font-medium leading-snug">{item.title}</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={`ml-4 h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
                    isActive ? "translate-x-0 opacity-80" : "opacity-25 group-hover:translate-x-1 group-hover:opacity-60"
                  }`}
                >
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="rounded-[2rem] border border-charcoal/8 bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:p-10 lg:min-h-[560px]">
        <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-mid-gray">
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <h2 className="mb-8 font-serif text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05] text-charcoal">
          {activeItem.title}
        </h2>
        <div className="prose max-w-none text-[15px] leading-8 text-charcoal/65 prose-strong:text-charcoal prose-a:text-charcoal prose-a:underline prose-headings:text-charcoal">
          {activeItem.body}
        </div>
      </section>
    </div>
  );
}
