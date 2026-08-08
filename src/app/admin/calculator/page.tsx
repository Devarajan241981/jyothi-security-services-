import { SimpleCalculator } from "@/components/admin/simple-calculator";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Calculator" };

export default async function AdminCalculatorPage() {
  const { dict } = await getAdminDictionary();
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.calculator.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.calculator.subtitle}</p>
      <div className="mt-8">
        <SimpleCalculator />
      </div>
    </div>
  );
}
