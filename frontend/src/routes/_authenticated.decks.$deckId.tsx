import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/decks/$deckId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/decks/$deckId"!</div>
}
