import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { login as loginRequest } from '../api/auth';
import { getStoredToken, setStoredToken } from '../api/client';

interface AuthContextValue {
  token: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getStoredToken().then((stored) => {
      setToken(stored);
      setIsReady(true);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isReady,
      isAuthenticated: token !== null,
      login: async (username: string, password: string) => {
        const accessToken = await loginRequest(username, password);
        await setStoredToken(accessToken);
        setToken(accessToken);
      },
      logout: () => {
        setStoredToken(null);
        setToken(null);
      },
    }),
    [token, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
