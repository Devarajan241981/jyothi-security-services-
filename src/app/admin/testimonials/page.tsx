import { createClient } from "@/lib/supabase/server";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.testimonials.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.testimonials.subtitle}</p>
      <div className="mt-6">
        <TestimonialsManager testimonials={testimonials ?? []} />
      </div>
    </div>
  );
}
