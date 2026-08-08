import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JoinTeamForm } from "@/components/forms/join-team-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "joinForm" });
  return { title: t("heading") };
}

export default async function JoinOurTeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <JoinTeamForm />;
}
