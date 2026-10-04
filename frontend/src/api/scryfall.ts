const API_URL = "https://api.scryfall.com";

export interface ScryfallError {
  object: string;
  code: string;
  status: number;
  details: string;
}

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `API Error: ${response.status}`;

    if (response.status == 429) {
      throw new Error("Scryfall limit. Please, wait to reset.");
    }

    try {
      const errorData = await response.json();

      if (typeof errorData?.error === "string") {
        message = errorData.error;
      } else if (typeof errorData?.message === "string") {
        message = errorData.message;
      } else if (typeof errorData?.details === "string") {
        message = errorData.details;
      }
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
