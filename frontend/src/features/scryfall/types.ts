export interface ScryfallCard {
    id: string;
    name: string;
    printed_name?: string;
    lang: string;
    set: string;
    set_name: string;
    collector_number: string;
    rarity: string;
    type_line?: string;
    mana_cost?: string;
    cmc?: number;
    colors?: string[];
    color_identity?: string[];
    oracle_text?: string;
    frame_effects?: string[];
    border_color?: string;
    promo?: boolean;
    full_art?: boolean;
    finishes?: string[];
    prices?: { usd?: string | null; usd_foil?: string | null; eur?: string | null };
    scryfall_uri?: string;
    image_uris?: { small?: string; normal?: string; large?: string; art_crop?: string };
    card_faces?: Array<{
        name: string;
        mana_cost?: string;
        type_line?: string;
        oracle_text?: string;
        image_uris?: { small?: string; normal?: string; large?: string; art_crop?: string };
    }>;
}

export interface ScryfallResult {
    data: ScryfallCard[]
}