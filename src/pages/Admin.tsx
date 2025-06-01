import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useFirebase } from "@/contexts/FirebaseContext";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";
import BookingsTable from "@/components/admin/BookingsTable";
import IntegratedPricingManager from "@/components/admin/IntegratedPricingManager";
import SessionManager from "@/components/admin/SessionManager";
import MembershipManager from "@/components/admin/MembershipManager";
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

  const toggleSidebar = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
        {/* Mobile overlay when sidebar is open */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar Navigation */}
        <div className={cn(
          "fixed lg:static inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <AdminSidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            onItemClick={() => setIsMobileMenuOpen(false)} 
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="bookings" element={<BookingsTable />} />
            <Route path="pricing" element={<IntegratedPricingManager />} />
            <Route path="sessions" element={<SessionManager />} />
            <Route path="memberships" element={<MembershipManager />} />
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

export default Admin;
