
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingsTable from "@/components/admin/BookingsTable";
import PriceManager from "@/components/admin/PriceManager";
import { useFirebase } from "@/contexts/FirebaseContext";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Welcome to your Admin Dashboard</h2>
        
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Discounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-6">
            <BookingsTable />
          </TabsContent>
          
          <TabsContent value="pricing" className="space-y-6">
            <PriceManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
