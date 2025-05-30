import { useState, useEffect, useCallback, memo } from "react";
import { useFirebase, CouponType, ServiceType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Timestamp,
  getDocs,  // Add missing import
  collection,  // Add missing import
  getFirestore  // Add missing import
} from "firebase/firestore";
import { Plus, Search, Tag, ListPlus, Pencil, RefreshCw } from "lucide-react"; // Add RefreshCw import
import UPIQRCode from "@/components/UpiQRCode";
import CouponManager from "./CouponManager";
import CreateCouponDialog from "./CreateCouponDialog";
import RedemptionResetDialog from "./RedemptionResetDialog"; // Import the new dialog
import { ScrollArea } from "@/components/ui/scroll-area";
import ServiceEditor from "./ServiceEditor";

// Memoize the CouponManager component to prevent unnecessary re-renders
const MemoizedCouponManager = memo(CouponManager);

const IntegratedPricingManager = () => {
  const { 
    getServices, 
    updateService, 
    createService,
    deleteService,
    getCoupons 
  } = useFirebase();
  const { toast } = useToast();
  
  // Services states
  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isEditingService, setIsEditingService] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // Coupon states
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [totalRedemptions, setTotalRedemptions] = useState(0);
  const [createCouponDialogOpen, setCreateCouponDialogOpen] = useState(false);

  // Set default active tab to coupons
  const [activeTab, setActiveTab] = useState("coupons");
  
  const [loading, setLoading] = useState(true);
  
  // Add state for the reset dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  
  // Memoize the fetchData function to avoid recreating it on every render
  const fetchData = useCallback(async (preserveTab = true) => {
    setLoading(true);
    try {
      // Fetch services
      const servicesData = await getServices();
      setServices(servicesData);
      
      // Always fetch coupons data when refreshing after a redemption reset
      // Removed the tab condition to ensure data is always fresh
      const couponsData = await getCoupons();
      setCoupons(couponsData);
      
      // Calculate total redemptions directly from Firebase collection
      // This ensures we get the correct count after a reset
      const db = getFirestore(); // Get the Firestore instance
      const allRedemptionsSnapshot = await getDocs(collection(db, "couponRedemptions"));
      const totalUsed = allRedemptionsSnapshot.size;
      setTotalRedemptions(totalUsed);
      
      console.log(`Fetched data: ${couponsData.length} coupons, ${totalUsed} redemptions`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [getServices, getCoupons, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Separate handler for tab changes to prevent unnecessary data fetching
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Only fetch coupon data if we're switching to the coupons tab
    // and we haven't fetched the data yet
    if (value === "coupons" && coupons.length === 0) {
      fetchData(true);
    }
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setIsEditingService(true);
    setIsCreatingService(false);
  };

  const handleCreateNewService = () => {
    setSelectedService(null);
    setIsEditingService(false);
    setIsCreatingService(true);
  };

  const handleServiceSave = async (serviceData: Partial<ServiceType>) => {
    try {
      if (isCreatingService) {
        // Create new service
        await createService(serviceData as Omit<ServiceType, 'id'>);
        toast({
          title: "Success",
          description: "New service created successfully"
        });
      } else if (isEditingService && selectedService) {
        // Update existing service
        await updateService(selectedService.id, serviceData);
        toast({
          title: "Success", 
          description: "Service updated successfully"
        });
      }
      
      // Refresh services data
      fetchData();
      setIsEditingService(false);
      setIsCreatingService(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save service. Please try again."
      });
    }
  };

  const handleServiceDelete = async (serviceId: string) => {
    if (!window.confirm("Are you sure you want to delete this service? This cannot be undone.")) {
      return;
    }
    
    try {
      await deleteService(serviceId);
      toast({
        title: "Service deleted",
        description: "The service has been successfully removed."
      });
      fetchData();
      setIsEditingService(false);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service. Please try again."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats row - improved for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gym-gray-dark border-gym-gray-light">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gym-yellow">{services.length}</span>
            </div>
            <p className="text-white/70 text-sm mt-1">
              Active services on the website
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gym-gray-dark border-gym-gray-light">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Coupon Redemptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gym-yellow">{totalRedemptions}</span>
                <span className="text-lg text-white/40 pb-1">/30</span>
              </div>
              
              {/* Add Reset button with improved UI feedback */}
              <Button
                onClick={() => setResetDialogOpen(true)}
                variant="outline"
                size="sm"
                className="border-gym-yellow text-gym-yellow hover:bg-gym-yellow/10 group relative"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1 group-hover:rotate-180 transition-transform duration-500" /> 
                Reset
              </Button>
            </div>
            <p className="text-white/70 text-sm mt-1">
              {totalRedemptions >= 30 
                ? "Limit reached for all services" 
                : `${30 - totalRedemptions} more available across all services`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile-optimized tabs */}
      <div className="bg-gym-gray-dark border border-gym-gray-light rounded-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="border-b border-gym-gray-light">
            <ScrollArea className="w-full">
              <TabsList className="bg-transparent h-12 px-2 w-max border-0">
                <TabsTrigger 
                  value="coupons" 
                  className="min-w-[120px] data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Coupon Codes
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="min-w-[120px] data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Services
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>
          
          {/* Coupons Content */}
          <TabsContent value="coupons" className="mt-0 pt-4 px-3 sm:px-4">
            {activeTab === "coupons" && (
              <>
                <div className="flex justify-end mb-4">
                  <Button 
                    onClick={() => setCreateCouponDialogOpen(true)}
                    className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Coupon
                  </Button>
                </div>
                
                {/* Use memoized component to prevent re-renders */}
                <div className="bg-transparent">
                  <MemoizedCouponManager 
                    hideAddButton={true} 
                    refreshParent={() => fetchData(true)}
                    preventTabReset={true}
                  />
                </div>
                
                <CreateCouponDialog
                  open={createCouponDialogOpen}
                  onOpenChange={setCreateCouponDialogOpen}
                  existingCoupon={null}
                  services={services}
                  onSuccess={() => fetchData(true)}
                />
              </>
            )}
          </TabsContent>
          
          {/* Services Content - improved for mobile */}
          <TabsContent value="services" className="mt-0 p-0">
            <div className="sm:p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Services List - Mobile-optimized */}
                <Card className="bg-gym-gray-dark border-gym-gray-light col-span-1">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Services</CardTitle>
                    <Button 
                      size="sm" 
                      onClick={handleCreateNewService}
                      className="h-8 bg-gym-yellow text-black hover:bg-gym-yellow/90"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> New
                    </Button>
                  </CardHeader>
                  <CardContent className="p-3">
                    <ScrollArea className="h-[350px] sm:h-[400px] pr-4">
                      <div className="space-y-2">
                        {services.map(service => (
                          <div
                            key={service.id}
                            onClick={() => handleServiceSelect(service)}
                            className={`p-3 rounded-md cursor-pointer transition-all ${
                              selectedService?.id === service.id 
                                ? 'bg-gym-yellow/20 border border-gym-yellow' 
                                : 'bg-gym-gray-light/50 border border-transparent hover:bg-gym-gray-light'
                            }`}
                          >
                            <div className="font-medium text-white">{service.title}</div>
                            <div className="text-sm text-white/70 flex justify-between mt-1">
                              <span>{service.trainer}</span>
                              <span>₹{service.basePrice}</span>
                            </div>
                          </div>
                        ))}
                        
                        {services.length === 0 && (
                          <div className="text-center py-6 text-white/50">
                            No services found. Create your first service.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                {/* Service Editor - Mobile-optimized */}
                <Card className="bg-gym-gray-dark border-gym-gray-light col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {isCreatingService ? "Create New Service" : isEditingService ? "Edit Service" : "Select a Service"}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {isCreatingService || isEditingService 
                        ? "Fill in the details for this service" 
                        : "Select a service from the list to edit or create a new one"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    {(isEditingService || isCreatingService) ? (
                      <ServiceEditor 
                        service={selectedService} 
                        onSave={handleServiceSave} 
                        onDelete={handleServiceDelete}
                        onCancel={() => {
                          setIsEditingService(false);
                          setIsCreatingService(false);
                        }}
                        isNew={isCreatingService}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
                        <div className="w-16 h-16 bg-gym-gray rounded-full flex items-center justify-center mb-4">
                          <Pencil className="h-8 w-8 text-white/30" />
                        </div>
                        <p className="text-white/70 mb-4">Select a service to edit or create a new one</p>
                        <Button 
                          onClick={handleCreateNewService}
                          className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Create New Service
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Reset Dialog - Mobile-optimized */}
      <RedemptionResetDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        onResetComplete={() => {
          // Force a complete data refresh
          fetchData(false);
          
          // Show success toast
          toast({
            title: "Reset Successful",
            description: "Redemption count has been reset to 0/30",
          });
        }}
      />
    </div>
  );
};

export default IntegratedPricingManager;
