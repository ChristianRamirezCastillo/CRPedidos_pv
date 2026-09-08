import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile, LoginRequest } from '../types/auth';
import { authService, parseJwt } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Inicializar sesión desde almacenamiento local
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(storedUser);
      } else {
        const decoded = parseJwt(storedToken);
        if (decoded) {
          setUser(decoded);
          localStorage.setItem('user', JSON.stringify(decoded));
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const data = await authService.login(credentials);
      const decodedUser = parseJwt(data.token);
      
      const userProfile: UserProfile = decodedUser || {
        id: '1',
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'Admin' : 'User',
      };

      setToken(data.token);
      setUser(userProfile);
      authService.saveSession(data.token, userProfile);
      toast.success(`¡Bienvenido de nuevo, ${userProfile.email}!`);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success('Sesión cerrada correctamente');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
