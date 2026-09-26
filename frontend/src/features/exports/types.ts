export interface DeckExportData {
  deckId: number;
  format: ExportFormat | null;
}

export interface FolderExportData {
  folderId: number;
  format: ExportFormat | null;
}

export interface CollectionExportData {
  format: ExportFormat | null;
}

export type ExportFormat = "csv" | "txt" | "xlsx";
