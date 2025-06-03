import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { BarChart3, CalendarDays, Clock, DollarSign, Users, Home, GiftIcon } from "lucide-react";
import { useFirebase } from "@/contexts/FirebaseContext";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingsTable from "@/components/admin/BookingsTable";
import IntegratedPricingManager from "@/components/admin/IntegratedPricingManager";
import SessionManager from "@/components/admin/SessionManager";
import MembershipManager from "@/components/admin/MembershipManager";
import FreeSessionManager from "@/components/admin/FreeSessionManager"; // Add this import
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Check if user is authenticated via local storage
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

const Admin = () => {
  const { user, loading } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("bookings");

  const toggleSidebar = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Get current path to determine active section
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/bookings")) setActiveSection("bookings");
    else if (path.includes("/pricing")) setActiveSection("pricing");
    else if (path.includes("/sessions")) setActiveSection("sessions");
    else if (path.includes("/memberships")) setActiveSection("memberships");
    else if (path.includes("/analytics")) setActiveSection("analytics");
    else if (path.includes("/free-sessions")) setActiveSection("free-sessions"); // Add this line
    else setActiveSection("bookings"); // Default
  }, [location.pathname]);

  useEffect(() => {
    // Wait for Firebase auth to initialize
    if (!loading) {
      // Check if user is authenticated
      if (!isAuthenticated() && !user) {
        // Redirect to login page if not authenticated
        navigate("/login");
      } else {
        setIsLoading(false);
      }
    }
  }, [user, loading, navigate]);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gym-gray-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gym-gray">
      <AdminHeader toggleSidebar={toggleSidebar} isMobileMenuOpen={isMobileMenuOpen} />
      
      <div className="flex-grow flex overflow-hidden">
        {/* Mobile overlay when sidebar is open - added for touch dismissal */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Sidebar Navigation - Fixed position for mobile */}
        <div className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-64 h-full",
          "lg:flex-shrink-0 transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="bg-gym-gray-dark border-r border-gym-gray-light h-full">
            <div className="p-4 border-b border-gym-gray-light">
              <h2 className="text-lg font-bold text-white">Admin Dashboard</h2>
            </div>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                <NavItem 
                  to="bookings" 
                  icon={<CalendarDays className="mr-2 h-5 w-5" />}
                  label="Bookings"
                  isActive={activeSection === "bookings"}
                  onClick={() => setActiveSection("bookings")}
                />
                <NavItem 
                  to="pricing" 
                  icon={<DollarSign className="mr-2 h-5 w-5" />}
                  label="Pricing"
                  isActive={activeSection === "pricing"}
                  onClick={() => setActiveSection("pricing")}
                />
                <NavItem 
                  to="sessions" 
                  icon={<Clock className="mr-2 h-5 w-5" />}
                  label="Sessions"
                  isActive={activeSection === "sessions"}
                  onClick={() => setActiveSection("sessions")}
                />
                <NavItem 
                  to="memberships" 
                  icon={<Users className="mr-2 h-5 w-5" />}
                  label="Memberships"
                  isActive={activeSection === "memberships"}
                  onClick={() => setActiveSection("memberships")}
                />
                {/* Add Free Session Leads navigation item */}
                <NavItem 
                  to="free-sessions" 
                  icon={<GiftIcon className="mr-2 h-5 w-5" />}
                  label="Free Session Leads"
                  isActive={activeSection === "free-sessions"}
                  onClick={() => setActiveSection("free-sessions")}
                />
                <NavItem 
                  to="analytics" 
                  icon={<BarChart3 className="mr-2 h-5 w-5" />}
                  label="Analytics"
                  isActive={activeSection === "analytics"}
                  onClick={() => setActiveSection("analytics")}
                />
                <NavItem 
                  to="/" 
                  absolute={true}
                  icon={<Home className="mr-2 h-5 w-5" />}
                  label="Back to Site"
                  isActive={false}
                  onClick={() => {}} 
                />
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Main Content Area - Full width on mobile */}
        <div className="w-full flex-grow overflow-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<BookingsTable />} />
            <Route path="pricing" element={<IntegratedPricingManager />} />
            <Route path="sessions" element={<SessionManager />} />
            <Route path="memberships" element={<MembershipManager />} />
            <Route path="free-sessions" element={<FreeSessionManager />} /> {/* Add this route */}
            <Route path="analytics" element={
              <div className="bg-gym-gray-dark rounded-lg shadow-md border border-gym-gray-light p-8">
                <h2 className="text-xl font-bold text-white mb-4">Analytics Dashboard</h2>
                <p className="text-white/70">Analytics features coming soon.</p>
              </div>
            } />
            <Route path="*" element={<Navigate to="bookings" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Add this NavItem component definition before the main Admin component
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  absolute?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive, onClick, absolute = false }) => {
  // Handle both absolute and relative paths
  const finalPath = absolute ? to : `/admin/${to}`;
  
  return (
    <Link
      to={finalPath}
      className={cn(
        "flex items-center py-2 px-4 rounded-md transition-colors",
        isActive 
          ? "bg-gym-yellow text-black" 
          : "text-white hover:bg-gym-gray-light hover:text-white"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Admin;
