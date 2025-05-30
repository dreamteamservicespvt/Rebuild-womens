import { useState, useEffect } from "react";
import { useFirebase, CouponType, ServiceType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { 
  Timestamp, 
  getDocs, 
  collection, 
  getFirestore 
} from "firebase/firestore";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Search, MoreVertical, Edit, Trash, Eye, Tag } from "lucide-react";
import CreateCouponDialog from "./CreateCouponDialog";
import CouponRedemptionsDialog from "./CouponRedemptionsDialog";

interface CouponManagerProps {
  hideAddButton?: boolean;
  refreshParent?: {
    (): void;
    refreshCount?: () => Promise<void>;
  };
  preventTabReset?: boolean;
}

const CouponManager = ({ 
  hideAddButton = false,
  refreshParent,
  preventTabReset = false
}: CouponManagerProps) => {
  const { getCoupons, getCoupon, updateCoupon, deleteCoupon, getServices, getCouponRedemptions } = useFirebase();
  const { toast } = useToast();
  const db = getFirestore();
  
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponType | null>(null);
  const [redemptionsDialogOpen, setRedemptionsDialogOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>("");
  
  // Add function to check and display total redemptions
  const [totalRedemptions, setTotalRedemptions] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  
  // Add loading state for coupon redemptions check to avoid duplicate loading indicators
  const [checkingRedemptions, setCheckingRedemptions] = useState(false);
  
  useEffect(() => {
    // Only fetch data on initial mount to prevent repeated fetching
    const initialFetch = async () => {
      await fetchData();
      await checkTotalRedemptions();
    };
    
    initialFetch();
    // Empty dependency array ensures this only runs once on component mount
  }, []);
  
  const checkTotalRedemptions = async () => {
    if (checkingRedemptions) return;
    
    setCheckingRedemptions(true);
    try {
      // Get direct count from couponRedemptions collection instead of summing coupon usage counts
      const allRedemptionsSnapshot = await getDocs(collection(db, "couponRedemptions"));
      const totalCount = allRedemptionsSnapshot.size;
      
      // Update UI with fresh count
      setTotalRedemptions(totalCount);
      setLimitReached(totalCount >= 30);
      
      console.log(`Found ${totalCount} total redemptions across all coupons`);
    } catch (error) {
      console.error("Error checking redemptions:", error);
    } finally {
      setCheckingRedemptions(false);
    }
  };
  
  // Add a public method that can be called from parent components to refresh the count
  useEffect(() => {
    if (refreshParent) {
      // Make checkTotalRedemptions available to parent components
      const refreshCount = async () => {
        await checkTotalRedemptions();
      };
      
      // Safely assign the refresh function
      if (typeof refreshParent === 'object' || typeof refreshParent === 'function') {
        (refreshParent as any).refreshCount = refreshCount;
      }
    }
  }, [refreshParent]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch coupons
      const couponsData = await getCoupons();
      setCoupons(couponsData);
      
      // Fetch services for dropdown options
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load coupons. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleStatus = async (coupon: CouponType) => {
    try {
      // Toggle between active and inactive
      const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
      
      await updateCoupon(coupon.id, { status: newStatus });
      
      // Update local state
      setCoupons(prevCoupons => 
        prevCoupons.map(c => 
          c.id === coupon.id ? { ...c, status: newStatus } : c
        )
      );
      
      toast({
        title: "Status updated",
        description: `Coupon ${coupon.code} is now ${newStatus}.`,
      });
      
      // Also notify parent component if needed
      if (refreshParent && !preventTabReset) {
        refreshParent();
      }
    } catch (error) {
      console.error("Error updating coupon status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update coupon status. Please try again.",
      });
    }
  };
  
  // Ensure that when deleting a coupon, we don't just delete the coupon but handle any data consistency issues
  const handleDeleteCoupon = async (couponId: string, couponCode: string) => {
    if (window.confirm(`Are you sure you want to delete the coupon "${couponCode}"? This action cannot be undone.`)) {
      try {
        // First check if we can find the coupon
        const coupon = await getCoupon(couponId);
        if (!coupon) {
          throw new Error("Coupon not found");
        }
        
        // First check for any active redemptions
        const redemptionsData = await getCouponRedemptions(couponId);
        
        if (redemptionsData.length > 0) {
          // If redemptions exist, inform the admin
          if (!window.confirm(`This coupon has been used ${redemptionsData.length} times. Deleting it will keep those redemptions in history but mark the coupon as inactive. Continue?`)) {
            return;
          }
          
          // Instead of deleting, mark as inactive
          await updateCoupon(couponId, { 
            status: 'inactive',
            updatedAt: Timestamp.now()
          });
          
          toast({
            title: "Coupon deactivated",
            description: `Coupon "${couponCode}" has been marked as inactive due to existing redemptions.`,
          });
        } else {
          // If no redemptions, we can safely delete the coupon
          await deleteCoupon(couponCode); // Use couponCode instead of couponId
          
          toast({
            title: "Coupon deleted",
            description: `Coupon "${couponCode}" has been permanently removed.`,
          });
        }
        
        // Update the UI in both cases
        setCoupons(prevCoupons => prevCoupons.filter(c => c.id !== couponId));
        
        // Also notify parent component if needed
        if (refreshParent && !preventTabReset) {
          refreshParent();
        }
      } catch (error) {
        // Replace console.error with quiet error handling
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete coupon. Please try again.",
        });
      }
    }
  };
  
  // Add a permanent delete function that bypasses redemption checks
  const handlePermanentDelete = async (couponId: string, couponCode: string) => {
    if (window.confirm(`WARNING: You are about to PERMANENTLY DELETE coupon "${couponCode}". This action cannot be undone and will remove ALL data related to this coupon, including redemption history. Are you absolutely sure?`)) {
      try {
        // Confirm again with more serious warning
        if (window.confirm(`FINAL WARNING: Permanent deletion may cause data inconsistency if this coupon has been used. This is irreversible. Type "${couponCode}" below to confirm.`)) {
          // Ask for code confirmation
          const confirmation = window.prompt(`To confirm permanent deletion, please type the coupon code (${couponCode}):`, "");
          
          if (confirmation === couponCode) {
            // Direct deletion without checking for redemptions
            await deleteCoupon(couponCode);
            
            // Update the UI
            setCoupons(prevCoupons => prevCoupons.filter(c => c.id !== couponId));
            
            toast({
              title: "Coupon permanently deleted",
              description: `Coupon "${couponCode}" has been permanently removed from the system.`,
            });
            
            // Notify parent component if needed
            if (refreshParent && !preventTabReset) {
              refreshParent();
            }
          } else {
            toast({
              variant: "destructive",
              title: "Deletion cancelled",
              description: "The coupon code entered did not match.",
            });
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete coupon. Please try again.",
        });
      }
    }
  };
  
  const handleEditCoupon = (coupon: CouponType) => {
    setEditingCoupon(coupon);
    setCreateDialogOpen(true);
  };
  
  const handleViewRedemptions = (couponId: string, couponCode: string) => {
    setSelectedCouponId(couponId);
    setSelectedCouponCode(couponCode);
    setRedemptionsDialogOpen(true);
  };
  
  // Filter coupons based on search query
  const filteredCoupons = coupons.filter(coupon => {
    const query = searchQuery.toLowerCase();
    return (
      coupon.code.toLowerCase().includes(query) ||
      coupon.applicableServices.some(serviceId => 
        services.find(s => s.id === serviceId)?.title.toLowerCase().includes(query)
      )
    );
  });
  
  // Format date from timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Helper to get service names from IDs
  const getServiceNames = (serviceIds: string[]) => {
    if (!serviceIds.length) return "All Services";
    
    return serviceIds.map(id => 
      services.find(s => s.id === id)?.title || id
    ).join(", ");
  };
  
  // Mobile-optimized coupon card
  const renderMobileCouponCard = (coupon: CouponType) => {
    // Check if this is a high-usage coupon (more than 80% of max)
    const isHighUsage = coupon.maxRedemptions > 0 && 
      (coupon.usageCount / coupon.maxRedemptions) >= 0.8;
      
    return (
      <div 
        key={coupon.id}
        className={`bg-gym-gray-dark border-gym-gray-light mb-3 overflow-hidden
          ${coupon.status === 'inactive' ? 'opacity-70' : ''}
          ${isHighUsage ? 'border-l-4 border-l-amber-500' : ''}`}
      >
        <div className="p-4 pb-3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-lg text-white">{coupon.code}</h3>
              <p className="text-white/60 text-xs">
                {coupon.expiryDate ? `Expires ${formatDate(coupon.expiryDate).split(',')[0]}` : "No expiry"}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={coupon.status === 'active'}
                onCheckedChange={() => handleToggleStatus(coupon)}
                className="data-[state=checked]:bg-gym-yellow h-5 w-9"
              />
              <span className={coupon.status === 'active' ? 'text-gym-yellow text-xs' : 'text-white/50 text-xs'}>
                {coupon.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-white/50 text-xs">Discount</p>
              <Badge variant="outline" className="border-gym-yellow text-gym-yellow bg-gym-yellow/10 mt-1 text-xs">
                {coupon.discountType === 'percentage' 
                  ? `${coupon.discountValue}% off` 
                  : `₹${coupon.discountValue} off`}
              </Badge>
            </div>
            
            <div>
              <p className="text-white/50 text-xs">Usage</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gym-gray rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full ${
                      coupon.maxRedemptions > 0 && coupon.usageCount >= coupon.maxRedemptions
                        ? 'bg-red-500'
                        : isHighUsage
                          ? 'bg-amber-500'
                          : 'bg-gym-yellow'
                    }`}
                    style={{ width: `${coupon.maxRedemptions ? Math.min(100, (coupon.usageCount / coupon.maxRedemptions) * 100) : 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-white whitespace-nowrap">
                  {coupon.usageCount}/{coupon.maxRedemptions}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-white/50 text-xs">Services</p>
            <p className="text-white/80 text-sm truncate">
              {getServiceNames(coupon.applicableServices)}
            </p>
          </div>
        </div>
        
        <div className="flex border-t border-gym-gray-light">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewRedemptions(coupon.id, coupon.code)}
            className="flex-1 rounded-none py-2 text-white"
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-sm">View Usage</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditCoupon(coupon)}
            className="flex-1 rounded-none py-2 text-white border-l border-gym-gray-light"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span className="text-sm">Edit</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
            className="flex-1 rounded-none py-2 text-red-400 border-l border-gym-gray-light"
          >
            <Trash className="h-4 w-4 mr-1" />
            <span className="text-sm">Delete</span>
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gym-gray-dark rounded-lg shadow-md border border-gym-gray-light overflow-hidden">
      <div className="p-4 border-b border-gym-gray-light">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Coupon Management</h2>
            <p className="text-white/70 text-xs sm:text-sm">
              Total Redemptions: <span className={totalRedemptions >= 30 ? "text-red-400" : "text-gym-yellow"}>{totalRedemptions}/30</span>
              {totalRedemptions >= 30 && " - Limit Reached"}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search coupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50"
              />
            </div>
            
            {!hideAddButton && (
              <Button 
                onClick={() => { setEditingCoupon(null); setCreateDialogOpen(true); }}
                className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Coupon
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="text-center py-10 px-4 text-white/60">
          <div className="bg-gym-gray inline-flex rounded-full p-4 mb-4">
            <Tag className="h-8 w-8 text-white/30" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No coupons found</h3>
          <p className="mb-4">
            {searchQuery ? "No coupons match your search." : "Create your first coupon to get started."}
          </p>
          {!searchQuery && !hideAddButton && (
            <Button
              onClick={() => { setEditingCoupon(null); setCreateDialogOpen(true); }}
              className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Create First Coupon
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile view */}
          <div className="sm:hidden p-3">
            {filteredCoupons.map(coupon => renderMobileCouponCard(coupon))}
          </div>
          
          {/* Desktop table view */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gym-gray-light hover:bg-transparent">
                  <TableHead className="text-white/70">Code</TableHead>
                  <TableHead className="text-white/70">Discount</TableHead>
                  <TableHead className="text-white/70">Services</TableHead>
                  <TableHead className="text-white/70">Usage / Limit</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Expiry Date</TableHead>
                  <TableHead className="text-white/70">Last Updated</TableHead>
                  <TableHead className="text-white/70 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow 
                    key={coupon.id} 
                    className="border-gym-gray-light hover:bg-gym-gray"
                  >
                    <TableCell className="font-medium text-white">
                      {coupon.code}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gym-yellow text-gym-yellow bg-gym-yellow/10">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}% off` 
                          : `₹${coupon.discountValue} off`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/80">
                      <span className="line-clamp-1">
                        {getServiceNames(coupon.applicableServices)}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center">
                        <span className={`${coupon.usageCount >= coupon.maxRedemptions ? "text-red-500" : "text-gym-yellow"}`}>
                          {coupon.usageCount}
                        </span>
                        <span className="text-white/70">/</span>
                        <span>{coupon.maxRedemptions}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={coupon.status === 'active'}
                          onCheckedChange={() => handleToggleStatus(coupon)}
                          className="data-[state=checked]:bg-gym-yellow"
                        />
                        <span className={coupon.status === 'active' ? 'text-gym-yellow' : 'text-white/50'}>
                          {coupon.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80">
                      {coupon.expiryDate ? formatDate(coupon.expiryDate) : "No expiry"}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {formatDate(coupon.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4 text-white/70" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gym-gray border-gym-gray-light">
                          <DropdownMenuLabel className="text-white/70">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gym-gray-light" />
                          
                          <DropdownMenuItem 
                            onClick={() => handleEditCoupon(coupon)}
                            className="text-white hover:bg-gym-gray-light hover:text-white"
                          >
                            <Edit className="h-4 w-4 mr-2 text-blue-400" />
                            Edit Coupon
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleViewRedemptions(coupon.id, coupon.code)}
                            className="text-white hover:bg-gym-gray-light hover:text-white"
                          >
                            <Eye className="h-4 w-4 mr-2 text-green-400" />
                            View Redemptions
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-gym-gray-light" />
                          
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                            className="text-red-400 hover:bg-red-950 hover:text-red-400"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handlePermanentDelete(coupon.id, coupon.code)}
                            className="text-red-600 hover:bg-red-950 hover:text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Permanent Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      
      {/* Create/Edit Coupon Dialog - with mobile improvements */}
      <CreateCouponDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        existingCoupon={editingCoupon}
        services={services}
        onSuccess={fetchData}
      />
      
      {/* View Redemptions Dialog - with mobile improvements */}
      <CouponRedemptionsDialog
        open={redemptionsDialogOpen}
        onOpenChange={setRedemptionsDialogOpen}
        couponId={selectedCouponId}
        couponCode={selectedCouponCode}
      />
    </div>
  );
};

export default CouponManager;
