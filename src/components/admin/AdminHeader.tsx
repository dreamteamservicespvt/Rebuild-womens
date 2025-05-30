import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/contexts/FirebaseContext";
import { LogOut, Home } from "lucide-react";

const AdminHeader = () => {
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
    <header className="bg-gym-gray-dark border-b border-gym-gray-light py-3 sm:py-4 sticky top-0 z-30 shadow-md">
      <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gym-yellow font-heading">Rebuild Women</h1>
          <p className="text-white/70 text-xs sm:text-sm">Admin Dashboard</p>
        </div>
        
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
};

export default AdminHeader;
