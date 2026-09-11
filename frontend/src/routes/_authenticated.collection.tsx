import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/collection')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/collection"!</div>
}
