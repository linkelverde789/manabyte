import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

import type { Card } from "#/lib/types";
import { CardPreview } from "../Base/CardPreview";
import AddCardToDeck from "../Base/AddCardToDeck";
import AddCardToCollection from "../Base/AddCardToCollection";

import { useCreateDeckCard } from "#/features/deckCards/hooks";
import type { CreateDeckCardData } from "#/features/deckCards/types";
import { useCreateCollectionItem } from "#/features/collection/hooks";
import type { CreateCollectionItemData } from "#/features/collection/types";

import { useListPrints } from "#/features/utils/hooks";
import { useDecks } from "#/features/decks/hooks";
import { useListFolders } from "#/features/folders/hooks";

type SearchTab = "preview" | "collection" | "deck";

export default function GeneralSearchDialog({
  card,
  open,
  onOpenChange,
  initialTab = "preview",
}: {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: SearchTab;
}) {
  const [tab, setTab] = useState<SearchTab>(initialTab);
  const [showStyles, setShowStyles] = useState(false);
  const [selected, setSelected] = useState<Card>(card);

  const { data: printings } = useListPrints(selected.oracle_id);
  const { data: decks } = useDecks();
  const { data: folders } = useListFolders();

  const createDeckCard = useCreateDeckCard();
  const createCollectionItem = useCreateCollectionItem();

  useEffect(() => {
    if (!open) return;

    setTab(initialTab);
    setSelected(card);
    setShowStyles(false);
  }, [open, card, initialTab]);

  function handleCreateDeck(data: CreateDeckCardData, deckId: number) {
    createDeckCard.mutate({
      data,
      deckId,
    });
  }

  function handleCreateCollectionItem(data: CreateCollectionItemData) {
    createCollectionItem.mutate(data);
  }

  function handleClose() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        {!decks || !printings || !folders ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading card data...
          </div>
        ) : (
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as SearchTab)}
          >
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>

              <TabsTrigger value="deck">Deck</TabsTrigger>

              <TabsTrigger value="collection">Collection</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-6">
              <CardPreview card={selected} />
            </TabsContent>

            <TabsContent value="deck" className="mt-6">
              <AddCardToDeck
                card={selected}
                decks={decks}
                printings={printings}
                showStyles={showStyles}
                onCreate={handleCreateDeck}
                onChangeCard={setSelected}
                onShowStyles={setShowStyles}
                onClose={handleClose}
              />
            </TabsContent>

            <TabsContent value="collection" className="mt-6">
              <AddCardToCollection
                card={selected}
                folders={folders}
                printings={printings}
                showStyles={showStyles}
                onCreate={handleCreateCollectionItem}
                onChangeCard={setSelected}
                onShowStyles={setShowStyles}
                onClose={handleClose}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
