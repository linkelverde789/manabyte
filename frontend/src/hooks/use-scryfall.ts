import { useQuery } from '@tanstack/react-query'
import { scryfall } from '@/lib/scryfall'

export function useScryfall<T>(endpoint: string) {
    return useQuery({
        queryKey: ['scryfall', endpoint],
        queryFn: () => scryfall<T>(endpoint),
    })
}