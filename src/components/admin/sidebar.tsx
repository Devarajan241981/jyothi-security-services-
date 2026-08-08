"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { adminNavItems } from "@/lib/constants/admin-nav";
import { Icon } from "@/components/icons/icon-map";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import { cn } from "@/lib/utils";

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { dict } = useAdminDict();

  return (
    <div className="flex h-full flex-col bg-[#0f1a2b] text-slate-200">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">JSS Admin</p>
          <p className="truncate text-xs text-slate-400">Jyothi Security Services</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white",
                isActive && "bg-primary/15 text-white",
              )}
            >
              <Icon name={item.icon} className="size-4.5 shrink-0" />
              <span className="truncate">{dict.nav[item.labelKey]}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          {dict.topbar.backToSite}
          <ExternalLink className="size-3" />
        </Link>
      </div>
    </div>
  );
}
