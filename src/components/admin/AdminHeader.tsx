import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/contexts/FirebaseContext";
import { LogOut, Home, Menu, X } from "lucide-react";

interface AdminHeaderProps {
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
}

const AdminHeader = ({ toggleSidebar, isMobileMenuOpen }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useFirebase();

  const handleSignOut = async () => {
    try {
      // Try to sign out from Firebase if authenticated there
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      // Clear local authentication
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    }
  };

  const goToHomepage = () => {
    navigate("/");
  };

  return (
    <header className="bg-gym-gray-dark border-b border-gym-gray-light p-4 flex items-center justify-between sticky top-0 z-10">
      {/* Mobile menu toggle - improved touch target */}
      <button 
        onClick={toggleSidebar}
        className="p-2 -ml-2 lg:hidden text-white hover:text-gym-yellow focus:outline-none flex items-center justify-center"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen ? "true" : "false"}
      >
        {isMobileMenuOpen ? 
          <X size={24} className="text-gym-yellow" /> : 
          <Menu size={24} />
        }
      </button>
      
      {/* Title - hidden on smallest screens */}
      <h1 className="text-xl font-bold text-gym-yellow hidden xs:block">
        Admin Dashboard
      </h1>
      
      {/* Actions area - adjust sizing for mobile */}
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          onClick={goToHomepage}
          size="sm"
          className="text-white hover:bg-gym-gray-light"
          title="Go to Homepage"
        >
          <Home className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Home</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          size="sm"
          className="border-gym-yellow text-gym-yellow hover:bg-gym-yellow/20"
        >
          <LogOut className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
