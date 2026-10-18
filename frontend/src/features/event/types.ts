import type { Card } from "#/lib/types";
import type { Deck } from "../decks/types";
import type { Folder } from "../folders/types";

export type TimelineKind = "add" | "remove" | "update" | "create" | "delete";

export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  text: string;
  time: string;
  cards?: string[];
}

export interface TimelineDay {
  day: string;
  label: string;
  summary: string;
  items: TimelineItem[];
}

export interface EventChangeData {
  foil?: boolean;
  card?: number;
  quantity?: number;
  language?: string;
  zone?: string;
  condition?: string;
  deck?: string;
  folder?: string;
}

export interface ChangeValues {
  to: number | string | boolean | null;
  from: number | string | boolean | null;
}

export interface ValuesChanges {
  foil?: ChangeValues;
  card?: ChangeValues;
  quantity?: ChangeValues;
  language?: ChangeValues;
  zone?: ChangeValues;
  condition?: ChangeValues;
  deck?: ChangeValues;
  folder?: ChangeValues;
}

export interface EventItem {
  card: Card;
  data_before: EventChangeData;
  data_after: EventChangeData;
  values_changed: ValuesChanges;
}

export interface Event {
  id: string;
  type: string;
  aggregate_type: string;
  aggregate_id: string;
  created_at: string;
  items: EventItem[];
  aggregate_obj: Deck | Folder | null;
}

export interface ProfileEvents {
  today: Event[];
  yesterday: Event[];
}

export interface Day {
  day: string;
  events: Event[];
}
