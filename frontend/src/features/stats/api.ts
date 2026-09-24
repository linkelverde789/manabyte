import { api } from "#/api/manabyte";
import type { UserStats } from "./types";

export function getStats() {
  return api<UserStats>("/stats/");
}
