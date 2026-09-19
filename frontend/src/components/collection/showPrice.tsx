import { DollarSign } from "lucide-react";

export default function ShowPrice({
  price,
}: {
  price: string | null | undefined;
}) {
  if (!price || price === "") {
    return null;
  }

  return (
    <div className="ml-2 inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
      <DollarSign className="h-3.5 w-3.5" />
      <span>{price}</span>
    </div>
  );
}
