import { Link } from "@tanstack/react-router";
import { Boxes, Layers, Library, LogIn, Search, UserRound } from "lucide-react";

import { useAuth } from "#/contexts/AuthContext";

const links = [
    { to: "/search", label: "Search", icon: Search },
    { to: "/decks", label: "Decks", icon: Layers },
    { to: "/collection", label: "Collection", icon: Library },
] as const;

export function SiteHeader() {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
                <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
                    <Boxes className="h-5 w-5 text-primary" />
                    <span className="text-lg">ManaByte</span>
                </Link>
                <nav className="flex items-center gap-1 text-sm">
                    {links.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                            activeProps={{ className: "bg-muted text-foreground" }}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </Link>
                    ))}
                    <Link
                        to="/auth"
                        className="ml-1 flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                        activeProps={{ className: "bg-muted text-foreground" }}
                    >
                        {user ? <UserRound className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                        <span className="hidden sm:inline">{user ? user.username : "Sign in"}</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
