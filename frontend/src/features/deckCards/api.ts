import { api } from "../../api/client";
import type { CreateDeckCardData, DeckCard } from "./types";


export function getDeckCards(deckId: number) {
    return api<DeckCard[]>(`/deck/${deckId}/cards/`);
}

export function createDeckCard(deckId: number, data: CreateDeckCardData) {
    return api<DeckCard>(`/deck/${deckId}/cards/`, { method: "POST", body: JSON.stringify(data) });

}

export function deleteDeckCard(deckId: number, cardId: number) {
    return api<number>(`/deck/${deckId}/cards/${cardId}`, { method: "DELETE" });
}