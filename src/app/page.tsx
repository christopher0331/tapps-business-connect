import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import FeaturedMemberSlider from "@/components/FeaturedMemberSlider";
import { BC_LOGO, allMembers } from "@/lib/business-connect-data";

export const metadata: Metadata = {
  title: "Tapps Business Connect | Local Businesses & Services in Lake Tapps, Bonney Lake & Puyallup",
  description:
    "Tapps Business Connect — high-standard businesses, real relationships, trusted referrals. A networking group for professionals in Lake Tapps, Bonney Lake, Sumner, Puyallup, Buckley & surrounding areas.",
};

const memberToolLinks = [
  { label: "Member Application", href: "/apply" },
  { label: "MTG Attendance Check-In", href: "https://share-na2.hsforms.com/2n3GfbQmvScGO5M9fakRKnQ415kr0", external: true },
  { label: "RSVP for Next Event", href: "/rsvp" },
  { label: "Group Structure & Guidelines", href: "/about" },
];

export default function BusinessConnectPage() {
  return (
    <>
      <Header />
      <main className="bg-white">

        <section className="bg-[#1a1a18] pt-14 pb-24 sm:pt-20 sm:pb-32">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-8">
                  <Image
                    src={BC_LOGO}
                    alt="Tapps Business Connect"
                    width={200}
                    height={100}
                    className="object-contain invert mix-blend-screen"
                  />
                </div>
                <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-white/60">Lake Tapps · Bonney Lake · Puyallup</p>
                <h1 className="mb-8 max-w-3xl font-serif text-[clamp(2.8rem,7vw,5.8rem)] font-light leading-[1.0] text-white">
                  Tapps Business<br />Connect.
                </h1>
                <p className="max-w-xl text-[16px] leading-8 text-white/70">
                  High-standard businesses. Real relationships. Trusted referrals. A networking group for professionals across Lake Tapps, Bonney Lake, Sumner, Puyallup, Buckley &amp; surrounding areas.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:min-w-[320px]">
                <Link
                  href="/directory"
                  className="flex items-center justify-between rounded-full bg-white px-6 py-4 text-[12px] uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:bg-white/90"
                >
                  Find a Trusted Local Business
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 shrink-0 ml-4">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/directory"
                  className="flex items-center justify-between rounded-full border border-white/20 px-6 py-4 text-[12px] uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:text-white"
                >
                  Tapps Business Connect Member Directory
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 shrink-0 ml-4">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
              <div>
                <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-mid-gray">Tapps Business Connect Member Directory</p>
                <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.05] text-charcoal">
                  Find a Trusted Local Business.
                </h2>
              </div>
              <div className="flex flex-col gap-6 lg:items-end">
                <p className="max-w-2xl text-[16px] leading-8 text-charcoal/70 lg:text-right">
                  Browse a curated group of vetted professionals held to high standards for service, integrity, and local relationships across Lake Tapps, Bonney Lake, Sumner, Puyallup, Buckley, and surrounding areas.
                </p>
                <Link
                  href="/directory"
                  className="inline-flex items-center gap-3 rounded-full bg-charcoal px-8 py-4 text-[12px] uppercase tracking-[0.25em] text-white transition-all duration-500 hover:bg-charcoal/85"
                >
                  View Full Member Directory
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            <FeaturedMemberSlider members={allMembers} />
          </div>
        </section>

        <section className="bg-[#f2ede6] py-12">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {memberToolLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center justify-between rounded-full bg-white px-6 py-4 text-[12px] uppercase tracking-[0.2em] text-charcoal/70 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:text-charcoal hover:shadow-[0_14px_45px_rgba(0,0,0,0.09)]"
                >
                  {l.label}
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 shrink-0 ml-4">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
              <div>
                <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-mid-gray">How It Works</p>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.08] text-charcoal">
                  Three Ways to Connect.
                </h2>
              </div>
              <p className="text-[16px] leading-8 text-charcoal/70">
                We build meaningful connections through monthly breakfast meetings, educational speakers, and after-hours events — without the fees or pressure.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { label: "Guests", description: "Attend a morning meeting to experience the group firsthand. No commitment required." },
                { label: "Members", description: "Accepted professionals who hold exclusive seats and uphold our high standards. By application." },
                { label: "Affiliates", description: "Professionals who've attended prior meetings and engage through our Connections After Close after-hours events." },
              ].map((t, i) => (
                <div key={t.label} className="rounded-3xl border border-charcoal/8 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                  <p className="mb-4 font-serif text-[3rem] font-light leading-none text-charcoal/30">0{i + 1}</p>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-charcoal/60">{t.label}</p>
                  <p className="text-[15px] leading-7 text-charcoal/70">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f2ede6] py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
              <div>
                <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-mid-gray">How We Meet</p>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.08] text-charcoal">
                  Two Ways to Connect.
                </h2>
              </div>
              <div className="flex flex-col gap-4 lg:items-end">
                <p className="text-[15px] leading-7 text-charcoal/60 lg:text-right">
                  Both events require an RSVP — seating is limited by design.
                </p>
                <Link
                  href="/rsvp"
                  className="inline-flex items-center gap-3 rounded-full bg-charcoal px-8 py-4 text-[12px] uppercase tracking-[0.25em] text-white transition-all duration-500 hover:bg-charcoal/85"
                >
                  RSVP Required — Reserve Your Spot
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                <p className="mb-4 font-serif text-[3rem] font-light leading-none text-charcoal/10">01</p>
                <h3 className="mb-3 font-serif text-[1.5rem] font-light leading-snug text-charcoal">Monthly Morning<br />Members Meeting (M4)</h3>
                <p className="mb-6 text-[14px] leading-7 text-charcoal/60">
                  Once per month. Designed for Members and Guests in open industry seats. Includes structured networking, educational segments, referral sharing, and accountability updates. Seating intentionally limited.
                </p>
                <div className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-[#f2ede6] px-5 py-3">
                  <span className="h-2 w-2 rounded-full bg-charcoal/30 shrink-0" />
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-charcoal/60">RSVP Required</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/rsvp" className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-charcoal/85">
                    RSVP as Guest
                  </Link>
                  <Link href="/rsvp" className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:bg-charcoal hover:text-white">
                    RSVP as Member
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-[#1a1a18] p-10">
                <p className="mb-4 font-serif text-[3rem] font-light leading-none text-white/10">02</p>
                <h3 className="mb-3 font-serif text-[1.5rem] font-light leading-snug text-white">Connections<br />After Close (CAC)</h3>
                <p className="mb-6 text-[14px] leading-7 text-white/55">
                  Once per month, hosted by a TBC Member. Open to Members, Guests, and Affiliates. No industry seat restrictions — focused on building relationships in a relaxed, after-hours setting.
                </p>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                  <span className="h-2 w-2 rounded-full bg-white/30 shrink-0" />
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/60">RSVP Required</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/rsvp" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:bg-white/90">
                    RSVP as Member / Affiliate
                  </Link>
                  <Link href="/rsvp" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/10">
                    RSVP as Guest
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1a1a18] py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-white/60">Join the Group</p>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.08] text-white">
                  Serious About Your<br />Business?
                </h2>
              </div>
              <div className="flex flex-col gap-6 lg:items-end">
                <p className="text-[16px] leading-8 text-white/70 lg:text-right">
                  If you&apos;re ready to network with integrity, RSVP for our next meeting or submit a member application. Hosted by André Bohall (OnSite Real Estate Group) and Cindie Bohall (NW Senior Advisors). No fees. No fluff. Just great people doing great business.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/apply"
                    className="inline-flex items-center rounded-full bg-white px-8 py-4 text-[12px] uppercase tracking-[0.25em] text-charcoal transition-all duration-500 hover:bg-white/90"
                  >
                    Apply for Membership
                  </Link>
                  <Link
                    href="/rsvp"
                    className="inline-flex items-center rounded-full border border-white/35 px-8 py-4 text-[12px] uppercase tracking-[0.25em] text-white transition-all duration-500 hover:bg-white/10"
                  >
                    RSVP for Next Event
                  </Link>
                </div>
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
