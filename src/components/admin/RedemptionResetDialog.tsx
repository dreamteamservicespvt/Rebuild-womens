import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/contexts/FirebaseContext";
import { AlertTriangle } from "lucide-react";

interface RedemptionResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetComplete: () => void;
}

const RedemptionResetDialog = ({
  open,
  onOpenChange,
  onResetComplete
}: RedemptionResetDialogProps) => {
  const { resetCouponRedemptions } = useFirebase();
  const { toast } = useToast();
  
  const [confirmText, setConfirmText] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  const handleReset = async () => {
    if (confirmText !== "RESET") {
      toast({
        variant: "destructive",
        title: "Confirmation Failed",
        description: "Please type RESET to confirm this action."
      });
      return;
    }
    
    setIsResetting(true);
    
    try {
      await resetCouponRedemptions();
      
      toast({
        title: "Reset Successful",
        description: "All coupon redemptions have been reset to zero.",
      });
      
      // Clear the input field
      setConfirmText("");
      
      // Close the dialog
      onOpenChange(false);
      
      // Refresh data in the parent component
      onResetComplete();
      
    } catch (error: unknown) {
      // Improved error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred";
      
      // Log error for monitoring in production
      if (process.env.NODE_ENV === "production") {
        // errorLoggingService.logError({
        //   action: "resetCouponRedemptions",
        //   error: errorMessage,
        //   component: "RedemptionResetDialog"
        // });
      }
      
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "An error occurred while resetting coupon redemptions. Please try again."
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gym-gray-dark border-gym-gray-light text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gym-yellow">
            <AlertTriangle className="h-5 w-5" />
            Reset Redemption Count
          </DialogTitle>
          <DialogDescription className="text-white/70">
            This action will reset all coupon redemption counts to zero and delete all redemption records.
          </DialogDescription>
        </DialogHeader>
        
        {/* Warning box */}
        <div className="bg-red-950/30 border border-red-900/50 rounded-md p-4 text-sm text-red-400">
          <strong className="font-semibold">WARNING:</strong> This is a destructive action that cannot be undone. 
          All coupon usage records will be permanently deleted, and all coupons will show 0 redemptions.
        </div>
        
        <div className="grid gap-4 py-2">
          <Label htmlFor="confirm" className="text-white">
            Type <span className="font-mono bg-gym-gray-light px-2 py-0.5 rounded text-gym-yellow">RESET</span> to confirm:
          </Label>
          <Input
            id="confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type RESET here"
            className="bg-gym-gray border-gym-gray-light text-white"
            autoComplete="off"
          />
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setConfirmText("");
              onOpenChange(false);
            }}
            className="sm:w-auto w-full border-white/20 hover:bg-white/10 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReset}
            disabled={confirmText !== "RESET" || isResetting}
            className="sm:w-auto w-full bg-red-600 hover:bg-red-700 text-white disabled:bg-red-900/50"
          >
            {isResetting ? "Resetting..." : "Reset All Redemptions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RedemptionResetDialog;
