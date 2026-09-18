import { api } from "#/api/manabyte";
import type { CollectionItem, CreateCollectionItemData, PartialUpdateCollectionItemData } from "./types";


export function getCollectionItems(){
    return api<CollectionItem[]>("/collection/")
}

export function createCollectionItem(data: CreateCollectionItemData){
    return api<CollectionItem>("/collection/",{method: "POST", body: JSON.stringify(data)} )
}

export function bulkCreateCollectionItem(data: CreateCollectionItemData[]){
    return api<CollectionItem[]>("/collection/bulk/",{method: "POST", body: JSON.stringify(data)} )

}

export function partialUpdateCollectionItem(cardId: number|string, data: PartialUpdateCollectionItemData){
    return api<CollectionItem>(`/collection/${cardId}/`,{method: "PATCH", body: JSON.stringify(data)} )
}

export function deleteCollectionItem(cardId: number|string){
    return api<number>(`/collection/${cardId}/`, {method: "DELETE"})
}