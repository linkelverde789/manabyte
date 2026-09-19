export interface Folder {
  id: number;
  name: string;
  type?: FolderFormat;
}

export interface CreateFolderData {
  name: string;
  type: FolderFormat;
}

export const FOLDER_FORMATS = ["Deck", "Collection"] as const;
export type FolderFormat = (typeof FOLDER_FORMATS)[number];
