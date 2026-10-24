import { Button } from "#/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";

import { X, ClipboardList, Layers } from "lucide-react";

import { useState } from "react";

import { ScryfallImport } from "../imports/ScryfallImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NormalImport } from "../imports/NormalImport";
import type { ResolvedRow } from "#/features/imports/types";
import { Label } from "../ui/labels";
import { Switch } from "../ui/switch";

export function ImportDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  trigger,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (rows: ResolvedRow[], allowMerge: boolean) => Promise<void>;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"scryfall" | "manabyte">("manabyte");
  const [allowMerge, setAllowMerge] = useState(false);

  function handleOpenChange(value: boolean) {
    setOpen(value);
  }

  function handleChangeTab(value: "scryfall" | "manabyte") {
    setTab(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <ClipboardList className="mr-2 h-4 w-4" />
            Paste list
          </Button>
        )}
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px]" />

        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border bg-background p-0 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div className="min-w-0 space-y-1">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                {title}
              </DialogTitle>

              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </DialogDescription>
            </div>

            <DialogClose asChild>
              <button
                type="button"
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
          </div>
          <Tabs
            value={tab}
            onValueChange={(value) => {
              handleChangeTab(value as "scryfall" | "manabyte");
            }}
          >
            <div className="px-6 pt-4">
              <TabsList className="flex-wrap">
                <TabsTrigger value="scryfall">Scryfall</TabsTrigger>
                <TabsTrigger value="manabyte">Manabyte</TabsTrigger>
              </TabsList>
            </div>
            <div className="mx-6 mt-4 flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-muted-foreground" />

                <div>
                  <Label htmlFor="import-merge">Merge existing cards</Label>
                  <p className="text-xs text-muted-foreground">
                    Add quantities to existing cards when possible.
                  </p>
                </div>
              </div>

              <Switch
                id="import-merge"
                checked={allowMerge}
                onCheckedChange={setAllowMerge}
              />
            </div>

            <TabsContent value="scryfall">
              <ScryfallImport
                onChangeOpen={setOpen}
                confirmLabel={confirmLabel}
                onConfirm={(rows) => onConfirm(rows, allowMerge)}
              />
            </TabsContent>

            <TabsContent value="manabyte">
              <NormalImport
                onChangeOpen={setOpen}
                confirmLabel={confirmLabel}
                onConfirm={(rows) => onConfirm(rows, allowMerge)}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
