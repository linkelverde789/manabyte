import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    getCurrentUser,
    loginRequest,
    logoutRequest,
    registerRequest,
    type LoginPayload,
    type RegisterPayload,
    type User,
} from "#/lib/auth";

export type { User } from "#/lib/auth";

export type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadAuth() {
            try {
                const currentUser = await getCurrentUser();
                if (!cancelled) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Error loading authentication:", error);
                if (!cancelled) {
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadAuth();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (payload: LoginPayload) => {
        const nextUser = await loginRequest(payload);
        setUser(nextUser);
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        console.log("Registering user with payload:", payload); // Debug log
        const nextUser = await registerRequest(payload);
        setUser(nextUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
        }
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            loading,
            login,
            register,
            logout,
        }),
        [user, loading, login, register, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
}
