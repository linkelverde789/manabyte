export interface Folder {
    id: number
    name: string
}


export interface CreateFolderData{
    name: string
    type: FolderType
}

export interface FolderType{
    type: "deck" | "collection"
}