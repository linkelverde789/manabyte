import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/labels";
import { Input } from "../ui/input";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCreateDeck } from "#/features/decks/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const DECK_FORMATS = [
    "Commander",
    "Modern",
    "Standard",
    "Pioneer",
    "Legacy",
    "Pauper",
    "Limited",
    "Casual",
] as const;

export type DeckFormat = (typeof DECK_FORMATS)[number];

export default function NewDeckDialog() {
    const navigate = useNavigate();
    const createDeck = useCreateDeck();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [format, setFormat] = useState<DeckFormat>("Commander");


    function handleCreate() {
        createDeck.mutate(
            {
                "name": name || "Untitled Deck",
                "format": format || "Commander"
            }, {
            onSuccess: (deck) => {
                setOpen(false)
                setName("")
                navigate({ to: "/decks/$deckId", params: { deckId: deck.id.toLocaleString() } });
            }
        }
        )
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New deck
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a deck</DialogTitle>
                    <DialogDescription>Pick a format and which sections it should have.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="deck-name">Deck name</Label>
                        <Input
                            id="deck-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Gondor tokens"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Format</Label>
                        <Select value={format} onValueChange={(v) => setFormat(v as DeckFormat)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {DECK_FORMATS.map((f) => (
                                    <SelectItem key={f} value={f}>
                                        {f}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full" onClick={handleCreate}>
                        Create deck
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 