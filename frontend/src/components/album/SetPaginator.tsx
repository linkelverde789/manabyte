import { ChevronLeft, ChevronRight } from "lucide-react";

export function SetPaginator({
  page,
  onChangePage,
  totalPages,
}: {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-3 shadow-sm">
      <button
        onClick={() => {
          onChangePage(page - 1);
        }}
        disabled={page <= 1}
        type="button"
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-amber-100"
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-amber-100">Page {page}</span>
        <span className="text-sm text-muted-foreground">of {totalPages}</span>
      </div>
      <button
        onClick={() => {
          onChangePage(page + 1);
        }}
        disabled={page === totalPages}
        type="button"
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-amber-100"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
