
import { createContext, useContext } from 'react';

export interface UserInfo {
  id?: number;
  name?: string;
  email?: string;
  contact?: string;
  apartment?: string; // Changed from number to string for consistency
  status?: string;
  resident_id?: number;
  userId?: number;
  role?: 'admin' | 'staff' | 'resident';
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRole: 'admin' | 'staff' | 'resident' | null;
  setUserRole: (value: 'admin' | 'staff' | 'resident' | null) => void;
  currentUser: UserInfo | null;
  setCurrentUser: (user: UserInfo | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  userRole: null,
  setUserRole: () => {},
  currentUser: null,
  setCurrentUser: () => {},
});

// Create and export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
