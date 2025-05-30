import { useState, useEffect } from "react";
import { useFirebase, CouponRedemptionType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gym-gray-dark border-gym-gray-light">
        <DialogHeader>
          <DialogTitle className="text-white">Redemption History</DialogTitle>
          <DialogDescription className="text-white/70">
            Viewing all redemptions for coupon code "{couponCode}"
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
          </div>
        ) : redemptions.length === 0 ? (
          <div className="text-center py-10 text-white/60">
            No redemptions found for this coupon code.
          </div>
        ) : (
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
      </DialogContent>
    </Dialog>
  );
};

export default CouponRedemptionsDialog;
