import { useQuery } from "@tanstack/react-query";
import { getProfileEvents } from "./api";

export function useGetProfileEvents() {
  return useQuery({
    queryKey: ["profile-events"],
    queryFn: () => getProfileEvents(),
  });
}
