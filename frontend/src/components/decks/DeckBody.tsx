import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/components/ui/tabs";
import CardSearch from "#/components/deckCards/cardSearch";
import { useEffect, useState } from "react";
import type { Deck } from "#/features/decks/types";
import { useCreateDeckCard } from "#/features/deckCards/hooks";
import type { ExportFormat } from "#/features/exports/types";
import { useDeckExport } from "#/features/exports/hooks";
import { downloadFile } from "#/lib/utils";
import type { CreateDeckCardData } from "#/features/deckCards/types";
import { Export } from "../utils/Export";
import { DeckContent } from "../deckCards/DeckContent";

export default function DeckBody({ deck }: { deck: Deck }) {
  const [tab, setTab] = useState<"main" | "search">("main");

  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);

  const { data: exportData } = useDeckExport({
    deckId: deck.id,
    format: exportFormat,
  });

  const createDeckCard = useCreateDeckCard(deck.id);

  function handleCreate(data: CreateDeckCardData) {
    createDeckCard.mutate({
      scryfall_id: data.scryfall_id,
      quantity: data.quantity,
    });
  }

  useEffect(() => {
    if (!exportData || !exportFormat) {
      return;
    }

    downloadFile(
      exportData.blob,
      exportData.filename
        ? exportData.filename
        : `${deck?.name}.${exportFormat}`,
    );
  }, [exportData, exportFormat]);

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        setTab(value as "main" | "search");
      }}
    >
      <TabsList className="flex-wrap">
        <TabsTrigger value="main">Main deck ({deck.card_count})</TabsTrigger>

        <TabsTrigger value="search">Search cards</TabsTrigger>
      </TabsList>
      <TabsContent value="main" className="mt-6">
        <div className="space-y-6">
          <Export onExportFormatChange={(format) => setExportFormat(format)} />
          <DeckContent deck={deck} />
        </div>
      </TabsContent>
      <TabsContent value="search" className="mt-6">
        <CardSearch onCreate={handleCreate} />
      </TabsContent>
    </Tabs>
  );
}
