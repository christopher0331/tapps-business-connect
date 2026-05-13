"use client";

import { useState, type ReactNode } from "react";

type GuidelinesItem = {
  title: string;
  body: ReactNode;
};

export default function GuidelinesMobileAccordion({ items }: { items: GuidelinesItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] bg-[#f2ede6] p-5">
        <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-charcoal/45">Guidelines</p>
        <p className="text-[14px] leading-7 text-charcoal/65">
          Tap a section below to review the group structure, standards, and expectations.
        </p>
      </div>

      {items.map((item, index) => {
        const isOpen = index === openIndex;
        const contentId = `mobile-guideline-${index}`;

        return (
          <article
            key={item.title}
            className={`overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${
              isOpen
                ? "border-charcoal/15 bg-white shadow-[0_12px_42px_rgba(0,0,0,0.08)]"
                : "border-charcoal/8 bg-[#f8f5f0]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              <span>
                <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-charcoal/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="block font-serif text-[1.25rem] font-medium leading-snug text-charcoal">
                  {item.title}
                </span>
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/50 transition-transform duration-300 ${
                  isOpen ? "rotate-45 bg-charcoal text-white" : "bg-white"
                }`}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                  <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div id={contentId} className="border-t border-charcoal/8 px-5 pb-6 pt-5">
                <div className="text-[15px] leading-8 text-charcoal/68 [&_a]:text-charcoal [&_a]:underline [&_strong]:text-charcoal">
                  {item.body}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
