import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
        <ShieldAlert className="size-8" />
      </span>
      <h1 className="text-3xl font-bold text-foreground">{t("heading")}</h1>
      <p className="max-w-md text-muted-foreground">{t("message")}</p>
      <Button asChild>
        <Link href="/">{t("cta")}</Link>
      </Button>
    </div>
  );
}
