import { refreshTokenRequest } from "@/api/auth";
import { UserModel, getUser } from "@/api/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SplashScreen } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

// Prevent hiding the splash screen after the navigation has mounted
SplashScreen.preventAutoHideAsync();

interface AuthContextProps {
    authenticated: boolean;
    user: UserModel;
    session: {
        create: (token: string, refresh_token: string) => void;
        load: () => void;
        end: () => void;
        refresh: () => void;
        refreshToken: () => void;
    };
}

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const AuthContext = createContext<AuthContextProps>(null!);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const queryClient = useQueryClient();

    const profileQuery = useQuery({
        queryKey: ["profile"],
        queryFn: getUser,
        enabled: false,
    });
    const refreshProfileQuery = useQuery({
        queryKey: ["refreshProfile"],
        queryFn: getUser,
        enabled: false,
    });
    const refreshTokenMutation = useMutation({
        mutationFn: refreshTokenRequest,
        onSuccess: (data) => {
            setAuthTokens(data.access_token, data.refresh_token);
        },
        onError: (error) => {
            console.error(error);
            endSession();
        },
    });

    const [authenticated, setAuthenticated] = useState(false);
    const [initialLoad, setInitialLoad] = useState(false);

    // axios interceptors
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            if (error.response.status === 401 && authenticated) {
                setAuthenticated(false);
                axios.defaults.headers.common["Authorization"] = "";
                await SecureStore.deleteItemAsync(TOKEN_KEY);
                await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            }
            return Promise.reject(error);
        }
    );

    const handleAuthentication = (authenticated: boolean) => {
        if (authenticated) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
        setInitialLoad(true);
    };

    const setAuthTokens = async (token: string, refresh_token: string) => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
    };

    const loadSession = async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            profileQuery.refetch();
        } else {
            axios.defaults.headers.common["Authorization"] = "";
            if (profileQuery.isFetched) {
                queryClient.invalidateQueries();
                profileQuery.refetch();
            }
            handleAuthentication(false);
        }
    };

    const refreshAccessToken = async () => {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            return;
        }
        refreshTokenMutation.mutate(refreshToken);
    };

    const refreshSession = async () => {
        refreshProfileQuery.refetch();
    };

    const endSession = async () => {
        setAuthenticated(false);
        axios.defaults.headers.common["Authorization"] = "";
        await Promise.all([
            await SecureStore.deleteItemAsync(TOKEN_KEY),
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        ]).then(() => {
            loadSession();
        });
    };

    const createSession = async (token: string, refresh_token: string) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
        loadSession();
    };

    const session = {
        load: loadSession,
        end: endSession,
        create: createSession,
        refresh: refreshSession,
        refreshToken: refreshAccessToken,
    };

    useEffect(() => {
        if (!profileQuery.isFetched) {
            loadSession();
        }
    }, []);

    useEffect(() => {
        if (profileQuery.isSuccess && !profileQuery.isFetching) {
            handleAuthentication(true);
        }
        if (profileQuery.isError) {
            handleAuthentication(false);
        }
    }, [profileQuery, refreshProfileQuery]);

    // only show loading screen once on initial load (need to set a 1 time state)
    useEffect(() => {
        if (!profileQuery.isLoading && initialLoad) {
            SplashScreen.hideAsync();
        }
    }, [profileQuery.isLoading, initialLoad]);

    const value = {
        authenticated: authenticated,
        user: (refreshProfileQuery.data
            ? refreshProfileQuery.data
            : profileQuery.data) as UserModel,
        session: session,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
