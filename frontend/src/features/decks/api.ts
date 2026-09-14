import { api } from "../../api/client";
import type { Deck } from "./types";

export function getDecks() {
    return api<Deck[]>("/deck/");
}