import { api } from "#/api/scryfall"
import type { ScryfallCard, ScryfallSearchResult } from "./types"



export function searchCard(text: string) {
    return api<ScryfallSearchResult>(`/cards/search?q=${encodeURIComponent(text)}&unique=true&order=name&include_extras=false`)
}

export function randomCard() {
    return api<ScryfallCard>(`/cards/random`)
}

export function loadSingleCard(scryfallId: string) {
    return api<ScryfallCard>(`/cards/${scryfallId}`)

}

export interface ScryfallCollectionIdentifier {
    id: string
}

export function loadCollection(identifiers: ScryfallCollectionIdentifier[]) {
    return api<ScryfallCard[]>(`/cards/collection`, { method: "POST", body: JSON.stringify({ "identifiers": identifiers }) })

}