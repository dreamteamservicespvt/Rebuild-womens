import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign,
  Clock,
  BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isMobileMenuOpen: boolean;
  onItemClick?: () => void; // Optional callback to close mobile menu
}

const AdminSidebar = ({ isMobileMenuOpen, onItemClick }: AdminSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    // For the root admin path, only consider it active if it's exactly /admin
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    
    // For other paths, check if the current path starts with the given path
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
    { name: "Sessions", href: "/admin/sessions", icon: Clock },
    { name: "Memberships", href: "/admin/memberships", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 }
  ];

  return (
    <div className="h-full flex flex-col bg-gym-gray-dark border-r border-gym-gray-light">
      {/* Logo area with better mobile padding */}
      <div className="px-4 py-5 flex items-center justify-center border-b border-gym-gray-light mb-2">
        <div className="text-xl font-bold text-gym-yellow tracking-wider italic">REBUILD WOMEN'S</div>
      </div>

      {/* Navigation - adjusted for better touch targets */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center py-3 px-4 mx-2 rounded-lg mb-1",
                active 
                  ? "bg-gym-yellow text-black font-medium" 
                  : "text-white/80 hover:bg-gym-yellow/10 hover:text-white"
              )}
              onClick={onItemClick}
            >
              <Icon size={18} className={cn("flex-shrink-0", active ? "text-black" : "text-gym-yellow")} />
              <span className="ml-3 text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Version info */}
      <div className="p-4 border-t border-gym-gray-light">
        <p className="text-xs text-white/40 text-center">Rebuild Women v1.0</p>
      </div>
    </div>
  );
};

export default AdminSidebar;
