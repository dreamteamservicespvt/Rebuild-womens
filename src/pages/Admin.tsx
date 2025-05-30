import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingsTable from "@/components/admin/BookingsTable";
import IntegratedPricingManager from "@/components/admin/IntegratedPricingManager";
import { useFirebase } from "@/contexts/FirebaseContext";
import { BarChart3, CalendarDays } from "lucide-react";

// Check if user is authenticated via local storage
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

const Admin = () => {
  const { user, loading } = useFirebase();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for Firebase auth to initialize
    if (!loading) {
      // Check both Firebase auth and our local authentication
      if (!user && !isAuthenticated()) {
        navigate("/login");
      } else {
        // If authenticated via local storage, set the local storage
        if (!user && isAuthenticated()) {
          localStorage.setItem("isLoggedIn", "true");
        }
        setIsLoading(false);
      }
    }
  }, [user, loading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gym-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gym-black">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h2>
        
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-gym-gray-dark">
            <TabsTrigger 
              value="bookings" 
              className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white flex items-center gap-1"
            >
              <CalendarDays className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="manage" 
              className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white flex items-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              Manage Services & Pricing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-6">
            <BookingsTable />
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-6">
            <IntegratedPricingManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
