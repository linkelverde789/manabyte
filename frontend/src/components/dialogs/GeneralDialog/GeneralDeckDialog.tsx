import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "../../ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

import type { Card } from "#/lib/types";
import { CardPreview } from "../Base/CardPreview";
import { type UpdateDeckCard } from "../Base/EditCollectionCard";
import EditDeckCard from "../Base/EditDeckCard";
import type { DeckCard } from "#/features/deckCards/types";

export default function GeneralDeckDialog({
  card,
  dataCard,
  open,
  onOpenChange,
  initialTab = "preview",
  onUpdate,
}: {
  card: Card;
  dataCard: DeckCard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "preview" | "edit";
  onUpdate: (data: UpdateDeckCard) => void;
}) {
  const [tab, setTab] = useState<"preview" | "edit">(initialTab);

  useEffect(() => {
    if (open) {
      setTab(initialTab);
    }
  }, [open, initialTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as "preview" | "edit")}
        >
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>

            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-6">
            <CardPreview card={card} />
          </TabsContent>

          <TabsContent value="edit" className="mt-6">
            <EditDeckCard card={card} dataCard={dataCard} onUpdate={onUpdate} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
