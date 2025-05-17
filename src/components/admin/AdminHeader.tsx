
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
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rebuild-purple">Rebuild Fitness Admin</h1>
          <p className="text-gray-500 text-sm">Manage your women's fitness program</p>
        </div>
        
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
