import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { login as loginRequest } from '../api/auth';
import { getStoredToken, setStoredToken } from '../api/client';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: token !== null,
      login: async (username: string, password: string) => {
        const accessToken = await loginRequest(username, password);
        setStoredToken(accessToken);
        setToken(accessToken);
      },
      logout: () => {
        setStoredToken(null);
        setToken(null);
      },
    }),
    [token],
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
