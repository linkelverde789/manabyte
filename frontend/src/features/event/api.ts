import { api } from "#/api/manabyte";
import type { ProfileEvents } from "./types";

export function getProfileEvents() {
  return api<ProfileEvents>("/events/profile");
}
