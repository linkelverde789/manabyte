export interface ScryfallCard {
  object: "card";
  id: string;
  oracle_id: string;

  multiverse_ids?: number[];
  mtgo_id?: number;
  mtgo_foil_id?: number;
  arena_id?: number;

  name: string;
  lang: string;
  released_at?: string;

  uri?: string;
  scryfall_uri?: string;

  layout?: string;

  highres_image?: boolean;
  image_status?: string;
  image_updated_at?: string;

  image_uris?: ScryfallImageUris;

  mana_cost?: string;
  cmc?: number;

  type_line?: string;
  oracle_text?: string;

  power?: string;
  toughness?: string;

  colors?: string[];
  color_identity?: string[];

  keywords?: string[];

  card_faces?: ScryfallCardFace[];

  all_parts?: ScryfallRelatedCard[];

  legalities?: ScryfallLegalities;

  games?: string[];

  reserved?: boolean;
  game_changer?: boolean;

  foil?: boolean;
  nonfoil?: boolean;

  finishes?: string[];

  oversized?: boolean;
  promo?: boolean;
  reprint?: boolean;
  variation?: boolean;

  set_id?: string;
  set?: string;
  set_name?: string;
  set_type?: string;

  set_uri?: string;
  set_search_uri?: string;
  scryfall_set_uri?: string;

  rulings_uri?: string;
  prints_search_uri?: string;

  collector_number?: string;
  digital?: boolean;
  rarity?: string;

  card_back_id?: string;

  artist?: string;
  artist_ids?: string[];

  illustration_id?: string;

  border_color?: string;
  frame?: string;
  frame_effects?: string[];

  security_stamp?: string;

  full_art?: boolean;
  textless?: boolean;
  booster?: boolean;
  story_spotlight?: boolean;

  promo_types?: string[];

  prices?: ScryfallPrices;

  related_uris?: ScryfallRelatedUris;

  purchase_uris?: ScryfallPurchaseUris;
}

export interface ScryfallImageUris {
  small?: string;
  normal?: string;
  large?: string;
  png?: string;
  art_crop?: string;
  border_crop?: string;
  thumb?: string;
  grid?: string;
  display?: string;
  art?: string;
  crop?: string;
}

export interface ScryfallCardFace {
  object?: string;

  name: string;

  mana_cost?: string;

  type_line?: string;

  oracle_text?: string;

  colors?: string[];

  color_indicator?: string[];

  power?: string;
  toughness?: string;

  flavor_text?: string;

  artist?: string;
  artist_id?: string;

  illustration_id?: string;

  image_uris?: ScryfallImageUris;

  watermark?: string;

  printed_name?: string;
  printed_type_line?: string;
  printed_text?: string;
}

export interface ScryfallRelatedCard {
  object: "related_card" | string;

  id: string;

  component: string;

  name: string;

  type_line?: string;

  uri: string;
}

export interface ScryfallLegalities {
  standard?: ScryfallLegality;
  future?: ScryfallLegality;
  historic?: ScryfallLegality;
  timeless?: ScryfallLegality;
  gladiator?: ScryfallLegality;
  pioneer?: ScryfallLegality;
  explorer?: ScryfallLegality;
  modern?: ScryfallLegality;
  legacy?: ScryfallLegality;
  pauper?: ScryfallLegality;
  vintage?: ScryfallLegality;
  penny?: ScryfallLegality;
  commander?: ScryfallLegality;
  oathbreaker?: ScryfallLegality;
  standardbrawl?: ScryfallLegality;
  brawl?: ScryfallLegality;
  alchemy?: ScryfallLegality;
  paupercommander?: ScryfallLegality;
  duel?: ScryfallLegality;
  oldschool?: ScryfallLegality;
  premodern?: ScryfallLegality;
  predh?: ScryfallLegality;
  historicbrawl?: ScryfallLegality;
  competitivebrawl?: ScryfallLegality;
  tlr?: ScryfallLegality;
  [format: string]: ScryfallLegality | undefined;
}

export type ScryfallLegality = "legal" | "not_legal" | "restricted" | "banned";

export interface ScryfallPrices {
  usd?: string | null;
  usd_foil?: string | null;
  usd_etched?: string | null;

  eur?: string | null;
  eur_foil?: string | null;

  tix?: string | null;
}

export interface ScryfallRelatedUris {
  gatherer?: string;
  tcgplayer_infinite_articles?: string;
  tcgplayer_infinite_decks?: string;
  edhrec?: string;

  cardmarket?: string;
  cardhoarder?: string;
  mtgo_traders?: string;

  [key: string]: string | undefined;
}

export interface ScryfallPurchaseUris {
  tcgplayer?: string;
  cardmarket?: string;
  cardhoarder?: string;

  [key: string]: string | undefined;
}

export interface ScryfallResult {
  data: ScryfallCard[];
}
