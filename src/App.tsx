import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Residents from "./pages/Residents";
import Properties from "./pages/Properties";
import Wings from "./pages/Wings";
import Notices from "./pages/Notices";
import Complaints from "./pages/Complaints";
import Amenities from "./pages/Amenities";
import Parking from "./pages/Parking";
import DeliveryRecords from "./pages/DeliveryRecords";
import Staff from "./pages/Staff";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Housekeeping from "./pages/Housekeeping";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import LoginPage from "./pages/LoginPage"; // Combined login page
import { useEffect, useState } from "react";
import AuthContext, { UserInfo } from "./context/AuthContext";
import { ThemeProvider } from "./components/providers/theme-provider";
import { supabase } from "./integrations/supabase/client";

// Custom route component that checks user role
interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: Array<'admin' | 'staff' | 'resident' | null>;
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'staff' | 'resident' | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        
        // Get user role from the session if available
        const userMeta = data.session.user.user_metadata;
        if (userMeta && userMeta.role) {
          setUserRole(userMeta.role);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };
    
    checkAuth();
  }, []);
  
  if (isAuthenticated === null) {
    // Still checking auth status
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If allowedRoles is specified and user's role is not included, redirect to home
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'staff' | 'resident' | null>(null);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  
  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
        
        if (session) {
          // Get user role from metadata or fetch from profile table
          const userMeta = session.user.user_metadata;
          const role = userMeta.role || 'resident'; // Default to resident if no role found
          setUserRole(role as 'admin' | 'staff' | 'resident');
          
          // Update current user info
          setCurrentUser({
            userId: session.user.id,
            email: session.user.email,
            name: userMeta.full_name || userMeta.name,
            role: role
          });
          
          // Optionally fetch more user details from your database
          if (role === 'resident') {
            try {
              const { data: residentData } = await supabase
                .from('resident')
                .select('*')
                .eq('email', session.user.email)
                .single();
                
              if (residentData) {
                setCurrentUser(prevState => ({
                  ...prevState!,
                  resident_id: residentData.resident_id,
                  name: residentData.name,
                  contact: residentData.contact_number,
                  apartment: residentData.apartment_id?.toString(), // Convert to string
                  status: residentData.status,
                }));
              }
            } catch (error) {
              console.error('Error fetching resident data:', error);
            }
          } else if (role === 'staff' || role === 'admin') {
            try {
              const { data: staffData } = await supabase
                .from('staff')
                .select('*')
                .eq('name', userMeta.full_name || userMeta.name)
                .single();
                
              if (staffData) {
                setCurrentUser(prevState => ({
                  ...prevState!,
                  id: staffData.staff_id,
                  name: staffData.name,
                  contact: staffData.contact_number,
                }));
              }
            } catch (error) {
              console.error('Error fetching staff data:', error);
            }
          }
        } else {
          setUserRole(null);
          setCurrentUser(null);
        }
      }
    );
    
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        // Set initial user data
        const userMeta = session.user.user_metadata;
        const role = userMeta.role || 'resident';
        setUserRole(role as 'admin' | 'staff' | 'resident');
        
        setCurrentUser({
          userId: session.user.id,
          email: session.user.email,
          name: userMeta.full_name || userMeta.name,
          role: role
        });
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ 
          isAuthenticated, 
          setIsAuthenticated, 
          userRole, 
          setUserRole,
          currentUser,
          setCurrentUser
        }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Login routes - accessible to all */}
                <Route path="/login" element={
                  isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
                } />
                <Route path="/admin-login" element={
                  <Navigate to="/login" replace state={{ defaultTab: 'admin' }} />
                } />
                <Route path="/loginpage" element={
                  <Navigate to="/login" replace />
                } />
                
                {/* Protected routes with role-based access */}
                <Route path="/" element={
                  <ProtectedRoute element={<Index />} />
                } />
                <Route path="/residents" element={
                  <ProtectedRoute element={<Residents />} allowedRoles={['admin']} />
                } />
                <Route path="/properties" element={
                  <ProtectedRoute element={<Properties />} allowedRoles={['admin']} />
                } />
                <Route path="/wings" element={
                  <ProtectedRoute element={<Wings />} allowedRoles={['admin']} />
                } />
                
                {/* Routes available to all authenticated users */}
                <Route path="/amenities" element={
                  <ProtectedRoute element={<Amenities />} />
                } />
                <Route path="/parking" element={
                  <ProtectedRoute element={<Parking />} />
                } />
                <Route path="/delivery-records" element={
                  <ProtectedRoute element={<DeliveryRecords />} />
                } />
                <Route path="/notices" element={
                  <ProtectedRoute element={<Notices />} />
                } />
                <Route path="/complaints" element={
                  <ProtectedRoute element={<Complaints />} />
                } />
                <Route path="/payments" element={
                  <ProtectedRoute element={<Payments />} />
                } />
                <Route path="/profile" element={
                  <ProtectedRoute element={<Profile />} />
                } />
                <Route path="/settings" element={
                  <ProtectedRoute element={<Settings />} />
                } />
                <Route path="/housekeeping" element={
                  <ProtectedRoute element={<Housekeeping />} />
                } />
                
                {/* Admin-only routes */}
                <Route path="/staff" element={
                  <ProtectedRoute element={<Staff />} allowedRoles={['admin']} />
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
