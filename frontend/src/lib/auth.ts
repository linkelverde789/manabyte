export type User = {
    id: number;
    email: string;
    username: string;
    profile_picture: string | null;
};

export type LoginPayload = {
    email: string;
    password: string;
    remember_me?: boolean;
};

export type RegisterPayload = {
    email: string;
    username: string;
    password: string;
};

const AUTH_API = import.meta.env.VITE_AUTH_API_URL;

async function authRequest(path: string, init?: RequestInit): Promise<Response> {
    return fetch(`${AUTH_API}${path}`, {
        ...init,
        credentials: "include",
        headers: {
            ...(init?.body ? { "Content-Type": "application/json" } : {}),
            ...init?.headers,
        },
    });
}

async function parseUser(response: Response): Promise<User | null> {
    if (!response.ok) {
        return null;
    }

    const body = (await response.json()) as { user: User | null };
    return body.user ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
    const user = await parseUser(await authRequest("/me/"));
    if (user) {
        return user;
    }

    const refresh = await authRequest("/refresh/", { method: "POST" });
    if (!refresh.ok) {
        return null;
    }

    return parseUser(await authRequest("/me/"));
}

export async function loginRequest(payload: LoginPayload): Promise<User> {
    const response = await authRequest("/login/", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Invalid email or password");
    }

    const user = await parseUser(response);
    if (!user) {
        throw new Error("Invalid email or password");
    }

    return user;
}

export async function registerRequest(payload: RegisterPayload): Promise<User> {
    const response = await authRequest("/register/", {
        method: "POST",
        body: JSON.stringify(payload),
    });


    if (!response.ok) {
        console.error("Registration failed with status:", response.status);
        try {
            const errorText = await response.text();
            console.error("Error response body:", errorText);
            throw new Error("Could not create the account: " + errorText);
        } catch (error) {
            console.error("Failed to parse error response:", error);
            throw new Error("Could not create the account");
        }
    }

    const user = await parseUser(response);
    if (!user) {
        throw new Error("Could not create the account: Invalid response from server");
    }

    return user;
}

export async function logoutRequest(): Promise<void> {
    await authRequest("/logout/", { method: "POST" });
}
