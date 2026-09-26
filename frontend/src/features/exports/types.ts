export interface DeckExportData {
  deckId: number | string;
  format: ExportFormat | null;
}

export interface FolderExportData {
  folderId: number | string;
  format: ExportFormat | null;
}

export interface CollectionExportData {
  format: ExportFormat | null;
}

export type ExportFormat = "csv" | "txt" | "xlsx";
