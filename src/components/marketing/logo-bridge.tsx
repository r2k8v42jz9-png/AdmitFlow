"use client";

import { useT } from "@/lib/i18n";

/**
 * Bridge band between the hero and the journey — a quiet marquee of the elite
 * universities students are admitted to. Shares the hero's background so the
 * page reads as one continuous experience instead of separate blocks.
 */

const LOGOS: { name: string; domain: string }[] = [
  { name: "MIT", domain: "mit.edu" },
  { name: "Stanford", domain: "stanford.edu" },
  { name: "Harvard", domain: "harvard.edu" },
  { name: "Oxford", domain: "ox.ac.uk" },
  { name: "Cambridge", domain: "cam.ac.uk" },
  { name: "ETH Zürich", domain: "ethz.ch" },
  { name: "NUS", domain: "nus.edu.sg" },
  { name: "Toronto", domain: "utoronto.ca" },
  { name: "Melbourne", domain: "unimelb.edu.au" },
  { name: "TU München", domain: "tum.de" },
  { name: "Imperial", domain: "imperial.ac.uk" },
  { name: "UCL", domain: "ucl.ac.uk" },
];

export function LogoBridge() {
  const { t } = useT();
  const row = [...LOGOS, ...LOGOS];

  return (
    <section className="relative py-14">

      <p className="relative text-center text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
        {t("hero.admittedTo")}
      </p>

      <div className="mask-fade-x relative mt-8 flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pause-on-hover sm:gap-14">
          {row.map((u, i) => (
            <span key={i} className="flex shrink-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://www.google.com/s2/favicons?sz=128&domain=${u.domain}`}
                  alt=""
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </span>
              <span className="whitespace-nowrap font-display text-base font-medium text-foreground/55">{u.name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
