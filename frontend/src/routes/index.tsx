import { createFileRoute, Link } from "@tanstack/react-router";


import { useAuth } from "#/contexts/AuthContext";
import UserInfo from "#/components/index/userInfo";
import AnonymousInfo from "#/components/index/anonymousInfo";
import GeneralInfo from "#/components/index/generalInfo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ManaByte — Magic deck & collection builder" },
      {
        name: "description",
        content:
          "Build Magic: The Gathering decks by pasting a list or searching cards, track your collection and choose any alternate printing.",
      },
      { property: "og:title", content: "ManaByte — Magic deck & collection builder" },
      {
        property: "og:description",
        content:
          "Paste a decklist or search cards, pick alternate styles and track everything you own.",
      },
    ],
  }),
  component: Index,
});



function Index() {



  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">

      <GeneralInfo userLogged={!!user} />

      {user ? <UserInfo deckCount={0} collectionItem={0} /> : <AnonymousInfo />}
    </div>
  );
}




