import type {
  EventItem,
  TimelineKind,
  Event,
  TimelineItem,
  TimelineDay,
} from "#/features/event/types";

import { Layers, Minus, Pencil, Plus, Trash2 } from "lucide-react";

export const ICON: Record<TimelineKind, { Icon: typeof Plus; cls: string }> = {
  add: {
    Icon: Plus,
    cls: "bg-primary/15 text-primary",
  },
  remove: {
    Icon: Minus,
    cls: "bg-destructive/15 text-destructive",
  },
  update: {
    Icon: Pencil,
    cls: "bg-muted text-muted-foreground",
  },
  create: {
    Icon: Layers,
    cls: "bg-primary/15 text-primary",
  },
  delete: {
    Icon: Trash2,
    cls: "bg-destructive/15 text-destructive",
  },
};

const EVENT_CONFIG: Record<string, { kind: TimelineKind; label: string }> = {
  card_added: { kind: "add", label: "Added" },
  card_removed: { kind: "remove", label: "Removed" },
  card_quantity_changed: {
    kind: "update",
    label: "Changed quantity of",
  },
  cards_bulk_added: { kind: "add", label: "Imported" },
  card_print_changed: {
    kind: "update",
    label: "Changed printing of",
  },
  card_updated: { kind: "update", label: "Updated" },
  deck_created: { kind: "create", label: "Created deck" },
  deck_deleted: { kind: "delete", label: "Deleted deck" },
  folder_created: { kind: "create", label: "Created folder" },
  folder_deleted: { kind: "delete", label: "Deleted folder" },
};

export function getCardName(item: EventItem): string {
  return item.card.name;
}

function getEventText(event: Event): string {
  const config = EVENT_CONFIG[event.type];

  if (!config) return "Updated collection";

  const aggregateName =
    (event.aggregate_type === "collection" ||
      event.aggregate_type === "deck") &&
    event.aggregate_obj
      ? ` in "${event.aggregate_obj.name}" ${event.aggregate_type}`
      : "";

  switch (event.type) {
    case "card_added":
      return `Added ${event.items.length} ${
        event.items.length === 1 ? "card" : "cards"
      }${aggregateName}`;

    case "card_removed":
      return `Removed ${event.items.length} ${
        event.items.length === 1 ? "card" : "cards"
      }${aggregateName}`;

    case "cards_bulk_added":
      return `Imported ${event.items.length} cards${aggregateName}`;

    case "card_quantity_changed":
      return `Changed quantity of ${event.items
        .map((item) => item.card.name)
        .join(", ")}${aggregateName}`;

    case "card_print_changed":
      return `Changed printing of ${event.items
        .map((item) => item.card.name)
        .join(", ")}${aggregateName}`;

    case "card_updated":
      return `Updated ${event.items
        .map((item) => item.card.name)
        .join(", ")}${aggregateName}`;

    case "deck_created":
      return `Created deck${event.aggregate_obj ? ` ${event.aggregate_obj.name}` : ""}`;

    case "deck_deleted":
      return `Deleted deck${event.aggregate_obj ? ` ${event.aggregate_obj.name}` : ""}`;

    case "folder_created":
      return `Created folder${event.aggregate_obj ? ` ${event.aggregate_obj.name}` : ""}`;

    case "folder_deleted":
      return `Deleted folder${event.aggregate_obj ? ` ${event.aggregate_obj.name}` : ""}`;

    default:
      return config.label;
  }
}

export function getEventCards(event: Event): string[] {
  return event.items.map((item) => {
    const name = getCardName(item);
    const quantity = item.data_after.quantity;

    if (typeof quantity === "number" && quantity > 1) {
      return `${quantity}× ${name}`;
    }

    return name;
  });
}

export function parseEventItemToTimeLine(events: Event[]): TimelineItem[] {
  return events.map((event) => {
    const config = EVENT_CONFIG[event.type];

    return {
      id: event.id,
      kind: config?.kind ?? "update",
      text: getEventText(event),
      time: new Date(event.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cards: event.items.length > 0 ? getEventCards(event) : undefined,
    };
  });
}

export function parseEventsToTimeLine(
  events: Event[],
  label: string,
): TimelineDay {
  const added = events
    .filter((event) => ["card_added", "cards_bulk_added"].includes(event.type))
    .reduce(
      (total, event) =>
        total +
        event.items.reduce(
          (sum, item) =>
            sum +
            (typeof item.data_after.quantity === "number"
              ? item.data_after.quantity
              : 1),
          0,
        ),
      0,
    );

  const removed = events
    .filter((event) => event.type === "card_removed")
    .reduce(
      (total, event) =>
        total +
        event.items.reduce(
          (sum, item) =>
            sum +
            (typeof item.data_before.quantity === "number"
              ? item.data_before.quantity
              : 1),
          0,
        ),
      0,
    );

  const summaryParts: string[] = [];

  if (added > 0) {
    summaryParts.push(`Added ${added} ${added === 1 ? "card" : "cards"}`);
  }

  if (removed > 0) {
    summaryParts.push(`Removed ${removed} ${removed === 1 ? "card" : "cards"}`);
  }

  const otherEvents = events.filter(
    (event) =>
      !["card_added", "cards_bulk_added", "card_removed"].includes(event.type),
  ).length;

  if (otherEvents > 0) {
    summaryParts.push(
      `${otherEvents} other ${otherEvents === 1 ? "change" : "changes"}`,
    );
  }

  return {
    day: label,
    label,
    summary: summaryParts.join(" · ") || "No activity",
    items: parseEventItemToTimeLine(events),
  };
}
