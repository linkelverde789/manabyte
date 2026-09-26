export interface DeckExportData {
  deckId: string;
  format: ExportFormat | null;
}

export interface FolderExportData {
  folderId: string;
  format: ExportFormat | null;
}

export interface CollectionExportData {
  format: ExportFormat | null;
}

export type ExportFormat = "csv" | "txt" | "xlsx";
