import { api } from "../../api/manabyte";
import type {
  CreateBulkDeckCardData,
  CreateDeckCardData,
  DeckCard,
  PartialUpdateDeckCardData,
} from "./types";

export function getDeckCards(deckId: number) {
  return api<DeckCard[]>(`/deck/${deckId}/cards/`);
}

export function createDeckCard(deckId: number, data: CreateDeckCardData) {
  return api<DeckCard>(`/deck/${deckId}/cards/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function bulkCreateDeckCard(
  deckId: number,
  data: CreateBulkDeckCardData,
) {
  return api<DeckCard[]>(`/deck/${deckId}/cards/bulk/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function partialUpdateDeckCard(
  deckId: number,
  cardId: number,
  data: PartialUpdateDeckCardData,
) {
  return api<DeckCard>(`/deck/${deckId}/cards/${cardId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteDeckCard(deckId: number, cardId: number) {
  return api<number>(`/deck/${deckId}/cards/${cardId}/`, { method: "DELETE" });
}
