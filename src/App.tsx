
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Residents from "./pages/Residents";
import Properties from "./pages/Properties";
import Notices from "./pages/Notices";
import Complaints from "./pages/Complaints";
import Facilities from "./pages/Facilities";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<NotFound />} />
          <Route path="/settings" element={<NotFound />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
