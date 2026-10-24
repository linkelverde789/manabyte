import { api } from "#/api/manabyte";
import type { ImportData } from "./types";

export function check(text: string) {
  return api<ImportData[]>("/imports/", {
    method: "POST",
    body: JSON.stringify({ content: text }),
  });
}
