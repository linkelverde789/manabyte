import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "../ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import type { ScryfallCard } from "#/features/scryfall/types";
import type { CollectionItem } from "#/features/collection/types";

import type { UpdateCardData } from "./EditCardDialog";
import { CardPreview } from "./CardPreview";
import EditCard from "./EditCard";

export default function GeneralDialog({
  card,
  dataCard,
  open,
  onOpenChange,
  initialTab = "preview",
  onUpdate,
}: {
  card: ScryfallCard;
  dataCard: CollectionItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "preview" | "edit";
  onUpdate: (data: UpdateCardData) => void;
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
            <EditCard card={card} dataCard={dataCard} onUpdate={onUpdate} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
