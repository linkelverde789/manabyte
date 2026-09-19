export interface Folder {
  id: number;
  name: string;
  type?: FolderType;
}

export interface CreateFolderData {
  name: string;
  type: FolderType;
}

export interface FolderType {
  type: "deck" | "collection";
}
