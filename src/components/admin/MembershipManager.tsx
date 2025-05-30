import { useState, useEffect } from "react";
import { useFirebase, ServiceType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Search, Edit, Trash, ArrowUpDown, RefreshCw, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MembershipEditor from "./MembershipEditor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Define default services that match the existing website services
const defaultServices: Omit<ServiceType, 'id'>[] = [
  {
    title: "Weight Loss Program",
    basePrice: 4000,
    discountedPrice: 3000,  // Fixed coupon price
    trainer: "Revathi",
    maxCapacity: 10,
    description: "Comprehensive weight loss program designed for women to achieve their fitness goals effectively.",
    features: [
      "Personalized diet plans",
      "Regular body assessments",
      "Group workouts",
      "One-on-one coaching"
    ],
    timings: "6:00AM to 10:00AM, 4:00PM to 8:00PM"
  },
  {
    title: "Strength Training",
    basePrice: 1800,
    discountedPrice: 1500,  // Fixed coupon price
    trainer: "Revathi",
    maxCapacity: 10,
    description: "Build muscle, increase metabolism, and improve overall strength with specialized training for women.",
    features: [
      "Progressive resistance training",
      "Core strengthening",
      "Proper form guidance",
      "Strength assessments"
    ],
    timings: "5:30AM to 10:30AM, 4:00PM to 8:00PM"
  },
  {
    title: "Zumba",
    basePrice: 2000,
    discountedPrice: 1500,  // Fixed coupon price
    trainer: "Jyothi",
    maxCapacity: 10,
    description: "High-energy dance fitness program combining cardio exercise with Latin-inspired dance moves.",
    features: [
      "Fun dance routines",
      "Calorie burning",
      "No prior dance experience needed",
      "Stress relief"
    ],
    timings: "4:00PM to 8:00PM"
  }
];

const MembershipManager = () => {
  const { getServices, updateService, createService, deleteService } = useFirebase();
  const { toast } = useToast();
  
  // State variables
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sortField, setSortField] = useState<'title' | 'basePrice' | 'trainer'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<'list' | 'edit' | 'create'>('list');
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [serviceMissing, setServiceMissing] = useState(false);
  
  // Fetch services data
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesData = await getServices();
      setServices(servicesData);
      
      // Check if any of our default services are missing
      const existingServiceTitles = servicesData.map(s => s.title.toLowerCase().trim());
      const missingServices = defaultServices.filter(
        ds => !existingServiceTitles.includes(ds.title.toLowerCase().trim())
      );
      
      setServiceMissing(missingServices.length > 0);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load membership plans. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Synchronize with default services function
  const synchronizeWithDefaults = async () => {
    setIsSynchronizing(true);
    try {
      const currentServices = await getServices();
      const existingServiceTitles = currentServices.map(s => s.title.toLowerCase().trim());
      
      // Filter out services that already exist
      const missingServices = defaultServices.filter(
        ds => !existingServiceTitles.includes(ds.title.toLowerCase().trim())
      );
      
      if (missingServices.length === 0) {
        toast({
          title: "Already Synchronized",
          description: "All default services already exist in the database."
        });
        setIsSynchronizing(false);
        return;
      }
      
      // Create missing services
      let createdCount = 0;
      for (const service of missingServices) {
        await createService(service);
        createdCount++;
      }
      
      toast({
        title: "Synchronization Complete",
        description: `Successfully added ${createdCount} missing service${createdCount > 1 ? 's' : ''}.`
      });
      
      // Refresh services
      fetchServices();
    } catch (error) {
      console.error("Error synchronizing services:", error);
      toast({
        variant: "destructive",
        title: "Synchronization Failed",
        description: "Could not add default services. Please try again."
      });
    } finally {
      setIsSynchronizing(false);
    }
  };
  
  // Sort and filter services
  const sortedAndFilteredServices = [...services]
    .filter(service => 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.trainer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'basePrice') {
        return sortDirection === 'asc' 
          ? a.basePrice - b.basePrice 
          : b.basePrice - a.basePrice;
      } else {
        const fieldA = a[sortField].toLowerCase();
        const fieldB = b[sortField].toLowerCase();
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
    });
  
  // Toggle sort direction
  const toggleSort = (field: 'title' | 'basePrice' | 'trainer') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Check if a service is one of the core default services
  const isDefaultService = (service: ServiceType) => {
    return defaultServices.some(ds => 
      ds.title.toLowerCase() === service.title.toLowerCase()
    );
  };
  
  // CRUD handlers
  const handleCreateMembership = () => {
    setSelectedService(null);
    setIsEditing(false);
    setIsCreating(true);
    setActiveTab('create');
  };
  
  const handleEditMembership = (service: ServiceType) => {
    setSelectedService(service);
    setIsEditing(true);
    setIsCreating(false);
    setActiveTab('edit');
  };
  
  const handleDeleteMembership = async (serviceId: string, serviceTitle: string) => {
    // Check if this is one of the core services
    if (defaultServices.some(ds => ds.title.toLowerCase() === serviceTitle.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Core Service",
        description: `"${serviceTitle}" is a core service that cannot be deleted. You may edit it instead.`
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the "${serviceTitle}" membership plan? This action cannot be undone.`)) {
      try {
        await deleteService(serviceId);
        toast({
          title: "Membership plan deleted",
          description: `"${serviceTitle}" has been successfully removed.`
        });
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete membership plan. Please try again."
        });
      }
    }
  };
  
  const handleSaveService = async (serviceData: Partial<ServiceType>) => {
    try {
      if (isCreating) {
        // Check if service with same title already exists
        const exists = services.some(
          s => s.title.toLowerCase().trim() === serviceData.title?.toLowerCase().trim()
        );
        
        if (exists) {
          toast({
            variant: "destructive",
            title: "Service Already Exists",
            description: "A service with this title already exists. Please use a different title."
          });
          return;
        }
        
        await createService(serviceData as Omit<ServiceType, 'id'>);
        toast({
          title: "Membership plan created",
          description: "New membership plan has been added successfully."
        });
      } else if (isEditing && selectedService) {
        await updateService(selectedService.id, serviceData);
        toast({
          title: "Membership plan updated",
          description: "Membership details have been updated successfully."
        });
      }
      
      fetchServices();
      setActiveTab('list');
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      console.error("Error saving membership plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save membership plan. Please try again."
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-gym-gray-dark border-gym-gray-light">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-white text-2xl">Membership Plans</CardTitle>
              <CardDescription className="text-white/70">
                Manage your membership pricing plans and details
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search memberships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gym-gray border-gym-gray-light text-white w-full"
                />
              </div>
              
              <Button
                onClick={handleCreateMembership}
                className="bg-gym-yellow text-black hover:bg-gym-yellow/90 whitespace-nowrap"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Plan
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Show sync warning if default services are missing */}
          {serviceMissing && (
            <div className="mb-6 bg-yellow-900/20 border border-yellow-700 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-500 font-medium mb-1">Missing Core Services</h4>
                <p className="text-white/70 text-sm mb-3">
                  Some of your website's core services are not properly set up in Firebase.
                  Click Synchronize to add the missing services.
                </p>
                <Button 
                  onClick={synchronizeWithDefaults} 
                  className="bg-yellow-700 hover:bg-yellow-600 text-white"
                  disabled={isSynchronizing}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSynchronizing ? 'animate-spin' : ''}`} />
                  {isSynchronizing ? "Synchronizing..." : "Synchronize with Website"}
                </Button>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="list" value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'edit' | 'create')}>
            <TabsList className="bg-gym-gray border-gym-gray-light mb-4">
              <TabsTrigger 
                value="list" 
                className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
              >
                All Plans
              </TabsTrigger>
              {isEditing && (
                <TabsTrigger 
                  value="edit" 
                  className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
                >
                  Edit Plan
                </TabsTrigger>
              )}
              {isCreating && (
                <TabsTrigger 
                  value="create" 
                  className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
                >
                  New Plan
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* List of All Membership Plans */}
            <TabsContent value="list" className="bg-transparent">
              {loading ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 py-3 px-2 bg-gym-gray-light/30 animate-pulse rounded-md">
                      <div className="h-12 w-12 rounded-full bg-gym-gray-light"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-3/4 bg-gym-gray-light rounded"></div>
                        <div className="h-4 w-1/2 bg-gym-gray-light rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedAndFilteredServices.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gym-gray-light rounded-md">
                  <h3 className="text-white font-medium mb-2">No membership plans found</h3>
                  <p className="text-white/60 mb-4">
                    {searchQuery ? "No results match your search criteria." : "Get started by adding your first membership plan or synchronizing with the website."}
                  </p>
                  {!searchQuery && (
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Button
                        onClick={synchronizeWithDefaults}
                        className="bg-gym-yellow/80 text-black hover:bg-gym-yellow"
                        disabled={isSynchronizing}
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isSynchronizing ? 'animate-spin' : ''}`} />
                        {isSynchronizing ? "Synchronizing..." : "Sync with Website"}
                      </Button>
                      <Button
                        onClick={handleCreateMembership}
                        className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Custom Plan
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gym-gray-light hover:bg-transparent">
                        <TableHead 
                          className="text-white/70 cursor-pointer"
                          onClick={() => toggleSort('title')}
                        >
                          <div className="flex items-center">
                            Membership Plan
                            {sortField === 'title' && (
                              <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="text-white/70 cursor-pointer"
                          onClick={() => toggleSort('basePrice')}
                        >
                          <div className="flex items-center">
                            Price
                            {sortField === 'basePrice' && (
                              <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="text-white/70 cursor-pointer"
                          onClick={() => toggleSort('trainer')}
                        >
                          <div className="flex items-center">
                            Trainer
                            {sortField === 'trainer' && (
                              <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-white/70">Features</TableHead>
                        <TableHead className="text-white/70 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAndFilteredServices.map((service) => {
                        // Check if this is a core service
                        const isCore = isDefaultService(service);
                        
                        return (
                          <TableRow 
                            key={service.id}
                            className={`border-gym-gray-light hover:bg-gym-gray ${isCore ? 'bg-gym-yellow/5' : ''}`}
                          >
                            <TableCell className="font-medium text-white">
                              {service.title}
                              {isCore && (
                                <Badge className="ml-2 bg-gym-yellow/20 text-gym-yellow border-none">
                                  Core
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <Badge variant="outline" className="bg-gym-yellow/10 border-gym-yellow/30 text-gym-yellow">
                                  ₹{service.basePrice}
                                </Badge>
                                {service.discountedPrice !== service.basePrice && (
                                  <Badge variant="outline" className="ml-2 bg-purple-900/20 border-purple-400/30 text-purple-400">
                                    ₹{service.discountedPrice} (with coupon)
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-white">
                              {service.trainer}
                            </TableCell>
                            <TableCell className="text-white/80">
                              <span className="line-clamp-1">
                                {service.features.length > 0 
                                  ? `${service.features.length} features` 
                                  : "No features specified"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span className="sr-only">Open menu</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                                      <circle cx="12" cy="12" r="1"></circle>
                                      <circle cx="12" cy="5" r="1"></circle>
                                      <circle cx="12" cy="19" r="1"></circle>
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gym-gray border-gym-gray-light">
                                  <DropdownMenuLabel className="text-white/70">Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-gym-gray-light" />
                                  <DropdownMenuItem 
                                    onClick={() => handleEditMembership(service)}
                                    className="text-white hover:bg-gym-gray-light hover:text-white"
                                  >
                                    <Edit className="h-4 w-4 mr-2 text-blue-400" />
                                    Edit Plan
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteMembership(service.id, service.title)}
                                    className={`${isCore ? 'text-red-400/50 cursor-not-allowed' : 'text-red-400 hover:bg-red-950 hover:text-red-400'}`}
                                    disabled={isCore}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete Plan
                                    {isCore && <span className="ml-1 text-xs">(Core)</span>}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            {/* Edit Membership Plan */}
            <TabsContent value="edit" className="bg-transparent">
              {isEditing && selectedService && (
                <MembershipEditor 
                  membership={selectedService}
                  onSave={handleSaveService}
                  onCancel={() => {
                    setActiveTab('list');
                    setIsEditing(false);
                  }}
                  isNew={false}
                  isCore={isDefaultService(selectedService)}
                />
              )}
            </TabsContent>
            
            {/* Create New Membership Plan */}
            <TabsContent value="create" className="bg-transparent">
              {isCreating && (
                <MembershipEditor 
                  membership={null}
                  onSave={handleSaveService}
                  onCancel={() => {
                    setActiveTab('list');
                    setIsCreating(false);
                  }}
                  isNew={true}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipManager;
