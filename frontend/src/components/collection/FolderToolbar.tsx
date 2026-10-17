import type { ExportFormat } from "#/features/exports/types";
import type { SortingOptions } from "#/lib/types";
import { Export } from "../utils/Export";
import { SearchingOption } from "../utils/SearchingOption";
import SortingOption from "../utils/SortingOption";

export function FolderToolbar({
  term,
  sort,
  onTermChange,
  onSortChange,
  onExportFormatChange,
}: {
  term: string;
  sort: string;
  onTermChange: (value: string) => void;
  onSortChange: (value: SortingOptions) => void;
  onExportFormatChange: (format: ExportFormat | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <SearchingOption term={term} onSearch={onTermChange} />
      <SortingOption sort={sort} onSort={onSortChange} />
      <Export onExportFormatChange={onExportFormatChange} />
    </div>
  );
}
