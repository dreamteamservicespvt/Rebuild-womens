import { useState } from "react";
import { useFirebase, ServiceType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";

interface ServiceEditorProps {
  service: ServiceType | null;
  onSave: (serviceData: Partial<ServiceType>) => Promise<void>;
  onDelete: (serviceId: string) => Promise<void>;
  onCancel: () => void;
  isNew?: boolean;
}

const ServiceEditor = ({
  service,
  onSave,
  onDelete,
  onCancel,
  isNew = false
}: ServiceEditorProps) => {
  const { toast } = useToast();

  const [title, setTitle] = useState(service?.title || "");
  const [basePrice, setBasePrice] = useState<number>(service?.basePrice || 0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(service?.discountedPrice || 0);
  const [trainer, setTrainer] = useState(service?.trainer || "");
  const [maxCapacity, setMaxCapacity] = useState<number | string>(service?.maxCapacity || 10);
  const [description, setDescription] = useState(service?.description || "");
  const [timings, setTimings] = useState(service?.timings || "");
  
  // Features management
  const [features, setFeatures] = useState<string[]>(service?.features || []);
  const [newFeature, setNewFeature] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    
    if (!title || !basePrice || !trainer) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill out all required fields."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const serviceData = {
        title,
        basePrice: Number(basePrice),
        discountedPrice: Number(discountedPrice || basePrice),
        trainer,
        maxCapacity,
        description,
        features,
        timings,
      };
      
      await onSave(serviceData);
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save service. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!service) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(service.id);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service. Please try again."
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-white">Service Name*</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Weight Loss Program"
            className="bg-gym-gray border-gym-gray-light text-white"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="basePrice" className="text-white">Base Price* (₹)</Label>
            <Input
              id="basePrice"
              type="number"
              min="0"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="bg-gym-gray border-gym-gray-light text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="discountedPrice" className="text-white">Discounted Price (₹)</Label>
            <Input
              id="discountedPrice"
              type="number"
              min="0"
              max={basePrice}
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(Number(e.target.value))}
              className="bg-gym-gray border-gym-gray-light text-white"
            />
            <p className="text-white/50 text-xs mt-1">Leave empty to use base price</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="trainer" className="text-white">Trainer*</Label>
            <Input
              id="trainer"
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
              placeholder="Trainer name"
              className="bg-gym-gray border-gym-gray-light text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="maxCapacity" className="text-white">Max Capacity</Label>
            <Input
              id="maxCapacity"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              placeholder="Maximum participants"
              className="bg-gym-gray border-gym-gray-light text-white"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="timings" className="text-white">Available Times</Label>
          <Input
            id="timings"
            value={timings}
            onChange={(e) => setTimings(e.target.value)}
            placeholder="E.g., 5:30AM to 10:30AM, 4:00PM to 8:00PM"
            className="bg-gym-gray border-gym-gray-light text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this service..."
            className="bg-gym-gray border-gym-gray-light text-white min-h-[100px]"
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-white">Features</Label>
          
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              className="bg-gym-gray border-gym-gray-light text-white flex-grow"
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
              Add
            </Button>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center bg-gym-gray p-2 rounded-md"
              >
                <span className="text-white">{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFeature(index)}
                  className="h-8 w-8 p-0 text-red-400 hover:bg-red-950/30 hover:text-red-400"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {features.length === 0 && (
              <p className="text-white/50 text-sm italic">No features added yet</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gym-gray-light">
        <div>
          {!isNew && service && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-sm">Are you sure?</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="border-white/20 hover:bg-white/10 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="border-red-400/30 text-red-400 hover:bg-red-950/30 hover:text-red-400"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Service
                </Button>
              )}
            </>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-white/20 hover:bg-white/10 text-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : (isNew ? "Create Service" : "Update Service")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ServiceEditor;
