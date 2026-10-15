import { api } from "#/api/manabyte";
import { type Set, type Card } from "#/lib/types";

export function listCardPrints(oracle_id: string) {
  return api<Card[]>(`/cards/printings/${oracle_id}`);
}

export function searchCard(text: string) {
  const searchParams = new URLSearchParams();

  searchParams.set("q", String(text));
  const queryString = searchParams.toString();
  return api<Card[]>(`/cards/search/${queryString ? `?${queryString}` : ""}`);
}

export function listSet() {
  return api<Set[]>("/sets/");
}
