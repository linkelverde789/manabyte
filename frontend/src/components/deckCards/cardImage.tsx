import type { ScryfallCard } from "#/features/scryfall/types";

import { cn } from "#/lib/utils";
import { useState } from "react";

export function CardImage({
  card,
  alt,
  className,
  foil,
}: {
  card: ScryfallCard;
  alt: string;
  className?: string;
  foil?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  let imageUrl =
    !card.image_uris && card.card_faces
      ? isHovered
        ? card.card_faces[1].image_uris?.normal
        : card.card_faces[0].image_uris?.normal
      : card.image_uris?.normal;

  return (
    <div
      className={cn(
        "group relative aspect-[488/680] w-full overflow-hidden rounded-xl",
        "bg-muted/40",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={alt}
            loading="lazy"
            className={cn(
              "relative z-0 h-full w-full object-cover",
              "transition-transform duration-500",
              "group-hover:scale-[1.03]",
              foil && "drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]",
            )}
          />

          {foil && (
            <>
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-10",
                  "opacity-0 transition-opacity duration-300",
                  "group-hover:opacity-100",
                  "mix-blend-screen",
                )}
                style={{
                  background: `
                    linear-gradient(
                      115deg,
                      transparent 20%,
                      rgba(255, 0, 128, 0.12) 32%,
                      rgba(0, 200, 255, 0.28) 42%,
                      rgba(255, 255, 255, 0.45) 50%,
                      rgba(120, 255, 180, 0.22) 58%,
                      rgba(180, 80, 255, 0.16) 68%,
                      transparent 80%
                    )
                  `,
                  backgroundSize: "250% 100%",
                  animation: isHovered
                    ? "foil-shimmer 1.8s ease-in-out infinite"
                    : "none",
                }}
              />

              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-10",
                  "opacity-0 transition-opacity duration-500",
                  "group-hover:opacity-100",
                  "mix-blend-overlay",
                )}
                style={{
                  background: `
                    radial-gradient(
                      circle at 50% 30%,
                      rgba(255,255,255,0.35),
                      transparent 45%
                    )
                  `,
                }}
              />

              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-20 rounded-xl",
                  "opacity-0 transition-opacity duration-300",
                  "group-hover:opacity-100",
                )}
                style={{
                  boxShadow: `
                    inset 0 0 20px rgba(255,255,255,0.25),
                    inset 0 0 45px rgba(120,200,255,0.12),
                    0 0 18px rgba(255,255,255,0.15)
                  `,
                }}
              />
            </>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
          {alt}
        </div>
      )}
    </div>
  );
}
