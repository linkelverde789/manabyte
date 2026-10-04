const API_URL = import.meta.env.VITE_BASE_API_URL;
const AUTH_URL = import.meta.env.VITE_AUTH_API_URL;

type ApiOptions = RequestInit & {
  responseType?: "json" | "blob";
  retried?: boolean;
};

export type BlobResponse = {
  blob: Blob;
  filename?: string;
};

type AuthExpiredListener = () => void;

const authExpiredListeners = new Set<AuthExpiredListener>();

export function onAuthExpired(listener: AuthExpiredListener): () => void {
  authExpiredListeners.add(listener);
  return () => {
    authExpiredListeners.delete(listener);
  };
}

function notifyAuthExpired() {
  for (const listener of authExpiredListeners) {
    listener();
  }
}

export async function api<T>(
  endpoint: string,
  options?: ApiOptions,
): Promise<T> {
  const {
    responseType = "json",
    retried = false,
    ...fetchOptions
  } = options ?? {};

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (response.status === 401 && !retried) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return api<T>(endpoint, { ...options, retried: true });
    }
    notifyAuthExpired();
  }

  if (!response.ok) {
    let message = `API Error: ${response.status}`;

    try {
      const errorData = await response.json();

      if (typeof errorData?.error === "string") {
        message = errorData.error;
      } else if (typeof errorData?.message === "string") {
        message = errorData.message;
      }
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (responseType === "blob") {
    const blob = await response.blob();

    const contentDisposition = response.headers.get("Content-Disposition");

    let filename: string | undefined;

    if (contentDisposition) {
      const match = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
      );

      if (match?.[1]) {
        filename = match[1].replace(/['"]/g, "");
      }
    }

    return {
      blob,
      filename,
    } as T;
  }

  return (await response.json()) as T;
}

let refreshInFlight: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${AUTH_URL}/refresh/`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}
