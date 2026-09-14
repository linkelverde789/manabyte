import { useQuery } from "@tanstack/react-query";
import { getDecks } from "./api";

export function useDecks() {
    return useQuery({
        queryKey: ["decks"],
        queryFn: getDecks,
    });
}