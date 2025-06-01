import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, DollarSign, Users, BarChart3, PlusCircle, Calendar, Tag, ChevronRight } from "lucide-react";
import StatsCards from "./StatsCards";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { getBookings, getCoupons, getServices } = useFirebase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all necessary data in parallel
        const [bookingsData, servicesData, couponsData] = await Promise.all([
          getBookings(),
          getServices(),
          getCoupons()
        ]);
        
        setBookings(bookingsData);
        setServices(servicesData);
        setCoupons(couponsData);
        
        // Get most recent 5 bookings
        const sorted = [...bookingsData].sort((a, b) => {
          // Sort by createdAt timestamp, newest first
          const dateA = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
        });
        setRecentBookings(sorted.slice(0, 5));
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error loading dashboard",
          description: "Failed to load some dashboard data. Please refresh."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [getBookings, getServices, getCoupons, toast]);

  // Calculate dashboard metrics
  const metrics = {
    totalBookings: bookings.length,
    activeServices: services.length,
    activeCoupons: coupons.filter(c => c.status === 'active').length,
    pendingPayments: bookings.filter(b => b.paymentStatus === 'pending').length
  };

  // Get most popular service based on bookings
  const getPopularService = () => {
    if (services.length === 0) return null;
    
    // In a real implementation, you would count bookings by service
    // For now, just return the first service as an example
    return services[0];
  };

  const popularService = getPopularService();

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = timestamp.toDate();
      return format(date, "MMM dd, yyyy • h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Quick action handlers
  const handleQuickAction = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/70">Welcome to your fitness studio management hub</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
            onClick={() => handleQuickAction('/admin/bookings')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Bookings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gym-gray-dark border-gym-gray-light h-11">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="recent" 
            className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
          >
            Recent Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gym-gray-dark border-gym-gray-light hover:border-gym-yellow transition-colors cursor-pointer"
                onClick={() => handleQuickAction('/admin/bookings')}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <CalendarDays className="h-8 w-8 text-gym-yellow mb-3" />
                      <h3 className="font-medium text-lg text-white">Manage Bookings</h3>
                      <p className="text-white/70 text-sm mt-1">View and update client bookings</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gym-yellow" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gym-gray-dark border-gym-gray-light hover:border-gym-yellow transition-colors cursor-pointer"
                onClick={() => handleQuickAction('/admin/sessions')}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Clock className="h-8 w-8 text-gym-yellow mb-3" />
                      <h3 className="font-medium text-lg text-white">Session Schedule</h3>
                      <p className="text-white/70 text-sm mt-1">Manage your fitness sessions</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gym-yellow" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gym-gray-dark border-gym-gray-light hover:border-gym-yellow transition-colors cursor-pointer"
                onClick={() => handleQuickAction('/admin/pricing')}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Tag className="h-8 w-8 text-gym-yellow mb-3" />
                      <h3 className="font-medium text-lg text-white">Manage Coupons</h3>
                      <p className="text-white/70 text-sm mt-1">Create and edit discount codes</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gym-yellow" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gym-gray-dark border-gym-gray-light hover:border-gym-yellow transition-colors cursor-pointer"
                onClick={() => handleQuickAction('/admin/memberships')}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Users className="h-8 w-8 text-gym-yellow mb-3" />
                      <h3 className="font-medium text-lg text-white">Membership Plans</h3>
                      <p className="text-white/70 text-sm mt-1">Manage services and pricing</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gym-yellow" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Business Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="bg-gym-gray-dark border-gym-gray-light overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Pending Payments</CardTitle>
                <CardDescription className="text-white/70">
                  Bookings with pending payment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.filter(b => b.paymentStatus === 'pending').length > 0 ? (
                  <div className="space-y-4">
                    {bookings
                      .filter(b => b.paymentStatus === 'pending')
                      .slice(0, 3)
                      .map((booking, index) => (
                        <div key={booking.id} className="flex items-center justify-between py-2">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{booking.name}</span>
                            <span className="text-white/60 text-sm">{booking.phone}</span>
                          </div>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">
                            ₹{booking.price} pending
                          </Badge>
                        </div>
                      ))}
                      
                    {metrics.pendingPayments > 3 && (
                      <Button 
                        variant="link" 
                        className="text-gym-yellow mt-2 p-0 h-auto"
                        onClick={() => handleQuickAction('/admin/bookings')}
                      >
                        View {metrics.pendingPayments - 3} more pending payments
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <p>No pending payments at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gym-gray-dark border-gym-gray-light overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Popular Services</CardTitle>
                <CardDescription className="text-white/70">
                  Most booked services this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {popularService ? (
                  <div className="space-y-4">
                    <div className="bg-gym-yellow/10 border border-gym-yellow/20 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{popularService.title}</h3>
                          <p className="text-white/70 text-sm mt-1">Trainer: {popularService.trainer}</p>
                        </div>
                        <Badge className="bg-gym-yellow text-black">Top Service</Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-white/70 text-sm">Price range: <span className="text-gym-yellow">₹{popularService.discountedPrice} - ₹{popularService.basePrice}</span></p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        className="border-gym-yellow text-gym-yellow hover:bg-gym-yellow/10"
                        onClick={() => handleQuickAction('/admin/memberships')}
                      >
                        Manage All Services
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <p>No service data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card className="bg-gym-gray-dark border-gym-gray-light">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-white/70">
                Latest bookings and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {recentBookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-gym-yellow"
                      >
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{booking.name}</span>
                          <span className="text-white/60 text-sm">
                            Booked {booking.preferredSlot || "a session"}
                            {booking.paymentStatus === "completed" ? 
                              <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/30">Paid</Badge> : 
                              <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/30">Pending</Badge>
                            }
                          </span>
                          <span className="text-white/40 text-xs mt-1">{booking.createdAt ? formatDate(booking.createdAt) : "No date"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <p>No recent bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
