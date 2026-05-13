import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import MemberDirectory from "@/components/MemberDirectory";
import { allMembers, categories } from "@/lib/business-connect-data";

export const metadata: Metadata = {
  title: "Tapps Business Connect Member Directory | Trusted Local Businesses",
  description:
    "Find trusted, vetted local businesses and professionals serving Lake Tapps, Bonney Lake, Sumner, Puyallup, Buckley, and surrounding areas.",
};

const activeCategories = categories.filter((category) =>
  allMembers.some((member) => member.categorySlug === category.slug),
);

export default function DirectoryPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-[#1a1a18] pt-40 pb-20 sm:pt-52 sm:pb-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/40">
              <Link href="/" className="transition-colors hover:text-white">Business Connect</Link>
              <span>/</span>
              <span className="text-white/60">Member Directory</span>
            </div>

            <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-white/60">Find a Trusted Local Business</p>
                <h1 className="mb-8 max-w-4xl font-serif text-[clamp(2.7rem,7vw,5.8rem)] font-light leading-[1.0] text-white">
                  Tapps Business Connect Member Directory.
                </h1>
                <p className="max-w-2xl text-[16px] leading-8 text-white/70">
                  Browse vetted local professionals held to high standards for service, integrity, and relationship-driven business across Lake Tapps, Bonney Lake, Sumner, Puyallup, Buckley, and surrounding communities.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 lg:col-span-4">
                <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/45">Why This Directory Exists</p>
                <p className="text-[15px] leading-7 text-white/65">
                  TBC is built around trusted relationships and high standards. This directory helps consumers confidently find local businesses connected through an accountable, relationship-focused community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-6 md:grid-cols-3 lg:px-12">
            {[
              { label: "Trusted", body: "Members are part of a standards-driven local business community." },
              { label: "Local", body: "Serving Lake Tapps, Bonney Lake, Sumner, Puyallup, Buckley, and nearby areas." },
              { label: "Vetted", body: "Built for consumers who want a more confident way to choose local professionals." },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-charcoal/8 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-charcoal/45">{item.label}</p>
                <p className="text-[15px] leading-7 text-charcoal/65">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <MemberDirectory members={allMembers} categories={activeCategories} />

        <section className="bg-[#1a1a18] py-20 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-white/50">Join the Community</p>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.08] text-white">
                  Want to be listed here?
                </h2>
              </div>
              <div className="flex flex-col gap-6 lg:items-end">
                <p className="max-w-xl text-[16px] leading-8 text-white/65 lg:text-right">
                  Membership is application-based for local professionals who want to build real relationships and uphold the standards of Tapps Business Connect.
                </p>
                <Link
                  href="/apply"
                  className="inline-flex items-center rounded-full bg-white px-8 py-4 text-[12px] uppercase tracking-[0.25em] text-charcoal transition-all duration-500 hover:bg-white/90"
                >
                  Apply for Membership
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Marquee />
      </main>
      <Footer />
    </>
  );
}
