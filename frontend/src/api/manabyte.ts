const API_URL = import.meta.env.VITE_BASE_API_URL;

type ApiOptions = RequestInit & {
  responseType?: "json" | "blob";
};

export type BlobResponse = {
  blob: Blob;
  filename?: string;
};

export async function api<T>(
  endpoint: string,
  options?: ApiOptions,
): Promise<T> {
  const { responseType = "json", ...fetchOptions } = options ?? {};

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
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
