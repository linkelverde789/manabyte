import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/decks/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/decks/"!</div>
}
