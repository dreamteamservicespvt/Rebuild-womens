import { useState, useEffect } from "react";
import { ServiceType } from "@/contexts/FirebaseContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash, ChevronsUpDown, Plus, X } from "lucide-react";

interface ServiceEditorProps {
  service: ServiceType | null;
  onSave: (data: Partial<ServiceType>) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const ServiceEditor = ({ service, onSave, onDelete, onCancel, isNew = false }: ServiceEditorProps) => {
  const [formData, setFormData] = useState<Partial<ServiceType>>({
    title: "",
    basePrice: 0,
    discountedPrice: 0,
    trainer: "",
    maxCapacity: "",
    description: "",
    features: [],
    timings: ""
  });
  
  const [newFeature, setNewFeature] = useState("");
  
  useEffect(() => {
    if (service && !isNew) {
      setFormData({
        title: service.title || "",
        basePrice: service.basePrice || 0,
        discountedPrice: service.discountedPrice || 0,
        trainer: service.trainer || "",
        maxCapacity: service.maxCapacity || "",
        description: service.description || "",
        features: [...(service.features || [])],
        timings: service.timings || ""
      });
    } else {
      // Set defaults for new service
      setFormData({
        title: "",
        basePrice: 2000,
        discountedPrice: 1500,
        trainer: "",
        maxCapacity: "20",
        description: "",
        features: [],
        timings: ""
      });
    }
  }, [service, isNew]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'basePrice' || name === 'discountedPrice') {
      setFormData({
        ...formData,
        [name]: Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    setFormData({
      ...formData,
      features: [...(formData.features || []), newFeature.trim()]
    });
    
    setNewFeature("");
  };
  
  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    
    setFormData({
      ...formData,
      features: newFeatures
    });
  };
  
  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    if (!formData.features) return;
    
    const newFeatures = [...formData.features];
    
    if (direction === 'up' && index > 0) {
      // Move up
      [newFeatures[index], newFeatures[index - 1]] = [newFeatures[index - 1], newFeatures[index]];
    } else if (direction === 'down' && index < newFeatures.length - 1) {
      // Move down
      [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
    }
    
    setFormData({
      ...formData,
      features: newFeatures
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-white">Service Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Weight Loss Program"
            className="bg-gym-gray border-gym-gray-light text-white mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="trainer" className="text-white">Trainer Name *</Label>
          <Input
            id="trainer"
            name="trainer"
            value={formData.trainer}
            onChange={handleInputChange}
            placeholder="e.g. Revathi"
            className="bg-gym-gray border-gym-gray-light text-white mt-1"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="basePrice" className="text-white">Base Price (₹) *</Label>
          <Input
            id="basePrice"
            name="basePrice"
            type="number"
            value={formData.basePrice}
            onChange={handleInputChange}
            placeholder="e.g. 4000"
            className="bg-gym-gray border-gym-gray-light text-white mt-1"
            required
            min="0"
          />
        </div>
        
        <div>
          <Label htmlFor="discountedPrice" className="text-white">Discounted Price (₹) *</Label>
          <Input
            id="discountedPrice"
            name="discountedPrice"
            type="number"
            value={formData.discountedPrice}
            onChange={handleInputChange}
            placeholder="e.g. 3000"
            className="bg-gym-gray border-gym-gray-light text-white mt-1"
            required
            min="0"
          />
        </div>
        
        <div>
          <Label htmlFor="maxCapacity" className="text-white">Max Capacity</Label>
          <Input
            id="maxCapacity"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleInputChange}
            placeholder="e.g. 20 or Unlimited"
            className="bg-gym-gray border-gym-gray-light text-white mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="timings" className="text-white">Session Timings</Label>
        <Input
          id="timings"
          name="timings"
          value={formData.timings}
          onChange={handleInputChange}
          placeholder="e.g. 6:00AM to 10:00AM, 4:00PM to 8:00PM"
          className="bg-gym-gray border-gym-gray-light text-white mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Service description..."
          className="bg-gym-gray border-gym-gray-light text-white mt-1 min-h-[100px]"
        />
      </div>
      
      <div>
        <Label className="text-white">Features</Label>
        
        <div className="space-y-3 mt-2">
          {/* Features List */}
          {formData.features && formData.features.length > 0 ? (
            <div className="space-y-2 mb-3">
              {formData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-gym-gray rounded-md p-2 border border-gym-gray-light group"
                >
                  <div className="flex-grow text-white">{feature}</div>
                  <div className="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveFeature(index, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/50 italic mb-3">No features added yet</div>
          )}
          
          {/* Add Feature Input */}
          <div className="flex items-center space-x-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature..."
              className="bg-gym-gray border-gym-gray-light text-white"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
            />
            <Button
              type="button"
              onClick={handleAddFeature}
              disabled={!newFeature.trim()}
              className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gym-gray-light">
        <div>
          {!isNew && service && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => service.id && onDelete(service.id)}
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gym-gray-light text-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
          >
            {isNew ? "Create Service" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ServiceEditor;
