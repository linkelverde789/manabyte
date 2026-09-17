import { cn } from "#/lib/utils"

export function CardImage({
    src,
    alt,
    className,
}: {
    src?: string
    alt: string
    className?: string
}) {
    return (
        <div
            className={cn(
                'relative aspect-[488/680] w-full overflow-hidden rounded-xl',
                'bg-muted/40 ring-1 ring-border',
                className,
            )}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
                    {alt}
                </div>
            )}
        </div>
    )
}

