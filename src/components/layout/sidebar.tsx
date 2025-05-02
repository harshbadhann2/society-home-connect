
import React from 'react';
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
  Truck 
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
        active ? "text-primary bg-primary/10 font-medium" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
      )}
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
  
  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Residents', href: '/residents' },
    { icon: Building, label: 'Properties', href: '/properties' },
    { icon: Bed, label: 'Amenities', href: '/amenities' },
    { icon: ParkingMeter, label: 'Parking', href: '/parking' },
    { icon: Truck, label: 'Delivery Records', href: '/delivery-records' },
    { icon: Users, label: 'Staff', href: '/staff' },
    { icon: FileText, label: 'Notices', href: '/notices' },
    { icon: MessageSquare, label: 'Complaints', href: '/complaints' },
    { icon: CreditCard, label: 'Payments', href: '/payments' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  if (isMobile && !isOpen) {
    return null;
  }
  
  return (
    <div className={cn(
      "pb-12 min-h-screen transition-all duration-300 border-r bg-sidebar",
      isOpen ? "w-64" : "w-0 border-none"
    )}>
      {isOpen && (
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={location.pathname === item.href}
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
