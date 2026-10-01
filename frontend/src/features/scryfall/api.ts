import { api } from "#/api/scryfall";
import type {
  ScryfallCard,
  ScryfallResult,
  ScryfallSet,
  ScryfallSetList,
  setCollection,
} from "./types";

export function searchCard(text: string) {
  return api<ScryfallResult>(
    `/cards/search?q=${encodeURIComponent(text)}&unique=true&order=name&include_extras=false`,
  );
}

export function randomCard() {
  return api<ScryfallCard>(`/cards/random`);
}

export function loadSingleCard(scryfallId: number) {
  return api<ScryfallCard>(`/cards/${scryfallId}`);
}

export interface ScryfallCollectionIdentifier {
  id?: string;
  name?: string;
  set?: string;
  collector_number?: number | string;
}

export function loadCollection(identifiers: ScryfallCollectionIdentifier[]) {
  return api<ScryfallResult>(`/cards/collection`, {
    method: "POST",
    body: JSON.stringify({ identifiers: identifiers }),
  });
}

export function searchCardFuzzy(text: string) {
  return api<ScryfallCard>(`/cards/named?fuzzy=${encodeURIComponent(text)}`);
}

export function searchCardStyles(text: string) {
  return api<ScryfallResult>(
    `/cards/search?q=${encodeURIComponent(text)}&unique=prints&order=released&dir=desc`,
  );
}

export function listSetCollection(setCode: string, page: number) {
  return api<setCollection>(
    `/cards/search?dir=asc&format=json&include_extras=true&include_multilingual=false&include_variations=true&order=set&page=${page}&q=set:${setCode}&unique=prints`,
  );
}

export function getSetInformation(setCode: string) {
  return api<ScryfallSet>(`/sets/${setCode}`);
}

export function listSets() {
  return api<ScryfallSetList>(`/sets`);
}
