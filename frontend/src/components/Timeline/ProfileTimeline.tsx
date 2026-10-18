import type { ProfileEvents } from "#/features/event/types";
import { parseEventsToTimeLine } from "#/components/Timeline/utils";
import { Timeline } from "./Timeline";

export function ProfileTimeline({ data }: { data: ProfileEvents }) {
  const days = [
    parseEventsToTimeLine(data.today, "Today"),
    parseEventsToTimeLine(data.yesterday, "Yesterday"),
  ].filter((day) => day.items.length > 0);

  return <Timeline days={days} />;
}
