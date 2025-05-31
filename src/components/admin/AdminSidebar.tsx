import Link from "next/link";
import { useRouter } from "next/router";
import { 
  Home, 
  Users, 
  Calendar, 
  Tag, 
  Settings, 
  FileText, 
  Award,
  DollarSign
} from "lucide-react";
import Image from "next/image";

const AdminSidebar = () => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Services", href: "/admin/services", icon: Award },
    { name: "Coupons", href: "/admin/coupons", icon: Tag },
    { name: "Payments", href: "/admin/payments", icon: DollarSign },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings }
  ];

  return (
    <div className="h-full flex flex-col bg-gym-gray-dark border-r border-gym-gray-light">
      {/* Logo area with better mobile padding */}
      <div className="px-4 py-5 flex items-center justify-center border-b border-gym-gray-light mb-2">
        <div className="relative w-40 h-12">
          <Image
            src="/images/logo-light.png"
            alt="Rebuild Women Logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Navigation - adjusted for better touch targets */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center py-3 px-4 mx-2 rounded-lg mb-1 ${
                active 
                  ? "bg-gym-yellow text-black font-medium" 
                  : "text-white/80 hover:bg-gym-yellow/10 hover:text-white"
              } transition-colors`}
            >
              <Icon size={18} className={`flex-shrink-0 ${active ? "text-black" : "text-gym-yellow"}`} />
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
