"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/business-connect-data";

type CategoryOption = {
  slug: string;
  name: string;
};

function shuffleMembers(members: Member[]) {
  const shuffled = [...members];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

function MemberCard({ member }: { member: Member }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(0,0,0,0.14)]">
      <Link href={`/profiles/${member.slug}`} className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-charcoal">
          {member.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="font-serif text-[1.35rem] font-light leading-snug text-charcoal">{member.name}</h3>
          <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-charcoal/45">{member.company}</p>
          <p className="mt-5 border-t border-charcoal/8 pt-5 text-[14px] leading-7 text-charcoal/65">
            {member.specialty}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={`/profiles/${member.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-charcoal px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-charcoal/85"
          >
            View Details
          </Link>
          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-charcoal/15 px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:border-charcoal hover:bg-charcoal hover:text-white"
            >
              Website
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MemberDirectory({
  members,
  categories,
}: {
  members: Member[];
  categories: CategoryOption[];
}) {
  const [orderedMembers, setOrderedMembers] = useState<Member[] | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setOrderedMembers(shuffleMembers(members));
  }, [members]);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const randomizedMembers = orderedMembers ?? [];

    return randomizedMembers.filter((member) => {
      const matchesCategory = category === "all" || member.categorySlug === category;
      const matchesQuery =
        !normalizedQuery ||
        [member.name, member.company, member.category, member.specialty, member.bio]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, orderedMembers, query]);

  return (
    <section className="bg-[#f2ede6] py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-10 rounded-[2rem] bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-charcoal/45">Search Members</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, business, service, or specialty"
                className="w-full rounded-full border border-charcoal/10 bg-[#f8f5f0] px-5 py-4 text-[15px] text-charcoal outline-none transition-all duration-300 placeholder:text-charcoal/35 focus:border-charcoal/40 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-charcoal/45">Filter By Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full appearance-none rounded-full border border-charcoal/10 bg-[#f8f5f0] px-5 py-4 text-[15px] text-charcoal outline-none transition-all duration-300 focus:border-charcoal/40 focus:bg-white"
              >
                <option value="all">All trusted businesses</option>
                {categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/8 pt-5">
            <p className="text-[13px] leading-6 text-charcoal/55">
              Showing {filteredMembers.length} of {members.length} vetted local businesses.
            </p>
            {(query || category !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className="text-[11px] uppercase tracking-[0.22em] text-charcoal/50 transition-colors duration-300 hover:text-charcoal"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {!orderedMembers ? (
          <div className="rounded-[2rem] bg-white px-8 py-20 text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="mb-4 font-serif text-[2.5rem] font-light text-charcoal">Loading directory.</p>
            <p className="mx-auto max-w-xl text-[15px] leading-7 text-charcoal/60">
              Randomizing member order so every business gets a fair position.
            </p>
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredMembers.map((member) => (
              <MemberCard key={member.slug} member={member} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white px-8 py-20 text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="mb-4 font-serif text-[2.5rem] font-light text-charcoal">No exact matches.</p>
            <p className="mx-auto max-w-xl text-[15px] leading-7 text-charcoal/60">
              Try clearing the filter or searching a broader service term. The full directory remains available whenever filters are reset.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
