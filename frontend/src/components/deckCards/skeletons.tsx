export function CardRowSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
            <div className="h-10 w-7 shrink-0 animate-pulse rounded-md bg-muted" />

            <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>

            <div className="h-7 w-24 animate-pulse rounded bg-muted" />
        </div>
    )
}

export function DeckHeaderSkeleton() {
    return (
        <div className="space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-9 w-64 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
    )
}