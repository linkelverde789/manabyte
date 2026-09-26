import { api } from "../../api/manabyte";

import type { Deck, CreateDeckData } from "./types";

export function getDecks() {
  return api<Deck[]>("/deck/");
}

export function getDeck(deckId: number) {
  return api<Deck>(`/deck/${deckId}/`);
}

export function createDeck(data: CreateDeckData) {
  return api<Deck>("/deck/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteDeck(deckId: number) {
  return api<number>(`/deck/${deckId}/`, {
    method: "DELETE",
  });
}
