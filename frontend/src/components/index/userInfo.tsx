import { Link } from "@tanstack/react-router";
import { Search, Layers, Library } from "lucide-react";

export default function UserInfo(userInfoProps: { deckCount: number, collectionItem: number }) {

    return <section className="mt-16 grid gap-4 sm:grid-cols-3">
        <Link
            to="/search"
            className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
        >
            <Search className="h-5 w-5 text-primary" />
            <div className="mt-3 text-3xl font-semibold">All sets</div>
            <div className="text-sm text-muted-foreground">searchable printings</div>
        </Link>
        <Link
            to="/decks"
            className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
        >
            <Layers className="h-5 w-5 text-primary" />
            <div className="mt-3 text-3xl font-semibold">{userInfoProps.deckCount}</div>
            <div className="text-sm text-muted-foreground">decks saved</div>
        </Link>
        <Link
            to="/collection"
            className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
        >
            <Library className="h-5 w-5 text-primary" />
            <div className="mt-3 text-3xl font-semibold">{userInfoProps.collectionItem}</div>
            <div className="text-sm text-muted-foreground">cards in your collection</div>
        </Link>
    </section>
}