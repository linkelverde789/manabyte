import type { TimelineDay } from "#/features/event/types";
import { ICON } from "#/components/Timeline/utils";

export function Timeline({ days }: { days: TimelineDay[] }) {
  return (
    <div className="space-y-8">
      {days.map((day) => (
        <section key={day.day}>
          <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2">
            <h3 className="font-semibold">{day.label}</h3>
            <span className="text-xs text-muted-foreground">{day.summary}</span>
          </div>

          <ol className="relative space-y-4 border-l border-border pl-6">
            {day.items.map((item) => {
              const { Icon, cls } = ICON[item.kind];

              return (
                <li key={item.id} className="relative mb-8">
                  <span
                    className={`absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background ${cls}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-left">{item.text}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>

                  {item.cards && item.cards.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.cards.slice(0, 5).map((card, index) => (
                        <span
                          key={`${item.id}-${index}`}
                          className="rounded-md border border-border bg-card px-2 py-0.5 text-xs"
                        >
                          {card}
                        </span>
                      ))}
                      {item.cards.length > 5 && (
                        <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs">
                          +{item.cards.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
