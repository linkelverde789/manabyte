import { useDeckCards } from '#/features/deckCards/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/decks/$deckId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { deckId } = Route.useParams()
  const { data: cards } = useDeckCards(parseInt(deckId))



}
