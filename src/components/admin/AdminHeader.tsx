import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/contexts/FirebaseContext";

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

  return (
    <header className="bg-gym-gray-dark border-b border-gym-gray-light py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gym-yellow font-heading">Rebuild Fitness Admin</h1>
          <p className="text-white/70 text-sm">Manage your women's fitness program</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="border-gym-yellow text-gym-yellow hover:bg-gym-yellow/20"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
