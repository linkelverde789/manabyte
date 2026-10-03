import type { ScryfallCard, ScryfallCardFace } from "#/features/scryfall/types";
import { useEffect, useState } from "react";

import ManaCost from "../search/manaCost";
import { Button } from "../ui/button";
import { processOracleText } from "#/lib/utils";

export function CardPreview({ card }: { card: ScryfallCard }) {
  const [transform, setTransform] = useState(false);

  const canTransform = card.keywords?.includes("Transform");

  const [data, setData] = useState<ScryfallCardFace>(
    canTransform && card.card_faces ? card.card_faces[0] : card,
  );

  useEffect(() => {
    if (!canTransform || !card.card_faces) return;

    setData(transform ? card.card_faces[1] : card.card_faces[0]);
  }, [transform, canTransform, card]);

  return (
    <div className="grid md:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
      <div className="flex items-center justify-center bg-muted/40 p-6 md:p-9">
        <img
          src={
            data.image_uris
              ? data.image_uris.normal
              : card.card_faces?.[0]?.image_uris?.normal
          }
          alt={`${data.name} - ${card.set_name} card`}
          className="aspect-[488/680] w-full max-w-[260px] rounded-lg object-contain shadow-xl md:max-w-[360px]"
        />
      </div>

      <div className="flex min-w-0 flex-col px-6 pb-8 pt-6 md:px-9 md:py-10">
        <div className="text-left">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            {card.set_name} · #{card.collector_number}
          </p>

          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
            {data.name}
          </h2>
        </div>

        {data.mana_cost ? (
          <div className="mt-5 flex items-center gap-3 border-b border-border pb-5">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Mana cost
            </span>

            <ManaCost
              cost={data.mana_cost}
              className="[&_img]:h-6 [&_img]:w-6"
            />
          </div>
        ) : (
          <div className="mt-5 border-b border-border pb-5" />
        )}

        <div className="py-7">
          <p className="mb-4 text-sm font-medium text-primary">
            {data.type_line}
          </p>

          <p
            className="whitespace-pre-line text-base leading-7 text-foreground"
            dangerouslySetInnerHTML={{
              __html: processOracleText(data.oracle_text),
            }}
          />
        </div>

        {data.flavor_text && (
          <div className="border-t border-border pt-6">
            <p className="whitespace-pre-line text-sm italic leading-6 text-muted-foreground">
              {data.flavor_text.replace(/\*+/g, "")}
            </p>
          </div>
        )}

        {canTransform && (
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => setTransform((value) => !value)}
          >
            {transform ? "Back" : "Transform"}
          </Button>
        )}
      </div>
    </div>
  );
}
