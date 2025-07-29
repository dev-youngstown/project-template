import { IUser } from "@/api";
import { createContext } from "react";

type AuthContextType = {
    authenticated: boolean;
    session: {
        create: (token: string) => void;
        end: () => void;
        refresh: () => void;
    };
    user: IUser | null;
};

export const AuthContext = createContext<AuthContextType>({
    authenticated: false,
    session: {
        create: () => {},
        end: () => {},
        refresh: () => {},
    },
    user: null,
});
