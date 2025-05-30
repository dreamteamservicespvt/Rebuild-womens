import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingsTable from "@/components/admin/BookingsTable";
import IntegratedPricingManager from "@/components/admin/IntegratedPricingManager";
import SessionManager from "@/components/admin/SessionManager";
import MembershipManager from "@/components/admin/MembershipManager";
import { useFirebase } from "@/contexts/FirebaseContext";
import { BarChart3, CalendarDays, Clock, DollarSign, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Check if user is authenticated via local storage
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

const Admin = () => {
  const { user, loading } = useFirebase();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");

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

  // Save active tab to localStorage to persist between refreshes
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("adminActiveTab", activeTab);
    }
  }, [activeTab]);

  // Restore active tab from localStorage on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem("adminActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gym-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gym-black flex flex-col">
      <AdminHeader />
      
      <main className="flex-grow flex flex-col">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-grow flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white pl-1">Admin Dashboard</h2>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-4 sm:space-y-6 flex-grow flex flex-col"
          >
            {/* Mobile-optimized tab list with scroll for small screens */}
            <div className="relative border-b border-gym-gray-light">
              <ScrollArea className="pb-0.5 -mb-0.5">
                <TabsList className="bg-transparent w-auto inline-flex px-1 h-auto py-1 justify-start overflow-visible">
                  <TabsTrigger 
                    value="bookings" 
                    className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white py-2 px-3 rounded-md flex items-center gap-1.5 text-sm h-10"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Bookings</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="sessions" 
                    className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white py-2 px-3 rounded-md flex items-center gap-1.5 text-sm h-10"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Sessions</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="pricing" 
                    className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white py-2 px-3 rounded-md flex items-center gap-1.5 text-sm h-10"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Pricing</span>
                  </TabsTrigger>

                  <TabsTrigger 
                    value="memberships" 
                    className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white py-2 px-3 rounded-md flex items-center gap-1.5 text-sm h-10"
                  >
                    <Users className="h-4 w-4" />
                    <span>Memberships</span>
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>
            
            <div className="flex-grow overflow-hidden flex flex-col">
              <TabsContent value="bookings" className="flex-grow flex flex-col m-0 data-[state=active]:flex">
                <div className="flex-grow flex flex-col">
                  <BookingsTable />
                </div>
              </TabsContent>
              
              <TabsContent value="sessions" className="flex-grow flex flex-col m-0 data-[state=active]:flex">
                <div className="flex-grow flex flex-col overflow-auto">
                  <SessionManager />
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="flex-grow flex flex-col m-0 data-[state=active]:flex">
                <div className="flex-grow flex flex-col overflow-auto">
                  <IntegratedPricingManager />
                </div>
              </TabsContent>

              <TabsContent value="memberships" className="flex-grow flex flex-col m-0 data-[state=active]:flex">
                <div className="flex-grow flex flex-col overflow-auto">
                  <MembershipManager />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
