"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icons/icon-map";

export function PremisesIllustration({ icon }: { icon: string }) {
  return (
    <div className="relative flex size-20 items-center justify-center rounded-2xl bg-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={icon}
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="flex size-14 items-center justify-center rounded-full bg-white shadow-md"
        >
          <Icon name={icon} className="size-6 text-primary" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
