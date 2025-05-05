
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '../providers/sidebar-provider';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Building, 
  Calendar, 
  CreditCard, 
  Home, 
  MessageSquare, 
  Settings, 
  User, 
  Users, 
  FileText,
  Bed,
  ParkingMeter,
  Truck,
  Settings as SettingsIcon,
  ClipboardList,
  Landmark
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  roles?: Array<'admin' | 'staff' | 'resident' | null>;
  index: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href, active, roles, index }) => {
  const { userRole } = useAuth();

  // If roles is defined and the current user's role is not in the allowed roles, don't render the item
  if (roles && !roles.includes(userRole)) {
    return null;
  }

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all animate-roll-in",
        active ? "text-primary bg-primary/10 font-medium" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isOpen } = useSidebarContext();
  const isMobile = useIsMobile();
  const { userRole } = useAuth();
  
  // Explicitly type the roles arrays with the correct union type
  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Residents', href: '/residents', roles: ['admin'] as Array<'admin' | 'staff' | 'resident' | null> },
    { icon: Building, label: 'Manage Properties', href: '/properties', roles: ['admin'] as Array<'admin' | 'staff' | 'resident' | null> },
    { icon: Landmark, label: 'Manage Wings', href: '/wings', roles: ['admin'] as Array<'admin' | 'staff' | 'resident' | null> },
    { icon: Bed, label: 'Amenities', href: '/amenities' },
    { icon: ParkingMeter, label: 'Parking', href: '/parking' },
    { icon: Truck, label: 'Delivery Records', href: '/delivery-records' },
    { icon: Users, label: 'Staff', href: '/staff', roles: ['admin'] as Array<'admin' | 'staff' | 'resident' | null> },
    { icon: ClipboardList, label: 'Housekeeping', href: '/housekeeping' },
    { icon: FileText, label: 'Notices', href: '/notices' },
    { icon: MessageSquare, label: 'Complaints', href: '/complaints' },
    { icon: CreditCard, label: 'Payments', href: '/payments' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: SettingsIcon, label: 'Settings', href: '/settings' },
  ];

  if (isMobile && !isOpen) {
    return null;
  }
  
  return (
    <div className={cn(
      "pb-12 min-h-screen transition-all duration-300 border-r bg-sidebar",
      isOpen ? "w-64 animate-slide-in-right" : "w-0 border-none"
    )}>
      {isOpen && (
        <div className="space-y-4 py-4 animate-fade-in">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Nirvaan Heights
            </h2>
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={location.pathname === item.href}
                  roles={item.roles}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
