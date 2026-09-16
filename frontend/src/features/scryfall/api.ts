import { api } from "#/api/scryfall"
import type { ScryfallCard, ScryfallResult } from "./types"



export function searchCard(text: string) {
    return api<ScryfallResult>(`/cards/search?q=${encodeURIComponent(text)}&unique=true&order=name&include_extras=false`)
}

export function randomCard() {
    return api<ScryfallCard>(`/cards/random`)
}

export function loadSingleCard(scryfallId: string) {
    return api<ScryfallCard>(`/cards/${scryfallId}`)

}

export interface ScryfallCollectionIdentifier {
    id?: string
    name?: string
    set?: string
    collector_number?: number | string

}

export function loadCollection(identifiers: ScryfallCollectionIdentifier[]) {
    return api<ScryfallResult>(`/cards/collection`, { method: "POST", body: JSON.stringify({ "identifiers": identifiers }) })

}

export function searchCardFuzzy(text: string) {
    return api<ScryfallCard>(`/cards/named?fuzzy=${encodeURIComponent(text)}`)
}

export function searchCardStyles(text: string){
    return api<ScryfallResult>(`/cards/search?q=${encodeURIComponent(text)}&unique=prints&order=released&dir=desc`)
}