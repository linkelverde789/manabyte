import type { ExportFormat } from "#/features/exports/types";
import { Checkbox } from "../ui/CheckBox";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Export } from "../utils/Export";
import { GroupingOption } from "../utils/GroupingOption";
import { SearchingOption } from "../utils/SearchingOption";
import SortingOption from "../utils/SortingOption";

export function FolderToolbar({
  term,
  onTermChange,
  sort,
  onSortChange,
  groupByType,
  onGroupByTypeChange,
  onExportFormatChange,
}: {
  term: string;
  onTermChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  groupByType: boolean;
  onGroupByTypeChange: (value: boolean) => void;
  onExportFormatChange: (format: ExportFormat | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <SearchingOption term={term} onSearch={onTermChange} />
      <SortingOption sort={sort} onSort={onSortChange} />

      <GroupingOption checked={groupByType} onCheck={onGroupByTypeChange} />

      <Export onExportFormatChange={onExportFormatChange} />
    </div>
  );
}
