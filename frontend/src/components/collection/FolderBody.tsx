import { useFolderExport } from "#/features/exports/hooks";
import type { ExportFormat } from "#/features/exports/types";
import type { Folder } from "#/features/folders/types";
import { downloadFile } from "#/lib/utils";
import { useEffect, useState } from "react";
import { SearchingOption } from "../utils/SearchingOption";
import SortingOption from "../utils/SortingOption";
import { GroupingOption } from "../utils/GroupingOption";
import { Export } from "../utils/Export";
import { FolderContent } from "./FolderContent";

export default function FolderBody({ folder }: { folder: Folder }) {
  const [sort, setSort] = useState<string>("recent");
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [groupByType, setGroupByType] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);

  const { data: exportData } = useFolderExport({
    folderId: folder.id,
    format: exportFormat,
  });

  useEffect(() => {
    if (!exportData || !exportFormat) return;

    downloadFile(
      exportData.blob,
      exportData.filename
        ? exportData.filename
        : `${folder.name}.${exportFormat}`,
    );
  }, [exportData, exportFormat, folder.name]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(term.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [term]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <SearchingOption term={term} onSearch={setTerm} />

        <SortingOption sort={sort} onSort={setSort} />

        <GroupingOption checked={groupByType} onCheck={setGroupByType} />

        <Export onExportFormatChange={setExportFormat} />
      </div>

      <FolderContent
        folderId={folder.id}
        term={debounced}
        sorting={sort}
        groupByType={groupByType}
      />
    </div>
  );
}
