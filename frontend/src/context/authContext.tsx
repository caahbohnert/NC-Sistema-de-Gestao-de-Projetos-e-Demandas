import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuthService } from '../services/authService';

interface Usuario {
  id: string;
  email: string;
  name: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
  updateUser: (data: Partial<Usuario>) => void;
}

function getUserFromToken(token: string): Usuario | null {
  try {
    const decoded = jwtDecode<{ sub: string; email: string; nome?: string }>(
      token,
    );
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.nome ?? 'Usuário',
    };
  } catch {
    return null;
  }
}

const STORAGE_USER_KEY = 'user';

function getUserFromStorage(): Usuario | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authService = useAuthService();

  const tokenInicial = localStorage.getItem('token');

  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenInicial);

  const [user, setUser] = useState<Usuario | null>(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) return storedUser;

    if (tokenInicial) return getUserFromToken(tokenInicial);

    return null;
  });

  async function login(email: string, senha: string) {
    const response = await authService.login({ email, senha });
    const token = response.data.accessToken;

    const decodedUser = getUserFromToken(token);

    localStorage.setItem('token', token);

    if (decodedUser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(decodedUser));
    }

    setUser(decodedUser);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(STORAGE_USER_KEY);

    setUser(null);
    setIsAuthenticated(false);
  }

  function updateUser(data: Partial<Usuario>) {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        ...data,
      };

      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));

      return updated;
    });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        setUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
