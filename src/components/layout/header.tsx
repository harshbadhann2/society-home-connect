
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, User, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarContext } from '../providers/sidebar-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthContext from '@/context/AuthContext';
import { mockResidents, mockStaff, mockUsers } from '@/types/database';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebarContext();
  const { userRole, setIsAuthenticated, setUserRole } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New notice posted", time: "2 min ago" },
    { id: 2, message: "Payment reminder", time: "1 hour ago" },
    { id: 3, message: "Maintenance scheduled", time: "Yesterday" }
  ]);

  // Default user from mock data
  const [currentUser, setCurrentUser] = useState(mockResidents[0]);
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  
  // Fetch user data based on role
  const { data: userData } = useQuery({
    queryKey: ['current-user', userRole],
    queryFn: async () => {
      if (!userRole) return null;
      
      try {
        // For admin, we use a simple lookup from mock data
        if (userRole === 'admin') {
          return mockUsers.find(user => user.role === 'admin');
        }
        
        // For staff, try to fetch from database first
        if (userRole === 'staff') {
          const { data, error } = await supabase
            .from('staff')
            .select('*')
            .limit(1);
            
          if (data && data.length > 0) {
            return data[0];
          } else {
            return mockStaff[0]; // Fallback to mock data
          }
        }
        
        // For residents, try to fetch from database first
        if (userRole === 'resident') {
          const { data, error } = await supabase
            .from('residents')
            .select('*')
            .limit(1);
            
          if (data && data.length > 0) {
            return data[0];
          } else {
            return mockResidents[0]; // Fallback to mock data
          }
        }
        
        return null;
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Fallback to mock data based on role
        if (userRole === 'admin') return mockUsers.find(user => user.role === 'admin');
        if (userRole === 'staff') return mockStaff[0];
        return mockResidents[0];
      }
    }
  });
  
  useEffect(() => {
    // Update current user when userData changes
    if (userData) {
      setCurrentUser(userData);
    }
    
    // Get time of day for greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Good Morning");
    else if (hour < 17) setTimeOfDay("Good Afternoon");
    else setTimeOfDay("Good Evening");
  }, [userData]);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };
  
  // Helper function to get user's name regardless of user type
  const getUserName = () => {
    if (!currentUser) return "Guest";
    
    if ('name' in currentUser) {
      return currentUser.name;
    } else if ('email' in currentUser) {
      // If we only have email (like for admin), use the part before @
      return currentUser.email.split('@')[0];
    }
    
    return "User";
  };
  
  // Extract first name for display
  const firstName = getUserName().split(' ')[0];
  const title = userRole === 'admin' ? 'Admin' : userRole === 'staff' ? 'Mr./Ms.' : 'Mr./Ms.';
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}
        
        <Link to="/" className="flex items-center gap-2 mr-4">
          <div className="rounded-md bg-primary p-1.5 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">Nirvaan Heights</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-4">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* User greeting - show on tablet and larger */}
          <div className="hidden md:block text-sm font-medium">
            <span className="text-muted-foreground">{timeOfDay}! </span>
            <span className="text-foreground">{title} {firstName}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive" />
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                  <div>
                    <p>{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              {notifications.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {getUserName().charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{getUserName()}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
