import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/folders/$folderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderId } = Route.useParams();

  return <p>{folderId}</p>;
}
