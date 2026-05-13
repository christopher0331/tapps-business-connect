"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/business-connect-data";

function shuffleMembers(members: Member[]) {
  return [...members].sort(() => Math.random() - 0.5);
}

function getFeaturedMembers(members: Member[]) {
  return members.filter((member) => member.slug !== "alan-dueck-caring-transitions");
}

export default function FeaturedMemberSlider({ members }: { members: Member[] }) {
  const availableMembers = useMemo(() => getFeaturedMembers(members), [members]);
  const [featuredMembers, setFeaturedMembers] = useState<Member[]>(() => availableMembers.slice(0, 4));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setFeaturedMembers(shuffleMembers(availableMembers).slice(0, 6));
    setActiveIndex(0);
  }, [availableMembers]);

  useEffect(() => {
    if (featuredMembers.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredMembers.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [featuredMembers.length]);

  const activeMember = useMemo(
    () => featuredMembers[activeIndex] ?? featuredMembers[0] ?? availableMembers[0],
    [activeIndex, availableMembers, featuredMembers],
  );

  if (!activeMember) return null;

  return (
    <Link
      href="/directory"
      className="group grid overflow-hidden rounded-[2rem] bg-charcoal text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_32px_100px_rgba(0,0,0,0.24)] lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="relative min-h-[360px] overflow-hidden">
        <Image
          src={activeMember.photo}
          alt={activeMember.name}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent lg:bg-gradient-to-r" />
        <div className="absolute bottom-6 left-6 rounded-full bg-white/90 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-charcoal">
          Featured Local Business
        </div>
      </div>

      <div className="flex flex-col justify-between p-8 sm:p-10">
        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-white/50">Meet Our Members</p>
          <h3 className="font-serif text-[clamp(2rem,5vw,3.8rem)] font-light leading-[1.02] text-white">
            {activeMember.company}
          </h3>
          <p className="mt-4 text-[13px] uppercase tracking-[0.25em] text-white/45">{activeMember.category}</p>
          <p className="mt-6 max-w-xl text-[15px] leading-8 text-white/65">
            {activeMember.name} represents the trusted, relationship-focused local professionals who make up Tapps Business Connect.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Business Type</p>
            <p className="mt-2 text-[15px] text-white/75">{activeMember.specialty}</p>
          </div>
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-charcoal transition-all duration-300 group-hover:bg-white/90">
            View Full Directory
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {featuredMembers.length > 1 && (
          <div className="mt-8 flex gap-2">
            {featuredMembers.map((member, index) => (
              <span
                key={member.slug}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-10 bg-white" : "w-3 bg-white/25"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
