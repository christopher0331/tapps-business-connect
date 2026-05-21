# Quo-Style Comms Hub for an EA — Build Review & Spec

**Audience:** 2 business owners + 1 Executive Assistant (3 seats total)
**Purpose:** Pipe every business call (audio + transcript) and every SMS/MMS from both owners' Android phones into a single, protected web dashboard the EA uses to schedule meetings, plan events, and create reminders.
**Date of review:** May 2026
**Reviewer assumption about location:** Washington State (Lake Tapps / Puyallup area, based on parent repo). **Washington is a two-party consent state.** That fact drives a lot of the architecture below.

---

## TL;DR — Read this first

1. **You almost certainly do not want to record raw cellular calls on the owners' personal Android phones.** In 2026 it requires rooting their daily-driver phones (Magisk/KernelSU + BCR), which kills banking/Google Pay/work apps, voids warranty, breaks during OS updates, and even when it works, Android 15 has new behavior that drops audio on network handover. This is a hobbyist setup, not a business one.
2. **The right architecture is the same one Quo (formerly OpenPhone), Dialpad, Aircall, Google Voice etc. use:** route the owners' business comms through a programmable telephony provider (Twilio is the recommended choice) and treat the cell phone as a soft client. You either port the owners' existing numbers to Twilio, or give them new "business line" numbers that ring their cell as a fallback. Recording, transcription, SMS capture, and webhook-to-database all become trivial.
3. **A "true Quo clone" for 3 users, using Cursor + Opus 4.7, is realistic in roughly 2–3 weeks for a usable MVP and 4–6 weeks of focused work for a polished, production-grade version.** Without AI assistance, budget 12–16 weeks.
4. **Recurring cost for 3 seats: ~$60–$180/month** depending on call volume and which transcription engine you pick.
5. **Washington requires two-party consent.** Your inbound call flow must play a recording disclosure; your outbound flow must do the same or get verbal consent. This is baked into the spec below.

---

## 1. What Quo actually does (and what it doesn't)

Quo (rebranded from OpenPhone in early 2026) is a cloud PBX. It is **not** an app that secretly captures audio from a normal cellular call. It works because:

- You get a Quo phone number (or port your existing one in).
- Calls to that number land in Quo's softswitch first, where Quo records, transcribes, and stores them, then bridges the call to your device.
- Outbound calls originate from the Quo app (mobile or desktop), so they also flow through Quo's softswitch.
- SMS messages go in/out through Quo's messaging service and are captured the same way.

Your spec ("record cellular calls and texts from Android phones") sounds different from Quo, but if you trace what users actually want — a unified log of every business conversation — Quo's architecture is what makes that possible. The same architecture is what we should copy.

---

## 2. The Android cellular-call problem (why we don't do it the obvious way)

| Option | Works in 2026? | Notes |
|---|---|---|
| **Stock Phone app call recording (Pixel 6+ only, US)** | Partially | Plays a loud "this call is now being recorded" voice prompt (a beep-only mode is being rolled out in Phone app v212, March 2026 teardown, not yet public). No API to ship recordings to your server; you'd have to scrape `/storage/emulated/0/Recordings/Call/` over SSH/Syncthing. Brittle. |
| **BCR (chenxiaolong/BCR)** — best-in-class FOSS recorder | Only on **rooted** Android 9+ (Magisk or KernelSU) | Stereo on Pixels is the only reliable variant. Android 15 has a known regression: recording stops on VoLTE/VoWiFi handover and won't resume until next call. KernelSU 3.0+ needs `meta-overlayfs`. |
| **Third-party "call recorder" apps from Play Store** | No | Google's Play Store policy + Android 10's removal of `getCallAudio()` killed these. The ones still listed mostly record only your mic side and silence on the remote party. |
| **Carrier-level recording** (Verizon/AT&T/T-Mobile) | Not offered to consumers | Some business lines (Verizon One Talk, etc.) offer it, but it's a different product. |
| **VoIP/softphone route (Twilio, Telnyx, SignalWire, Bandwidth)** | Yes, fully supported | Recommended. See section 3. |

**Conclusion:** if the owners insist on using their existing Android cellular dialer with no behavior change, the only honest answer is "this is not solvable reliably in 2026." Otherwise, the VoIP route below is dramatically better on every axis (legal, technical, cost, UX, longevity).

---

## 3. Recommended architecture

```
                           ┌─────────────────────────────────┐
                           │  Owners' Android phones         │
                           │  • Twilio Voice React-Native    │
                           │    softphone (or Twilio's free  │
                           │    "Frontline" app) for calls   │
                           │  • Stock Messages app keeps     │
                           │    working — see SMS section    │
                           └────────────┬────────────────────┘
                                        │ inbound + outbound
                                        ▼
                  ┌────────────────────────────────────────┐
                  │   Twilio Programmable Voice + Messaging │
                  │   • Per-owner phone number              │
                  │   • Auto-record both legs (stereo)      │
                  │   • Voice Intelligence or Deepgram      │
                  │     for transcripts + summaries         │
                  └────────────┬───────────────────────────┘
                               │ webhooks (status, recording-ready,
                               │ transcript-ready, message-received)
                               ▼
                  ┌────────────────────────────────────────┐
                  │   Next.js 16 app on Vercel              │
                  │   • /api/twilio/* webhook handlers      │
                  │   • Signed-URL playback                 │
                  │   • Inngest jobs: summarize, extract    │
                  │     action items, propose reminders     │
                  └────────────┬───────────────────────────┘
                               │
                ┌──────────────┴─────────────────┐
                ▼                                ▼
       ┌─────────────────┐              ┌────────────────────┐
       │ Postgres (Neon) │              │ Object storage     │
       │ via Drizzle ORM │              │ Cloudflare R2 or S3│
       │ Calls, Messages,│              │ Audio files (opt.  │
       │ Transcripts,    │              │ mirror; Twilio also│
       │ Contacts,       │              │ stores them)       │
       │ Reminders, Users│              └────────────────────┘
       └─────────────────┘
                ▲
                │ Clerk auth (3 users, email+passkey, MFA on)
                │
       ┌────────┴────────┐
       │ EA + 2 owners   │
       │ open dashboard  │
       │ at private URL  │
       └─────────────────┘
```

---

## 4. Tech stack (with rationale)

| Layer | Pick | Why this, not the alternatives |
|---|---|---|
| **Frontend + backend** | **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4** | Matches the existing `tapps-business-connect` codebase (`next 16.1.6`, `react 19.2.3`, `tailwind v4`), so you/the LLM stay in one mental model. Server Actions remove half the API plumbing. |
| **Auth** | **Clerk** | Free up to 10k MAU (you have 3). 5-minute setup, passkeys, MFA, magic links, org/role support if you ever add the EA's assistant. NextAuth/Auth.js works too but you'd own more. |
| **Database** | **Neon Postgres** (or Supabase if you also want auth/storage in one place) | Serverless Postgres, scales to zero, ~$0–$19/mo for this load. |
| **ORM** | **Drizzle** | Type-safe SQL, lightweight, plays well with Next.js. Prisma is fine but heavier. |
| **Object storage (optional mirror)** | **Cloudflare R2** | Zero egress, ~$0.015/GB/mo. Use only if you want a backup outside Twilio. |
| **Telephony** | **Twilio Programmable Voice + Messaging** | Most mature webhooks, best docs, Voice SDK for Android, easy two-party-consent flows, includes Voice Intelligence. Telnyx is ~30% cheaper if cost matters; Bandwidth is best if you ever scale to dozens of users. |
| **Transcription** | **Twilio Voice Intelligence** for v1 (zero glue code), **Deepgram Nova-4** for v2 if cost matters | Voice Intelligence: speaker diarization, PII redaction, summaries built in. Deepgram Nova-4: 7.4% WER on telephony (best in class), ~$0.0043/min batch — about 12× cheaper than Twilio's bundled $0.05/min. |
| **Background jobs** | **Inngest** (free tier covers you) | Durable, signed webhooks, retries, fan-out. Replaces the need for a separate worker process. |
| **AI summarization + action-item extraction** | **OpenAI gpt-5.5 or Claude Opus 4.7** via Vercel AI SDK | Run on transcript-ready event. ~$0.005–$0.02 per call. |
| **Email/SMS notifications to the EA** | **Resend** (email) + Twilio (SMS) | Resend is $0 for first 3k/mo. |
| **Hosting** | **Vercel** | Free Hobby tier may work; Pro $20/mo if you want logs, longer function timeouts, and team. |
| **Monitoring** | **Sentry** (free) + **Vercel Analytics** | Catch webhook failures fast — they will happen. |
| **Optional cell-phone SMS fallback** | **android-sms-gateway (capcom6)** on each owner's phone | If you want to capture personal-line SMS *in addition to* the new business line, install this open-source app on each Android. It forwards every SMS as a JSON webhook to your Next.js API. Requires the owners to grant `READ_SMS`/`RECEIVE_SMS`. See SMS section below. |

---

## 5. SMS strategy — three options, pick one

### Option A (recommended): All business SMS goes through the Twilio number
- Owners give out the Twilio number for business.
- They receive/reply in the Twilio app or in your dashboard's compose UI.
- Every message is webhooked into Postgres. Zero phone-side software.

### Option B: Forward personal-line SMS via on-device gateway
- Install `capcom6/android-sms-gateway` (Kotlin, FOSS, 4.3k★, mature) on each owner's phone.
- Configure private mode → it posts every incoming/outgoing SMS as JSON to your `/api/sms/webhook` endpoint with HMAC auth.
- Requires `READ_SMS`, `RECEIVE_SMS`, foreground service. Battery cost: negligible.
- Risk: Google may flag the apps as "high-risk permissions"; not a problem when sideloaded.

### Option C: Both
- Use the Twilio number for **outbound** business messages.
- Use the on-device gateway to **archive** personal-line inbound (in case a client texts the wrong number).
- This is what most prosumer setups end up with.

---

## 6. Data model (Drizzle / Postgres sketch)

```ts
// users — synced from Clerk
id, clerkUserId, role ('owner'|'ea'), displayName, ownerId(self-ref nullable)

// contacts — auto-merged by phone number
id, e164, displayName?, company?, notes?, firstSeenAt

// calls
id, twilioCallSid, ownerId, direction, fromE164, toE164, contactId,
startedAt, endedAt, durationSec, recordingUrl, recordingDurationSec,
status, hasTranscript, hasSummary, createdAt

// messages
id, twilioMessageSid?, ownerId, direction, fromE164, toE164, contactId,
body, mediaUrls jsonb, source ('twilio'|'android_gateway'),
sentAt, createdAt

// transcripts
id, callId, provider ('twilio_vi'|'deepgram'), language,
segments jsonb,   // [{speaker, startMs, endMs, text}]
fullText, redactedText?, createdAt

// summaries
id, callId|messageThreadId, title, tldr, actionItems jsonb,
suggestedReminders jsonb, createdBy 'llm-model-id', createdAt

// reminders — what the EA acts on
id, ownerId, sourceCallId?, sourceMessageId?, title, dueAt,
status ('open'|'scheduled'|'done'|'dismissed'), assignedToEaId,
notes, createdAt

// audit_log — required for two-party-consent defensibility
id, actorId, action, entityType, entityId, ip, userAgent, at
```

---

## 7. Pages / UX outline

- `/sign-in` — Clerk
- `/` — Unified inbox: chronological list (calls + messages) with filters (owner, contact, date, has-action-items)
- `/calls/[id]` — Audio player + diarized transcript + AI summary + "Create reminder" button
- `/messages/[contactId]` — Thread view with both owners' messages, ability to send (from Twilio number)
- `/contacts` — Auto-built address book
- `/reminders` — EA's kanban: Open / Scheduled / Done
- `/settings` — Per-owner recording on/off, business hours, voicemail greeting, redaction toggles
- `/audit` — Compliance log (owner-visible)

---

## 8. Two-party consent compliance (Washington / multi-state)

This is non-negotiable; bake it in from day one.

- **Inbound calls:** Twilio Studio flow plays a TTS prompt: *"This call may be recorded and transcribed for business record-keeping. Press 1 to continue, or hang up now."* (Or simply: "...by continuing this call, you consent to recording." for lower friction — check with counsel.)
- **Outbound calls:** Same TTS plays to the called party when they pick up, before bridging to the owner. Twilio's `<Say>` + `<Dial>` does this in ~10 lines of TwiML.
- **SMS:** The first message a new contact receives from the Twilio number includes a one-time disclosure: *"Messages with this number are saved for business record-keeping. Reply STOP to opt out."*
- **Audit log:** Persist consent event (timestamp, method, IP/caller-ID) on the call/message record.
- **Per-owner kill switch:** A toggle in `/settings` lets either owner pause recording for a specific call (legal-privileged conversations, personal calls, etc.).
- **Redaction:** Enable PII redaction in Twilio VI or Deepgram for SSNs/credit cards before persisting transcripts.

> ⚠️ Get an actual attorney to sign off on the disclosure language before you go live. The architecture above gives them everything they need to say yes; the wording is theirs.

---

## 9. Cost model (3 users, moderate volume)

Assume per owner: 60 calls/day × avg 3 min = 180 min/day × 22 workdays ≈ **4,000 call-minutes/month/owner**, plus ~500 SMS/month/owner.

| Line item | Twilio VI path | Deepgram path |
|---|---|---|
| 2× Twilio US local numbers | $2.30 | $2.30 |
| Inbound voice (8,000 min × $0.0085) | $68.00 | $68.00 |
| Outbound voice (8,000 min × $0.014) | $112.00 | $112.00 |
| Recording ($0.0025/min) | $20.00 | $20.00 |
| Recording storage ($0.0005/min/mo, year-1 avg) | ~$25.00 | ~$25.00 |
| Transcription (8,000 min) | $400.00 (@ $0.05) | $34.40 (@ $0.0043 batch) |
| SMS in/out (~1,000 × $0.0083) | $8.30 | $8.30 |
| Vercel Pro | $20.00 | $20.00 |
| Neon Postgres (Launch) | $19.00 | $19.00 |
| Clerk | $0 | $0 |
| Inngest | $0 | $0 |
| OpenAI/Claude summaries (~$0.01 × ~2,640 calls) | $26.40 | $26.40 |
| Sentry / Resend / Cloudflare R2 (~) | $5–10 | $5–10 |
| **Estimated monthly total** | **~$705** | **~$340** |

Halve those numbers for "light" usage (30 calls/day each). At the very low end (~30 calls/week each), you can be **under $100/mo total**. If you replace Twilio's bundled transcription with Deepgram you save almost exactly half the bill. The breakeven for moving off Twilio VI is roughly 1,500 minutes/month total across both owners.

**Outbound voice is the single biggest line item.** If the owners can use the Twilio softphone over Wi-Fi/data (Voice SDK), outbound switches from $0.014/min PSTN to $0.004/min — saving ~$80/mo at the volumes above.

---

## 10. Build time estimate with Cursor + Claude Opus 4.7

Assuming a competent solo developer (or you) driving Cursor in Agent/Plan mode, with Opus 4.7 doing the heavy lifting. "Hour" = one focused, uninterrupted developer-hour at the keyboard; "day" = ~6–8 such hours.

| # | Phase | With Cursor + Opus 4.7 | Hours (low–high) | Without AI |
|---|---|---|---|---|
| 0 | Twilio setup, number provisioning, consent IVR (Studio flows + TwiML) | 0.5 day | **4–6 h** | ~8 h |
| 1 | Next.js scaffold, Clerk auth, Drizzle + Neon schema, base layout | 1 day | **6–8 h** | ~24 h |
| 2 | Twilio webhook handlers (call status, recording-ready, message-received) + signature verification | 1–2 days | **8–14 h** | ~32 h |
| 3 | Recording playback + diarized transcript viewer (signed URLs, waveform) | 2–3 days | **14–22 h** | ~40 h |
| 4 | AI summary + action-item extraction + reminder generation (Vercel AI SDK) | 2 days | **12–16 h** | ~40 h |
| 5 | EA reminder kanban + Google Calendar export | 2–3 days | **14–22 h** | ~60 h |
| 6 | Contacts auto-merge, search, filters (Postgres FTS or pgvector) | 2 days | **12–16 h** | ~40 h |
| 7 | Settings, audit log, consent toggles, redaction toggle | 1–2 days | **8–14 h** | ~24 h |
| 8 | Polish, error/empty states, mobile-EA PWA view, Framer Motion | 2–3 days | **14–22 h** | ~50 h |
| 9 | Soft launch — Twilio production trust, A2P 10DLC SMS registration paperwork | 0.5 day (+5–10 day wait) | **4 h active** | same |
| 10 | Hardening — Sentry, retry logic, dead-letter queue, nightly reconciliation, backups, runbook | 1–2 days | **8–14 h** | ~40 h |
| 11 | Pilot iteration with owners + EA (bug fixes, UX tweaks based on real usage) | — | **8–16 h** | ~24 h |
| 12 | Legal review back-and-forth on consent script | — | **2–4 h of your time** | same |
| | **Active dev hours, total** | | **~114–178 h** | **~380 h** |

### Three scenarios, expressed in hours

| Scope | Hours with Cursor + Opus 4.7 | Calendar (focused) | Calendar (nights/weekends) |
|---|---|---|---|
| **Bare-bones "1-week cut-to-bone"** (phases 0–4 only, no reminders UI, single page) | **30–45 h** | 4–6 working days | 1.5–2 weeks |
| **MVP** (phases 0–4 + minimal 7 + 9 = usable end-to-end, no kanban, no Calendar export) | **50–75 h** | 1.5–2 working weeks | 3–4 weeks |
| **Production-ready** (everything in the table) | **115–180 h** | 3–5 working weeks | 6–10 weeks |
| **Without AI assistance** (same production scope) | **~380 h** | 10–14 working weeks | 4–6 months |

### Where the hours actually go (heads-up)

In practice, the time sinks that always blow estimates on telephony projects:

- **Twilio webhook debugging** (signature mismatches, ngrok in dev vs prod URLs, late-arriving recording callbacks). Budget the high end of phase 2.
- **Audio player polish** (waveform seeking, dual-channel display, time-synced transcript highlighting). Easy to demo, hard to make feel good.
- **A2P 10DLC SMS registration rejection cycles.** Each rejection adds ~3–7 days of wall-clock and ~1–2 h of paperwork. File on day 1.
- **Pilot feedback from the owners** ("can we hide personal calls?", "the EA needs a different sort order"). Always 8–16 h of unplanned work.
- **Calendar OAuth + timezone bugs.** Always.

### Wall-clock if one person is driving

- **Full-time (40 h/week):** production-ready in ~**3–5 weeks** active, but **5–7 weeks calendar** because Twilio number port-in (~10 business days) and A2P 10DLC approval (~7–10 business days) gate go-live and run in parallel.
- **Half-time (~20 h/week):** **6–10 weeks calendar**.
- **Nights and weekends (~10 h/week):** **3–4 months calendar**.

> Practical advice: spend the first 2–3 hours in **Plan mode** with Opus 4.7 generating a feature-by-feature build plan committed to `/docs`, then switch to Agent mode and execute one feature per session. Keep PRs small. The model is very strong at Twilio webhooks, Next.js App Router, Drizzle, and Clerk — those four are 80% of the code and the area where the hour estimates are most reliable.

---

## 11. Open questions to decide before you start coding

1. **Port existing numbers or get new ones?** Porting takes 5–15 business days, can't make/receive calls during ~15-minute cutover, and locks you into Twilio. New numbers are instant but require re-publishing business cards/website.
2. **Are the owners willing to switch their dialer app?** If no → cellular-recording approach (rooted phones + BCR), and you should reset their expectations. If yes → Twilio approach (recommended).
3. **Does the EA need to send messages on the owners' behalf?** If yes, the dashboard needs a compose UI and clear "sent by EA" labeling for compliance.
4. **Should personal calls/texts be filterable out?** Add a per-contact toggle and a phone-number allowlist/denylist.
5. **Retention policy?** Default to 7 years (matches IRS retention) but make it configurable — some industries (legal, medical) require specific handling.
6. **Calendar integration?** Google Calendar is the obvious add — the EA likely lives there. Add it in v1.1.
7. **Mobile app for the EA, or PWA?** A polished PWA on her phone covers 95% of use cases at 5% of the cost.

---

## 12. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Two-party consent violation in WA | Medium if rushed | High (criminal + civil) | Consent IVR + SMS disclosure + audit log + counsel review before launch |
| Twilio webhook delivery failure → missing call in dashboard | Medium | Medium | Inngest with retries + nightly reconciliation job that polls Twilio API for the last 48h |
| Recording stored unencrypted in Twilio | Low | Medium | Twilio encrypts at rest; enable Voice Recording Encryption ($0.0004/min extra) for true E2E + your KMS key |
| Owners hate the new dialer | High if forced | High | Pilot with one owner for 1 week first. Twilio's mobile SDK + a thin wrapper is fine but isn't native-quality. Consider Twilio Frontline (free, polished) as the softphone client. |
| Personal calls accidentally captured | Medium | Medium | Per-call kill switch + visible "RECORDING" banner in the softphone + only the business number is recorded |
| Vercel function timeout on large transcripts | Low | Low | Use Inngest for transcript processing; Vercel function just enqueues |
| A2P 10DLC SMS rejection | Medium | Medium (delays SMS go-live ~1 week) | Register the brand and campaign on day 1, not day 30 |

---

## 13. Recommended sequencing (week-by-week)

**Week 1 — Foundations**
- Day 1: Twilio account, buy 2 numbers, set up Studio flows with consent IVR, register A2P 10DLC.
- Day 2: Create `comms-hub` Next.js 16 project. Add Clerk, Drizzle, Neon. Deploy to Vercel.
- Day 3: Webhooks for `call.status`, `recording.completed`, `message.received` with signature verification. Hello-world insert into Postgres.
- Day 4: Recording playback page with signed URLs.
- Day 5: First end-to-end call → recording in dashboard. Demo to owners.

**Week 2 — Intelligence**
- Day 6–7: Twilio VI (or Deepgram) integration. Diarized transcript viewer.
- Day 8–9: LLM summaries + action-item extraction. Reminder objects.
- Day 10: Unified inbox view (calls + messages merged chronologically).

**Week 3 — EA workflow**
- Day 11–12: Reminder kanban + Google Calendar export.
- Day 13: Contacts, search, filters.
- Day 14: Settings + audit log + redaction.
- Day 15: Pilot with one owner. Iterate.

**Week 4 — Polish + production**
- Day 16–17: Mobile/PWA polish for EA. Email digest.
- Day 18: Sentry, dead-letter queues, backup, runbook.
- Day 19: Legal review of consent language.
- Day 20: Full rollout.

---

## 14. What I would build differently if you said "I only have 1 week"

Cut to the bone:

1. One Twilio number, forwarded to both owners (simultaneous ring), recorded.
2. One Next.js app with one page: a chronological list of calls with audio + Twilio VI transcript + GPT summary.
3. Clerk for auth, Neon for DB, Vercel for hosting.
4. No reminder kanban — just a "Copy summary to clipboard" button so the EA pastes into whatever calendar she already uses.
5. SMS captured but displayed read-only.

That's about **4–6 days with Cursor + Opus 4.7** and gets you 70% of the value.

---

## 15. Files / repo layout I'd start with

```
comms-hub/
├─ src/
│  ├─ app/
│  │  ├─ (dashboard)/
│  │  │  ├─ page.tsx                 # unified inbox
│  │  │  ├─ calls/[id]/page.tsx
│  │  │  ├─ messages/[contactId]/page.tsx
│  │  │  ├─ reminders/page.tsx
│  │  │  ├─ contacts/page.tsx
│  │  │  ├─ settings/page.tsx
│  │  │  └─ audit/page.tsx
│  │  ├─ api/
│  │  │  ├─ twilio/voice/route.ts        # call status + recording-ready
│  │  │  ├─ twilio/message/route.ts      # SMS in/out
│  │  │  ├─ twilio/transcript/route.ts   # VI callback
│  │  │  ├─ android-sms/route.ts         # optional on-device gateway
│  │  │  └─ inngest/route.ts
│  │  ├─ sign-in/[[...sign-in]]/page.tsx
│  │  └─ layout.tsx
│  ├─ lib/
│  │  ├─ db/schema.ts                    # Drizzle
│  │  ├─ db/index.ts
│  │  ├─ twilio/client.ts
│  │  ├─ twilio/verify.ts                # signature validation
│  │  ├─ ai/summarize.ts
│  │  └─ auth.ts
│  ├─ inngest/
│  │  ├─ functions/transcribe.ts
│  │  ├─ functions/summarize.ts
│  │  └─ functions/reconcile.ts          # nightly polling
│  └─ components/
│     ├─ AudioPlayer.tsx
│     ├─ TranscriptViewer.tsx
│     ├─ InboxList.tsx
│     ├─ ReminderCard.tsx
│     └─ ConsentBadge.tsx
├─ twilio/
│  ├─ studio-flow-inbound.json           # consent IVR exported
│  └─ studio-flow-outbound.json
├─ drizzle/                              # migrations
├─ .env.example
└─ README.md
```

---

## 16. Bottom-line recommendation

Build it as a **Next.js 16 + Clerk + Drizzle/Neon + Twilio + Deepgram + Inngest** app on Vercel. Route both owners' business comms through Twilio (port or new numbers). Use Twilio Voice Intelligence for v1 to compress time-to-launch, switch to Deepgram for cost in v2. Plan for **3–5 weeks of focused work** in Cursor with Opus 4.7, plus 1–2 weeks of carrier paperwork running in parallel. Expect **~$60–$180/month** in recurring spend for 3 users at realistic volume. Get a lawyer to bless the consent script before flipping it on, because Washington is two-party consent and this app's value proposition *is* the recording.

Skip the "record cellular calls on stock Android" path. It's a tar pit in 2026.
