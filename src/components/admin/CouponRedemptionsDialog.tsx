import { useState, useEffect } from "react";
import { useFirebase, CouponRedemptionType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, User, Package, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CouponRedemptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponId: string | null;
  couponCode: string;
}

const CouponRedemptionsDialog = ({
  open,
  onOpenChange,
  couponId,
  couponCode
}: CouponRedemptionsDialogProps) => {
  const { getCouponRedemptions } = useFirebase();
  const { toast } = useToast();
  
  const [redemptions, setRedemptions] = useState<CouponRedemptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    if (open && couponId) {
      fetchRedemptions(couponId);
    }
  }, [open, couponId]);
  
  const fetchRedemptions = async (id: string) => {
    setLoading(true);
    try {
      const data = await getCouponRedemptions(id);
      setRedemptions(data);
    } catch (error) {
      console.error("Error fetching redemptions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load coupon redemption data."
      });
    } finally {
      setLoading(false);
    }
  };
  
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
  
  // Mobile card renderer
  const renderMobileCard = (redemption: CouponRedemptionType) => (
    <div 
      key={redemption.id}
      className="bg-gym-gray border border-gym-gray-light rounded-lg p-4 mb-4 last:mb-0 animate-in fade-in duration-300"
    >
      {/* User info row */}
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-gym-yellow/20 rounded-full p-2.5 mt-0.5">
          <User className="h-4 w-4 text-gym-yellow" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium">{redemption.userName}</h4>
          <div className="space-y-0.5 mt-1">
            <p className="text-white/70 text-sm">{redemption.userPhone}</p>
            {redemption.userEmail && (
              <p className="text-white/70 text-sm truncate max-w-[220px]">
                {redemption.userEmail}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Service row */}
      <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gym-gray-light">
        <div className="bg-green-500/20 rounded-full p-2.5 mt-0.5">
          <Package className="h-4 w-4 text-green-500" />
        </div>
        <div>
          <p className="text-white/60 text-xs mb-1">Service</p>
          <p className="text-white">{redemption.serviceName}</p>
        </div>
      </div>
      
      {/* Pricing and discount row */}
      <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gym-gray-light">
        <div className="bg-blue-500/20 rounded-full p-2.5 mt-0.5">
          <Tag className="h-4 w-4 text-blue-500" />
        </div>
        <div>
          <p className="text-white/60 text-xs mb-1">Pricing</p>
          <div className="flex flex-col">
            <Badge 
              variant="outline" 
              className="border-gym-yellow text-gym-yellow bg-gym-yellow/10 w-fit mb-1.5"
            >
              ₹{redemption.originalPrice - redemption.discountedPrice} off
            </Badge>
            <div className="text-sm">
              <span className="line-through text-white/60">₹{redemption.originalPrice}</span>
              {" → "}
              <span className="text-gym-yellow font-medium">₹{redemption.discountedPrice}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Date and time row */}
      <div className="flex items-start gap-3">
        <div className="bg-purple-500/20 rounded-full p-2.5 mt-0.5">
          <Calendar className="h-4 w-4 text-purple-500" />
        </div>
        <div>
          <p className="text-white/60 text-xs mb-1">Redeemed on</p>
          <p className="text-white">{formatDate(redemption.timestamp)}</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "bg-gym-gray-dark border-gym-gray-light",
          isMobile ? "w-[100vw] h-[100vh] max-w-none p-0 rounded-none" : "sm:max-w-[700px]"
        )}
      >
        <div className={cn("flex flex-col", isMobile ? "h-full" : "")}>
          {/* Header with close button for mobile */}
          <DialogHeader className={cn(
            isMobile 
              ? "sticky top-0 z-10 bg-gym-gray-dark border-b border-gym-gray-light py-4 px-4" 
              : ""
          )}>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white">
                Redemption History
              </DialogTitle>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-9 w-9 rounded-full bg-gym-gray text-white/70"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            <DialogDescription className="text-white/70">
              Viewing all redemptions for coupon code "{couponCode}"
            </DialogDescription>
          </DialogHeader>
          
          {/* Content area with proper scrolling */}
          <div className={cn("relative", isMobile ? "flex-1 overflow-hidden" : "")}>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gym-yellow opacity-20"></div>
                  <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-gym-yellow border-t-transparent"></div>
                </div>
              </div>
            ) : redemptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gym-gray rounded-full flex items-center justify-center mb-4">
                  <Tag className="h-8 w-8 text-white/30" />
                </div>
                <h3 className="text-white text-lg mb-2">No redemptions yet</h3>
                <p className="text-white/60 max-w-sm">
                  This coupon hasn't been used by anyone. When customers redeem it, records will appear here.
                </p>
              </div>
            ) : isMobile ? (
              // Mobile card-based layout with ScrollArea
              <ScrollArea className="h-[calc(100vh-160px)] px-4 pt-4">
                <div className="pb-4">
                  {redemptions.map(renderMobileCard)}
                </div>
              </ScrollArea>
            ) : (
              // Desktop table layout
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gym-gray-light hover:bg-transparent">
                      <TableHead className="text-white/70">User</TableHead>
                      <TableHead className="text-white/70">Service</TableHead>
                      <TableHead className="text-white/70">Discount</TableHead>
                      <TableHead className="text-white/70">Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redemptions.map((redemption) => (
                      <TableRow 
                        key={redemption.id} 
                        className="border-gym-gray-light hover:bg-gym-gray"
                      >
                        <TableCell className="font-medium text-white">
                          <div className="flex flex-col">
                            <span>{redemption.userName}</span>
                            <span className="text-xs text-white/60">{redemption.userPhone}</span>
                            {redemption.userEmail && (
                              <span className="text-xs text-white/60">{redemption.userEmail}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80">
                          {redemption.serviceName}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Badge variant="outline" className="border-gym-yellow text-gym-yellow bg-gym-yellow/10 w-fit">
                              ₹{redemption.originalPrice - redemption.discountedPrice} off
                            </Badge>
                            <div className="text-xs mt-1 text-white/70">
                              <span className="line-through">₹{redemption.originalPrice}</span>
                              {" → "}
                              <span className="text-gym-yellow">₹{redemption.discountedPrice}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80">
                          {formatDate(redemption.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          {/* Footer for mobile */}
          {isMobile && redemptions.length > 0 && (
            <DialogFooter className="sticky bottom-0 bg-gym-gray-dark border-t border-gym-gray-light p-4 mt-auto">
              <Button 
                onClick={() => onOpenChange(false)} 
                className="w-full bg-gym-yellow text-black hover:bg-gym-yellow/90 py-6"
              >
                Close
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponRedemptionsDialog;
