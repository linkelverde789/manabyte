import type { ExportFormat } from "#/features/exports/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown";
import { Button } from "#/components/ui/button";
import { ChevronDown, Download } from "lucide-react";

export function Export({
  onExportFormatChange,
}: {
  onExportFormatChange: (format: ExportFormat) => void;
}) {
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
          <DropdownMenuItem onSelect={() => onExportFormatChange("csv")}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onExportFormatChange("xlsx")}>
            Export as XLSX
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
