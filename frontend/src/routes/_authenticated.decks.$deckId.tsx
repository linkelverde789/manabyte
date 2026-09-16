import CardRow from '#/components/deckCards/cardRow'

import EmptyDeck from '#/components/deckCards/emptyDeck'

import { CardRowSkeleton, DeckHeaderSkeleton } from '#/components/deckCards/skeletons'

import {
  useDeckCards,
} from '#/features/deckCards/hooks'

import type { DeckCard } from '#/features/deckCards/types'

import { useDeck } from '#/features/decks/hooks'

import { useLoadCollection } from '#/features/scryfall/hooks'

import type { ScryfallCard } from '#/features/scryfall/types'

import { createFileRoute, Link } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'

import { memo, useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/_authenticated/decks/$deckId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { deckId } = Route.useParams()

  const { data: deck, isLoading: isLoadingDeck } = useDeck(deckId)

  const { data: cards, isLoading: isLoadingCards } = useDeckCards(deckId)

  const {
    mutate: loadCollection,
    data: results,
    isPending: isLoadingCollection,
    reset: resetCollection,
  } = useLoadCollection()

  const [collection, setCollection] = useState<
    Record<string, ScryfallCard>
  >({})

  const missingIds = useMemo(() => {
    return (
      cards
        ?.map((card) => card.scryfall_id)
        .filter((id) => !collection[id])
        .map((id) => ({ id })) ?? []
    )
  }, [cards, collection])

  useEffect(() => {
    if (missingIds.length === 0) {
      return
    }

    loadCollection(missingIds)
  }, [missingIds, loadCollection])

  useEffect(() => {
    if (!results?.data) {
      return
    }

    setCollection((previous) => {
      const next = { ...previous }

      for (const card of results.data) {
        next[card.id] = card
      }

      return next
    })

    resetCollection()
  }, [results, resetCollection])



  const deckRows = useMemo(() => {
    return (
      cards?.flatMap((dataCard) => {
        const card = collection[dataCard.scryfall_id]

        if (!card) {
          return []
        }

        return [
          {
            card,
            dataCard,
          },
        ]
      }) ?? []
    )
  }, [cards, collection])

  const isLoading =
    isLoadingDeck ||
    isLoadingCards ||
    isLoadingCollection ||
    missingIds.length > 0

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <Link
        to="/decks"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All decks
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {isLoadingDeck ? (
            <DeckHeaderSkeleton />
          ) : (
            <>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {deck?.format ?? 'Unknown format'}
              </div>

              <h1 className="truncate text-3xl font-semibold tracking-tight">
                {deck?.name ?? 'Untitled deck'}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {deck?.card_count ?? 0} cards
              </p>
            </>
          )}
        </div>

        {/* TODO: Import dialogs */}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <CardRowSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && deckRows.length === 0 && (
        <EmptyDeck />
      )}

      {!isLoading && deckRows.length > 0 && (
        <div className="space-y-2">
          {deckRows.map(({ card, dataCard }) => (
            <MemoizedCardRow
              key={dataCard.id}
              card={card}
              dataCard={dataCard}
              deckId={deckId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const MemoizedCardRow = memo(CardRow)
