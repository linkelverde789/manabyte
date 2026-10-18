import type { User } from "#/contexts/AuthContext";
import { useGetProfileEvents } from "#/features/event/hooks";
import { Button } from "../ui/button";
import { ProfileTimeline } from "../Timeline/ProfileTimeline";

export function UserProfile({
  user,
  onLogOut,
}: {
  user: User;
  onLogOut: () => void;
}) {
  const { data: events, isLoading } = useGetProfileEvents();

  if (isLoading || !events) {
    return;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        Hi, {user.username}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
      <div className="mt-8 flex justify-center gap-3">
        {/*<Button asChild>
              <Link to="/decks">My decks</Link>
            </Button> */}
        <Button
          variant="outline"
          onClick={() => {
            onLogOut();
          }}
        >
          Sign out
        </Button>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <ProfileTimeline data={events} />
      </div>
    </div>
  );
}
