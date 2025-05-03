
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LoginPage from "./pages/LoginPage"; // New combined login page
import { useState } from "react";
import AuthContext from "./context/AuthContext";

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
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/loginpage" element={<LoginPage />} /> {/* New combined login page */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/" element={<Index />} />
              <Route path="/residents" element={<Residents />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/wings" element={<Wings />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/parking" element={<Parking />} />
              <Route path="/delivery-records" element={<DeliveryRecords />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/housekeeping" element={<Housekeeping />} />
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
