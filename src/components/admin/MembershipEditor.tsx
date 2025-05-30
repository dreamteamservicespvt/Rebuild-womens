import { useState, useEffect } from "react";
import { ServiceType } from "@/contexts/FirebaseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, AlertTriangle, Trash, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MembershipEditorProps {
  membership: ServiceType | null;
  onSave: (data: Partial<ServiceType>) => Promise<void>;
  onCancel: () => void;
  isNew: boolean;
  isCore?: boolean; // Add this prop to identify core services
}

const MembershipEditor = ({
  membership,
  onSave,
  onCancel,
  isNew,
  isCore = false
}: MembershipEditorProps) => {
  // Form state
  const [title, setTitle] = useState(membership?.title || "");
  const [basePrice, setBasePrice] = useState(membership?.basePrice?.toString() || "");
  const [discountedPrice, setDiscountedPrice] = useState(membership?.discountedPrice?.toString() || "");
  const [trainer, setTrainer] = useState(membership?.trainer || "");
  const [description, setDescription] = useState(membership?.description || "");
  const [features, setFeatures] = useState<string[]>(membership?.features || []);
  const [maxCapacity, setMaxCapacity] = useState(membership?.maxCapacity?.toString() || "");
  const [timings, setTimings] = useState(membership?.timings || "");
  
  // New feature state
  const [newFeature, setNewFeature] = useState("");
  
  // Loading state
  const [saving, setSaving] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState<{
    title?: string;
    basePrice?: string;
    trainer?: string;
  }>({});
  
  const validate = (): boolean => {
    const newErrors: {
      title?: string;
      basePrice?: string;
      trainer?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = "Membership title is required";
    }
    
    if (!basePrice || parseFloat(basePrice) <= 0) {
      newErrors.basePrice = "A valid price is required";
    }
    
    if (!trainer.trim()) {
      newErrors.trainer = "Trainer name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const membershipData = {
        title,
        basePrice: parseFloat(basePrice),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : parseFloat(basePrice),
        trainer,
        description,
        features,
        maxCapacity: maxCapacity || "Unlimited",
        timings
      };
      
      await onSave(membershipData);
    } catch (error) {
      console.error("Error saving membership:", error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="animate-in fade-in-50 duration-300">
      <Card className="bg-gym-gray-dark border-gym-gray-light overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white">{isNew ? "Create New Membership Plan" : "Edit Membership Plan"}</CardTitle>
          <CardDescription className="text-white/70">
            {isNew ? "Add a new membership plan to your offerings" : "Update the details of this membership plan"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Add warning for core services */}
            {isCore && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-md p-4 flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-yellow-500 font-medium mb-1">Core Service</h4>
                  <p className="text-white/70 text-sm">
                    This is a core service that already exists on your website. You can update its details,
                    but keep the title consistent with your website to maintain synchronization.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Membership Title*
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Weight Loss Program"
                    className={`bg-gym-gray border-gym-gray-light text-white ${errors.title ? 'border-red-500' : ''}`}
                    disabled={isCore} // Disable title editing for core services
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  {isCore && <p className="text-yellow-500/70 text-xs mt-1">Core service title cannot be changed</p>}
                </div>
                
                <div>
                  <Label htmlFor="trainer" className="text-white">
                    Trainer Name*
                  </Label>
                  <Input
                    id="trainer"
                    value={trainer}
                    onChange={(e) => setTrainer(e.target.value)}
                    placeholder="e.g., Revathi"
                    className={`bg-gym-gray border-gym-gray-light text-white ${errors.trainer ? 'border-red-500' : ''}`}
                  />
                  {errors.trainer && <p className="text-red-500 text-sm mt-1">{errors.trainer}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="basePrice" className="text-white">
                      Base Price (₹)*
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="basePrice"
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="e.g., 1800"
                        className={`pl-9 bg-gym-gray border-gym-gray-light text-white ${errors.basePrice ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="discountedPrice" className="text-white">
                      Coupon Price (₹)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="discountedPrice"
                        type="number"
                        value={discountedPrice}
                        onChange={(e) => setDiscountedPrice(e.target.value)}
                        placeholder="e.g., 1500"
                        className="pl-9 bg-gym-gray border-gym-gray-light text-white"
                      />
                    </div>
                    <p className="text-white/50 text-xs mt-1">Leave empty to use base price</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="timings" className="text-white">
                    Availability Timings
                  </Label>
                  <Input
                    id="timings"
                    value={timings}
                    onChange={(e) => setTimings(e.target.value)}
                    placeholder="e.g., Morning: 5:30AM to 10:30AM, Evening: 4:00PM to 8:00PM"
                    className="bg-gym-gray border-gym-gray-light text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxCapacity" className="text-white">
                    Maximum Capacity
                  </Label>
                  <Input
                    id="maxCapacity"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="e.g., 10 or 'Unlimited'"
                    className="bg-gym-gray border-gym-gray-light text-white"
                  />
                </div>
              </div>
              
              {/* Right column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this membership plan..."
                    className="bg-gym-gray border-gym-gray-light text-white min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label className="text-white block mb-2">
                    Membership Features
                  </Label>
                  
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a membership feature"
                      className="bg-gym-gray border-gym-gray-light text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[200px] pr-4 border border-gym-gray-light rounded-md p-2">
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center bg-gym-gray p-3 rounded-md group"
                        >
                          <span className="text-white">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFeature(index)}
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-red-400 hover:bg-red-950/30 hover:text-red-400"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {features.length === 0 && (
                        <p className="text-white/50 text-center py-4">
                          No features added yet. Add some key benefits of this membership.
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gym-gray-light">
              <div className="flex justify-between items-center">
                <div className="text-white/60 text-sm">
                  {isNew 
                    ? "New membership will be available immediately after creation."
                    : `Editing ${membership?.title}`
                  }
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="bg-gym-gray-dark/50 border-t border-gym-gray-light px-6 py-4">
          <div className="flex justify-between items-center w-full">
            {isNew ? null : (
              <Badge variant="outline" className="text-gym-yellow border-gym-yellow bg-gym-yellow/10">
                {membership?.basePrice !== membership?.discountedPrice 
                  ? `Regular: ₹${membership?.basePrice} | With Coupon: ₹${membership?.discountedPrice}`
                  : `Price: ₹${membership?.basePrice}`
                }
              </Badge>
            )}
            <div className="flex gap-3 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-white/20 hover:bg-white/10 text-white"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
                disabled={saving}
              >
                {saving ? "Saving..." : (isNew ? "Create Membership" : "Update Membership")}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MembershipEditor;
