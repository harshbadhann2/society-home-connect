
import { createContext } from 'react';

export interface UserInfo {
  id?: number;
  name?: string;
  email?: string;
  contact?: string;
  apartment?: string;
  status?: string;
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

export default AuthContext;
