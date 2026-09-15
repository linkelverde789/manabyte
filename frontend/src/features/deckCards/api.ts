import { api } from "../../api/manabyte";
import type { CreateDeckCardData, DeckCard } from "./types";


export function getDeckCards(deckId: number | string) {
    return api<DeckCard[]>(`/deck/${deckId}/cards/`);
}

export function createDeckCard(deckId: number | string, data: CreateDeckCardData) {
    return api<DeckCard>(`/deck/${deckId}/cards/`, { method: "POST", body: JSON.stringify(data) });
}

export function bulkCreateDeckCard(deckId: number | string, data: CreateDeckCardData[]) {
    return api<DeckCard[]>(`/deck/${deckId}/cards/bulk/`, { method: "POST", body: JSON.stringify(data) });

}

export interface PartialUpdateDeckCardData {
    quantity?: number
    scryfall_id?: string
}

export function partialUpdateDeckCard(deckId: number | string, cardId: number | string, data: PartialUpdateDeckCardData) {
    console.log("prueba: ", data)
    console.log("deckId: ", deckId)
    console.log("cardId: ", cardId)

    return api<DeckCard>(`/deck/${deckId}/cards/${cardId}/`, { method: "PATCH", body: JSON.stringify(data) });

}

export function deleteDeckCard(deckId: number | string, cardId: number | string) {
    return api<number>(`/deck/${deckId}/cards/${cardId}/`, { method: "DELETE" });
}