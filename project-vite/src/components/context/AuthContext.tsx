// import { useAsync } from "@react-hookz/web";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser, getProfile } from "@/api/profile";

export type AuthContextType = {
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

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();

  // api
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: false,
  });
  const refreshQuery = useQuery({
    queryKey: ["refreshProfile"],
    queryFn: getProfile,
    enabled: false,
  });

  // handle profile
  useEffect(() => {
    if (!isAuthenticated) {
      if (profileQuery.isSuccess) {
        setUser(profileQuery.data);
        setIsAuthenticated(true);
      }
    }
  }, [isAuthenticated, mounted, profileQuery]);

  // initial check
  useEffect(() => {
    if (!mounted) {
      const token = localStorage.getItem("access_token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        profileQuery.refetch();
      } else {
        setIsAuthenticated(false);
        setMounted(true);
      }
    }
  }, [profileQuery, mounted]);

  const handleAuthentication = (authenticated: boolean) => {
    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setMounted(true);
  };

  useEffect(() => {
    if (profileQuery.isSuccess) {
      handleAuthentication(true);
    }
    if (profileQuery.isError) {
      handleAuthentication(false);
    }
  }, [profileQuery]);

  useEffect(() => {
    if (refreshQuery.isSuccess) {
      setUser(refreshQuery.data);
    }
    if (refreshQuery.isError) {
      setIsAuthenticated(false);
    }
  }, [refreshQuery]);

  const createSession = async (token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("access_token", token);
    profileQuery.refetch();
  };

  const endSession = () => {
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setUser(null);
    queryClient.clear();
  };

  const refreshSession = async () => {
    setUser(null);
    refreshQuery.refetch();
  };

  const session = {
    create: createSession,
    end: endSession,
    refresh: refreshSession,
  };

  const value = {
    authenticated: isAuthenticated,
    session,
    user,
  };

  if (!mounted) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
