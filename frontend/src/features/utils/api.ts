import { api } from "#/api/manabyte";
import type { Card } from "#/lib/types";

export function listCardPrints(oracle_id: string) {
  return api<Card[]>(`/cards/printings/${oracle_id}`);
}

export function searchCard(text: string) {
  return api<Card[]>(`/cards/search/?q=${text}`);
}
