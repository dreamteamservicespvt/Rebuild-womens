import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFirebase } from "@/contexts/FirebaseContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Menu, X } from "lucide-react"; // For mobile menu toggle

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, loading } = useFirebase();
  const router = useRouter();
  // Add state for mobile sidebar visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add effect to close sidebar when route changes (important for mobile UX)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  // Add listener for screen resizes to automatically hide mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gym-gray-dark text-white">
      {/* Mobile overlay when sidebar is open */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Main content area - positioned to take full width */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Mobile header with menu toggle */}
        <AdminHeader 
          toggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMobileMenuOpen={mobileMenuOpen}
        />
        
        {/* Main content with safe area padding for mobile */}
        <main className="flex-1 overflow-y-auto bg-gym-black p-3 sm:p-6">
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Sidebar - positioned absolute/fixed on mobile so it overlays content */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <AdminSidebar isMobileMenuOpen={mobileMenuOpen} />
      </div>
    </div>
  );
};

export default AdminLayout;
