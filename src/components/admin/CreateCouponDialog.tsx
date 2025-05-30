import { useState, useEffect } from "react";
import { useFirebase, CouponType, ServiceType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

interface CreateCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCoupon: CouponType | null;
  services: ServiceType[];
  onSuccess: () => void;
}

const CreateCouponDialog = ({
  open,
  onOpenChange,
  existingCoupon,
  services,
  onSuccess
}: CreateCouponDialogProps) => {
  const { createCoupon, updateCoupon } = useFirebase();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [code, setCode] = useState("");
  const [applicableServices, setApplicableServices] = useState<string[]>([]);
  const [maxRedemptions, setMaxRedemptions] = useState(1);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isEditing, setIsEditing] = useState(false);
  
  // Set form data if editing an existing coupon
  useEffect(() => {
    if (existingCoupon) {
      setCode(existingCoupon.code);
      setApplicableServices(existingCoupon.applicableServices);
      setMaxRedemptions(existingCoupon.maxRedemptions);
      setStatus(existingCoupon.status);
      
      // Convert Firebase Timestamp to Date if exists
      if (existingCoupon.expiryDate) {
        setExpiryDate(existingCoupon.expiryDate.toDate());
      } else {
        setExpiryDate(null);
      }
      
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [existingCoupon, open]);
  
  const resetForm = () => {
    setCode("");
    setApplicableServices([]);
    setMaxRedemptions(1);
    setExpiryDate(null);
    setStatus('active');
  };
  
  const handleServiceToggle = (serviceId: string) => {
    setApplicableServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  
  const validateForm = () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Missing coupon code",
        description: "Please enter a coupon code."
      });
      return false;
    }
    
    if (maxRedemptions <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid redemption limit",
        description: "Redemption limit must be greater than 0."
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Format code to be uppercase and trimmed
      const formattedCode = code.trim().toUpperCase();
      
      // Prepare data with Firebase Timestamp for expiry date
      const couponData = {
        code: formattedCode,
        // Use fixed discount values as per your business model
        discountType: 'fixed' as 'fixed', // Keep this for database compatibility
        discountValue: 0, // This will be ignored as you're using fixed service prices
        applicableServices: applicableServices.length > 0 ? applicableServices : [], // Ensure empty array if none selected
        maxRedemptions,
        expiryDate: expiryDate ? Timestamp.fromDate(expiryDate) : null,
        status
      };
      
      console.log("Saving coupon with data:", couponData);
      
      if (isEditing && existingCoupon) {
        // Update existing coupon
        await updateCoupon(existingCoupon.id, couponData);
        console.log(`Coupon ${formattedCode} updated successfully`);
        toast({
          title: "Coupon updated",
          description: `Coupon "${formattedCode}" has been updated successfully.`
        });
      } else {
        // Create new coupon
        await createCoupon(couponData);
        console.log(`Coupon ${formattedCode} created successfully`);
        toast({
          title: "Coupon created",
          description: `Coupon "${formattedCode}" has been created successfully.`
        });
      }
      
      // Close dialog and refresh data
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving coupon:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save coupon. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gym-gray-dark border-gym-gray-light">
        <DialogHeader>
          <DialogTitle className="text-white">{isEditing ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
          <DialogDescription className="text-white/70">
            {isEditing 
              ? 'Update the details of this coupon code.'
              : 'Create a new coupon code for your customers. Limited to first 30 members across all services.'}
          </DialogDescription>
          <div className="mt-2 p-3 bg-gym-yellow/10 border border-gym-yellow/30 rounded-md">
            <p className="text-sm text-white/80">
              This coupon will apply the following fixed prices:<br/>
              • Weight Loss: <span className="font-bold text-gym-yellow">₹3000</span> (Regular ₹4000)<br/>
              • Strength Training: <span className="font-bold text-gym-yellow">₹1500</span> (Regular ₹1800)<br/>
              • Zumba: <span className="font-bold text-gym-yellow">₹1500</span> (Regular ₹2000)
            </p>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-white">Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER50"
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white uppercase"
                disabled={isEditing} // Disable editing code for existing coupons
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-white pt-2">Applicable Services</Label>
              <div className="col-span-3 space-y-2">
                <p className="text-xs text-white/70 mb-2">
                  Leave all unchecked to apply to all services
                </p>
                
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`service-${service.id}`} 
                      checked={applicableServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                      className="data-[state=checked]:bg-gym-yellow data-[state=checked]:border-gym-yellow"
                    />
                    <label 
                      htmlFor={`service-${service.id}`}
                      className="text-sm text-white cursor-pointer"
                    >
                      {service.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxRedemptions" className="text-white">Max Redemptions</Label>
              <Input
                id="maxRedemptions"
                type="number"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(Number(e.target.value))}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white"
                min={1}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-white">Expiry Date</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left bg-gym-gray border-gym-gray-light text-white ${!expiryDate && "text-white/50"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : "No expiry date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gym-gray border-gym-gray-light" align="start">
                    <Calendar
                      mode="single"
                      selected={expiryDate || undefined}
                      onSelect={setExpiryDate}
                      initialFocus
                      className="bg-gym-gray text-white"
                    />
                    {expiryDate && (
                      <div className="p-3 border-t border-gym-gray-light">
                        <Button 
                          variant="ghost" 
                          onClick={() => setExpiryDate(null)}
                          className="w-full text-white hover:bg-gym-gray-light"
                        >
                          Clear Date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-white">Status</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  checked={status === 'active'}
                  onCheckedChange={(checked) => setStatus(checked ? 'active' : 'inactive')}
                  className="data-[state=checked]:bg-gym-yellow"
                />
                <span className={status === 'active' ? 'text-gym-yellow' : 'text-white/50'}>
                  {status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-gym-gray-light"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-gym-yellow text-gym-black hover:bg-gym-yellow/90"
            >
              {loading ? "Saving..." : isEditing ? "Update Coupon" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCouponDialog;
