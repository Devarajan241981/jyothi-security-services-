"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BadgeCheck, ShieldCheck } from "lucide-react";

const RING_DELAYS = [0, 0.9, 1.8];

export function HeroIllustration() {
  const t = useTranslations("hero.illustration");

  const stats = [
    { value: "500+", label: t("guards") },
    { value: "24×7", label: t("coverage") },
    { value: "<15min", label: t("response") },
  ];

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
      data-decorative-illustration
    >
      {/* Soft glow blobs instead of a hard-edged panel */}
      <div className="absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/14 blur-3xl" />
      <div className="absolute right-6 top-4 h-40 w-40 rounded-full bg-accent/12 blur-3xl" />
      <div className="absolute bottom-10 left-4 h-36 w-36 rounded-full bg-primary/12 blur-3xl" />

      {/* Verified Agency chip */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute left-0 top-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-4 py-2.5 shadow-lg"
      >
        <BadgeCheck className="size-4 text-success" />
        <span className="text-sm font-semibold text-foreground">{t("verifiedAgency")}</span>
      </motion.div>

      {/* Radar rings pulsing outward behind the badge */}
      <div className="absolute inset-0 flex items-center justify-center">
        {RING_DELAYS.map((delay) => (
          <motion.span
            key={delay}
            className="absolute rounded-full border border-primary/20"
            style={{ width: "10.5rem", height: "10.5rem" }}
            animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, delay, ease: "easeOut" }}
          />
        ))}

        {/* Grounded shadow, so the badge reads as floating above the page */}
        <motion.div
          className="absolute bottom-[-1.25rem] h-6 w-28 rounded-full bg-primary/25 blur-xl sm:w-32"
          animate={{ scaleX: [1, 0.85, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 3D medallion: rotating glossy rim + embossed inner sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
            y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
          }}
          style={{ perspective: 800 }}
          className="relative"
        >
          <motion.div
            className="absolute inset-[-0.4rem] rounded-full opacity-90"
            style={{
              background:
                "conic-gradient(from 0deg, #0B5ED7, #6EA6F2, #E0A825, #0B5ED7)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            animate={{ rotateY: [0, 14, 0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative flex size-32 items-center justify-center rounded-full bg-white shadow-[0_24px_48px_rgba(11,94,215,0.28),inset_0_-10px_18px_rgba(11,94,215,0.10),inset_0_10px_16px_rgba(255,255,255,0.95)] sm:size-36"
          >
            <span className="pointer-events-none absolute left-6 top-5 h-9 w-16 rounded-full bg-white/80 blur-md sm:left-7 sm:top-6" />
            <ShieldCheck
              className="relative size-14 text-primary drop-shadow-sm sm:size-16"
              strokeWidth={1.6}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Live operations panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute inset-x-2 bottom-2 rounded-2xl border border-border/70 bg-white p-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            <span className="text-xs font-semibold text-foreground">{t("onDuty")}</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("live")}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-sm font-bold text-foreground sm:text-base">{stat.value}</p>
              <p className="text-[10px] font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
