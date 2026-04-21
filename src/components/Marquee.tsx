"use client";

export default function Marquee() {
  const text = "High Standards \u2022 Real Relationships \u2022 Trusted Referrals";
  const repeated = Array(8).fill(text).join(" \u2022 ") + " \u2022 ";

  return (
    <section className="py-10 bg-charcoal overflow-hidden">
      <div className="relative flex">
        <div className="animate-marquee flex shrink-0 whitespace-nowrap">
          <span className="font-serif text-[clamp(1rem,2vw,1.5rem)] text-white/30 font-light italic tracking-wide">
            {repeated}
          </span>
        </div>
        <div className="animate-marquee flex shrink-0 whitespace-nowrap">
          <span className="font-serif text-[clamp(1rem,2vw,1.5rem)] text-white/30 font-light italic tracking-wide">
            {repeated}
          </span>
        </div>
      </div>
    </section>
  );
}
