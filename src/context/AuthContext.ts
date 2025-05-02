
import { createContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRole: 'admin' | 'staff' | 'resident' | null;
  setUserRole: (value: 'admin' | 'staff' | 'resident' | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  userRole: null,
  setUserRole: () => {},
});

export default AuthContext;
