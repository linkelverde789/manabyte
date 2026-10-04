import type { ExportFormat } from "#/features/exports/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown";
import { Button } from "#/components/ui/button";
import { ChevronDown, Download } from "lucide-react";
import { toast } from "sonner";

export function Export({
  onExportFormatChange,
}: {
  onExportFormatChange: (format: ExportFormat) => void;
}) {
  function handleExport(format: "csv" | "xlsx") {
    toast.loading("Exporting...");
    onExportFormatChange(format);
  }
  return (
    <div className="flex flex-wrap gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="h-4 w-4" /> Export{" "}
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => handleExport("csv")}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleExport("xlsx")}>
            Export as XLSX
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
